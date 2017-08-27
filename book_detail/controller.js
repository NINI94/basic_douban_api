(function(angular) {
  'use strict';


  var module = angular.module(
    'books.book_detail', [
      'ngRoute',
      'services.http'
    ])
  // 配置模块路由
  module.config(['$routeProvider', function($routeProvider) {
    // 路由中加上分页
    $routeProvider.when('/book/:id', {
      templateUrl: 'book_detail/view.html',
      controller: 'BookDetailController'
    });
  }])

  module.controller('BookDetailController', [
    '$scope',
    '$sce',
    '$route',
    '$routeParams',
    'HttpService',
    'AppConfig',
    function($scope,$sce,$route,$routeParams,HttpService,AppConfig) {
      $scope.loading = true;
      $scope.book = {};
      var id = $routeParams.id;

      //var apiAddress = AppConfig.BookDetailApiAddress + id;
      var apiAddress = 'https://api.douban.com/v2/book/' + id;

      // 跨域的方式
      HttpService.jsonp(apiAddress, {}, function(data) {
        $scope.book = data;

        /**
         * 处理目录换行
         */
        // 由于angular会自动过滤html，所以要把从api拿过来的\n转换成<br/>
        $scope.book.catalog = $sce.trustAsHtml($scope.book.catalog.toString().replace(/\n/g,'<br>'));

        $scope.loading = false;
        $scope.$apply();
      });
    }
  ]);

})(angular);
