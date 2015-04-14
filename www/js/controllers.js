angular.module('floor.controllers', [])

.run(function($ionicPlatform, $rootScope) {
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

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('EmployeesCtrl', function($scope, $resource, Employee) {
  $scope.searchKey = "";

  $scope.clearSearch = function () {
    $scope.searchKey = "";
    $scope.employees = Employee.query({limit:10});
  }

  $scope.search = function () {
    if($scope.searchKey) {
      $scope.employees = Employee.query({search: $scope.searchKey});
    }
  }

  $scope.employees = Employee.query({limit:10});
})

.controller('EmployeeCtrl', function($scope, $resource, $stateParams, Employee) {
  $scope.employee = Employee.get({ id: $stateParams.employeeId });
})




.controller('StatusCtrl', function($rootScope, $scope, $http) {
  $scope.check = function () {
    $http.get('http://stealth-new.suse.de:3001').success(function(data, status, headers, config) {
      $scope.status = data['status']
      $scope.api_url = config.url
    }).error(function(data, status, headers, config) {
      $scope.api_url = config.url
    });
  }



  $scope.check()
})
