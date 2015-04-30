regattaApp.controller('VenueController', ['$http','$scope','$routeParams',
  function($http,$scope,$routeParams) {

    
    // TODO fix this

    $http.get('/api/venue').success( function(data){
      $scope.flight = data;
      $scope.startButtonDisable = false;
      $scope.expectedRacers = _.map(_.range(1,$scope.flight.racingCrew.length+1), function(event){ return { label:event, value: event }; });
      $scope.remainingRacers = $scope.flight.racingCrew.length;
    });

    
}
]);
