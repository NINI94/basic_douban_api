'use strict';

angular.module('app', [
  'ngRoute',
  'moviecat.movie_detail',
  'moviecat.movie_list',
  'books.book_list',
  'books.book_detail',
  'directives.back_top',
])
// 为模块定义一些常量
.constant('AppConfig', {
	pageSize: 10,
	MovieListApiAddress: 'https://api.douban.com/v2/movie/',
	MovieDetailApiAddress: 'https://api.douban.com/v2/movie/subject/',
  BookListApiAddress: 'https://api.douban.com/v2/book/',
  BookDetailApiAddress: 'https://api.douban.com/v2/book/',
})
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
}])
/**
 * 处理各个模块的搜索功能
 */
.controller('SearchController', [
  '$scope',
  '$rootScope',
  '$route',
  '$routeParams',
  'AppConfig',
  function($scope, $rootScope, $route, $routeParams, AppConfig){
    $scope.input = '';
    $rootScope.search = function() {
      var input = $scope.input;
      if ($routeParams.tag) {
        $route.updateParams({
          category: 'search',
          q: input,
          page: 1,
          tag:''
        });
      } else {
        $route.updateParams({
          category: 'search',
          q: input,
          page: 1,
        });
      }
    };
  }
])
/**
 * 处理首页
 */
.controller('IndexController',[
  '$window',
  '$scope',
  '$location',
  '$rootScope',
  '$route',
  '$routeParams',
  function($window, $scope, $location, $rootScope, $route, $routeParams){
    $rootScope.$on('$routeChangeSuccess', function () {
      // console.log($routeParams)
      if(isEmptyObject($routeParams)){
        // 如果是空对象，说明地址栏为首页，显示首页内容
        $scope.ifshow = true;
      } else {
        $scope.ifshow = false;
      }
    });

    // 判断是不是空对象
    function isEmptyObject(obj) {
      for (var k in obj)
        return false;
      return true;
    }

    // 判断是否是当前页面
    // $scope.isActive = function(url) {
    //   if ($routeParams.category==url) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // }


    // 顶部小屏幕导航点击关闭菜单
    $(".navbar-collapse a").click(function() {
      $(".navbar-collapse").collapse('hide');
    });

  }
]);




