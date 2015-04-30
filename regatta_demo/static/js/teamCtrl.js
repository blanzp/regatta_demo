regattaApp.controller('TeamController', ['$http','$scope',
	function ($http,$scope) {
		$scope.teams = [];

		$http.get('/api/organizations').success( function(data){
			$scope.teams = data;
		});
	}]);