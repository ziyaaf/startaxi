angular.module('starter.controllers')
.controller('MytripsCtrl', function($scope,config, $stateParams , $localStorage , $http , $ionicLoading) {
    showLoadingScreen($ionicLoading);
    $scope.$on('$ionicView.enter', function() {
        $http.get(config.webservicePath+"web/user-journey/getbookinghistory?userId="+$localStorage.uid,  { cache : false }).then(function(response) {
            console.log("My Trips URL");
            console.log(config.webservicePath+"web/user-journey/getbookinghistory?userId="+$localStorage.uid);
            console.log(response);
            $scope.mytrips = response.data;
            $ionicLoading.hide();
        });
    });
     
});