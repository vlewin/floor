angular.module('staff', ['ionic', 'ngResource', 'templates', 'staff.controllers', 'staff.services'])

.run(function($ionicPlatform, $rootScope, $localStorage, $location, $state, $http, $ionicLoading, APIService) {
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
  })

  $rootScope.server_url = $localStorage.get('server_url') || 'http://10.162.168.55:3001'
  $rootScope.connected = $rootScope.connected || false;
  $rootScope.error_message = "No Internet connection or not in the internal SUSE network?"

  $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
    if(!$rootScope.connected) {
      console.log("Offline")

      APIService.status($rootScope.server_url).finally(function() {
        if($rootScope.connected) {
          $state.transitionTo('tab.employees');
        } else {
          $state.transitionTo('tab.status');
        }
      });
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: "tabs.html"
  })

  .state('tab.status', {
    url: '/status',
    views: {
      'tab-status': {
        templateUrl: 'tab-status.html',
        controller: 'StatusCtrl'
      }
    }
  })

  .state('tab.employees', {
      url: '/employees',
      views: {
        'tab-employees': {
          templateUrl: 'tab-employees.html',
          controller: 'EmployeesCtrl'
        }
      }
  })

  .state('tab.employee-detail', {
    url: '/employees/:employeeId',
    views: {
      'tab-employees': {
        templateUrl: 'employee-detail.html',
        controller: 'EmployeeDetailCtrl'
      }
    }
  })

  .state('tab.team', {
    url: '/employees/:employeeId/team',
    views: {
      'tab-employees': {
        templateUrl: 'team.html',
        controller: 'TeamMembersCtrl'
      }
    }
  })

  .state('tab.newcomers', {
    url: '/newcomers',
    views: {
      'tab-newcomers': {
        templateUrl: 'tab-newcomers.html',
        controller: 'NewcomersCtrl'
      }
    }
  })

  .state('tab.newcomer-detail', {
    url: '/newcomers/:employeeId',
    views: {
      'tab-newcomers': {
        templateUrl: 'employee-detail.html',
        controller: 'EmployeeDetailCtrl'
      }
    }
  })

  .state('tab.apprentices', {
    url: '/apprentices',
    views: {
      'tab-apprentices': {
        templateUrl: 'tab-apprentices.html',
        controller: 'ApprenticesCtrl'
      }
    }
  })

  .state('tab.apprentices-detail', {
    url: '/apprentices/:employeeId',
    views: {
      'tab-apprentices': {
        templateUrl: 'employee-detail.html',
        controller: 'EmployeeDetailCtrl'
      }
    }
  })

  $urlRouterProvider.otherwise('/tab/employees');
});

