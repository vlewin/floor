angular.module('staff.services', []).factory('Employee', function($rootScope, $resource) {
  return $resource($rootScope.server + '/employees/:id');
});
