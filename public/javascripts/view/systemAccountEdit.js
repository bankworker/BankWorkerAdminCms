let app = angular.module('myApp', []);

app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    accountID: '',
    selectedBank: null,
    bankList: [{bankCode: 0, bankName: '全部'}],
    currentBankCode: 0,
    selectedBranch: null,
    branchList: [{branchCode: 0, branchName: '全部'}],
    currentBranchCode: 0,
    systemList: [],
    selectedSystemList: [],
    displaySelectedSystem: '',
    account: '',
    password: '',
    add: true
  };


  $scope.initPage = function () {
    $scope.setDefaultOption();
    $scope.loadBank();
    $scope.loadSystemService();
    $scope.loadData();
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

  $scope.loadSystemService = function(){
    $http.get('/common/systemList').then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.bankList === null){
        return false;
      }
      angular.forEach(response.data.systemList, function (bank) {
        $scope.model.systemList.push({
          systemID: bank.systemID,
          systemName: bank.systemName
        });
      });
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onBankChange = function(){
    $scope.loadBranch();
  };

  $scope.onBranchChange = function(){
    if($scope.model.selectedBranch.branchCode === 0){
      $scope.model.account = '';
      $scope.model.password = '';
      return false;
    }
    $http.get('/common/bankBranchWithCode?bankCode=' + $scope.model.selectedBank.bankCode + '&branchCode=' + $scope.model.selectedBranch.branchCode).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.branchInfo === null){
        return false;
      }

      $scope.model.account = response.data.branchInfo.branchCode;
      $scope.model.password = response.data.branchInfo.branchContactCellphone.length > 6 ? response.data.branchInfo.branchContactCellphone.substr(5) : response.data.branchInfo.branchContactCellphone;
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onChangeSystem = function(changedSystem){
    let systemNameList = [];
    if($scope.model.selectedSystemList.indexOf(changedSystem) === -1){
      $scope.model.selectedSystemList.push(changedSystem);
    }else{
      $scope.model.selectedSystemList.splice($scope.model.selectedSystemList.indexOf(changedSystem), 1);
    }

    angular.forEach($scope.model.selectedSystemList, function (system) {
      systemNameList.push(system.systemName);
    });
    $scope.model.displaySelectedSystem = systemNameList.join('|');
  };

  $scope.loadData = function(){
    let accountID = document.getElementById('hidden-accountID').value;
    if(accountID === ''){
      return false;
    }
    $http.get('/systemAccount/edit/detail?accountID=' + accountID).then(function successCallback (response) {
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
    let systemIdList = $scope.getSelectedSystemId();
    $http.post('/systemAccount/edit', {
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

  //todo 需要检查账号的唯一性（支行联系人也需要检查电话号码的唯一性）
  $scope.onCellphoneBlur = function(){

  };

  //todo 需要检查该支行状态
  $scope.checkOrderIsValid = function(){
    return false;
  };

  $scope.onSubmit = function () {
    // if(!$scope.checkOrderIsValid()){
    //   bootbox.alert('暂时无法提交，请检查该支行订单状态！');
    //   return false;
    // }
    if($scope.model.accountID === ''){
      $scope.addData();
    }else{
      $scope.changeData();
    }
  };

  $scope.initPage();
});