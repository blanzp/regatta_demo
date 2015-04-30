
//angular.module('Authentication', []);
//angular.module('Home', []);

var regattaApp = angular.module('regattaApp', ['ui.bootstrap','ui.router', 'ngCookies','angularFileUpload']);

regattaApp.config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  console.log("In state");
  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise("/");
  
  // Now set up the states
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "../template/home.html",
      controller: 'HomeController',
    })
    .state('view_events', {
      url: "/view/events",
      templateUrl: "../template/events.html",
      controller: 'EventsController',
    })
    .state('view_teams', {
      url: '/view/teams',
      templateUrl: '../template/teams.html',
      controller: 'TeamController'
    })
    .state('login', {
      url: '/login',
      templateUrl: '../template/login.html',
      controller: 'LoginController'
    })
    .state('register', {
      url: '/register',
      templateUrl: '../template/register.html',
      controller: 'RegisterController'
    })
    .state('view_event', {
      url: '/view/events/:event_id/flightcrews',
      templateUrl: '../template/flightCrew.html',
      controller: 'FlightCrewController'
    })
    .state('view_results', {
      url: '/view/results',
      templateUrl: '../template/results.html',
      controller: 'ResultsController'
    })
    .state('manage_starts', {
      url: '/manage/start',
      templateUrl: '../template/start.html',
      controller: 'StartController',
    })
    .state('manage_start', {
      url: '/manage/start/:flight',
      templateUrl: '../template/start_race.html',
      controller: 'StartRaceController'
    })
    .state('manage_finishs', {
      url: '/manage/finish',
     templateUrl: '../template/finish.html',
     controller: 'FinishController'
   })
   .state('manage_finish', {
      url: '/manage/finish/:flight',
     templateUrl: '../template/finish_race.html',
     controller: 'FinishRaceController'
   })
    .state('manage_results', {
    url: '/manage/results',
     templateUrl: '../template/manage_results.html',
     controller: 'ManageResultsController'
   })
  .state('admin_upload', {
    url: '/admin/upload',
      templateUrl: '../template/upload.html',
      controller: 'UploadController'
    });
}]);
regattaApp.config( [
    '$compileProvider',
    function( $compileProvider )
    {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|tweetbot|drafts):/);
    }
]);

regattaApp.controller('HomeController', ['$scope',
  function ($scope) {
    console.log("In home controller");
  }]);


regattaApp.controller('RegisterController', ['$http','$scope',
  function ($http,$scope) {
    var registration = this;

    $scope.onRegister = function(first,last,email,password1,password2){
      console.log("registering" + password1 + " " + password2);
      if ( password1 !== password2 ){
        $scope.registration_error = "Passwords dont match";
      }
      else {
        $http.post('/api/user', { first: first, last: last, email: email, password: password1 }).success(function(data){
          console.log('registering user');
        })
      }
    }

  }]);

