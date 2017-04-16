angular.module('starter.controllers')
.controller('BookingCtrl', function($state ,config, $ionicHistory, $localStorage , $stateParams , $scope , $cordovaGeolocation , $timeout , $http , $ionicPopup , $ionicLoading, $ionicPlatform , $cordovaInAppBrowser , $rootScope, $mdDialog,$ionicSlideBoxDelegate, $ionicScrollDelegate) {

    console.log("Entering BookingCtrl ...");
    console.log($stateParams);
  
  var from_location = '';
  var to_location = '';
  $scope.isHideBookingCost = true;
  $scope.isFromLocationAPostcode = false;
  $scope.isToLocationAPostcode = false;
  $scope.isFromLocationAnAirport = false;
  $scope.isShowHigherCharge = false;
  var addressPopupTimeout ;
  
  $scope.$watch('isHideBookingCost', function() {
        if(!$scope.isHideBookingCost){
            $ionicScrollDelegate.scrollTop();
        }
    });
  
  // Set initial values for from & to location. (Set from booking history page) 
  if($stateParams){
      if($stateParams.fromloc.length>0 && $stateParams.toloc.length>0 ){
          
          $scope.initfromloc = $stateParams.fromloc;
          $scope.inittoloc = $stateParams.toloc;
          
          if($stateParams.fromloc==0 && $stateParams.toloc==0){
                $scope.initfromloc = "";
                $scope.inittoloc = ""; 
          }
      
          from_location = $stateParams.fromloc;
          to_location = $stateParams.toloc;
          console.log("FL: "+from_location);
          console.log("TL: "+to_location);
      }
  }
  
  console.log("Check for paypal ..");
  $http.get(config.webservicePath+"web/booking/ispaypalenabled",  { cache : false }).then(function(response) {
    
    console.log("IS PP enabled : "+response.data);
    if(response.data == "no"){
        $scope.isPaypalEnabled = false;
    } else {
        $scope.isPaypalEnabled = true;
    }
  });
    
  $scope.minstartdate = getYesterdaysDate();
  $scope.bookingForm = {};
  $scope.postcodeLocations = {};
  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude;
      var long = position.coords.longitude;
      
      $http.get("https://api.postcodes.io/postcodes?lon="+long+"&lat="+lat,  { cache : false }).then(function(response) {
            // console.log("https://api.postcodes.io/postcodes?lon=-0.4622120261192&lat=51.75419251748619");
            // console.log("aaaaaaa");
            // console.log(response.data);
            // console.log(response.data.result[0].postcode);
            // console.log("bbbbbbb");
            if(response.data.result){
                if(response.data.result.length>0){
                    // response.data.result[0].postcode
                    $scope.initfromloc = response.data.result[0].postcode;
                    from_location = response.data.result[0].postcode;
                }   
            }
      });
    }, function(err) {
        
        // console.log(errå);
    }); 
    // $scope.$broadcast('angucomplete-alt:changeInput', 'autocompletez', 'Hello!');
      
    
    // Set default date time in the field
    var todaysdate = new Date();
    $scope.bookingStartDate = todaysdate;
    
    // $scope.bookingForm.bookingStartTime = new Date();
    
    $scope.remoteUrlRequestFn = function(str) {
      return {q: str};
    }; 
    
    showLoadingScreen($ionicLoading);
    $http.get(config.webservicePath+"web/booking/vehicletypes",  { cache : false }).then(function(response) {
        console.log(config.webservicePath+"web/booking/vehicletypes");
        // console.log("https://api.postcodes.io/postcodes?lon="+long+"&lat="+lat);
        console.log("Vehicle types :"); 
        console.log(response);
        $scope.vehicletypes = response.data;
        $scope.vehicles = response.data;
        $scope.veh_type = 0;
        $scope.bookingForm.vehicle = response.data[0];
        $scope.bookingForm.vehicle.ID = response.data[0].ID;
        $ionicLoading.hide();
        console.log("Def veh type : "+$scope.bookingForm.vehicle.TYPE);
    });
      
    $scope.fromLocation = function (selected) {
        // >1 and ==1 logic is based on the number of objects returned
        if (selected === undefined) {
            from_location = "";
        } else if(Object.keys(selected).length == 1){
            from_location = selected.originalObject;
        } else if(Object.keys(selected).length > 1){
            from_location = selected.originalObject.name;
        }
    };
    
    $scope.toLocation = function (selected) {
        // >1 and ==1 logic is based on the number of objects returned
        if (selected === undefined) {
            to_location = "";
        } else if(Object.keys(selected).length == 1){
            to_location = selected.originalObject;
        } else if(Object.keys(selected).length > 1){
            to_location = selected.originalObject.name;
        }
        showHigherCharge(to_location);
    };
    
    function showHigherCharge(locationName){
        var higherChargeURL =  config.webservicePath+"web/booking/getadditionalchargeforlocation?toLocation="+encodeURIComponent(locationName);
        console.log(higherChargeURL);
        $http.get(higherChargeURL ,  { cache : false }).then(function(response) {
            console.log("Has additional charge ?");   
            console.log(response.data); 
            if(response.data > 0 ){
                console.log("Set charges ...");
                $scope.additionalCharge = response.data;
                $scope.isShowHigherCharge = true;
                console.log("Display charges ."+$scope.bookingForm.additionalCharge);
            } else {
                $scope.isShowHigherCharge = false;
            }
        });
    }

    $scope.setvehicletype = function($event) {
        
        var no_psng = $scope.bookingForm.noofpassengers;
        // $scope.bookingForm.vehicle = $scope.vehicletypes[0];
        $scope.veh_type = 0;
        // console.log($scope.bookingForm);
        if(no_psng > 0 && no_psng < 3){
            // $scope.bookingForm.veh_type_name = 'Standard Car';
            // $scope.bookingForm.vehicle = $scope.vehicletypes[0];
            $scope.veh_type = 0;
        } else if(no_psng == 3 || no_psng == 4){
            // $scope.bookingForm.veh_type_name = 'Estate car';
            // $scope.bookingForm.vehicle = $scope.vehicletypes[1];
            $scope.veh_type = 1;
        } else if(no_psng == 5){
            // $scope.bookingForm.veh_type_name = 'MPV 1';
            // $scope.bookingForm.vehicle = $scope.vehicletypes[2];
            $scope.veh_type = 2;
        } else if(no_psng == 6){
            // $scope.bookingForm.veh_type_name = 'MPV 2';
            // $scope.bookingForm.vehicle = $scope.vehicletypes[3];
            $scope.veh_type = 3;
        } else if(no_psng == 7){
            // $scope.bookingForm.veh_type_name = 'People Carrier';
            // $scope.bookingForm.vehicle = $scope.vehicletypes[4];
            $scope.veh_type = 4;
        } else if(no_psng > 7){
            // $scope.bookingForm.veh_type_name = 'People Carrier 2';
            // $scope.bookingForm.vehicle = $scope.vehicletypes[5];
            $scope.veh_type = 5;
        } else {
            // $scope.bookingForm.veh_type_name = '';
            // $scope.bookingForm.vehicle = $scope.vehicletypes[0];
            $scope.veh_type = 0;
        }
        console.log("Select vehicle :");
        console.log($scope.bookingForm.vehicle);
    };
    
    $scope.showvehicleinfo = function(ev) {
        // $state.go('app.vehicleinfo');
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'templates/vehicleinfo.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };
    
    $scope.showterminalchargeinfo = function() {
        // $state.go('app.terminalchargeinfo');
        $mdDialog.show({
          controller: TerminalInfoController,
          templateUrl: 'templates/terminal-charges.html',
          parent: angular.element(document.body),
          // targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
    };
    
    $scope.cancel = function() {
        $scope.isHideBookingCost = true;
    }; 
    
    function borwserClosed(){
          showLoadingScreen($ionicLoading);
          if($localStorage.currentJID){
              // alert("Current Journey ID : "+$localStorage.currentJID);
                var purl = config.webservicePath+"web/booking/ispaypalpaymentsuccess?journeyID="+$localStorage.currentJID;
                $http.get(purl ,  { cache : false }).then(function(response) {
                    $ionicLoading.hide();
                    if(response.data == "success"){
                        $scope.sendEmailConfirmation();
                    } else {
                        var alertPopup = $ionicPopup.alert({
                             title: "Payment Failed !",
                             template: 'Paypal payment failed, please try again.'
                        });
                        alertPopup.then(function(res) {
                            $scope.resetBookingForm();
                        });
                    }
                });
          } else {
                $ionicLoading.hide();
          }
    }
    
    // Fired when in app browser is closed
    document.addEventListener('deviceready', function() {
      $rootScope.$on("$cordovaInAppBrowser:exit", function(event, result) {
          // showLoadingScreen($ionicLoading);
          // if($localStorage.currentJID){
          //     // alert("Current Journey ID : "+$localStorage.currentJID);
          //       var purl = config.webservicePath+"web/booking/ispaypalpaymentsuccess?journeyID="+$localStorage.currentJID;
          //       $http.get(purl ,  { cache : false }).then(function(response) {
          //           $ionicLoading.hide();
          //           if(response.data == "success"){
          //               $scope.sendEmailConfirmation();
          //           } else {
          //               var alertPopup = $ionicPopup.alert({
          //                    title: "Payment Failed !",
          //                    template: 'Paypal payment failed, please try again.'+response.data
          //               });
          //               alertPopup.then(function(res) {
          //                   $scope.resetBookingForm();
          //               });
          //           }
          //       });
          // } else {
          //       $ionicLoading.hide();
          // }
       });
    });
    
    $scope.booknow = function() {
        
        showLoadingScreen($ionicLoading);
        
        var paymentType = $scope.bookingForm.paymentMethod;
        // Pay by cash or to driver
        if(paymentType == 1 || paymentType == 3){
            $scope.sendBookingEmail();
        } 
        // Pay by Paypal
        else if(paymentType == 2){
            $scope.openPaypalInAppBrowser();
            // console.log(personalInfo.uid);
            $ionicLoading.hide();
        }
        
         
    };
    
    $scope.sendBookingEmail = function(){
        // $state.go('app.vehicleinfo');
        // console.log($scope.postcodeLocations);
        console.log("Booking form details :");
        console.log($scope.bookingForm);

        var bookingDetails = encodeURIComponent(JSON.stringify($scope.bookingForm));
        var startDate = encodeURIComponent($scope.bookingStartDate);
        var startTime = encodeURIComponent($scope.bookingStartTime);
        var returnDate = encodeURIComponent($scope.bookingReturnDate);
        var returnTime = encodeURIComponent($scope.bookingReturnTime);
        
        var arrivalDate = encodeURIComponent($scope.arrivalDate);
        var arrivalTime = encodeURIComponent($scope.arrivalTime);
        var depatureDate = encodeURIComponent($scope.depatureDate);
        var depatureTime = encodeURIComponent($scope.depatureTime);
        
        var acceptDropoffcharges = $scope.bookingForm.acceptDropoffZoneCharge;
        
        var postcodeLocationsDetails = encodeURIComponent(JSON.stringify($scope.postcodeLocations));
        var personalInfo = encodeURIComponent(JSON.stringify($localStorage));
        
        console.log("BD");
        console.log($scope.bookingForm);
        console.log("json ..");
        console.log($scope.bookingForm);
        var jidurl = config.webservicePath+"web/booking/savebooking?fromLocation="+encodeURIComponent(from_location)+"&toLocation="+encodeURIComponent(to_location)+"&bookingDetails="+bookingDetails+"&postcodeLocationsDetails="+postcodeLocationsDetails+"&personalInfo="+personalInfo+"&paymentType="
        +$scope.bookingForm.paymentMethod+"&bookingCost="+$scope.bookingCost+"&startDate="+startDate+"&startTime="+startTime+"&returnDate="+returnDate+"&returnTime="+returnTime
        +"&arrivalDate="+arrivalDate+"&arrivalTime="+arrivalTime+"&depatureDate="+depatureDate+"&depatureTime="+depatureTime;
        // var jidurl = config.webservicePath+"web/booking/savebooking?fromLocation=A&toLocation=B&bookingDetails=C&postcodeLocationsDetails=D&personalInfo=E&bookingCbookingDetailsost=F&paymentType=G";

        console.log("jidurl : "+jidurl);
        $http.get(jidurl ,  { cache : false }).then(function(response) {
            console.log(response.data);
            var journeyid = response.data;
            
            var estimate_url = config.webservicePath+"web/booking/sendbookingestimateemail?fromLocation="+encodeURIComponent(from_location)+"&toLocation="+encodeURIComponent(to_location)+"&bookingDetails="+bookingDetails+"&postcodeLocationsDetails="+postcodeLocationsDetails+"&personalInfo="+personalInfo
            +"&bookingCost="+$scope.bookingCost+"&paymentType="+$scope.bookingForm.paymentMethod+"&journeyId="+journeyid+"&startDate="+startDate+"&startTime="+startTime+"&returnDate="+returnDate+"&returnTime="+returnTime
            +"&arrivalDate="+arrivalDate+"&arrivalTime="+arrivalTime+"&depatureDate="+depatureDate+"&depatureTime="+depatureTime;
            console.log(estimate_url); 
            $http.get(estimate_url ,  { cache : false }).then(function(response) {
                console.log(response); 
                if(response.data == "OK"){
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                         title: "Booking successful !",
                         template: 'Booking successful !'
                    });
                    
                    alertPopup.then(function(res) {
                        $scope.resetBookingForm();
                    });
                }
            });
            
        });
        
        
        
    };
    
    $scope.sendEmailConfirmation = function(){
        var bookingDetails = encodeURIComponent(JSON.stringify($scope.bookingForm));
        var postcodeLocationsDetails = encodeURIComponent(JSON.stringify($scope.postcodeLocations));
        var personalInfo = encodeURIComponent(JSON.stringify($localStorage));
        
        var estimate_url = config.webservicePath+"web/booking/sendbookingestimateemail?fromLocation="+encodeURIComponent(from_location)+"&toLocation="+encodeURIComponent(to_location)+"&bookingDetails="+bookingDetails+"&postcodeLocationsDetails="+postcodeLocationsDetails+"&personalInfo="+personalInfo
            +"&bookingCost="+$scope.bookingCost+"&paymentType="+$scope.bookingForm.paymentMethod+"&journeyId="+$localStorage.currentJID;
        console.log(estimate_url); 
        $http.get(estimate_url ,  { cache : false }).then(function(response) {
            console.log(response); 
            if(response.data == "OK"){
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                     title: "Booking successful !",
                     template: 'Booking successful !'
                });
                
                alertPopup.then(function(res) {
                    $scope.resetBookingForm();
                });
            }
        });
    };
    
    
    $scope.openPaypalInAppBrowser = function(){
        // $paymentDesc, $paymentAmount, $journeyId, $uid, $amount
        var userInfo = $localStorage;
        var bookingDetails = encodeURIComponent(JSON.stringify($scope.bookingForm));
        var postcodeLocationsDetails = encodeURIComponent(JSON.stringify($scope.postcodeLocations));
        var personalInfo = encodeURIComponent(JSON.stringify($localStorage));
        var jid = 0;
        var jidurl = config.webservicePath+"web/booking/savebooking?fromLocation="+encodeURIComponent(from_location)+"&toLocation="+encodeURIComponent(to_location)+"&bookingDetails="+bookingDetails+"&postcodeLocationsDetails="+postcodeLocationsDetails+"&personalInfo="+personalInfo+"&bookingCost="+$scope.bookingCost+"&paymentType="+$scope.bookingForm.paymentMethod;
        $http.get(jidurl ,  { cache : false }).then(function(response) {
            // Save current journey ID in localstorage
            $localStorage.currentJID = response.data;
            var paymentDescription = "Trip from "+$scope.bookingForm.from_loc+", to "+$scope.bookingForm.to_loc;
            var ppurl = config.webservicePath+"web/booking/getpaymentlink?paymentDesc=Trip%20made%20through%20Startaxi&paymentAmount="+$scope.bookingCost+"&uid="+userInfo.uid+"&jid="+response.data;
            console.log("PPURL "+ppurl);
            $http.get(ppurl ,  { cache : false }).then(function(response) {
                $scope.openBrowser(response.data);
            });
            
        });
    };
    
    $scope.openBrowser = function(ppurl){
        var options = "";
        console.log(ppurl);
        
        
        
        if(ionic.Platform.isAndroid()){ 
            // $cordovaInAppBrowser.open(ppurl, '_blank', options)
            //   .then(function(event) {
            //      // success
            //   })
            //   .catch(function(event) {
            //      // error
            // });
            options  = "location=yes,clearcache=yes,toolbar=no";
        } else if(ionic.Platform.isIOS()){
            // window.open(ppurl, '_blank', options);
            options  = "closebuttoncaption=Return Back To App";
        }
        var ref = cordova.InAppBrowser.open(ppurl, '_blank',options );
        ref.addEventListener('exit', borwserClosed);
    };
    
    // Reset booking form for new booking
    $scope.resetBookingForm = function(){
        $scope.isHideBookingCost = true;
          $scope.isFromLocationAPostcode = false;
          $scope.isToLocationAPostcode = false;
          $scope.isFromLocationAnAirport = false;
          $scope.isShowHigherCharge = false;
        $state.go($state.current, {}, {reload: true});

        console.log("Reset booking ... ");
//         $scope.isHideBookingCost = true;
//         
//         // Reset form elements
//         $scope.bookingForm = {};
//     
//         $scope.postcodeLocations = {};
//         
//         $scope.bookingForm.noofpassengers = 1;
//         
//         var d = new Date();
//         $scope.bookingForm.bookingStartDate = d;
// 
//         $scope.inittoloc = ' ';
//         to_location = ' ';
//         
//         $scope.initfromloc = ' ';
//         from_location = ' ';
//         $scope.bookingForm.from_loc = '';
//         $scope.bookingForm.to_loc = '';
//         
//         $scope.bookingForm.comments = "-";
//         
//         $scope.isHideBookingCost = true;
//         $scope.isFromLocationAPostcode = false;
//         $scope.isToLocationAPostcode = false;
//         $scope.isFromLocationAnAirport = false;
//         $scope.isShowHigherCharge = false;
//                             
//         $scope.bookingForm.vehicle = $scope.vehicletypes[0];
//         $scope.bookingForm.vehicle.ID = $scope.vehicletypes[0].ID;
//         console.log("start "+$scope.inittoloc);
//         console.log("end "+$scope.initfromloc);


        // $ionicHistory.nextViewOptions({
        //     disableBack: true
        // });
        // $state.go('app.booking', { "fromloc": 0 , "toloc" : 0});
        // $state.go($state.current, {}, {reload: true});

    };
    
    $scope.loadsample = function() {
        var x = config.webservicePath+"web/booking/time";
        $http.get(x ,  { cache : false }).then(function(response) {
            console.log(response.data);
            
        });
        // window.open('http://www.nraboy.com/contact', '_self', 'location=yes'); return false;
        // Set initial value for testing
        $scope.inittoloc = 'HEATHROW_T1';
        to_location = 'HEATHROW_T1'; 
        $scope.initfromloc = 'HP25UY';
        from_location = 'HP25UY';
        $scope.bookingForm.comments = "-";
        var d = new Date();
        d.setMonth(12);
        $scope.bookingStartDate = d;
        $scope.bookingStartTime = d;
        // $scope.bookingForm.is_ret_req = true;
        // $scope.bookingReturnDate = d;
        // $scope.bookingReturnTime = d;
        $scope.bookingForm.luggages = 1;
        no_of_luggages = 1;
        
        $scope.bookingForm.handluggages = 1;
        no_of_handluggages = 1;
    };
    
    
    $scope.bookingForm.noofpassengers = 1; 
    no_of_passegers = 1;
    
    $scope.bookingForm.luggages = 0;
    no_of_luggages = 0;
    
    $scope.bookingForm.comments = "-";
    
    $scope.showPopup = function() {
        console.log("open ...");
        console.log($scope.vehicles);
        $scope.data = {};
       
        var v = '<md-list ng-controller="ListCtrl" >';
        for (var d = 0;d < $scope.vehicles.length;d++){
           v += "<md-list-item ng-click='select_item("+d+")' >{{vty["+d+"].TYPE}}</md-list-item>";
           // console.log("xx: "+vty[d].TYPE);
        }
        v += '</md-list>';

       // An elaborate, custom popup
       var myPopup = $ionicPopup.show({
         template: v,
         title: 'Vehicle Types',
         scope: $scope,
         buttons: [
           {
             text: '<b>Cancel</b>',
             type: 'button-positive',
             
           },
         ]
       });
       
       myPopup.then(function(res) {
         console.log('Tapped!', res);
       });
   
        $scope.select_item = function (key) {
            console.log("select ..."+key);
            console.log($scope.vehicles);
            // console.log($scope.vehicletypes[key]);
            if ($scope.vehicletypes[key]) {
              $scope.bookingForm.vehicle.TYPE = $scope.vehicletypes[key].TYPE;
              $scope.bookingForm.vehicle.ID = $scope.vehicletypes[key].ID;
              console.log($scope.bookingForm.vehicle.TYPE);
              myPopup.close();
            }
        }
        // $timeout(function() {
        //    myPopup.close(); //close the popup after 3 seconds for some reason
        // }, 3000);
  };
   
  $scope.select_vehicle = function () {
        console.log("select ..."+$scope.veh_type);
        console.log($scope.vehicles);
        var key = $scope.veh_type;
        $scope.bookingForm.vehicle.TYPE = $scope.vehicletypes[key].TYPE;
        $scope.bookingForm.vehicle.ID = $scope.vehicletypes[key].ID;
        // console.log($scope.vehicletypes[key]);
        /*if ($scope.vehicletypes[key]) {
          $scope.bookingForm.vehicle.TYPE = $scope.vehicletypes[key].TYPE;
          $scope.bookingForm.vehicle.ID = $scope.vehicletypes[key].ID;
          console.log($scope.bookingForm.vehicle.TYPE);
          myPopup.close();
        }*/
    }
  
  $scope.chooseveh = function() {
      myPopup.close();
  };
  
  $scope.getstartaddresslist = function() {
      showLoadingScreen($ionicLoading);
      GetAddressList(from_location);
      clearTimeout(addressPopupTimeout);
      addressPopupTimeout = $timeout(function() {
           if (addressarray === undefined || addressarray.length == 0) {
              $ionicLoading.hide();
              $ionicPopup.alert({
                 title: 'Address not found',
                 template: 'Addresses not found for this location, please try again or enter it manually'
               });
          } else {
                showAddressListPopup(addressarray,"start");
          }
      }, 3500);
  };
  
  function showAddressListPopup(addressarray,startOrEnd){
        isAddressPopupShown = true;
        var v = '<ion-list>';
        for (var d = 0;d < addressarray.length;d++){
           v += "<ion-item class='address-list-style' ng-model='bookingForm.addlist' ng-click='select_item("+addressarray[d].id+")' >"+addressarray[d].address+"</ion-item>";
        }
        v += '</ion-list>';

       // An elaborate, custom popup
       var myPopup = $ionicPopup.show({
         template: v,
         title: 'Select your address',
         scope: $scope,
         buttons: [
           {
             text: '<b>Cancel</b>',
             type: 'button-positive',
             
           },
         ]
       });
       
       myPopup.then(function(res) {
         console.log('Tapped!', res);
       });
   
        $scope.select_item = function (key) {
            showLoadingScreen($ionicLoading);
            GetAddress(key);
            $timeout(function() {
                    console.log(addressObj);
                    console.log("KEY : "+key);
                   if(startOrEnd == "start"){
                        $scope.postcodeLocations.startBuildingNumber = addressObj.epcNumber+
                        addressObj.buildingName+addressObj.subBuildingName+addressObj.orgName;
                        $scope.postcodeLocations.startBuildingNumber = $scope.postcodeLocations.startBuildingNumber.replace(/-/g, "");
                        $scope.postcodeLocations.startStreetName = addressObj.streetName;
                        $scope.postcodeLocations.startPostalTown = addressObj.townOrCity;
                        $scope.postcodeLocations.startCounty = addressObj.county;
                        myPopup.close();
                        $ionicLoading.hide();
                    } else if(startOrEnd == "end"){
                        $scope.postcodeLocations.endBuildingNumber = addressObj.epcNumber+
                        addressObj.buildingName+addressObj.subBuildingName+addressObj.orgName;
                        $scope.postcodeLocations.endBuildingNumber = $scope.postcodeLocations.endBuildingNumber.replace(/-/g, "");
                        $scope.postcodeLocations.endStreetName = addressObj.streetName;
                        $scope.postcodeLocations.endPostalTown = addressObj.townOrCity;
                        $scope.postcodeLocations.endCounty = addressObj.county;
                        myPopup.close();
                        $ionicLoading.hide();
                    }
                    
              }, 3500);
            
        }
        $ionicLoading.hide();
  }
  
  $scope.getendaddresslist = function() {
      showLoadingScreen($ionicLoading);
      GetAddressList(to_location);
      $timeout(function() {
          console.log("Address list");
          console.log(addressarray);
          if (addressarray === undefined || addressarray.length == 0) {
              $ionicLoading.hide();
              $ionicPopup.alert({
                 title: 'Address not found',
                 template: 'Addresses not found for this location, please enter it manually'
               });
          } else {
                showAddressListPopup(addressarray,"end");
          }
      }, 3000);
  };
  
  $scope.search = function() {
      var myPopup = $ionicPopup.show({
         template: '<h1>Hello</h1>',
         title: 'Select your address',
         scope: $scope,
         buttons: [
           {
             text: '<b>Cancel</b>',
             type: 'button-positive',
             
           },
         ]
       });
  };
      
    
    $scope.getestimate = function() {
        var au = 'https://ws.epostcode.com/uk/addressfinder.asmx/SearchMulti?sPostcode=hp25uy&sCompany=&sStreet=&sLocality=&sTownOrCity=&sNumber=&sAccountName=FOURTHSO01&sGUID=87f9502b-9315-4c6b-b9e0-f26224ce8c2f&sIPAddress=';
        $http.get(au ,  { cache : false }).then(function(response) {
            console.log("address finder");
            console.log(response);
        });
        console.log($scope.bookingForm);
        // console.log("PersonalInfo :");
        // console.log($localStorage);
        
        // showLoadingScreen($ionicLoading);
        $scope.bookingForm.paymentMethod = 1;
        
        var start_date = $scope.bookingStartDate;
        start_date = start_date.toString();
        if (start_date === undefined || start_date === null) {
            start_date = "";
        }
        var start_time = $scope.bookingStartTime;
        if (start_time === undefined || start_time === null) {
            start_time = "";
        }
        var is_return = $scope.bookingForm.is_ret_req;
        if (is_return === undefined) {
            is_return = false;
        }
        
        var return_date = $scope.bookingReturnDate; 
        if (return_date === undefined || return_date === null) {
            return_date = "";
        }
        var return_time = $scope.bookingReturnTime;
        if (return_time === undefined || return_time === null) {
            return_time = "";
        }
        
        var is_child_seat_req = $scope.bookingForm.is_child_seat_req;
        if (is_child_seat_req === undefined) {
            is_child_seat_req = false;
            $scope.bookingForm.is_child_seat_req = 0;
        }
        
        var acceptDropoffZoneCharge = $scope.bookingForm.acceptDropoffZoneCharge;
        if (acceptDropoffZoneCharge === undefined) {
            acceptDropoffZoneCharge = false;
        }
        
        var no_of_childseats = $scope.bookingForm.noofchildseats;
        if (no_of_childseats === undefined) {
            no_of_childseats = 0;
            $scope.bookingForm.noofchildseats = 0;
        }       

        
        var no_of_passegers = $scope.bookingForm.noofpassengers;
        if (no_of_passegers === undefined) {
            no_of_passegers = 1;
            $scope.bookingForm.noofpassengers = 1;
        }
        
        var no_of_luggages = $scope.bookingForm.luggages;
        if (no_of_luggages === undefined) {
            no_of_luggages = 0;
            $scope.bookingForm.luggages = 0;
        }
        
        var no_of_handluggages = $scope.bookingForm.handluggages;
        if (no_of_handluggages === undefined) {
            no_of_handluggages = 0;
            $scope.bookingForm.handluggages = 0;
        }
        
        console.log("cc");
        console.log($scope.bookingForm.vehicle);
        var veh_type = $scope.bookingForm.vehicle.ID;
        if (veh_type === undefined) {
            veh_type = "";
        } else if(veh_type){
            veh_type = $scope.bookingForm.vehicle.ID;
        }
        console.log("A vehicle");
        console.log(veh_type);
        var current_datetime = getCurrentDateTime();
        console.log($scope.bookingForm);
       var ws_url = config.webservicePath+"web/booking/dobooking?from_location="+from_location
       +"&to_location="+to_location
       +"&current_datetime="+current_datetime
       +"&start_date="+start_date
       +"&start_time="+start_time
       +"&return_date="+return_date
       +"&return_time="+return_time
       +"&is_return="+is_return
       +"&is_child_seat_req="+is_child_seat_req
       +"&no_of_childseats"+no_of_childseats
       +"&no_of_passegers="+no_of_passegers
       +"&veh_type="+veh_type
       +"&acceptDropoffZoneCharge="+acceptDropoffZoneCharge;
       ws_url = encodeURI(ws_url);
       
       console.log("START DATE : "+start_date);
       // console.log(start_date);
       // console.log(start_time);
       console.log("ss");
       console.log(from_location);
       console.log(to_location);
       console.log("tt");
       if(from_location.trim().length == 0){
           var alertPopup = $ionicPopup.alert({
             title: "Missing Fields",
             template: 'Please tell us your journey starting location'
           });
           $ionicLoading.hide();
       } else if(to_location.trim().length == 0){
           var alertPopup = $ionicPopup.alert({
             title: "Missing Fields",
             template: 'Please tell us your journey end location'
           }); 
           $ionicLoading.hide();
       } else if((is_child_seat_req == 1) && (no_of_childseats >3)){
           var alertPopup = $ionicPopup.alert({
             title: "Child Seats",
             template: 'Max child seats allowed is 3'
           }); 
           $ionicLoading.hide();       
       } else if(from_location.toUpperCase() === to_location.toUpperCase()){
           var alertPopup = $ionicPopup.alert({
             title: "Missing Fields",
             template: 'Journey start and end location cannot be the same'
           }); 
           $ionicLoading.hide();
       } else if(start_date.toString().trim().length == 0){
           var alertPopup = $ionicPopup.alert({
             title: "Missing Fields",
             template: 'Please enter the journey start date'
           }); 
           $ionicLoading.hide();
       } else if(start_time.toString().trim().length == 0){
           var alertPopup = $ionicPopup.alert({
             title: "Missing Fields",
             template: 'Please enter the journey start time'
           }); 
           $ionicLoading.hide();
       } else if(isDateInPast(start_date,start_time)){
           var alertPopup = $ionicPopup.alert({
             title: "Invalid date",
             template: 'Please select a valid Journey start date'
           }); 
           $ionicLoading.hide();
       } else if(is_return && return_date.toString().trim().length == 0){
           var alertPopup = $ionicPopup.alert({
             title: "Missing Fields",
             template: 'Please enter the return date'
           }); 
           $ionicLoading.hide();
       } else if(is_return && return_time.toString().trim().length == 0){
           var alertPopup = $ionicPopup.alert({
             title: "Missing Fields",
             template: 'Please enter the return time'
           }); 
           $ionicLoading.hide();
       } else if(no_of_passegers > 8){
           var alertPopup = $ionicPopup.alert({
             title: "Passengers",
             template: 'Max number of passengers allowed is 8'
           }); 
           $ionicLoading.hide();       
       } 
       // else if(veh_type.trim().length == 0){
       //     var alertPopup = $ionicPopup.alert({
       //       title: "Missing Fields",
       //       template: 'Please select the vehicle type'
       //     }); 
       // } 
       else {
            showLoadingScreen($ionicLoading);
            // Check if booking time is outside buffer time
            var i_url = config.webservicePath+"web/booking/arefieldsvalid?from_location="+from_location+"&to_location="+to_location+"&current_datetime="+current_datetime+"&travelStartDate="+start_date.toString()+"&travelStartTime="+start_time.toString();
            i_url = encodeURI(i_url);
            console.log(i_url);
            $http.get(i_url,  { cache : false }).then(function(response) {
            console.log(response);
            if(!response.data.result){
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                 title: "Invalid fields",
                 template: response.data.error_msg
               });
               
            } else {
                $ionicLoading.hide();
                // All conditions are Valid
                
                // Card visibility
                var cardVisibilityUrl = config.webservicePath+"web/booking/locationairportcardvisibility?fromLocation="+from_location+"&toLocation="+to_location;
                // console.log("Card Vis : "+cardVisibilityUrl);
                $http.get(cardVisibilityUrl ,  { cache : false }).then(function(response) {
                    console.log(response.data);
                    if(response.data.fromPostcode == "true"){
                        $scope.isFromLocationAPostcode = true;
                    }
                    if(response.data.toPostcode == "true"){
                        $scope.isToLocationAPostcode = true;
                    }
                    if(response.data.isAirport == "true"){
                        $scope.isFromLocationAnAirport = true;
                    }
                });   
                
                $http.get(ws_url ,  { cache : false }).then(function(response) {
                    console.log("running ws ... ");
                    console.log(ws_url);
                    console.log(response);
                   $scope.bookingCost = response.data;
                   $scope.isHideBookingCost = false;
                   $ionicScrollDelegate.scrollTop();
                   /*var alertPopup = $ionicPopup.alert({
                     title: "Booking Cost",
                     template: ''+response.data
                   });*/
                });
            }
            });
           
       }
       
       
    }; 
    
    function DialogController($scope, $mdDialog) {
        $scope.hide = function() {
          $mdDialog.hide();
        };
    
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
    
        $scope.answer = function(answer) {
          $mdDialog.hide(answer);
        };
        
        $scope.closeVehicleInfo = function() {
            $state.go('app.booking');
        };
        
        $http.get(config.webservicePath+"web/booking/vehicletypes",  { cache : false }).then(function(response) {
            console.log("WSP");
            $scope.vehicles = response.data;
            // $ionicSlideBoxDelegate.update();
            // $ionicLoading.hide(); 
        });
    }
    
    function TerminalInfoController($scope, $mdDialog) {
        $scope.hide = function() {
          $mdDialog.hide();
        };
    
        $scope.cancel = function() {
          $mdDialog.cancel();
        };
    
        $scope.answer = function(answer) {
          $mdDialog.hide(answer);
        };
    }

   
})
angular.module('starter.controllers')
.controller('ListCtrl', function($state ,config, $ionicHistory, $localStorage , $stateParams , $scope , $cordovaGeolocation , $timeout , $http , $ionicPopup , $ionicLoading, $ionicPlatform , $cordovaInAppBrowser , $rootScope, $mdDialog,$ionicSlideBoxDelegate, $ionicScrollDelegate) {
    $http.get(config.webservicePath+"web/booking/vehicletypes",  { cache : false }).then(function(response) {
        console.log(config.webservicePath+"web/booking/vehicletypes");
        // console.log("https://api.postcodes.io/postcodes?lon="+long+"&lat="+lat);
        console.log("List Vehicle types :"); 
        console.log(response);
        $scope.vty = response.data;
    });
})
;

