regattaApp.controller('FinishRaceController', ['$http','$scope','$stateParams',
  function($http,$scope,$stateParams) {

    $scope.flight = [];
    $scope.finish_times = [];

    $scope.order = 0;
    $scope.validFinish = false;
    $scope.status = "";
    $scope.finish_status = "";
    $scope.saveButtonDisabled = false;

    $http.get('/api/flights/'+ $stateParams.flight).success( function(data){
      $scope.flight = data;
      $scope.startButtonDisable = false;
      $scope.expectedRacers = _.map(_.pluck($scope.flight.racingCrew,'laneNumber'),
        function(lane){ return { label:lane, value: parseInt(lane) }; });
      $scope.remainingRacers = $scope.flight.racingCrew.length;
    });

    $scope.save = function () {
      //console.log($scope.finish_times);
      $http.post('api/event/'+$scope.flight.event_id+'/stage/'+$scope.flight.stage_index+
        '/race/'+$scope.flight.flight_index+'?action=finish', { finishes: $scope.finish_times, finish_winning_raw_time: $scope.winning_time }).
      success(function(data, status, headers, config) {
                 // this callback will be called asynchronously
                 // when the response is available
                 console.log(status);
                 $scope.status = data;
                 $scope.saveButtonDisable=true;
               }).
      error(function(data, status, headers, config) {
        console.log(status);
        $scope.status = data;

      });
    }

    $scope.onFinishClock = function(){
      console.log("Finish clock")
      $scope.order = $scope.order + 1;
      var finish_time = Date.now();
      if ($scope.finish_times.length == 0 ) {
        $scope.winning_time = finish_time;
      }
      // console.log('split');
      // console.log(finish_time);
      // console.log($scope.winning_time);
      split = finish_time-$scope.winning_time;
      $scope.finish_times.push({finish_raw_time: finish_time, split_time: split, order: $scope.order, lane: 0, team: ''});
      $scope.remainingRacers = $scope.flight.racingCrew.length - $scope.finish_times.length;
      //console.log($scope.finish_times);
      if ( $scope.remainingRacers == 0 ){
        $scope.finish_status = "Assign Lanes";
      }
      else {
        $scope.finish_status = "Racers left: "+ $scope.remainingRacers + " of " + $scope.flight.racingCrew.length;
      }
    };

    $scope.onLaneAssignment = function(order, lane){
      if ( lane ) {
        //console.log('assigning order '+order + " to lane "+ lane.value);
        //console.log($scope.flight);
        // Assign lane
        $scope.finish_times[order-1]['lane'] = lane.value;
        // Assign Crew
        $scope.finish_times[order-1]['crew'] = _.filter($scope.flight.racingCrew, function (x) { return x['laneNumber'] == lane.value })[0]['crew'];
        // Assign team
        //console.log('found team ');
        //console.log(_.filter($scope.crews, function (x) { return x['laneNumber'] == lane.value }));

        //$scope.finish_times[order-1]['team'] = _.filter($scope.flight.racingCrews, function (x) { return x['laneNumber'] == lane.value })[0]['organization'];
        $scope.finish_times[order-1]['team'] = _.filter($scope.flight.racingCrew, function (x) { return x['laneNumber'] == lane.value })[0]['organization']['abbreviatedName'];
        $scope.validFinish = validateFinish();
      }
    }

    validateFinish = function(){
      $scope.finish_status = "";
      lanes = _.pluck($scope.finish_times, "lane");

      zero_lanes = _.filter(lanes, function (x) { return x == 0;});
      if ( zero_lanes.length > 0 ){
        $scope.finish_status = "Not all lanes assigned";
        return false;
      }
    // validate no dupe lanes
    // console.log('lanes');
    // console.log(lanes);
    // console.log(_.unique(lanes));
    // console.log(_.difference(_.unique(lanes),lanes) );
    if ( lanes.length > _.unique(lanes).length ){
      $scope.finish_status = "Duplicate Lanes, please correct";
      return false;
    }

    // validate no missing lanes

    return true;
  }

  $scope.onDNF = function(){
    $scope.finish_times.push({finish_time: "DNF", split_time: "DNF", order: 0, lane: 0, team: ''});
    $scope.remainingRacers = $scope.flight.racingCrew.length - $scope.finish_times.length;
  };

  $scope.orderByLane = function(crew) {
    return parseInt(crew.laneNumber);
  };
}
]);
