angular.module('floor.controllers', [])

.run(function($ionicPlatform, $rootScope, $ionicScrollDelegate) {
  $rootScope.server = 'http://stealth-new.suse.de:3001'
  $rootScope.status = 'No network connection!';

  $rootScope.scrollTop = function() {
    // FIXME: scrollTo is not working with tab on-select
    // console.log("scroll top")
    $ionicScrollDelegate.scrollTop(true)
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
    $scope.employees = []
    $scope.loadMore()
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


.controller('EmployeeDetailCtrl', function($scope, $resource, $stateParams, Employee) {
  $scope.employee = Employee.get({ id: $stateParams.employeeId });
})


.controller('NewcomersCtrl', function($rootScope, $scope, $http) {
  $http.get($rootScope.server + '/latest').success(function(data, status, headers, config) {
    console.log('get')
    $scope.employees = data
  })
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


.controller('SettingsCtrl', function($rootScope) {
})

