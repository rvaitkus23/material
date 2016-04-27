(function() {
  angular.module('headX')
    .service('userService', userService);

  userService.$inject = ['$rootScope', '$http', '$q', 'ENDPOINTS'];

  function userService($rootScope, $http, $q, ENDPOINTS) {
    var users = null;

    return {
      getUsers: getUsers,
      addUser: addUser
    };

    function getUsers() {
      var deferred = $q.defer();

      if (users !== null) {
        deferred.resolve(users);
      } else {
        requestUsers().then(function(response) {
          users = response.data;
          deferred.resolve(users);
        }, function(){
          deferred.reject();
        })
      }

      return deferred.promise;
    }

    function addUser(user) {
      if (users === null) { users = [] }
      users[users.length] = user;
      broadcastUsersChange();
    }

    function requestUsers() {
      var deferred = $q.defer();

      $http.get(ENDPOINTS.users).then(function(data){
        deferred.resolve(data);
      }, function(response){
        console.error(response);
      });

      return deferred.promise;
    }

    function broadcastUsersChange() {
      $rootScope.$broadcast('usersChanged', users);
    }
  }
})();
