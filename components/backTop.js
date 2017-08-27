(function (angular) {
  'use strict';
  angular.module('directives.back_top', [])
    .directive('backTop', ['$location', function($location) {
      return {
        restrict: 'A',
        link: function($scope, iElm, iAttrs, controller) {
          var e = $(iElm);  
          var pageClientHeight = $(window).height();
          $(window).scroll(function () {                 //滚动时触发  
              if ($(window).scrollTop() >= pageClientHeight)   
                  e.fadeIn(300)  
              else  
                  e.fadeOut(200);  
          });  
          /*点击回到顶部*/  
          e.click(function () {  
              $('html, body').animate({                 //添加animate动画效果  
                  scrollTop: 0  
              }, 300, 'swing');  
          });  
        }
      };
    }]);
})(angular);