function isDateInPast(selectedDate,selectedTime) {
   var selectedDateVal = new Date(selectedDate);
   var selectedTime = new Date(selectedTime);
   selectedDateVal.setHours(selectedTime.getHours());
   selectedDateVal.setMinutes(selectedTime.getMinutes());
   selectedDateVal.setSeconds(selectedTime.getSeconds());
   console.log("Selected date : "+selectedDateVal);
   var now = new Date();
   console.log("Todays date : "+now);
   if (selectedDateVal < now) {
        return true;
   } else if(selectedDateVal > now) {
        return false;
   }
 }

function getYesterdaysDate() {
    var date = new Date();
    date.setDate(date.getDate()-1);
    var d = date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    return d;
}

function getCurrentDateTime() {
    var date = new Date();
    var str = date.getFullYear() + "-" + ('0' + ((date.getMonth() + 1))).slice(-2) + "-" + ('0' +date.getDate()).slice(-2) + " " +
    ('0' +date.getHours()).slice(-2) + ":" + ('0' +date.getMinutes()).slice(-2) + ":" + ('0' +date.getSeconds()).slice(-2);
    return str;
}

function isValidPostcode(postcode){
    // Check if booking time is outside buffer time
    var i_url = config.webservicePath+"web/location/isvalidpostcode?postcode="+postcode;
    i_url = encodeURI(i_url);
    console.log(i_url);
    $http.get(i_url,  { cache : false }).then(function(response) {
        console.log(response);
        if(response.data == "true"){
            return true;
        } else {
            return false;
        }
    });
}
