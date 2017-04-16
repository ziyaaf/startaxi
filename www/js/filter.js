angular.module('starter.filters', [])
    .filter('yesnotext', [function (yesnotext) {
        return function (yesnotext) { 
            if(yesnotext == 0){
                return "No";
            } else if(yesnotext == 1){
                return "Yes";
            } 
        }
    }])
    .filter('pendingapprovestatus', [function (pendingapprovestatus) {
        return function (pendingapprovestatus) { 
            if(pendingapprovestatus == 0){
                return "Pending";
            } else if(pendingapprovestatus == 1){
                return "Approved";
            } 
        }
    }])
    .filter('vehicletype', [function (vehicletype) {
        return function (vehicletype) { 
            if(vehicletype == 1){
                return "Standard Car";
            } else if(vehicletype == 2){
                return "Estate car";
            }  else if(vehicletype == 3){
                return "MPV 1";
            }  else if(vehicletype == 4){
                return "MPV 2";
            }  else if(vehicletype == 5){
                return "People Carrier";
            }  else if(vehicletype == 6){
                return "People Carrier 2";
            } 
        }
    }])
    .filter('paymenttype', [function (paymenttype) {
        return function (paymenttype) { 
            if(paymenttype == 1){
                return "Pay By Cash";
            } else if(paymenttype == 2){
                return "Pay by Paypal";
            }  else if(paymenttype == 3){
                return "Pay by Card directly to driver";
            }  else if(paymenttype == 4){
                return "Pay by card online";
            } 
        }
    }])
    .filter('locationtype', [function (locationtype) {
        return function (locationtype) { 
            if(locationtype == 1){
                return "Airport";
            } else if(locationtype == 2){
                return "Station";
            } else if(locationtype == 3){
                return "Base Location";
            } else if(locationtype == 4){
                return "Public Location";
            }  else if(locationtype == 5){
                return "Non Public Location";
            } 
        }
    }])
    ;