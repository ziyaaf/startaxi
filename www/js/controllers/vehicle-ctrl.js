angular.module('starter.controllers')
.controller('VehicleCtrl', function($ionicSlideBoxDelegate , config, $state , $stateParams , $scope , $cordovaGeolocation , $timeout , $http , $ionicPopup , $ionicLoading) {

    showLoadingScreen($ionicLoading);
    $scope.closeVehicleInfo = function() {
        $state.go('app.booking');
    };
    
    $http.get(config.webservicePath+"web/booking/vehicletypes",  { cache : false }).then(function(response) {
        console.log(response);
        // $scope.vehicles = response.data;
        $ionicSlideBoxDelegate.update();
        $ionicLoading.hide();
    });

});
