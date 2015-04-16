angular.module('floor.controllers', [])

.run(function($ionicPlatform, $rootScope) {
  $rootScope.server = 'http://stealth-new.suse.de:3001'

  $ionicPlatform.ready(function() {
    setTimeout(function() {
        $rootScope.status = 'No network connection!';
    }, 100);
 });
})


.controller('EmployeesCtrl', function($rootScope, $scope, $resource, $http, Employee) {
  $scope.searchKey = "";
  $scope.limit = 50;
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


.controller('EmployeeDetailCtrl', function($scope, $resource, $stateParams, Employee) {
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


.controller('SettingsCtrl', function($rootScope) {
})

