let app = angular.module('myApp', []);

app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    bankBranchLogo: '/images/logo_temp.jpeg',
    bankBranchID: '',
    currentBankCode: 0,
    selectedBank: null,
    bankList: [{bankCode: 0, bankName: '全部'}],
    bankBranchCodeOriginal: '',
    bankBranchCode: '',
    bankBranchName: '',

    currentProvinceCode: 0,
    selectedProvince: null,
    provinceList: [{provinceCode: 0, provinceName: '全部'}],

    currentCityCode: 0,
    selectedCity: null,
    cityList: [{cityCode: 0, cityName: '全部'}],

    currentDistrictCode: 0,
    selectedDistrict: null,
    districtList: [{districtCode: 0, districtName: '全部'}],

    address: '',
    branchContact: '',
    branchContactCellphone: '',
    bankBranchCodeInvalid: false,
    add: true
  };

  $scope.initPage = function () {
    $scope.initUploadPlugins();
    $scope.loadBank();
    $scope.loadProvince();
    $scope.setDefaultOption();
    $scope.loadData();
  };

  $scope.initUploadPlugins = function(){
    uploadUtils.initUploadPlugin('#file-upload-thumbnail', '/bank/branch/edit/fileUpload', ['png','jpg', 'jpeg'], false, function (opt,data) {
      $scope.model.bankBranchLogo = data.imageUrl[0];
      $scope.$apply();
      $('#modal-upload-logo').modal('hide');
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
      if($scope.model.currentProvinceCode !== 0){
        angular.forEach($scope.model.provinceList, function (province) {
          if(province.provinceCode === $scope.model.currentProvinceCode){
            $scope.model.selectedProvince = province;
            return false;
          }
        });
        $scope.loadCity();
      }
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.loadCity = function(){
    $scope.model.selectedCity = $scope.model.cityList[0];
    if($scope.model.cityList.length > 1){
      $scope.model.cityList.splice(1);
    }
    if($scope.model.selectedProvince.provinceCode === 0){
      return false;
    }
    $http.get('/common/chinaMapping/?parentCode=' + $scope.model.selectedProvince.provinceCode).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.chinaMapping === null){
        return false;
      }
      angular.forEach(response.data.chinaMapping, function (region) {
        $scope.model.cityList.push({
          cityCode: region.regionCode,
          cityName: region.regionName
        });
      });
      if($scope.model.currentCityCode !== 0){
        angular.forEach($scope.model.cityList, function (city) {
          if(city.cityCode === $scope.model.currentCityCode){
            $scope.model.selectedCity = city;
            return false;
          }
        });
        $scope.loadDistrict();
      }
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.loadDistrict = function(){
    $scope.model.selectedDistrict = $scope.model.districtList[0];
    if($scope.model.districtList.length > 1){
      $scope.model.districtList.splice(1);
    }

    if($scope.model.selectedCity.cityCode === 0){
      return false;
    }
    $http.get('/common/chinaMapping/?parentCode=' + $scope.model.selectedCity.cityCode).then(function successCallback (response) {
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
      if($scope.model.currentDistrictCode !== 0){
        angular.forEach($scope.model.districtList, function (district) {
          if(district.districtCode === $scope.model.currentDistrictCode){
            $scope.model.selectedDistrict = district;
            return false;
          }
        });
      }
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.setDefaultOption = function(){
    if($scope.model.add){
      $scope.model.selectedBank = $scope.model.bankList[0];
      $scope.model.selectedProvince = $scope.model.provinceList[0];
      $scope.model.selectedCity = $scope.model.cityList[0];
      $scope.model.selectedDistrict = $scope.model.districtList[0];
    }
  };

  $scope.loadData = function(){
    let branchID = document.getElementById('hidden-bankBranchID').value;
    if(branchID === ''){
      return false;
    }
    $http.get('/bank/branch/edit/detail?branchID=' + branchID).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.branchInfo === null){
        return false;
      }
      $scope.model.currentBankCode = response.data.branchInfo.bankCode;
      $scope.model.bankBranchID = response.data.branchInfo.branchID;
      $scope.model.bankBranchLogo = response.data.branchInfo.branchLogo;
      $scope.model.bankBranchCode = response.data.branchInfo.branchCode;
      $scope.model.bankBranchCodeOriginal = response.data.branchInfo.branchCode;
      $scope.model.bankBranchName = response.data.branchInfo.branchName;
      $scope.model.currentProvinceCode = response.data.branchInfo.provinceCode;
      $scope.model.currentCityCode = response.data.branchInfo.cityCode;
      $scope.model.currentDistrictCode = response.data.branchInfo.districtCode;
      $scope.model.address = response.data.branchInfo.address;
      $scope.model.branchContact = response.data.branchInfo.branchContact;
      $scope.model.branchContactCellphone = response.data.branchInfo.branchContactCellphone;
      $scope.model.add = false;
      if($scope.model.bankList.length > 1){
        angular.forEach($scope.model.bankList, function (bank) {
          if(bank.bankCode === $scope.model.currentBankCode){
            $scope.model.selectedBank = bank;
          }
        });
      }
      if($scope.model.provinceList.length > 1){
        angular.forEach($scope.model.provinceList, function (province) {
          if(province.provinceCode === $scope.model.currentProvinceCode){
            $scope.model.selectedProvince = province;
          }
        });
        $scope.loadCity();
      }
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.addData = function () {
    $http.post('/bank/branch/edit', {
      bankCode: $scope.model.selectedBank.bankCode,
      branchCode: $scope.model.bankBranchCode,
      branchName: $scope.model.bankBranchName,
      provinceCode: $scope.model.selectedProvince.provinceCode,
      cityCode: $scope.model.selectedCity.cityCode,
      districtCode: $scope.model.selectedDistrict.districtCode,
      address: $scope.model.address,
      branchLogo: $scope.model.bankBranchLogo,
      branchContact: $scope.model.branchContact,
      branchContactCellphone: $scope.model.branchContactCellphone,
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      location.href = '/bank/branch';
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.changeData = function () {
    $http.put('/bank/branch/edit', {
      bankBranchID:  $scope.model.bankBranchID,
      bankCode: $scope.model.selectedBank.bankCode,
      branchCode: $scope.model.bankBranchCode,
      branchName: $scope.model.bankBranchName,
      provinceCode: $scope.model.selectedProvince.provinceCode,
      cityCode: $scope.model.selectedCity.cityCode,
      districtCode: $scope.model.selectedDistrict.districtCode,
      address: $scope.model.address,
      branchLogo: $scope.model.bankBranchLogo,
      branchContact: $scope.model.branchContact,
      branchContactCellphone: $scope.model.branchContactCellphone,
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      location.href = '/bank/branch';
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onProvinceChange = function(){
    $scope.loadCity();
    $scope.loadDistrict();
  };

  $scope.onCityChange = function(){
    $scope.loadDistrict();
  };

  $scope.onShowUploadLogo = function () {
    $('#modal-upload-logo').modal('show');
  };

  $scope.onBankBranchCodeBlur = function(){
    if($scope.model.bankBranchCode === '' || $scope.model.bankBranchCodeOriginal === $scope.model.bankBranchCode){
      $scope.model.bankBranchCodeInvalid = false;
      return false;
    }
    $http.get('/bank/branch/edit/branchCode/exist?branchCode=' + $scope.model.bankBranchCode).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      $scope.model.bankBranchCodeInvalid = response.data.exist;
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onSubmit = function () {
    if($scope.model.bankBranchID === ''){
      $scope.addData();
    }else{
      $scope.changeData();
    }
  };

  $scope.initPage();
});