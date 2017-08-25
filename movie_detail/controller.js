(function(angular) {
	'use strict';


	var module = angular.module(
		'moviecat.movie_detail', [
			'ngRoute',
			'services.http'
		])
	// 配置模块路由
	module.config(['$routeProvider', function($routeProvider) {
		// 路由中加上分页
	  $routeProvider.when('/movie/detail/:id', {
	    templateUrl: 'movie_detail/view.html',
	    controller: 'MovieDetailController'
	  });
	}])

	module.controller('MovieDetailController', [
		'$scope',
		'$route',
		'$routeParams',
		'HttpService',
		'AppConfig',
		function($scope,$route,$routeParams,HttpService,AppConfig) {
			$scope.loading = true;
			$scope.movie = {};
			var id = $routeParams.id;

			var apiAddress = AppConfig.MovieDetailApiAddress + id;

			// 跨域的方式
			HttpService.jsonp(apiAddress, {}, function(data) {
				$scope.movie = data;
				$scope.loading = false;
				$scope.$apply();
			});
		}
	]);



})(angular);
