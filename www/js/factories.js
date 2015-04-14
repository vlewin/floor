angular.module('floor.services', []).factory('Employee', function($resource) {
  return $resource('http://localhost:3001/employees/:id');
});
