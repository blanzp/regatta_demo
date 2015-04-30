regattaApp.controller('FinishController', ['$http','$scope',
  function($http,$scope){

    $scope.flights = [];

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
                'crew': event.crew,
                'racingCrew': racecrew_with_org(race.racingCrew,event.crew),
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
    get_flights($scope.flights);


    var get_crew_organization_name = function(crews,crew_id) {
      crew =  _.filter(crews, function(x) { return x['_id'] == crew_id; });
      if ( crew.length > 1) {
        console.log("ERROR: expected only 1 crew");
      }
      //console.log('returning crew '+ crew[0]['organization_name'][0]);
      return crew[0]['organization'];
    }

    var racecrew_with_org = function(race_crew_list, crew_list){
      return _.map(race_crew_list, function (x) { return _.extend(x,{organization: get_crew_organization_name(crew_list, x['crew'])}); });
    }

    $scope.orderByEvent = function(flight) {
      return parseInt(flight.eventNumber);
    };


  }
  ]);