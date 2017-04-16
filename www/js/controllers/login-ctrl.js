angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, config,$state, $http ,$localStorage , $ionicLoading) {
    
    $scope.loginform = {};

    $scope.$on('$ionicView.beforeEnter', function() {
        if($localStorage.loggedin == "YES"){
            $state.go('app.booking');
        }
    });
    
    $scope.doLogin = function() {
        
        showLoadingScreen($ionicLoading);

        // console.log("UN:"+$scope.loginform.username);
        // console.log("PW:"+$scope.loginform.password);
        $http.get(config.webservicePath+"web/login/login?username="+$scope.loginform.username+"&password="+$scope.loginform.password,  { cache : false }).then(function(response) {
            console.log(response);
            if(response.data.EXISTS == "YES"){
                $localStorage.loggedin = "YES";
                
                $localStorage.uid = response.data.UID;
                $localStorage.firstname = response.data.FNAME;
                $localStorage.lastname = response.data.LNAME;
                $localStorage.phone = response.data.PHONE;
                $localStorage.email = response.data.EMAIL;
                $localStorage.mobile = response.data.MOBILE_PHONE;
                $localStorage.code = response.data.CODE;
                $localStorage.addid = response.data.ADDRESS_ID;
                
                $localStorage.housename = response.data.HOUSE_NO_OR_NAME ;
                $localStorage.streetname = response.data.STREET_NAME ;
                $localStorage.postaltown = response.data.POSTAL_TOWN ;
                $localStorage.postalcode = response.data.POSTAL_CODE ;
                $localStorage.county = response.data.COUNTY ;
                $ionicLoading.hide();
                $state.go('app.booking');
            } else {
                $scope.error_message = "Invalid Login details";
                $ionicLoading.hide();
            }
        });  
    };
});

angular.module('starter.controllers')
.controller('SignupForgotPwdCtrl', function($scope, $state, $http ,$localStorage , $ionicLoading, $ionicModal) {
    
    $scope.showSignup = function(){
         $state.go('app.signup'); 
    }
    
    $scope.showForgotPwd = function(){
         $state.go('app.forgotpwd');
    }
}); 
