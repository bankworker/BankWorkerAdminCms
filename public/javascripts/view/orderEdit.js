let app = angular.module('myApp', []);

app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    orderID: '',

    selectedBank: null,
    bankList: [{bankCode: 0, bankName: '全部'}],
    currentBankCode: 0,

    selectedBranch: null,
    branchList: [{branchCode: 0, branchName: '全部'}],
    currentBranchCode: 0,

    systemList: [],
    selectedSystemList: [],
    selectedSystemID: '',

    orderType: '',
    orderTypeText: '',

    serviceList: [],
    selectedService: null,

    displaySelectedSystem: '',
    displaySelectedService: '',

    originalTotalSystemPrice: 0,
    originalTotalServicePrice: 0,

    orderDiscount: 1,
    paymentPrice: 0,
    originalPrice: 0,
    formatPaymentPrice: '¥0.00',
    formatOriginalPrice: '¥0.00',
    isShowServiceList: false,
    add: true
  };

  $scope.initPage = function () {
    $scope.setDefaultOption();
    $scope.loadBank();
    $scope.loadSystem();
    $scope.loadService();
    // $scope.loadData();
  };

  $scope.setDefaultOption = function(){
    if($scope.model.add){
      $scope.model.selectedBank = $scope.model.bankList[0];
      $scope.model.selectedBranch = $scope.model.branchList[0];
    }
  };

  $scope.loadBank = function(){
    $http.get('/common/bankList').then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.bankList === null){
        return false;
      }
      angular.forEach(response.data.bankList, function (bank) {
        $scope.model.bankList.push({
          bankCode: bank.bankCode,
          bankName: bank.bankName
        });
      });
      if($scope.model.currentBankCode !== 0){
        angular.forEach($scope.model.bankList, function (bank) {
          if(bank.bankCode === $scope.model.currentBankCode){
            $scope.model.selectedBank = bank;
            return false;
          }
        });
      }
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.loadBranch = function(){
    $scope.model.selectedBranch = $scope.model.branchList[0];
    if($scope.model.branchList.length > 1){
      $scope.model.branchList.splice(1);
    }
    if($scope.model.selectedBank.bankCode === 0){
      $scope.model.account = '';
      $scope.model.password = '';
      return false;
    }
    $http.get('/common/branchList?bankCode='+$scope.model.selectedBank.bankCode).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.branchList === null){
        return false;
      }
      angular.forEach(response.data.branchList, function (branch) {
        $scope.model.branchList.push({
          branchCode: branch.branchCode,
          branchName: branch.branchName
        });
      });
      if($scope.model.currentBranchCode !== 0){
        angular.forEach($scope.model.branchList, function (branch) {
          if(branch.branchCode === $scope.model.currentBranchCode){
            $scope.model.selectedBranch = branch;
            return false;
          }
        });
      }
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.loadSystem = function(){
    $http.get('/common/systemList').then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.systemList === null){
        return false;
      }
      angular.forEach(response.data.systemList, function (system) {
        $scope.model.systemList.push({
          systemID: system.systemID,
          systemName: system.systemName,
          systemPrice: '¥' + system.systemPrice.toFixed(2),
        });
      });
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.loadService = function(){
    $http.get('/common/serviceList').then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.serviceList === null){
        return false;
      }
      angular.forEach(response.data.serviceList, function (system) {
        $scope.model.serviceList.push({
          serviceID: system.serviceID,
          serviceYear: system.serviceYear + '年',
          servicePrice: '¥' + system.servicePrice.toFixed(2),
        });
      });
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onBankChange = function(){
    $scope.loadBranch();
  };

  $scope.onSystemChange = function(system){
    let systemIDList = [];
    let systemNameList = [];
    if($scope.model.selectedSystemList.indexOf(system) === -1){
      $scope.model.selectedSystemList.push(system);
    }else{
      $scope.model.selectedSystemList.splice($scope.model.selectedSystemList.indexOf(system), 1);
    }

    angular.forEach($scope.model.selectedSystemList, function (system) {
      systemIDList.push(system.systemID);
      systemNameList.push(system.systemName);
    });
    $scope.model.selectedSystemID = systemIDList.join(',');
    $scope.model.displaySelectedSystem = systemNameList.join('|');

    $scope.calculationOrderAmount('system');

  };

  $scope.onServiceChange = function(service){
    $scope.model.selectedService = service;
    if($scope.model.orderTypeText.indexOf('（') >= 0){
      $scope.model.orderTypeText = $scope.model.orderTypeText.substr(0, $scope.model.orderTypeText.indexOf('（'));
    }
    $scope.model.orderTypeText += '（' + service.serviceYear + '）';
    $scope.calculationOrderAmount('service');
  };

  $scope.onOrderTypeChange = function(orderType){
    switch (orderType) {
      case 'N':
        $scope.model.orderType = orderType;
        $scope.model.orderTypeText = '仅软件系统';
        $scope.model.isShowServiceList = false;
        $scope.model.selectedService = null;
        $("input[type='radio'][name='serviceYear']").prop("checked",false);
        $scope.calculationOrderAmount('service');
        break;
      case 'S':
        $scope.model.orderType = orderType;
        $scope.model.orderTypeText = '软件系统+服务器托管';
        $scope.model.isShowServiceList = true;
        break;
    }
  };

  $scope.calculationOrderAmount = function(priceFlag){
    //计算软件系统费用
    if(priceFlag === 'system'){
      $scope.model.originalTotalSystemPrice = 0;
      angular.forEach($scope.model.selectedSystemList, function (system) {
        $scope.model.originalTotalSystemPrice += Number(system.systemPrice.substr(1));
      });
    }

    //计算服务器托管费用
    if(priceFlag === 'service'){
      $scope.model.originalTotalServicePrice = $scope.model.selectedService === null ?
          $scope.model.originalTotalServicePrice = 0 :
          Number($scope.model.selectedService.servicePrice.substr(1));
    }

    //计算原始价格
    $scope.model.originalPrice = $scope.model.originalTotalSystemPrice + $scope.model.originalTotalServicePrice;

    //计算折扣后的价格
    let purchaseCount = $scope.model.selectedSystemList.length;

    switch (purchaseCount) {
      case 1:
        $scope.model.orderDiscount = 1;
        break;
      case 2:
        $scope.model.orderDiscount = 0.95;
        break;
      case 3:
        $scope.model.orderDiscount = 0.85;
        break;
    }
    $scope.model.paymentPrice = $scope.model.originalTotalSystemPrice * $scope.model.orderDiscount + $scope.model.originalTotalServicePrice;

    //格式化显示的价格
    $scope.model.formatPaymentPrice = '¥' + $scope.model.paymentPrice.toFixed(2);
    $scope.model.formatOriginalPrice = '¥' + $scope.model.originalPrice.toFixed(2);
  };

  $scope.loadData = function(){
    let orderID = document.getElementById('hidden-orderID').value;
    if(orderID === ''){
      return false;
    }
    $http.get('/order/edit/detail?orderID=' + orderID).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.systemInfo === null){
        return false;
      }
      $scope.model.accountID = response.data.accountInfo.accountID;
      $scope.model.currentBankCode = response.data.accountInfo.bankCode;
      $scope.model.currentBranchCode = response.data.accountInfo.branchCode;
      if($scope.model.bankList.length > 1){
        angular.forEach($scope.model.bankList, function (bank) {
          if(bank.bankCode === response.data.accountInfo.bankCode){
            $scope.model.selectedBank = bank;
            return false;
          }
        });
        $scope.loadBranch();
      }
      if($scope.model.branchList > 1){
        angular.forEach($scope.model.branchList, function (branch) {
          if(branch.branchCode === response.data.accountInfo.branchCode){
            $scope.model.selectedBranch = branch;
            return false;
          }
        });
      }

      //软件系统
      //$scope.model.servicePrice = response.data.systemInfo.servicePrice;

      $scope.model.account = response.data.accountInfo.account;
      $scope.model.password = response.data.accountInfo.password;

      $scope.model.add = false;
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.getSelectedSystemId = function(){
    let systemIdList = [];
    angular.forEach($scope.model.selectedSystemList, function (system) {
      systemIdList.push(system.systemID);
    });
    return systemIdList;
  };

  $scope.addData = function () {
    $http.post('/order/edit', {
      bankCode: $scope.model.selectedBank.bankCode,
      branchCode: $scope.model.selectedBranch.branchCode,
      orderType: $scope.model.orderType,
      originalAmount: $scope.model.originalPrice,
      discount: $scope.model.orderDiscount,
      orderAmount: $scope.model.paymentPrice,
      serviceYear: $scope.model.selectedService.serviceYear.replace('年', ''),
      orderItemList: $scope.model.selectedSystemID,
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      location.href = '/order';
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.changeData = function () {
    let systemIdList = $scope.getSelectedSystemId();
    $http.put('/systemAccount/edit', {
      accountID: $scope.model.accountID,
      bankCode: $scope.model.selectedBank.bankCode,
      branchCode: $scope.model.selectedBranch.branchCode,
      systemMultipleID: systemIdList.join(','),
      account: $scope.model.account,
      password: $scope.model.password,
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      location.href = '/systemAccount';
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onSubmit = function () {
    if($scope.model.orderID === ''){
      $scope.addData();
    }else{
      $scope.changeData();
    }
  };

  $scope.initPage();
});