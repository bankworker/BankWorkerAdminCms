let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.onChange = function (systemID) {
    location.href = '/systemSetting/edit?systemID=' + systemID;
  };
});