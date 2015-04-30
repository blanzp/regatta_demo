regattaApp.controller('StartRaceController', ['$http','$scope','$stateParams',
  function($http,$scope,$stateParams){
    //console.log($routeParams);

    $scope.flight = [];
    $scope.startButtonDisable = true;
    $scope.saveButtonDisable = true;

    $http.get('/api/flights/'+ $stateParams.flight).success( function(data){
      $scope.flight = data;
      $scope.startButtonDisable = false;
    });

    $scope.onStartClock = function(){
      console.log("starting clock")
      $scope.flightClock = Date.now();
      $scope.startButtonDisable = true;
      $scope.saveButtonDisable = false;

    };

    $scope.save = function () {
      $http.post('api/event/'+$scope.flight.event_id+'/stage/'+$scope.flight.stage_index+
        '/race/'+$scope.flight.flight_index+'?action=start',
        {start_time: $scope.flightClock}).
      success(function(data, status, headers, config) {
       console.log(status);
       $scope.status = data;
       $scope.startButtonDisable = true;
       $scope.saveButtonDisable = true;
     }).
      error(function(data, status, headers, config) {
        console.log(status);
        $scope.status = data;

      });
    }
  }
  ]);
