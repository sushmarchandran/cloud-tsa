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
        .module('istio', ['ngRoute', 'ngMaterial', 'ngMessages'],
            // The locationProvider must be set to HTML5 mode so that we can extract
            // start/end from it.  We must set requireBase false or on Safari the
            // error "10 $digest() iterations reached. Aborting!" may trigger. 
            function($locationProvider) {
                $locationProvider.html5Mode({
                      enabled: true,
                      requireBase: false
                    });

            })
        .controller('SankeyQueryController', SankeyQueryController);

    function SankeyQueryController($scope, $q, $http, $location, $rootScope) {
        console.log("Hello from SankeyQueryController");

        $scope.location = $location;
        $scope.queryStatus = "";
        $scope.dataOrigin = "";
        $scope.traceList = [];
        $scope.startTime = "";
        $scope.endTime = "";
        $scope.maxTraces = 500;

        $scope.query = query;

        $rootScope.$on('$locationChangeSuccess', function () {
            // I had trouble listening for $scope.$on('$routeUpdate',...)
            console.log("SankeyQueryController $locationChangeSuccess triggered, $location.path()=" + $location.path());

            if ($location.search() === undefined) {
                console.log("   SankeyQueryController $location.path() undefined; bailing");
                return;
            }

            $scope.startTime = parseTime($location.search()['start']);
            $scope.endTime = parseTime($location.search()['end']);
            if ('max' in $location.search()) {
                $scope.maxTraces = parseInt($location.search()['max']);
            }
            if (parseBoolean($location.search()['auto'])) {
                query(true);
            }
        });


        function parseBoolean(s) {
            if (s == true) {
                return true;
            }
            if (typeof s != "string") {
                return false;
            }
            return s.toUpperCase() == "TRUE" || s == "1";
        }

        // Currently the only special time format we support is "NOW";
        // otherwise s must be an ISO time string
        function parseTime(s) {
            if (s && s.toUpperCase() == "NOW") {
                var d = new Date();
                return d.toISOString();
            }
            return s;
        }

        function query(automatic) {
            $scope.queryStatus = "Posting query";
            $scope.dataOrigin = "";
            // TODO disable button?

            // See https://stackoverflow.com/questions/20884551/set-url-query-parameters-without-state-change-using-angular-ui-router
            if (!automatic) {
                $location.search({ start: $scope.startTime, end: $scope.endTime });
            }

            var requestTime = new Date();
            $http({
                  method: 'POST',
                  url: '/api/v1/distributed_tracing/traces',
                  data: { start_time: $scope.startTime, end_time: $scope.endTime, max: $scope.maxTraces }
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.queryStatus = "";
                $scope.dataOrigin = response.data.zipkin_url;

                $scope.traceList = srTimeFilter(response.data.trace_list, $scope.startTime, $scope.endTime);

                // TODO remove
                $scope.queryStatus = "Request took " + (new Date() - requestTime) + "ms";

                $scope.dataOrigin = response.data.zipkin_url;

                showSankey($scope.traceList, $scope.context);

            }, function errorCallback(response) {
                    $scope.queryStatus = "Failed " + JSON.stringify(response);
                    $scope.clusters = [];
            });

            if ($scope.context == null) {
                $scope.context = prepareSankey("#sankey_chart", $scope);
            }

        }

        $scope.advance = function(seconds) {
            var d = new Date(0);
            d.setUTCMilliseconds(Date.parse($scope.endTime)+seconds*1000);
            $scope.endTime = d.toISOString();
        }

        $scope.advanceToNow = function() {
            var d = new Date();
            $scope.endTime = d.toISOString();
        }

        // Filter a server response to a particular range
        function srTimeFilter(traces, start, end) {
            var tsStart = Date.parse(start) * 1000;
            var tsEnd = Date.parse(end) * 1000;
            return traces.map(function (trace) {
                var retval = {
                    trace_id: trace.trace_id,
                    spans: trace.spans.filter(function (span) {
                        return tsStart <= span.sr && span.sr <= tsEnd;
                    })
                };
                return retval;
            });
        }

    } // SankeyQueryController

})(window.angular);

