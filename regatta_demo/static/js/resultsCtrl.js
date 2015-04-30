regattaApp.controller('ResultsController', ['$http','$scope',
   function ($http,$scope) {

    $scope.results = [];

    function chunk(arr, size) {
      var newArr = [];
      for (var i=0; i<arr.length; i+=size) {
        newArr.push(arr.slice(i, i+size));
      }
      return newArr;
    }

    $http.get('/api/regattas').success( function(data){
        $scope.regatta = data[0];
        console.log(data[0]);
        if ($scope.regatta.logo != null && $scope.regatta.logo != undefined ){
            var logo_img = "data:image/jpg;base64,"+ $scope.regatta.logo;
            document.getElementById("logo").src = logo_img;
        }
    });

    $http.get('/api/flights').success( function(data){
        $scope.results = data;
        $scope.resultCols = chunk(data,3);
        console.log($scope.resultCols);
    });

 }]);
