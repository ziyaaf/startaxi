angular.module('starter.controllers')
.controller('MyProfileCtrl', function($scope, $stateParams,$localStorage , $cordovaDialogs) {
    $scope.$on('$ionicView.enter', function() {
        $scope.firstname = $localStorage.firstname;
        $scope.lastname = $localStorage.lastname;alert($scope.firstname);
        $scope.phone = $localStorage.phone;
        $scope.mobile = $localStorage.mobile;
        $scope.email = $localStorage.email;
        
        $scope.housename = $localStorage.housename;
        $scope.streetname = $localStorage.streetname;
        $scope.postaltown = $localStorage.postaltown;
        $scope.postalcode = $localStorage.postalcode;
        $scope.county = $localStorage.county;
    });
});