angular.module('staff.controllers', [])

.run(function($ionicPlatform, $rootScope, $ionicScrollDelegate) {
  $rootScope.scrollTop = function() {
    // FIXME: scrollTo is not working with tab on-select
    // console.log("scroll top")
    $ionicScrollDelegate.scrollTop(true)
  };

  $rootScope.showBack = function() {
    console.log("Show back")
    angular.element(document.querySelector('.back-button.hide')).removeClass('hide')
  };

  $rootScope.hideBack = function() {
    console.log("Hide back")
    angular.element(document.querySelector('.back-button.hide')).addClass('hide')
  };
})

.controller('EmployeesCtrl', function($rootScope, $scope, $resource, $interval, $http, $timeout, $sessionStorage, Employee) {
  $scope.searchKey = "";
  $scope.limit = 50;
  $scope.page = 0;
  $scope.total = 0;
  $scope.employees = []
  $scope.error_count = $sessionStorage.get('errors_count') || 0;

  $scope.count = function() {
    $http.get($rootScope.server_url + '/employees/count').success(function(data, status, headers, config) {
      $scope.total = data.count;
      $sessionStorage.set('errors_count', 0)
    }).error(function (data, status) {
      console.log('Try to reload the page: ' + $scope.error_count)
      if($scope.error_count  >= 1) {
        console.error('Retry failed!')
      } else {
        console.log('Increase counter')
        window.location.reload();
        $scope.error_count += 1;
        $sessionStorage.set('errors_count', $scope.error_count)
      }
    })
  }

  $scope.search = function () {
    if($scope.timeout) {
      clearTimeout($scope.timeout);
    }

    if($scope.searchKey) {
      $scope.timeout = setTimeout(function() {
        $scope.employees = Employee.query({search: $scope.searchKey});
      }, 300);
    } else {
      $scope.clearSearch()
    }
  }

  $scope.clearSearch = function () {
    $scope.searchKey = "";
    $scope.page = 0;
    $scope.employees = []
    $scope.loadMore()
  }

  $scope.loadMore = function() {
      Employee.query({ page: $scope.page, limit: $scope.limit}, function(employees) {
        $scope.employees =  $scope.employees.concat(employees)
        $scope.page++;

        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
  };

  $scope.isMore = function() {
    return (!$scope.searchKey && $scope.employees.length < $scope.total)
  };

  $scope.count()
})


.controller('EmployeeDetailCtrl', function($scope, $resource, $stateParams, Employee) {
  Employee.get({ id: $stateParams.employeeId }, function(employee) {
    $scope.employee = employee;
    $scope.manager = Employee.get({ id: $scope.employee.managerid }, function() {
    })
  });
})


.controller('TeamMembersCtrl', function($rootScope, $scope, $http, $stateParams) {
  $http.get($rootScope.server_url + '/employees/' + $stateParams.employeeId + '/team').success(function(data, status, headers, config) {
    $scope.id = $stateParams.employeeId
    $scope.employees = data
  })
})

.controller('NewcomersCtrl', function($rootScope, $scope, $http, $ionicLoading) {
  $ionicLoading.show({
    template: '<ion-spinner icon="lines"></ion-spinner>',
    hideOnStageChange: false
  });

  $http.get($rootScope.server_url + '/employees/newcomers').success(function(data, status, headers, config) {
    $scope.employees = data
    $ionicLoading.hide();
  })
})

.controller('ApprenticesCtrl', function($rootScope, $scope, $http, $ionicLoading) {
  $ionicLoading.show({
    template: '<ion-spinner icon="lines"></ion-spinner>',
    hideOnStageChange: true
  });

  $http.get($rootScope.server_url + '/employees/apprentices').success(function(data, status, headers, config) {
    $scope.employees = data
    $ionicLoading.hide();
  })
})

.controller('StatusCtrl', function($rootScope, $scope, $http, $state, $localStorage, APIService) {
  $scope.server_url = $rootScope.server_url;
  $scope.error = null;

  $scope.validate = function() {
    console.log("Current server URL " + $rootScope.server_url);
    console.log("Connected? " + $rootScope.connected);
    console.log("Ping " + $scope.server_url);

    APIService.status($scope.server_url).finally(function() {
      console.log("DONE Connected? " + $rootScope.connected);

      if($rootScope.connected) {
        $scope.error = null;
        $scope.save();
        $state.transitionTo('tab.employees');
      } else {
        $scope.error = { 'message': 'API server is offline or incorrect URL' }
      }
    });
  }

  $scope.save = function() {
    $rootScope.server_url = $scope.server_url;
    $localStorage.set('server_url', $scope.server_url);
  }

  $scope.checkStatus = function () {
    APIService.status()
  }
})

