regattaApp.controller('ManageResultsController', ['$http','$scope','$location',
   function ($http,$scope,$location) {

    $scope.results = [];

    function chunk(arr, size) {
      var newArr = [];
      for (var i=0; i<arr.length; i+=size) {
        newArr.push(arr.slice(i, i+size));
      }
      return newArr;
    }

    $http.get('/api/flights').success( function(data){
        filtered_data = _.filter(data, function(result) { return result.racingCrew.length > 0 });
        $scope.results = filtered_data;
        $scope.resultCols = chunk(filtered_data,3);
        //console.log($scope.resultCols);
    });

   $http.get('/api/custom').success( function(data){
        $scope.custom = data;
    });

    $scope.formatDuration = function(duration){
          dur = moment.duration(duration,"HH:mm:ss.SSS");
          return dur.asMilliseconds();
    };
    $scope.formatDurationFormatted = function(duration){
        return moment.utc($scope.formatDuration(duration)).format('mm:ss.SS');
    }

    $scope.addDuration = function(duration1, duration2){
          dur1 = moment.duration(duration1,"HH:mm:ss.SSS");
          dur2 = moment.duration(duration2,"HH:mm:ss.SSS");
          dur1.add(dur2);
          return dur1.asMilliseconds();
    };

    $scope.addDurationFormatted = function(dur1,dur2){
        return moment.utc($scope.addDuration(dur1,dur2)).format("mm:ss.SS");
    }

    $scope.orderFinishers = function(result){
        crews = result.racingCrew;
        sorted_crews = _.sortBy(crews, function(crew) { return moment.utc($scope.formatDuration(crew.results.split.time)); })
        result.racingCrew = sorted_crews;
        return result;
    }
    $scope.tweetText = function(result){
        //result['eventTitle']
        result = $scope.orderFinishers(result);
        race_results = '';
        for ( i=0; i < result.racingCrew.length; i++ ) {
            crew = result.racingCrew[i];
            race_results += i+1 + '.';
            race_results += crew.organization.abbreviatedName + ' ';
            if ( i == 0 ){
                race_results += moment.utc($scope.formatDuration(result.winningSplit.time)).format('mm:ss.SS');
            }
            else {
                race_results += "+" + moment.utc($scope.addDuration(crew.results.split.time)).format('m:ss.SS');
            }
            if ( i < result.racingCrew.length-1 ){
                race_results += ', ';
            }
        }
        return 'Event-' +
           result.raceNumber +
           '.' +
           result.eventTitle +
           ': ' +race_results;
    }

    $scope.tweetURL = function(result) {
        return encodeURIComponent($scope.tweetText(result));
    }
 }]);
