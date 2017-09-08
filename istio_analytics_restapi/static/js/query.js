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
        .module('istio', ['ngMaterial', 'ngMessages'])
        .controller('TraceQueryController', TraceQueryController);

  function TraceQueryController($scope, $timeout, $q, $log, $http) {
	  $scope.startTime = "2017-07-06T00:00:00.0Z";
	  $scope.endTime = "2017-07-31T00:00:00.0Z";
	  $scope.max = 500;
	  $scope.queryStatus = "";
	  
	  $scope.query = query;
	  
	  function query() {
		  $scope.queryStatus = "Posting query";
		  // TODO disable button?
		  
		  $http({
			  method: 'POST',
			  url: '/api/v1/distributed_tracing/traces/timelines',
			  data: { start_time: $scope.startTime, end_time: $scope.endTime, max: $scope.max }
		}).then(function successCallback(response) {
			    // this callback will be called asynchronously
			    // when the response is available
				$scope.queryStatus = JSON.stringify(response);
				
				// @@@ TODO
			  }, function errorCallback(response) {
			    // alert("Failed, response is " + JSON.stringify(response));
			    $scope.queryStatus = "Failed " + JSON.stringify(response);
			  });
		  }
  }
  
})(window.angular);