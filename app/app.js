;(function(){
    'use strict';

    /**
     * Main NYTimes app
     */
     var MainApp = angular.module('MainApp', ['CommonComponent', 'NewsTableComponent']);

     MainApp.config(function() {

         //== Default app config here...

     });

     //== Filter for HTML binding
     MainApp.filter('to_trusted',
        ['$sce', function($sce){
            return function(text) {
                return $sce.trustAsHtml(text);
            }
        }]
    );

    //== Filter for datetime moment format
    MainApp.filter('date_time', function(){
		return function(input) {
			if(input == null || input == 'N/A'){
				return 'N/A';
			}
			try {
					return moment.utc(input).format("MMM DD, YYYY HH:mm");
			} catch(e) {
				return "N/A";
			}
		};
	});

})();
