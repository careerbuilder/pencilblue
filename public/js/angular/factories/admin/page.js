(function() {
  angular.module('pencilblue.factories.admin.pages', [])
  .factory('pageFactory', function($http) {
    return {
      getPages: function(options, cb) {
        var queryString = '';
        for(var key in options) {
          if(queryString.length) {
            queryString += '&';
          }
          else {
            queryString += '?';
          }

          queryString += key + '=' + options[key];
        }

        $http.get('/api/content/pages' + queryString)
        .then(function(result) {
          cb(null, result.data, result.total);
        })
        .catch(function(error) {
          cb(error);
        });
      },

      deletePage: function(id, cb) {
        $http({
          method: 'DELETE',
          url: '/api/content/pages/' + id
        })
        .then(function(result) {
          cb(null, result);
        })
        .catch(function(error) {
          cb(error);
        });
      }
    };
  });
}());
