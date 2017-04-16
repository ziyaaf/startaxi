angular.module('starter.controllers')
.controller('MenuCtrl', function($scope, $localStorage) {
    $scope.$on('$ionicView.enter', function() {
        if($localStorage.loggedin == "YES"){
             $scope.isLoggedIn = true;
        } else {
             $scope.isLoggedIn = false;
        }       
    });
});
