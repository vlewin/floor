var module = angular.module('staff.services', [])


module.service('APIService', function($rootScope, $http, $q) {
  var promise;

  return {
    status: function (url) {
      api_url = url || $rootScope.server_url;
      promise =  $http.get(api_url).success(function(data, status, headers, config) {
        $rootScope.connected = true;
      }).error(function(data, status, headers, config) {
        $rootScope.connected = false
      }).then(function() {
        $rootScope.$broadcast('scroll.refreshComplete');
      })

      return promise;
    }
  };
})

module.factory('Employee', function($rootScope, $resource) {
  return $resource($rootScope.server_url + '/employees/:id');
})

module.factory('$localStorage', function($window) {
    return {
      set: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function(key) {
        return JSON.parse($window.localStorage[key] || '{}');
      }
    }
});

module.factory('$sessionStorage', function($window) {
    return {
      set: function(key, value) {
        $window.sessionStorage[key] = value;
      },
      get: function(key, defaultValue) {
        return $window.sessionStorage[key] || defaultValue;
      },
      setObject: function(key, value) {
        $window.sessionStorage[key] = JSON.stringify(value);
      },
      getObject: function(key) {
        return JSON.parse($window.sessionStorage[key] || '{}');
      }
    }
});
