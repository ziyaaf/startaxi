angular.module('starter.controllers')
.controller('SignupCtrl', function($scope, config,$stateParams , $localStorage , $state , $ionicPopup,$http , $ionicLoading , $ionicSideMenuDelegate) {
     $ionicSideMenuDelegate.canDragContent(false);
     console.log($scope.signupForm);
     $scope.signupForm = {};
     $scope.doSignup = function(){
         // console.log($scope.signupForm.email);  
         console.log($scope.signupForm);
         if ( !$scope.signupForm.firstName || !$scope.signupForm.mobileNumber || !$scope.signupForm.email || 
         !$scope.signupForm.password || !$scope.signupForm.confirmPassword ){
             // showAlert($ionicPopup , 'Signup' ,'Please fill all required fields');
             $ionicPopup.alert({
                 title: "Signup",
                 template: 'Please fill all required fields !'
               });
         } else if(!isValidEmail($scope.signupForm.email)){
             $ionicPopup.alert({
                 title: "Signup",
                 template: 'Please enter a valid email address'
               });
         } else if($scope.signupForm.password != $scope.signupForm.confirmPassword){
             $ionicPopup.alert({
                 title: "Signup",
                 template: 'Password and Confirm passwords do not match'
               });
         }else {
             showLoadingScreen($ionicLoading);
             var emailExists = encodeURI(config.webservicePath+"web/individual-customer/isemailexists?email="+$scope.signupForm.email);
             $http.get(emailExists,  { cache : false }).then(function(response) {
                console.log(response);
                console.log("Email : "+response.data);
                if(!response.data){
                    // var mobileExists = encodeURI(config.webservicePath+"web/individual-customer/ismobileexists?mobile="+$scope.signupForm.mobileNumber);
                    // $http.get(mobileExists ,  { cache : false }).then(function(response) {
                    //     console.log(config.webservicePath+"web/individual-customer/ismobileexists?mobile="+$scope.signupForm.mobileNumber);
                    //     console.log("Mobile : "+response.data);
                    //     if(response.data){
                    //         var alertPopup = $ionicPopup.alert({
                    //              title: "Signup",
                    //              template: 'Mobile Number already exists'
                    //            });
                    //     } else {
                    //         
                    //     }
                    // });
                    // All validations are okay
                    
                    var registerUser = encodeURI(config.webservicePath+"web/individual-customer/registernewuser?fname="+$scope.signupForm.firstName+"&mobile="+$scope.signupForm.mobileNumber+"&email="+$scope.signupForm.email+"&password="+$scope.signupForm.password);
                    $http.get(registerUser,  { cache : false }).then(function(response) {
                        if(response.data.saved == 'yes'){
                                                            
                            $ionicLoading.hide();
                            
                            $scope.signupForm.firstName = "";
                            $scope.signupForm.mobileNumber = "";
                            $scope.signupForm.email = "";
                            $scope.signupForm.password = "";
                            $scope.signupForm.confirmPassword = "";
                            
                            var alertPopup = $ionicPopup.alert({
                                 title: "Star Taxi",
                                 template: 'Thank you for signing up. Please login to book a taxi.'
                               });
                            
                            alertPopup.then(function(res) {
                                 if(res) {
                                   $state.go('login');
                                 }
                            });
                            
                        }
                    });
                } else if(response.data){
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                     title: "Signup",
                     template: 'Email already exists'
                   });
                }
            });
             
         }
     };
     
     $scope.cancelSignup = function(){
         console.log("Signup cancelled");
         $state.go('login');
     };   
     
});

function isValidEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}