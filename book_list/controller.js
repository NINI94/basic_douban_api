(function(angular) {
  'use strict';

  var module = angular.module(
    'books.book_list', [
      'ngRoute',
      'services.http',
    ])
  // 配置模块路由
  module.config(['$routeProvider', function($routeProvider) {
    // 路由中加上分页
    $routeProvider.when('/book/:category/:page', {
      templateUrl: 'book_list/view.html',
      controller: 'BookListController'
    });
  }])

  module.controller('BookListController', [
    '$scope',
    '$rootScope',
    '$route',
    '$routeParams',
    'HttpService',
    'AppConfig',
    function($scope,$rootScope,$route,$routeParams,HttpService,AppConfig) {
      var count = AppConfig.pageSize;  // 每页的条数
      var page = parseInt($routeParams.page);  // 当前第几页
      var start = (page - 1) * count;   // 每一页从第几条开始
      // 控制器分两步，1、暴露数据；2、暴露行为
      $scope.loading = true;
      $scope.title = 'Loading...';
      $scope.totalCount = 0;
      $scope.books = [];
      HttpService.jsonp(
        AppConfig.BookListApiAddress + $routeParams.category,
        // $routeParams的数据来源：1、路由匹配出来的，2、？参数
        {
          start: start,
          count: count,
          tag: $routeParams.tag,
          q: $routeParams.q,
        },
        function(data) {
          $routeParams.tag ? $scope.title = $routeParams.tag : $scope.title = $routeParams.q;
          
          $scope.currentPage = page;
          $scope.books = data.books;  // 图书对象，图书的详细信息
          $scope.totalCount = data.total;
          $scope.totalPages = Math.ceil($scope.totalCount / count);

          $scope.format = 'index.html#/book/' + $routeParams.category + '/';

          var pager = new Pagination($scope.currentPage, $scope.totalPages, 5, $scope.format, $routeParams.q, $routeParams.tag);
          pager.render('.booklist_pagination');


          // loading尽可能放后面
          $scope.loading = false;
          // $apply的作用就是让重新同步
          $scope.$apply();
        }
      );



      /**
       * 分页的构造函数
       */
      function Pagination(current, total, show, format, q, tag) {
        this.current = current;   // 当前页码
        this.total = total;       // 总页码
        this.show = show;         // 显示的页码数

        this.format =format;      // 路径模版

        // 搜索
        this.data = '';

        if (tag) {
          this.data += '?tag=' + tag;
          // 经测试，tag和q同时存在，以tag为准，所以不需要q
        } else {
          q ? this.data += '?tag=&q=' + q : '';
        }
        

        // 1. 根据显示数量算出正常情况当前页的左右各有几个
        var region = Math.floor(show / 2);
        // 2. 计算出当前界面上的起始值
        var begin = current - region; // 可能小于 1
        begin = begin < 1 ? 1 : begin;
        var end = begin + show; // end必须小于total
        if (end > total) {
          end = total + 1;
          begin = end - show;
          begin = begin < 1 ? 1 : begin;
        }
        this.begin = begin;
        this.end = end;
      };
      /**
       * 渲染分页这个组件到界面上
       */
      Pagination.prototype.render = function(containers) {
        // 获取分页展示容器
        // p.render('.pgfds');
        if (typeof containers === 'string') {
          containers = document.querySelectorAll(containers);
        }
        if (containers.length === undefined) {
          // dom对象
          containers = [containers];
        }
        for (var c = 0; c < containers.length; c++) {
          var container = containers[c];
          // 先append上一页
          var prevElement = document.createElement('li');
          prevElement.innerHTML = '<a href="' + this.format + (this.current - 1) + this.data +'">&laquo;</a>';
          if (this.current <= 1) {
            prevElement.classList.add('disabled');
            prevElement.innerHTML = '<a>&laquo;</a>';
          }
          container.appendChild(prevElement);
          for (var i = this.begin; i < this.end; i++) {
            var liElement = document.createElement('li');
            // liElement.innerHTML = '<a href="?page=' + i + '">' + i + '</a>';
            // liElement.innerHTML = '<a href="' + this.format + i +'">' + i + '</a>';
            liElement.innerHTML = '<a href="' + this.format + i + this.data +'">' + i + '</a>';

            if (i == this.current) {
              // 此时是当前页
              liElement.classList.add('active');
            }
            container.appendChild(liElement);
          }
          var nextElement = document.createElement('li');
          nextElement.innerHTML = '<a href="' + this.format + (this.current + 1) + this.data +'">&raquo;</a>';

          if (this.current >= this.total) {
            nextElement.classList.add('disabled');
            nextElement.innerHTML = '<a>&raquo;</a>';
          }
          container.appendChild(nextElement);
        }
      };

      /**
       * 暴露一个到第几页的行为
       */
      $scope.go = function(page) {
        // 传过来是第几页就是第几页
        // 一定要做一个合法范围校验
        if (page >= 1 && page <= $scope.totalPages)
          $route.updateParams({ page: page });
      }


      var trigger = $('.hamburger');
      var overlay = $('.overlay');
      var isClosed = false;

      trigger.click(function () {
        hamburger_cross();      
      });

      function hamburger_cross() {

        if (isClosed == true) {          
          overlay.hide();
          trigger.removeClass('is-open');
          trigger.addClass('is-closed');
          isClosed = false;
        } else {   
          overlay.show();
          trigger.removeClass('is-closed');
          trigger.addClass('is-open');
          isClosed = true;
        }
      }
      
      $('[data-toggle="offcanvas"]').click(function () {
            $('#wrapper').toggleClass('toggled');
      });


    }
  ]);



})(angular);
