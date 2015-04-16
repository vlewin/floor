angular.module('floor.services', []).factory('Employee', function($rootScope, $resource) {
  return $resource($rootScope.server + '/employees/:id');
});
