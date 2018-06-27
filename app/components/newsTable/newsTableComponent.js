
;(function(){
    'use strict';

	var newsTableComponent = angular.module('NewsTableComponent', []);

	newsTableComponent.filter('to_trusted',
        ['$sce', function($sce) {
            return function(text) {
                return $sce.trustAsHtml(text);
            }
        }]
    );

    /**=============================================================
	 * Service: News Table Service
	 *=============================================================*/
	newsTableComponent.factory('newsTableService', newsTableServiceInit);
	newsTableServiceInit.$inject = ['$rootScope', '$sce', '$q', '$http'];

	function newsTableServiceInit($rootScope, $sce, $q, $http) {
		var service = {
            data: {},
            currentPage: 0,
            isLoading: false,
            requestConfig: {
                api_key: null,
                nation: null,
                page: 0
            }
		};

		/**
		 * Function: Init data
         * Param: options {api_key: null, nation: null}
		 */
		service.init = function(options) {
            options = options != undefined ? options : {api_key: null, nation: null};

            this.requestConfig.api_key = options.api_key != null ? options.api_key : '092b8aac63e3484ea21a5245dfe44acc';
            this.requestConfig.nation = options.nation != null ? options.nation : 'singapore';

			this.loadData();
			return this;
		};

		/**
		 * Function: Load data
		 */
		service.loadData = function(page){
            var self = this;

            //== Check if API Key is wrong
            if (self.requestConfig.api_key == null) {

                console.error('API key is wrong.');
                return false;

            } else {

                var deferred = $q.defer();
                var self = this;

                //== Start loading
                self.isLoading = true;

                $http({
                    method : 'GET',
                    url: "https://api.nytimes.com/svc/search/v2/articlesearch.json?" + "api-key=" + self.requestConfig.api_key + "&q=" + self.requestConfig.nation + "&page=" + self.requestConfig.page,
                    async: false
                })
                .then(function successCallback(response) {

                    if (response.data.status != undefined && response.data.status == 'OK') {

                        self.data = response.data.response.docs;

                        self.currentPage = self.requestConfig.page;

                        deferred.resolve(response);

                        console.log(self);
                    }
                    //== Stop Loading
                    self.isLoading = false;

                }, function errorCallback(response) {

                    //== Handle error and stop loading
                    deferred.reject(error);
                    self.isLoading = false;

               });
           }

           //== Return Promise
           return deferred.promise;
		};

		/**
		 * Function: Load data with page
		 */
		service.loadPageData = function(page) {
            this.request.page = page;

			this.loadData();
		};

		/**
		 * Function: Sort Data
		 */
		service.sortData = function(field) {
			var self = this;

			//== Check if data is currently sorted by right field, we just need to change 'asc' to 'desc', or diverse
			if (self.request.sort.field == field) {

				if (self.request.sort.order == 'asc') {
					self.request.sort.order = 'desc';
				} else {
					self.request.sort.order = 'asc';
				}

			} else {
				self.request.sort.field = field;
				self.request.sort.order = 'asc';
			}

			//== Load Data
			self.loadData();
		};

		return service;
	};

	/**=============================================================
	 * Directive: News Render Directive
	 *=============================================================*/
	newsTableComponent.directive('newsTablePanel', newsTablePanelInit);
	newsTablePanelInit.$inject = ['$window', '$timeout', 'newsTableService'];

	function newsTablePanelInit($window, $timeout, newsTableService) {
		return {
            restrict : 'A',
            scope: true,
            controller: function($scope, $element, $attrs) {
                console.log('News table panel initing....');
                //== We create a new scope variable to use in this directive
            	$scope.newsPanel = newsTableService.init();


	        }
        };
	};

})()
