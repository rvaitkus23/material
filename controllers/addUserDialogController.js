(function() {
  'use strict';

  angular.module('headX')
    .controller('addUserDialogController', addUserDialogController);

  addUserDialogController.$inject = ['$scope', '$mdDialog', 'validatorService'];

  function addUserDialogController($scope, $mdDialog, validatorService) {
    var lastAddressCheck = '';
    var isAddressValid = false;

    $scope.user = {
      firstName: '',
      lastName: '',
      address: '',
      location: {}
    };

    $scope.addressValid = true;

    $scope.cancel = function () {
      $mdDialog.cancel();
    };

    $scope.save = function () {
      var validationMessage = validateUser();
      if (validationMessage === null) {
        $mdDialog.hide($scope.user);
      } else {
        alert(validationMessage);
      }
    };

    $scope.validateAddress = function(address) {
      if (address.length > 5 && address !== lastAddressCheck){
        validatorService.validateAddress(address).then(function(results){
          $scope.user['address'] = results.formattedAddress;
          $scope.user['location'] = results.location;
          lastAddressCheck = $scope.user['address'];
          setAddressValidity(true);
          isAddressValid = true;
        }, function(error){
          lastAddressCheck = address;
          setAddressValidity(false);
        });
      }
    };

    function validateUser() {
      if ($scope.user.firstName === '') {
        return 'First Name field has to be filled!';
      } else if ($scope.user.lastName === '') {
        return 'Last Name field has to be filled!';
      } else if ($scope.user.address === '') {
        return 'Address field has to be filled!';
      } else if (typeof($scope.user.location['lat']) === 'undefined') {
        return 'Address is not valid';
      } else {
        return null;
      }
    }

    function setAddressValidity(bool) {
      $scope.userForm.address.$setValidity('addressInvalid', bool);
    }
  }
})();