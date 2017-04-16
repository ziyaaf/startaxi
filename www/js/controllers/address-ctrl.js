angular.module('starter.controllers')
.controller('AddressCtrl', function($scope,$mdToast, config,$stateParams , $localStorage , $state, $http , $ionicLoading, $ionicPopup) {

     $scope.save = function() {
        console.log($scope.myprofile);
        if ( !$scope.myprofile.housename || !$scope.myprofile.streetname || !$scope.myprofile.postaltown || !$scope.myprofile.postalcode || !$scope.myprofile.county ) {
            showAlert($ionicPopup , 'My Address' ,'Please fill all required fields');
        } else {
            showLoadingScreen($ionicLoading);
            $http.get(config.webservicePath+"web/individual-customer/saveaddressinfo?addressId="+$localStorage.addid+"&houseNoOrName="+encodeURIComponent($scope.myprofile.housename)+"&streetName="+encodeURIComponent($scope.myprofile.streetname)+"&postalTown="+encodeURIComponent($scope.myprofile.postaltown)+"&postalCode="+encodeURIComponent($scope.myprofile.postalcode)+"&county="+encodeURIComponent($scope.myprofile.county),  { cache : false }).then(function(response) {
                console.log(config.webservicePath+"web/individual-customer/saveaddressinfo?addressId="+$localStorage.addid+"&houseNoOrName="+encodeURIComponent($scope.myprofile.housename)+"&streetName="+encodeURIComponent($scope.myprofile.streetname)+"&postalTown="+encodeURIComponent($scope.myprofile.postaltown)+"&postalCode="+encodeURIComponent($scope.myprofile.postalcode)+"&county="+encodeURIComponent($scope.myprofile.county));
                $ionicLoading.hide();
                
                $mdToast.show(
                  $mdToast.simple()
                    .textContent('Address saved successfully !')
                    .position('bottom')
                    .hideDelay(3000)
                );
            });
        }
        
     };
});