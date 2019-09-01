let app = angular.module('myApp', []);

app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {

  };

  $scope.onChange = function (orderID) {
    location.href = '/order/edit?orderID=' + orderID;
  };

  $scope.onPay = function (orderID) {
    bootbox.confirm({
      message: '您确定要订单' + orderID + '的状态修改为已支付吗？',
      buttons: {
        confirm: {
          label: '确认',
          className: 'btn-danger'
        },
        cancel: {
          label: '关闭',
          className: 'btn-default'
        }
      },
      callback: function (result) {
        if(result) {
          $http.put('/order/changeStatus', {
            orderID:  orderID,
            orderStatus: 'P',
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

  $scope.onCancel = function (orderID) {
    bootbox.confirm({
      message: '您确定要取消订单' + orderID + '吗？',
      buttons: {
        confirm: {
          label: '是的',
          className: 'btn-danger'
        },
        cancel: {
          label: '不是',
          className: 'btn-default'
        }
      },
      callback: function (result) {
        if(result) {
          $http.put('/order/changeStatus', {
            orderID:  orderID,
            orderStatus: 'C',
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

});