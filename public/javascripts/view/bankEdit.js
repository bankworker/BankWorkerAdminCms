let app = angular.module('myApp', []);

app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    bankID: '',
    bankLogo: '/images/logo_temp.jpeg',
    bankCodeOriginal: '',
    bankCode: '',
    bankName: '',
    bankCodeInvalid: false,
    add: true
  };

  $scope.initPage = function () {
    $scope.initUploadPlugins();
    $scope.loadData();
  };

  $scope.initUploadPlugins = function(){
    uploadUtils.initUploadPlugin('#file-upload-thumbnail', '/bank/edit/fileUpload', ['png','jpg', 'jpeg'], false, function (opt,data) {
      $scope.model.bankLogo = data.imageUrl[0];
      $scope.$apply();
      $('#modal-upload-logo').modal('hide');
    });
  };

  $scope.loadData = function(){
    let bankID = document.getElementById('hidden-bankID').value;
    if(bankID === ''){
      return false;
    }
    $http.get('/bank/edit/detail?bankID=' + bankID).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.bankInfo === null){
        return false;
      }
      $scope.model.bankID = response.data.bankInfo.bankID;
      $scope.model.bankCodeOriginal = response.data.bankInfo.bankCode;
      $scope.model.bankCode = response.data.bankInfo.bankCode;
      $scope.model.bankName = response.data.bankInfo.bankName;
      $scope.model.bankLogo = response.data.bankInfo.bankLogo;
      $scope.model.add = false;
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.addData = function () {
    $http.post('/bank/edit', {
      bankCode: $scope.model.bankCode,
      bankName: $scope.model.bankName,
      bankLogo: $scope.model.bankLogo,
      // loginUser: getLoginUser()
      loginUser: 'zhangqiang'
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      location.href = '/bank';
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.changeData = function () {
    $http.put('/bank/edit', {
      bankID:  $scope.model.bankID,
      bankCode: $scope.model.bankCode,
      bankName: $scope.model.bankName,
      bankLogo: $scope.model.bankLogo,
      // loginUser: getLoginUser()
      loginUser: 'zhangqiang'
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      location.href = '/bank';
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onShowUploadLogo = function () {
    $('#modal-upload-logo').modal('show');
  };

  $scope.onBankCodeBlur = function(){
    if($scope.model.bankCode === '' || $scope.model.bankCodeOriginal === $scope.model.bankCode){
      $scope.model.bankCodeInvalid = false;
      return false;
    }
    $http.get('/bank/edit/bankCode/exist?bankCode=' + $scope.model.bankCode).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      $scope.model.bankCodeInvalid = response.data.exist;
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onSubmit = function () {
    if($scope.model.bankLogo === '/images/logo_temp.jpeg'){
      bootbox.alert('请上传银行Logo');
      return false;
    }
    if($scope.model.bankID === ''){
      $scope.addData();
    }else{
      $scope.changeData();
    }
  };

  $scope.initPage();
});