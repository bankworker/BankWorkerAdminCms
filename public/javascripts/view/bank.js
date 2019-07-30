let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    dataStatus: 'A'
  };

  $scope.initPage = function () {
    $scope.model.dataStatus = document.getElementById('hidden-dataStatus').value;
  };

  $scope.onSearch = function () {
    location.href = '/bank?dataStatus=' + $scope.model.dataStatus;
  };

  $scope.onChange = function (bankID) {
    location.href = '/bank/edit?bankID=' + bankID;
  };

  $scope.onDelete = function (bankID, bankName) {
    bootbox.confirm({
      message: '您确定要将' + bankName + '修改为删除状态吗？',
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
          $http.put('/bank/changeStatus', {
            bankID:  bankID,
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

  $scope.onRecover = function (bankID, bankName) {
    bootbox.confirm({
      message: '您确定要将' + bankName + '恢复为正常状态吗？',
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
          $http.put('/bank/changeStatus', {
            bankID:  bankID,
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