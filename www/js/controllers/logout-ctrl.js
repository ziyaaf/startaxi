angular.module('starter.controllers')
.controller('LogoutCtrl', function($scope, $ionicHistory ,$ionicPopup ,$stateParams , $localStorage , $state) {
    var confirmPopup = $ionicPopup.confirm({
     title: 'Star Taxi',
     template: 'Are you sure you want to logout ?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       // $scope.$on('$ionicView.enter', function() {
            $localStorage.firstname = "";
            $localStorage.lastname = "";
            $localStorage.phone = "";
            $localStorage.mobile = "";
            $localStorage.loggedin = "NO";
            $state.go('login');
        // });
     } else {
         console.log("cancelled");
       $state.go('app.booking');
     }
   });
   
   $scope.$on("$ionicView.afterLeave", function () {
         $ionicHistory.clearCache();
 });
     
});