(function() {

  var app = angular.module('gemStore',
            ['product-tabs', 'product-gallery', 'product-reviews']);

  app.controller('StoreController', ['$http', '$log', function($http, $log) {
    var store = this;
    store.products = [];

    $http.get('gems.json').success(function(data) {
      store.products = data;
    })
    .error(function() {
      alert("Error al cargar productos.");
    });
  }]);

  app.directive("product", function() {
    return {
      restrict: 'E',
      templateUrl: 'views/product/product.html'
    };
  });

})();
