(function() {
  angular.module('pencilblue.factories.admin.articles', [])
  .factory('articleFactory', function($http) {
    return {
      getArticles: function(options, cb) {
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

        $http.get('/api/content/articles' + queryString)
        .then(function(result) {
          cb(null, result.data, result.total);
        })
        .catch(function(error) {
          cb(error);
        });
      },

      deleteArticle: function(id, cb) {
        $http({
          method: 'DELETE',
          url: '/api/content/articles/' + id
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
