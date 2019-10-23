let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    dataStatus: 'A',
    provinceList: [{provinceCode: 0, provinceName: '全部'}],
    cityList: [{codeCode: 0, codeName: '全部'}],
    districtList: [{districtCode: 0, districtName: '全部'}],
    selectedProvinceCode: '0',
    selectedCityCode: '0',
    selectedDistrictCode: '0',
    bankList: [{bankCode: 0, bankName: '全部'}],
    selectedBankCode: '0'
  };

  $scope.initPage = function () {
    $scope.loadProvince();
    $scope.loadBank();
    $scope.loadDataStatus();
  };

  $scope.loadProvince = function(){
    $http.get('/common/chinaMapping/?parentCode=0').then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.chinaMapping === null){
        return false;
      }
      angular.forEach(response.data.chinaMapping, function (region) {
        $scope.model.provinceList.push({
          provinceCode: region.regionCode,
          provinceName: region.regionName
        });
      });
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.loadCity = function(){
    $scope.model.selectedCityCode = '0';
    if($scope.model.cityList.length > 1){
      $scope.model.cityList.splice(1);
    }
    if($scope.model.selectedProvinceCode === '0'){
      return false;
    }
    $http.get('/common/chinaMapping/?parentCode=' + $scope.model.selectedProvinceCode).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.chinaMapping === null){
        return false;
      }
      angular.forEach(response.data.chinaMapping, function (region) {
        $scope.model.cityList.push({
          codeCode: region.regionCode,
          codeName: region.regionName
        });
      });


    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.loadDistrict = function(){
    $scope.model.selectedDistrictCode = '0';
    if($scope.model.districtList.length > 1){
      $scope.model.districtList.splice(1);
    }

    if($scope.model.selectedCityCode === '0'){
      return false;
    }
    $http.get('/common/chinaMapping/?parentCode=' + $scope.model.selectedCityCode).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.chinaMapping === null){
        return false;
      }
      angular.forEach(response.data.chinaMapping, function (region) {
        $scope.model.districtList.push({
          districtCode: region.regionCode,
          districtName: region.regionName
        });
      });
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
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
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.loadDataStatus = function(){
    $scope.model.dataStatus = document.getElementById('hidden-dataStatus').value;
  };

  $scope.onProvinceChange = function(){
    $scope.loadCity();
    $scope.loadDistrict();
  };

  $scope.onCityChange = function(){
    $scope.loadDistrict();
  };

  $scope.onSearch = function () {
    //location.href = '/bank/branch?dataStatus=' + $scope.model.dataStatus;
  };

  $scope.onChange = function (bankBranchID) {
    location.href = '/bank/branch/edit?bankBranchID=' + bankBranchID;
  };

  $scope.onDelete = function (branchID, branchName) {
    bootbox.confirm({
      message: '您确定要将' + branchName + '修改为冻结状态吗？',
      buttons: {
        confirm: {
          label: '确认',
          className: 'btn-danger'
        },
        cancel: {
          label: '取消',
          className: 'btn-default'
        }
      },
      callback: function (result) {
        if(result) {
          $http.put('/bank/branch/changeStatus', {
            branchID:  branchID,
            dataStatus: 'D',
            loginUser: getLoginUser()
          }).then(function successCallback(response) {
            if(response.data.err){
              bootbox.alert(response.data.msg);
              return false;
            }
            location.reload();
          }, function errorCallback(response) {
            bootbox.alert('网络异常，请检查网络设置');
          });
        }
      }
    });
  };

  $scope.onRecover = function (branchID, branchName) {
    bootbox.confirm({
      message: '您确定要将' + branchName + '恢复为正常状态吗？',
      buttons: {
        confirm: {
          label: '确认',
          className: 'btn-success'
        },
        cancel: {
          label: '取消',
          className: 'btn-default'
        }
      },
      callback: function (result) {
        if(result) {
          $http.put('/bank/branch/changeStatus', {
            branchID:  branchID,
            dataStatus: 'N',
            loginUser: getLoginUser()
          }).then(function successCallback(response) {
            if(response.data.err){
              bootbox.alert(response.data.msg);
              return false;
            }
            location.reload();
          }, function errorCallback(response) {
            bootbox.alert('网络异常，请检查网络设置');
          });
        }
      }
    });
  };

  $scope.initPage();
});