(function (angular) {
	'use strict';


	// 由于默认angular提供的异步请求对象不支持自定义回调函数名称
	// angular随机分配的回调函数不被豆瓣支持
	var http = angular.module('services.http', []);
	http.service('HttpService', ['$document','$window', function($document, $window){
		this.jsonp = function(url, data, callback) {
			// if (typeof data == 'function') {
			// 	callback = data;
			// }
			var cbFuncName = 'my_json_cb_' + Math.random().toString().replace('.','');

			// 2、将data转换为url字符串形式
			var querystring = url.indexOf('?') == -1 ? '?' : '&';
			for (var key in data ) {
				querystring += key + '=' + data[key] + '&';
			}
			// 3、处理url中的回调函数
			querystring += 'callback=' + cbFuncName;
			// 4、创建一个script标签
			var scriptElement = $document[0].createElement('script');
			scriptElement.src = url + querystring;


			// 1、挂载回调函数
			$window[cbFuncName] = function(data) {
				callback(data);
				// 由于每次加载都会创建一个script
				// 所以多次之后会造成内存占用无穷大
				// 所以要在每次回调函数执行过后，移除节点
				$document[0].body.removeChild(scriptElement);
			}

			// 5、将script标签放到页面中
			$document[0].body.appendChild(scriptElement);
		};

	}])
})(angular);
