regattaApp.controller('EventsController', ['$scope','$http','$location',
  function ($scope,$http,$location) {

    $scope.events = [];

    $http.get('/api/events').success( function(data){
      $scope.events = data;
    });

    $scope.orderEvent = function(event) {
        return parseInt(event.eventNumber);
    };

    $scope.orderByLane = function(race) {
        return parseInt(race.laneNumber);
    };

    $scope.showCrew = function(event) {
      $location.path("/view/events/"+event._id+"/flightcrews");
    };
}]);
