angular.module('starter.controllers', []);

function showLoadingScreen(ionicLoading){
    ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
}

function showAlert($ionicPopup , title ,msg){
    $ionicPopup.alert({
         title: title,
         template: msg
       });
}