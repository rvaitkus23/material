(function(){
  'use strict';

  angular.module('headX')
    .controller('appController', appController);

  appController.$inject = ['$scope', '$mdSidenav', '$mdDialog', 'userService'];

  function appController($scope, $mdSidenav, $mdDialog, userService) {
    var vm = this;

    vm.selected = undefined;
    vm.selectedIndex = -1;

    vm.users = [ ];

    vm.toggleSidenav = function() {
      $mdSidenav('left').toggle();
    };

    vm.firstLetter = function(text) {
      return text[0].toUpperCase();
    };

    vm.showAdd = function(ev) {
      $mdDialog.show({
          controller: 'addUserDialogController',
          templateUrl: './templates/addUserDialog.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
        .then(userService.addUser);
    };

    vm.selectUser = function(user, index, toggleMenu) {
      vm.selected = user;
      vm.selectedIndex = index;
      if (toggleMenu) vm.toggleSidenav();
    };

    vm.getCoordinates = function(location) {
      return location['lat'] + ',' + location['lng'];
    };

    userService.getUsers().then(updateUsers);

    $scope.$on('usersChanged', updateUsersEvent);

    function updateUsersEvent(event, newUsers) {
      updateUsers(newUsers);
    }

    function updateUsers(newUsers) {
      vm.users = newUsers;
      if (typeof(vm.selected) === 'undefined' && newUsers.length > 0) {
        vm.selectUser(newUsers[0], 0, false);
      }
    }

  }
})();