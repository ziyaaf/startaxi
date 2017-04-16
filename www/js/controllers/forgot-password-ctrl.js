angular.module('starter.controllers')
.controller('ForgotPwdCtrl', function($scope, config,$stateParams , $localStorage , $state , $ionicPopup,$http , $ionicLoading , $ionicSideMenuDelegate) {
     
     console.log($scope.resetPwForm);
     $scope.resetPwForm = {};
     
     $scope.resetPassword = function(){
         if ( !$scope.resetPwForm.email ){
             showAlert($ionicPopup , 'Forgot Password' ,'Please enter your email address');
         } else if(!isValidEmail($scope.resetPwForm.email)){
             $ionicPopup.alert({
                 title: "Forgot Password",
                 template: 'Please enter a valid email address'
               });
         } else {
             var emailExists = encodeURI(config.webservicePath+"web/individual-customer/isemailexists?email="+$scope.resetPwForm.email);
             $http.get(emailExists,  { cache : false }).then(function(response) {
                console.log("Email : "+response.data);
                if(!response.data){
                    var alertPopup = $ionicPopup.alert({
                     title: "Forgot Password",
                     template: 'Sorry, this email is not in our system.'
                   });
                } else if(response.data){
                    var sendEmail = encodeURI(config.webservicePath+"web/individual-customer/sendpwdresetemail?email="+$scope.resetPwForm.email);
                    $http.get(sendEmail,  { cache : false }).then(function(response) {
                        if(response.data == 'OK'){
                            $ionicPopup.alert({
                                 title: "Password Reset",
                                 template: 'Password reset link have been sent to your email. '
                               });
                            $scope.resetPwForm.email = "";
                        } else {
                            
                        }
                    });
                }
            });
         }
     };
     
     $scope.cancelResetPw = function(){
         console.log("Reset PW cancelled");
         $state.go('login');
     };   
     
});

function isValidEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}