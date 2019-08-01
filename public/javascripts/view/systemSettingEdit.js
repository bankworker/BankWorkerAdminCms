let app = angular.module('myApp', []);

app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    systemID: '',
    systemName: '',
    systemPrice: '',
    servicePrice: '',
    systemPriceShow: '',
    servicePriceShow: '',
    add: true
  };

  $scope.checkIsMoney = function(event) {
    if(!((event.keyCode >= 48 && event.keyCode <= 58) ||
        (event.keyCode >= 96 && event.keyCode <= 105) ||
        event.keyCode === 8 ||
        event.keyCode === 190 ||
        event.keyCode === 37 ||
        event.keyCode === 39 ||
        event.keyCode === 9
    )){
      event.preventDefault();
    }
    return true;
  };

  $scope.initPage = function () {
    $scope.loadData();
  };

  $scope.loadData = function(){
    let systemID = document.getElementById('hidden-systemID').value;
    if(systemID === ''){
      return false;
    }
    $http.get('/systemSetting/edit/detail?systemID=' + systemID).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.systemInfo === null){
        return false;
      }
      $scope.model.systemID = response.data.systemInfo.systemID;
      $scope.model.systemName = response.data.systemInfo.systemName;
      $scope.model.systemPrice = response.data.systemInfo.systemPrice;
      $scope.model.servicePrice = response.data.systemInfo.servicePrice;
      $scope.model.systemPriceShow = '¥' + response.data.systemInfo.systemPrice;
      $scope.model.servicePriceShow = '¥' + response.data.systemInfo.servicePrice;
      $scope.model.add = false;
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.addData = function () {
    $http.post('/systemSetting/edit', {
      systemName: $scope.model.systemName,
      systemPrice: $scope.model.systemPrice,
      servicePrice: $scope.model.servicePrice,
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      location.href = '/systemSetting';
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.changeData = function () {
    $http.put('/systemSetting/edit', {
      systemID:  $scope.model.systemID,
      systemName: $scope.model.systemName,
      systemPrice: $scope.model.systemPrice,
      servicePrice: $scope.model.servicePrice,
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      location.href = '/systemSetting';
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.formatMoney = function(money){
    if(money === ''){
      return false;
    }
    if(money.length <= 6 && money.indexOf('.') === -1){
      money = money + '.00';
      return money;
    }
    if(money.indexOf('.') >= 0 && money.substr(money.indexOf('.') + 1).length === 0){
      money = money + '00';
      return money;
    }
    if(money.indexOf('.') >= 0 && money.substr(money.indexOf('.') + 1).length === 1){
      money = money + '0';
      return money;
    }
    if(money.indexOf('.') >= 0 && money.substr(money.indexOf('.') + 1).length > 2){
      money = money.substr(0, money.indexOf('.') + 1) + money.substr(money.indexOf('.') + 1, 2);
      return money;
    }
    return money;
  };

  $scope.onSystemPriceBlur = function(){
    if($scope.model.systemPrice === ''){
      $scope.model.systemPriceShow = '';
      return false;
    }
    $scope.model.systemPrice = $scope.formatMoney($scope.model.systemPrice);
    $scope.model.systemPriceShow = '¥' + $scope.model.systemPrice;
  };

  $scope.onServicePriceBlur = function(){
    if($scope.model.servicePrice === ''){
      $scope.model.servicePriceShow = '';
      return false;
    }
    $scope.model.servicePrice = $scope.formatMoney($scope.model.servicePrice);
    $scope.model.servicePriceShow = '¥' + $scope.model.servicePrice;
  };

  $scope.onSubmit = function () {
    if($scope.model.systemID === ''){
      $scope.addData();
    }else{
      $scope.changeData();
    }
  };

  $scope.initPage();
});