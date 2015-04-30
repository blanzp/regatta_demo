regattaApp.controller('StartController', ['$http','$scope','$modal',
  function($http,$scope,$modal){
    $scope.events = [];
    $scope.flights = [];
    $scope.saveButtonDisabled = false;
    $scope.startButtonDisabled = false;

    var get_flights = function(events){
      $http.get('/api/events').success( function(data){
        events = data;

        $scope.flights = [];
        for ( i=0; i < data.length; i++ ){
          event = data[i];
          for ( j = 0; j < event.stage.length; j++ ){
            stage = event.stage[j];
            for ( k = 0; k < stage.race.length; k++ ){
              race = stage.race[k];
              $scope.flights.push({'event_id': event._id,
                'eventNumber': event.eventNumber,
                'stage_id': stage._id,
                'stage_index': j,
                'flight_id': race._id,
                'flight_index': k,
                'eventTitle': event.eventTitle,
                'raceNumber': race.raceNumber,
                'start_time': race.start_time,
                'status': race.status});
            }
          }
        }
      });

    };

    $scope.isActiveRace = function(status){
      if ( status == "In Progress" || status == "Finished") {
        return true;
      }
      else {
        return false;
      }
    }

    // var openModal = function (size) {
    //   console.log("in modal");

    //   var modalInstance = $modal.open({
    //     templateUrl: 'myModalContent.html',
    //     controller: 'StartModalCtrl',
    //     size: size,
    //     resolve: {
    //       flight: function () {
    //         return $scope.selectedFlight;
    //       }
    //     }
    //   });

    //   modalInstance.result.then(function () {
    //     get_flights($scope.flights);
    //   }, function () {
    //     console.log('Modal dismissed at: ' + new Date());
    //   });

    // };

    // $scope.onClick = function (flight) {
    //   $scope.selectedFlight = flight;
    //   openModal('lg');
    // };

    $scope.orderByEvent = function(flight) {
      return parseInt(flight.eventNumber);
    };

    get_flights($scope.flights);
  }
  ]);

// regattaApp.controller('StartModalCtrl', function ($scope, $http, $modalInstance, flight) {

//   $scope.flight = flight;
//   $scope.flightClock = "";

//   $scope.ok = function () {
//     $modalInstance.close();
//   };

//   $scope.save = function () {
//     $http.post('api/event/'+$scope.flight.event_id+'/stage/'+$scope.flight.stage_index+
//       '/race/'+$scope.flight.flight_index+'?action=start',
//       {start_time: $scope.flightClock}).
//     success(function(data, status, headers, config) {
//      console.log(status);
//      $scope.status = data;
//      $scope.saveButtonDisabled = true;
//      $scope.startButtonDisabled = true;
//    }).
//     error(function(data, status, headers, config) {
//       console.log(status);
//       $scope.status = data;

//     });
//   }

//   $scope.onStartClock = function(){
//     console.log("starting clock")
//     $scope.flightClock = Date.now();
//   };

//   $scope.onRestartClock = function(){
//     console.log('resetting clock');
//     $scope.flightClock = 0;
//   }

//   $scope.cancel = function () {
//     $modalInstance.dismiss('cancel');
//   };
// });
