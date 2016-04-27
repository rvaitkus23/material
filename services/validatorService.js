(function() {
  angular.module('headX')
    .service('validatorService', validatorService);

  validatorService.$inject = ['$http', '$q', 'ENDPOINTS'];

  function validatorService($http, $q, ENDPOINTS) {
    return {
      validateAddress: validateAddress
    };

    function validateAddress(address) {
      var deferred = $q.defer();

      $http.get(ENDPOINTS.googleGeocode + 'address=' + address).then(function(response){
        var match = checkResults(response['data']['results']);

        if (response['data']['status'] === 'OK' && match !== null){
          deferred.resolve({
            formattedAddress: match['formatted_address'],
            location: match['geometry']['location']
          })
        } else {
          deferred.reject('No results');
        }
      });

      return deferred.promise;
    }

    function checkResults(results) {
      for (var i = 0, il = results.length; i < il; i++) {
        if (results[i]['types'].indexOf('street_address') !== -1 ||
            results[i]['types'].indexOf('premise') !== -1){
          return results[i];
        }
      }

      return null;
    }

  }
})();