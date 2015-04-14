angular.module('floor.services', []).factory('Employee', function($resource) {
  return $resource('http://stealth-new.suse.de:3001/employees/:id');
});
