angular.module('starter.controllers')
.controller('PersonalinfoCtrl', function($scope, config,$stateParams , $localStorage , $state, $http , $ionicLoading , $ionicPopup, $mdToast) {
     
     $scope.$on('$ionicView.enter', function() {
        showLoadingScreen($ionicLoading); 
        $scope.myprofile = {};
        $http.get(config.webservicePath+"web/individual-customer/getpersonalinfo?userId="+$localStorage.uid,  { cache : false }).then(function(response) {
            console.log("Getting user details for ID : "+$localStorage.uid);
            console.log(response.data);
            $scope.myprofile.title = response.data.TITLE;
            $scope.myprofile.firstname = response.data.FNAME;
            $scope.myprofile.lastname = response.data.LNAME;
            $scope.myprofile.phone = response.data.PHONE;
            $scope.myprofile.mobile = response.data.MOBILE_PHONE;
            $scope.myprofile.email = response.data.EMAIL;
            $scope.myprofile.tittle = response.data.TITLE;
            $ionicLoading.hide();
        });
        
        $http.get(config.webservicePath+"web/individual-customer/getaddressinfo?addressId="+$localStorage.addid,  { cache : false }).then(function(response) {
            // console.log(config.webservicePath+"web/individual-customer/getaddressinfo?addressId="+$localStorage.addid);
            console.log(response.data);
            $scope.myprofile.housename = response.data.HOUSE_NO_OR_NAME;
            $scope.myprofile.streetname = response.data.STREET_NAME;
            $scope.myprofile.postaltown = response.data.POSTAL_TOWN;
            $scope.myprofile.postalcode = response.data.POSTAL_CODE;
            $scope.myprofile.county = response.data.COUNTY;
            $ionicLoading.hide();
        });
        
        
        // console.log($scope.myprofile.firstname);
    });
     
     $scope.save = function() {
        if ( !$scope.myprofile.firstname || !$scope.myprofile.lastname || !$scope.myprofile.phone
        || !$scope.myprofile.email || !$scope.myprofile.mobile ) {
            showAlert($ionicPopup , 'My Profile' ,'Please fill all required fields');
        } else {
            showLoadingScreen($ionicLoading);
            console.log(config.webservicePath+"web/individual-customer/savepersonalinfo?userId="+$localStorage.uid+"&title="+$scope.myprofile.title+"&fname="+encodeURIComponent($scope.myprofile.firstname)+"&lname="+encodeURIComponent($scope.myprofile.lastname)+"&mobile="+encodeURIComponent($scope.myprofile.mobile)+"&phone="+encodeURIComponent($scope.myprofile.phone)+"&email="+encodeURIComponent($scope.myprofile.email));
            $http.get(config.webservicePath+"web/individual-customer/savepersonalinfo?userId="+$localStorage.uid+"&title="+$scope.myprofile.title+"&fname="+encodeURIComponent($scope.myprofile.firstname)+"&lname="+encodeURIComponent($scope.myprofile.lastname)+"&mobile="+encodeURIComponent($scope.myprofile.mobile)+"&phone="+encodeURIComponent($scope.myprofile.phone)+"&email="+encodeURIComponent($scope.myprofile.email),  { cache : false }).then(function(response) {
                $localStorage.firstname = $scope.myprofile.firstname;
                $localStorage.lastname = $scope.myprofile.lastname;
                $localStorage.phone = $scope.myprofile.phone;
                $localStorage.email = $scope.myprofile.email;
                $localStorage.mobile = $scope.myprofile.mobile;
                $ionicLoading.hide();
                // showAlert($ionicPopup , 'My Profile' ,'Saved successfully !');

                $mdToast.show(
                  $mdToast.simple()
                    .textContent('Saved successfully !')
                    .position('bottom')
                    .hideDelay(3000)
                );
                
            });
        }
            
        
     };
});
 
