angular.module('starter.controllers')
.controller('MytripinfoCtrl', function($scope,config, $stateParams , $localStorage , $state, $http , $ionicLoading, $cordovaDialogs) {
     // $scope.title = tripid;
     // console.log($stateParams.tripid);
     $scope.$on('$ionicView.enter', function() {
         
     // User Journey
     $http.get(config.webservicePath+"web/user-journey/getuserjourney?journeyId="+$stateParams.tripid,  { cache : false }).then(function(response) {
        console.log(response);
        if(response.data != null){
        $scope.passengers = response.data.PASSANGER;
        $scope.luggage = response.data.LUGGAGE;
        $scope.handluggage = response.data.HAND_LUGGAGE;
        $scope.seatrequired = response.data.IS_SEAT_REQUIRED;
        $scope.seats = response.data.SEAT;
        $scope.isreturn = response.data.IS_HAVE_RETURN;
        $scope.vehicletype = response.data.VEHICLE_TYPE_ID;
        $scope.amount = response.data.AMOUNT;
        $scope.bookingdate = response.data.BOOKING_DATE;
        $scope.bookingstatus = response.data.STATUS;
        $scope.paymenttype = response.data.PAYMENT_TYPE_ID;
        $scope.confirmeddate = response.data.CONFIREM_DATE;
        }
     });
     
     // Journey Information
     $http.get(config.webservicePath+"web/user-journey/getjourneyinformation?journeyId="+$stateParams.tripid,  { cache : false }).then(function(response) {
        console.log(response);
        if(response.data != null){
        $scope.fromid = response.data.FROM_ID;
        $scope.fromtype = response.data.FROM_TYPE;
        $scope.toid = response.data.TO_ID;
        $scope.totype = response.data.TO_TYPE;
        $scope.isreturn = response.data.IS_RETURN;
        $scope.outbounddate = response.data.OUTBOUND_DATE;
        $scope.outboundhour = response.data.OUTBOUND_HOUR;
        $scope.outboundminute = response.data.OUTBOUND_MINUTE;
        }
     });
     
     // Flight Information
     $http.get(config.webservicePath+"web/user-journey/getflightinfo?journeyId="+$stateParams.tripid,  { cache : false }).then(function(response) {
        console.log(response);
        if(response.data != null){
        $scope.flightnumber = response.data.FILGHT_NUMBER;
        $scope.arrivaldate = response.data.ARRIVAL_DATE;
        $scope.arrivalhour = response.data.ARRIVAL_HOUR;
        $scope.arrivalminute = response.data.ARRIVAL_MINUTE;
        $scope.depaturefrom = response.data.DEPARTURE_FROM;
        $scope.depaturedate = response.data.DEPARTURE_DATE;
        $scope.depaturehour = response.data.DEPARTURE_HOUR;
        $scope.depatureminute = response.data.DEPARTURE_MINUTE;
        }
     });
     
     // Return Flight Information
     $http.get(config.webservicePath+"web/user-journey/getreturnflightinfo?journeyId="+$stateParams.tripid,  { cache : false }).then(function(response) {
        console.log(response);
        if(response.data != null){
        $scope.rf_flightnumber = response.data.FILGHT_NUMBER;
        $scope.rf_arrivaldate = response.data.ARRIVAL_DATE;
        $scope.rf_arrivalhour = response.data.ARRIVAL_HOUR;
        $scope.rf_arrivalminute = response.data.ARRIVAL_MINUTE;
        $scope.rf_depaturefrom = response.data.DEPARTURE_FROM;
        $scope.rf_depaturedate = response.data.DEPARTURE_DATE;
        $scope.rf_depaturehour = response.data.DEPARTURE_HOUR;
        $scope.rf_depatureminute = response.data.DEPARTURE_MINUTE;
        }
     });
     
     });
     // alert($routeParams.tripid);
     // $scope.save = function() {
     //    showLoadingScreen($ionicLoading);
     //    $http.get("https://pocket.deals/startaxiws/web/individual-customer/saveaddressinfo?addressId="+$localStorage.addid+"&houseNoOrName="+$scope.housename+"&streetName="+$scope.streetname+"&postalTown="+$scope.postaltown+"&postalCode="+$scope.postalcode+"&county="+$scope.county,  { cache : false }).then(function(response) {
     //        // console.log("https://pocket.deals/startaxiws/web/individual-customer/saveaddressinfo?addressId="+$localStorage.addid+"&houseNoOrName="+$scope.housename+"&streetName="+$scope.streetname+"&postalTown="+$scope.postaltown+"&postalCode="+$scope.postalcode+"&county="+$scope.county);
     //        // console.log(response);
     //        $cordovaDialogs.alert('Saved successfully !', 'Address Information', 'OK')
     //        .then(function() {
     //            $ionicLoading.hide();
     //        });
     //    });
     // };
});

