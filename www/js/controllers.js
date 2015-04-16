angular.module('floor.controllers', [])

.run(function($ionicPlatform, $rootScope) {
  $rootScope.server = 'http://stealth-new.suse.de:3001'

  $ionicPlatform.ready(function() {
    setTimeout(function() {
        $rootScope.status = 'No network connection!';
    }, 100);
 });
})


.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('EmployeesCtrl', function($rootScope, $scope, $resource, $http, Employee) {
  $scope.searchKey = "";
  $scope.limit = 100;
  $scope.page = 0;
  $scope.total = 0;

  $scope.employees = []

  $scope.count = function() {
    $http.get($rootScope.server + '/count').success(function(data, status, headers, config) {
      $scope.total = data.count;
    })
  }

  $scope.search = function () {
    if($scope.searchKey) {
      $scope.employees = Employee.query({search: $scope.searchKey});
    }
  }

  $scope.clearSearch = function () {
    $scope.searchKey = "";
    $scope.employees = Employee.query({ page: page, limit: $scope.limit });
  }

  $scope.loadMore = function() {
      console.log("Page: " + $scope.page)


      Employee.query({ page: $scope.page, limit: $scope.limit}, function(employees) {
        $scope.employees =  $scope.employees.concat(employees)
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.page++;
      });
  };

  $scope.isMore = function() {
    return $scope.employees.length < $scope.total;
  };

  $scope.count()
})

.controller('EmployeeCtrl', function($scope, $resource, $stateParams, Employee) {
  $scope.employee = Employee.get({ id: $stateParams.employeeId });
})


.controller('StatusCtrl', function($rootScope, $scope, $http) {
  $scope.check = function () {
    $http.get($rootScope.server).success(function(data, status, headers, config) {
      $scope.status = data['status']
      $scope.api_url = config.url
    }).error(function(data, status, headers, config) {
      $scope.api_url = config.url
    });
  }
  $scope.check()
})
