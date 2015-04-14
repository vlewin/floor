// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'floor' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'floor.controllers' is found in controllers.js
angular.module('floor', ['ngResource', 'ionic', 'floor.controllers', 'floor.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.status', {
    url: "/status",
    views: {
      'menuContent': {
        templateUrl: "templates/status.html",
        controller: 'StatusCtrl'
      }
    }
  })

  .state('app.employees', {
    url: "/employees",
    views: {
      'menuContent': {
        templateUrl: "templates/employees.html",
        controller: 'EmployeesCtrl'
      }
    }
  })

  .state('app.single', {
    url: "/employees/:employeeId",
    views: {
      'menuContent': {
        templateUrl: "templates/employee.html",
        controller: 'EmployeeCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/app/employees');
});
