// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
// ,'ngMessages'
angular.module('starter', ['ionic', 'ngCordova','ngStorage','starter.controllers', 'angucomplete-alt', 'starter.filters','ngMaterial','ngAria'])
.run(function($ionicPlatform,$ionicHistory,$state,$ionicPopup,$exceptionHandler,$ionicLoading) {
  
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
//     if (window.cordova && window.cordova.plugins.Keyboard) {
//       cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//       cordova.plugins.Keyboard.disableScroll(true);
// 
//     }
//     if (window.StatusBar) {
//       // org.apache.cordova.statusbar required
//       StatusBar.styleDefault();
//     }

    $ionicPlatform.registerBackButtonAction(function (event) {
        goBackToBookingPage(event, $ionicHistory , $state, $ionicPopup);
    }, 100);
    
  });
})
// .directive('ngCustomvalidation', function($http){
//     return {
//         restrict: 'A',
//         require: 'ngModel',
//         link: function($scope, $element, $attrs, ngModel){ 
//             ngModel.$validators.isValidBookingTime = function(modelValue) {
//               //true or false based on custome dir validation
//               // alert('s'+modelValue);
//             };
//         }
//     };
// })
.constant('config', {
        // webservicePath : 'https://pocket.deals/startaxiws/'
        webservicePath : 'https://startaxisuk.com/startaxiws/' 
    })
.factory('$exceptionHandler', function($log,$injector) {
    return function myExceptionHandler(exception, cause) {
      $injector.get('$ionicLoading').hide(); 
      console.log("aaaaaaa");
      console.log(exception);
      console.log(cause);
      console.log("xxxxxx");
      var alertPopup = $injector.get('$ionicPopup').alert({
         title: "Error",
         template: 'Unexpected error occurred.'+exception
       });
       if(alertPopup){
           // $injector.get('$state').go('app.booking');
       }
    };
})
.factory('GetCountryService', function ($http, $q) {
        return {
            getCountry: function(str) {
                // the $http API is based on the deferred/promise APIs exposed by the $q service
                // so it returns a promise for us by default
    			var url = "https://startaxisuk.com/startaxiws/web/location/getautocompletepostcode?q="+str;
                return $http.get(url)
                    .then(function(response) {
                        if (typeof response.data.result === 'object') {
                            console.log(response.data.result);
                            return response.data.result;
                        } else {
                            // invalid response
                            return $q.reject(response.data.result);
                        }

                    }, function(response) {
                        // something went wrong
                        return $q.reject(response.data.result);
                    });
            }
        };
    })
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    // $ionicConfigProvider.views.maxCache(0);

  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  
  .state('app.vehicleinfo', {
    url: '/vehicleinfo',
    views: {
      'menuContent': {
        templateUrl: 'templates/vehicleinfo.html'
      }
    }
  })
  
  .state('app.terminalchargeinfo', {
    url: '/terminalchargeinfo',
    views: {
      'menuContent': {
        templateUrl: 'templates/terminalchargeinfo.html'
      }
    }
  })

  .state('app.booking', {
    url: '/booking/:fromloc/:toloc',
    views: {
      'menuContent': {
        templateUrl: 'templates/booking.html'
      }
    }
  })

  .state('app.myprofile', {
      url: '/myprofile',
      views: {
        'menuContent': {
          templateUrl: 'templates/myprofile.html',
          controller: 'PersonalinfoCtrl'
        }
      }
    })
    
    .state('app.aboutus', {
      url: '/aboutus',
      views: {
        'menuContent': {
          templateUrl: 'templates/aboutus.html',
          controller: 'AboutUsCtrl'
        }
      }
    })
    
    .state('app.termsandconditions', {
      url: '/termsandconditions',
      views: {
        'menuContent': {
          templateUrl: 'templates/tac.html',
        }
      }
    })

    .state('app.mytrips', {
      url: '/mytrips',
      views: {
        'menuContent': {
          templateUrl: 'templates/mytrips.html',
          controller: 'MytripsCtrl'
        }
      }
    })
    
    .state('app.signup', {
      url: '/signup',
      views: {
        'menuContent': {
          templateUrl: 'templates/signup.html'
          , controller: 'SignupCtrl'
        }
      }
    })
    
    .state('app.forgotpwd', {
      url: '/forgotpwd',
      views: {
        'menuContent': {
          templateUrl: 'templates/forgot_password.html',
          controller: 'ForgotPwdCtrl'
        }
      }
    })
    
    .state('app.mytripinfo', {
      url: '/mytripinfo/:tripid',
      views: {
        'menuContent': {
          templateUrl: 'templates/mytripinfo.html',
          controller: 'MytripinfoCtrl'
        }
      }
    })
    
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    
    .state('logout', {
      cache: false,
      url: '/logout',
      controller: 'LogoutCtrl'
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});

function goBackToBookingPage(event , $ionicHistory , $state , $ionicPopup){
    // alert($ionicHistory.currentStateName());
      if ($ionicHistory.currentStateName() === 'app.booking'){
           exitApp(event,$ionicPopup)
      } else if ($ionicHistory.currentStateName() === 'login'){
           exitApp(event,$ionicPopup)
      } else if($ionicHistory.currentStateName() === 'app.termsandconditions'){
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('app.booking');
      } else if($ionicHistory.currentStateName() === 'app.myprofile'){
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('app.booking');
      } 
      else if($ionicHistory.currentStateName() === 'app.mytrips'){
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('app.booking');
      } 
      else if($ionicHistory.currentStateName() === 'app.aboutus'){
          $ionicHistory.nextViewOptions({
            disableBack: true
          });
          $state.go('app.booking');
      } 
      else {
        $ionicHistory.goBack();
      }
}

function exitApp(event,$ionicPopup){
   var confirmPopup = $ionicPopup.confirm({
     title: 'Star Taxi',
     template: 'Are you sure you want to exit ?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       event.preventDefault();
       ionic.Platform.exitApp();
     } else {
         
     }
   });
}

