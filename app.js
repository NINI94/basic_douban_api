'use strict';

angular.module('app', [
  'ngRoute',
  'moviecat.movie_detail',
  'moviecat.movie_list',
  'books.book_list',
  'books.book_detail',
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
    $scope.isActive = function(url) {
      if ($routeParams.category==url) {
        return true;
      } else {
        return false;
      }
    }


    /**
     * 回到顶部
     */
    backTop();
    function backTop() {
      var scrollUp = $window.document.getElementById('scrollup');
      // 按钮原来的位置
      var T = scrollup.offsetTop;
      scrollUp.style.display = 'none';
      // 可见文档的高度
      var pageClientHeight = $window.document.documentElement.clientHeight;
      // 按钮的位置 = 原来的位置 + 滚动条滚动的高度
      window.onscroll = function() {
        var scrollTop = $window.document.documentElement.scrollTop || $window.document.body.scrollTop;
        scrollUp.style.top = T + scrollTop + 'px';  
        if (scrollTop >= pageClientHeight) {
          scrollUp.style.display = 'block';
          
        } else {
          scrollUp.style.display = 'none';
        }
      }
      scrollUp.onclick = function() {
        scrollUp.timer = setInterval(function() {
          var scrollTop = $window.document.documentElement.scrollTop || $window.document.body.scrollTop;
          var speedTop = scrollTop/5;
          $window.document.body.scrollTop = scrollTop - speedTop;
          if (scrollTop == 0) {
            clearInterval(scrollUp.timer);
          }
        },30);
      }
    }


  }
]);




