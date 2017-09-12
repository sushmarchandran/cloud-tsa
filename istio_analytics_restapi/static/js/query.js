// Licensed Materials - Property of IBM
// (C) Copyright IBM Corp. 2017. All Rights Reserved.
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

// Use AngularJS to query Istio Zipkin Analytics

(function(angular) {
  'use strict';
  
  // Define module, that requires modules ngMaterial and ngMessages
  // Note that in addition to referencing them here the HTML must <script src=>
  // them as well.
  angular
        .module('istio', ['ngMaterial', 'ngMessages'],
        	// The locationProvider must be set to HTML5 mode so that we can extract
        	// start/end from it.  We must set requireBase false or on Safari the
        	// error "10 $digest() iterations reached. Aborting!" may trigger. 
        	function($locationProvider) {
            	$locationProvider.html5Mode({
            		  enabled: true,
            		  requireBase: false
            		});
        	})
        .controller('TraceQueryController', TraceQueryController);

  function TraceQueryController($scope, $timeout, $q, $log, $http, $location) {
	  $scope.location = $location;
	  if ($location.search()) {
		  if (typeof $location.search()['start'] == "string") {
			  $scope.startTime = $location.search()['start'];
		  } else {
			  $scope.startTime = "2017-07-06T00:00:00.0Z";	// default
		  }
		  if (typeof $location.search()['end'] == "string") {
			  $scope.endTime = $location.search()['end'];
		  } else {
			  $scope.endTime = "2017-07-31T00:00:00.0Z"; // default
		  }
		  if (typeof $location.search()['max'] == "string") {
			  $scope.max = parseInt($location.search()['max']);
		  } else {
			  $scope.max = 500;
		  }
		  if ($location.path().startsWith("/trace/")) {
			  $scope.nquery = parseInt($location.path().substring(7));
		  } else {
			  $scope.nquery = 0;
		  }
	  } else {
		  $scope.startTime = "2017-07-06T00:00:00.0Z";	// default
		  $scope.endTime = "2017-07-31T00:00:00.0Z"; // default
		  $scope.max = 500;
		  $scope.nquery = 0;
	  }
	  $scope.queryStatus = "";
	  $scope.rawTraces = null;
	  
	  $scope.query = query;
	  
	  function query() {
		  $scope.queryStatus = "Posting query";
		  // TODO disable button?
		  
		  var requestTime = new Date();
		  $http({
			  method: 'POST',
			  url: '/api/v1/distributed_tracing/traces/timelines',
			  data: { start_time: $scope.startTime, end_time: $scope.endTime, max: $scope.max }
		}).then(function successCallback(response) {
			    // this callback will be called asynchronously
			    // when the response is available
				$scope.queryStatus = "";
				$scope.rawTraces = response.data;

				// 'traces' and 'ntrace' are globals currently -- this is a work-around for strict mode
				// See https://stackoverflow.com/questions/9397778/how-to-declare-global-variables-when-using-the-strict-mode-pragma
				var globals = (1,eval)('this');
				globals.traces = $scope.rawTraces.traces_timelines;
				if (globals.traces.length == 0) {
				    $scope.queryStatus = "No traces for timerange";
				    return;
				}
				
				// TODO remove
				$scope.queryStatus = "Request took " + (new Date() - requestTime) + "ms";
				
				globals.ntrace = $scope.nquery;
				showTrace(globals.traces, globals.ntrace);

			  }, function errorCallback(response) {
			    // alert("Failed, response is " + JSON.stringify(response));
			    $scope.queryStatus = "Failed " + JSON.stringify(response);
			  });
		  }
  }
  
})(window.angular);