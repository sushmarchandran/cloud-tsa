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
        .controller('TraceQueryController', TraceQueryController)
        .controller('SequenceDiagramController', SequenceDiagramController)
        .controller('PieController', PieController)
        .controller('CategoriesController', CategoriesController)
        .config(function($routeProvider) {
            $routeProvider
            .when('/sequence/flow/:flow/trace/:traceid', {
                templateUrl: '/static/sequence_c.html',
                templateNamespace: 'svg',
                controller: 'SequenceDiagramController',
                reloadOnSearch: false,
            })
            .when('/categories', {
                templateUrl: '/static/categories_c.html',
                controller: 'CategoriesController',
                reloadOnSearch: false,
            })
            .when('/pie/flow/:flow', {
                templateUrl: '/static/pie_c.html',
                controller: 'PieController',
                reloadOnSearch: false,
            });
        });

    function TraceQueryController($scope, $timeout, $q, $log, $http, $location, $rootScope) {
        console.log("Hello from Canary TraceQueryController");

        $scope.location = $location;
        $scope.queryStatus = "";
        $scope.dataOrigin = "";
        $scope.clusters_diffs = [];    // Array of {root_request:, baseline_trace_ids:, canary_trace_ids:, cluster_stats_diff: }
        $scope.startTime = "";
        $scope.endTime = "";
        $scope.tags = "";
        $scope.maxTraces = 500;
        $scope.canaryStartTime = "";
        $scope.canaryEndTime = "";
        $scope.canaryTags = "";
        $scope.canaryMaxTraces = null;

        $scope.query = query;

        $rootScope.$on('$locationChangeSuccess', function () {
            // I had trouble listening for $scope.$on('$routeUpdate',...) and losing trace #
            console.log("TraceQueryController $locationChangeSuccess triggered, $location.path()=" + $location.path());

            $scope.startTime = parseTime($location.search()['start']);
            $scope.endTime = parseTime($location.search()['end']);
            if ('tags' in $location.search()) {
                $scope.tags = $location.search()['tags'];
            }
            if ('max' in $location.search()) {
                $scope.maxTraces = parseInt($location.search()['max']);
            }
            if ('canaryStart' in $location.search()) {
                $scope.canaryStartTime = parseTime($location.search()['canaryStart']);
            }
            if ('canaryEnd' in $location.search()) {
                $scope.canaryEndTime = parseTime($location.search()['canaryEnd']);
            }
            if ('canaryTags' in $location.search()) {
                $scope.canaryTags = $location.search()['canaryTags'];
            }
            if ('canaryMax' in $location.search()) {
                $scope.canaryMaxTraces = parseInt($location.search()['canaryMax']);
            }
            if (parseBoolean($location.search()['auto'])) {
                query(true);
            }
            
            // MK hard coded initial values
            $scope.deltaMeanThreshold = 0.3;
            $scope.deltaStddevThreshold = 0.1;
            $scope.durationMinCount = 100;
  		    $scope.errorcountMinCount = 100;
		    $scope.deltaRatioThreshold = 0.1;
        });

        function query(automatic) {

            $scope.dataOrigin = "";
            // TODO 'query' disable button?

            $scope.queryStatus = "Posting cluster/diff query";

            /* Replace the query with this code to test w/o server */
            /*
            $scope.queryStatus = "";
            var response_data = dummy_testdata;
            $scope.dataOrigin = response_data.zipkin_url;
            $scope.clusters_diffs = response_data.clusters_diffs;
            return;
            */

            if (!automatic) {
                $location.search({
                    start: $scope.startTime,
                    end: $scope.endTime,
                    tags: $scope.tags,
                    max: $scope.maxTraces,
                    canaryStart: $scope.canaryStartTime,
                    canaryEnd: $scope.canaryEndTime,
                    canaryTags: $scope.canaryTags,
                    canaryMax: $scope.canaryMaxTraces || 500,
                });
            }

            var requestTime = new Date();
            $http({
                  method: 'POST',
                  url: '/api/v1/distributed_tracing/traces/timelines/clusters/diff',
                  data: {
                      baseline: {
                          start_time: $scope.startTime,
                          end_time: $scope.endTime,
                          tags: parseTags($scope.tags),
                          max: $scope.maxTraces
                      },
                      canary: {
                          start_time: $scope.canaryStartTime,
                          end_time: $scope.canaryEndTime,
                          tags: parseTags($scope.canaryTags),
                          max: $scope.canaryMaxTraces || 500
                      },
                      metric_requirements: [
                    	  {
                    		  name: "duration",
                    		  metric_type: "mean",
                    		  min_count: $scope.durationMinCount || 100,
                    		  higher_is_better: false,
                    		  delta_mean_threshold: $scope.deltaMeanThreshold || 0.3,
                    		  delta_stddev_threshold: $scope.deltaStddevThreshold || 0.1
                    	  },
                    	  {
                    		  name: "error_count",
                    		  metric_type: "count",
                    		  min_count: $scope.errorcountMinCount || 100,
                    		  higher_is_better: false,
                    		  delta_ratio_threshold: $scope.deltaRatioThreshold || 0.1
                    	  }
                      ]
                  }
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.queryStatus = "";
                $scope.dataOrigin = response.data.zipkin_url;
                // We sort the data so that if we query again the flow # in the UI is stable
                if (response.data.clusters_diffs) {
                    response.data.clusters_diffs.sort(function (a, b) {
                        return a.root_request < b.root_request ? -1 :
                            (a.root_request > b.root_request ? 1 : 0);
                    });
                }
                $scope.clusters_diffs = response.data.clusters_diffs || [];

                // TODO remove
                $scope.queryStatus = "Request took " + (new Date() - requestTime) + "ms";

                $scope.dataOrigin = response.data.zipkin_url;

                annotateFlows(response.data.clusters_diffs);

                // The visualizations watch for these changes, rather than being called here.

            }, function errorCallback(response) {
                    $scope.queryStatus = "Failed " + JSON.stringify(response);
                    $scope.clusters_diffs = [];
            });
        }

        // Given a string like "foo=bar, baz=123" return ["foo=bar", "baz=123"]
        function parseTags(tags) {
            return tags.split(/[,;\ ]/).filter(function (s) { return s; });
        }

        function annotateFlows(flows) {
            // Explicitly set the index, so that we can retrieve the true index after sorting
            for (var nflow in flows) {
                flows[nflow].index = nflow;
            }
        }

        $scope.advanceBaseline = function(seconds) {
            var d = new Date(0);
            d.setUTCMilliseconds(Date.parse($scope.endTime)+seconds*1000);
            $scope.endTime = d.toISOString();
        }

        $scope.advanceBaselineToNow = function() {
            var d = new Date();
            $scope.endTime = d.toISOString();
        }

        $scope.advance = function(seconds) {
            var d = new Date(0);
            d.setUTCMilliseconds(Date.parse($scope.canaryEndTime)+seconds*1000);
            $scope.canaryEndTime = d.toISOString();
        }

        $scope.advanceToNow = function() {
            var d = new Date();
            $scope.canaryEndTime = d.toISOString();
        }

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
    } // TraceQueryController

    function SequenceDiagramController($scope, $log, $location, $rootScope, $http) {
        $scope.location = $location;

        $scope.clusters_diffs = [];    // Array of {root_request:, baseline_trace_ids:, cluster_stats_diff: }
        $scope.nflow = 0;        // Cursor for cluster in clusters
        $scope.ntrace = 0;        // Cursor for trace in the selected cluster
        $scope.debugUI = false;

        // Although magnification is presentation putting it in the controller makes it easy to watch etc.
        $scope.bigger = bigger;
        $scope.smaller = smaller;
        $scope.magnification = 1;

        // Although scroll is presentation putting it in the controller makes it easy to watch etc.
        $scope.up = up;
        $scope.down = down;
        $scope.start = 0;
        var scrollAmount = 5; // const

        console.log("Hello from Canary SequenceDiagramController");

        //$rootScope.$on('$locationChangeSuccess', function() {
        //    console.log("SequenceDiagramController $locationChangeSuccess triggered, $location.path()=" + $location.path());
        //    parseForFlowAndTraceno();
        //});

        $scope.$parent.$watch('clusters_diffs', function(newValue, oldValue) {
            console.log("SequenceDiagramController clusters watcher fired");
              $scope.clusters_diffs = newValue;
              $scope.start = 0;
              refreshTrace();
          });

        $scope.$watch('nflow', function() {
            console.log("SequenceDiagramController nflow watcher fired");
            $scope.start = 0;
            // TODO update URL?
              refreshTrace();
          });

        $scope.$watch('magnification', refreshTrace);
        $scope.$watch('debugUI', refreshTrace);

        $scope.$watch('start', function() {
            console.log("SequenceDiagramController start watcher fired");
            scrollTrace($scope.start);
          });

        parseForFlowAndTraceno();
        prepareChart();

        $scope.categoriesUrl = function() {
            return $location.absUrl().replace(/sequence\/flow\/[0-9]+\/trace\/[0-9]+/, 'categories');
        };

        $scope.pieUrl = function() {
            return $location.absUrl().replace(/sequence\/flow\/([0-9]+)\/trace\/[0-9]+/, 'pie/flow/$1');
        };

        $scope.dumpFlow = function () {
            console.log(JSON.stringify($scope.clusters_diffs[$scope.nflow]));
            alert(JSON.stringify($scope.clusters_diffs[$scope.nflow]));
        };

        $scope.selectedFlowTitle = function() {
            if (!$scope.clusters_diffs[$scope.nflow]) {
                return "";
            }

            return $scope.clusters_diffs[$scope.nflow].root_request;
        };

        $scope.selectedTraceId = function() {
            if (!$scope.clusters_diffs[$scope.nflow]) {
                return "";
            }

            return $scope.clusters_diffs[$scope.nflow].trace_ids[$scope.ntrace];
        }

        $scope.prevFlow = function() {
            if ($scope.nflow > 0) {
                $scope.nflow--;
            }
        }

        $scope.nextFlow = function() {
            if ($scope.nflow < $scope.clusters_diffs.length-1) {
                $scope.nflow++;
            }
        }

        function refreshTrace() {
              if ($scope.nflow >= $scope.clusters_diffs.length) {
                    showTrace({cluster_stats_diff: []}, $scope.magnification,
                            { debugUI: $scope.debugUI,
                        angularHttp: $http });
                  return;
              }

              if ($scope.$parent == null) {
                  console.error("Reached refreshTrace() with null parent");
                  return;
              }

              showTrace($scope.clusters_diffs[$scope.nflow], $scope.magnification,
                  {
                      zipkinUrl: $scope.$parent.dataOrigin,
                      debugUI: $scope.debugUI,
                      angularHttp: $http
                  });
        }

        function parseForFlowAndTraceno() {
            var ndx = $location.path().indexOf("/flow/")
            if (ndx > 0) {
                $scope.nflow = parseInt($location.path().substring(ndx+6));
            } else {
                $scope.nflow = 0;
            }

            var ndx = $location.path().indexOf("/trace/")
            if (ndx > 0) {
                $scope.ntrace = parseInt($location.path().substring(ndx+7));
            } else {
                $scope.ntrace = 0;
            }

            console.log("Parsing flow and traceno yielded " + $scope.nflow + ":" + $scope.ntrace);
            // $scope.clusters_diffs may not be ready yet.
        };

        function bigger() {
            $scope.magnification = $scope.magnification * 2;  
            $scope.start = $scope.start * 2;
        }

        function smaller() {
            $scope.magnification = Math.max(1, $scope.magnification / 2);
            $scope.start = $scope.start / 2;
        }

        function up() {
            $scope.start = Math.max(0, $scope.start - (Math.log2($scope.magnification) + 1) * scrollAmount);
        }

        function down() {
            $scope.start += (Math.log2($scope.magnification) + 1) * scrollAmount;
        }

    } // SequenceDiagramController

    function PieController($scope, $log, $location) {

        $scope.location = $location;

        $scope.clusters_diffs = [];    // Array of {root_request:, baseline_trace_ids:, cluster_stats_diff: }
        $scope.nflow = 0;        // Cursor for cluster in clusters

        console.log("Hello from Canary PieController");

        $scope.$parent.$watch('clusters_diffs', function(newValue, oldValue) {
            console.log("PieController clusters_diffs watcher fired, got newValue " + newValue + ", a " + typeof newValue);
              $scope.clusters_diffs = newValue;

              showPie();
          });

        $scope.$watch('nflow', function() {
            console.log("PieController nflow watcher fired");
            // TODO update URL?
              showPie();
          });

        $scope.prevFlow = function() {
            if ($scope.nflow > 0) {
                $scope.nflow--;
            }
        }

        $scope.nextFlow = function() {
            if ($scope.nflow < $scope.clusters_diffs.length-1) {
                $scope.nflow++;
            }
        }

        $scope.categoriesUrl = function() {
            return $location.absUrl().replace(/pie\/flow\/[0-9]+/, 'categories');
        }
        $scope.sequenceUrl = function() {
            return $location.absUrl().replace(/pie\/flow\/([0-9]+)/, 'sequence/flow/$1/trace/0');
        }

        preparePie("#pie");
        preparePie("#canaryPie");

        function showPie() {
            if (!$scope.clusters_diffs || $scope.clusters_diffs.length <= $scope.nflow) {
                return;
            }

            var selectedTrace = $scope.clusters_diffs[$scope.nflow];
            // console.log("selectedTrace is " + JSON.stringify(selectedTrace));

            // var siblingTraces = matchingTraces(traces[ntrace], traces);
            var processes = deriveProcessesFromTrace(selectedTrace);
            processes.push({id:"communication", title:"Communication", color:"black"});
            var pieData = { processes: processes, processToDuration: measureProcessAndNetworkDuration(selectedTrace, "baseline_stats") };

            setupPieDiagram(pieData, "#pie");

            var canaryPieData = { processes: processes, processToDuration: measureProcessAndNetworkDuration(selectedTrace, "canary_stats") };
            setupPieDiagram(canaryPieData, "#canaryPie");
        }

        function setupPieDiagram(data, pieID) {
            var svg = d3.select(pieID);
            if (svg.size() == 0) {
                console.log("Can't find pie " + pieID);
                return;
            }

            var width = +svg.attr("width");
            var height = +svg.attr("height");
            var radius = Math.min(width, height) / 2;
            var g = svg.select("#translatedPie");

            g.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            var path = d3.svg.arc()
                .outerRadius(radius - 10)
                .innerRadius(0);

            var label = d3.svg.arc()
                .outerRadius(radius - 80)
                .innerRadius(radius - 80);

            var pie = d3.layout.pie()
                // .sort(null)
                .value(function(d) { return data.processToDuration[d.id] || 0; });
            var pieData = pie(data.processes);

            // console.log("pieData = " + JSON.stringify(pieData));

            var aPathData = g.selectAll(".arcPath")
                .data(pieData);
            aPathData.enter()
                .append("path")
                  .attr("class", "arcPath")
            aPathData.exit().remove();
            aPathData.transition().duration(0)
                  .attr("d", path)
                .attr("fill", function(d) { return d.data.color; })

            var aTextData = g.selectAll(".processingDurationLabel")
                .data(pieData);
            aTextData.enter().append("text")
              .attr("dy", "0.35em")
              .attr("class", "processingDurationLabel")
              .attr("text-anchor", "middle")
            aTextData.exit().remove();
            aTextData.transition().duration(0)
                .text(function(d) { return d.data.title; })
                .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
                .attr("visibility", function(d) { return (d.value > 0) ? "visible" : "hidden"; });
        }

        function preparePie(pieID) {
            var svg = d3.select(pieID)
            var g = svg.append("g")
                .attr("id", "translatedPie")
            g.append("text")
                .text("No data");    // This gets covered if there is data
            return svg; 
        }

        function measureProcessAndNetworkDuration(trace, statstype) {
            var retval = {};

            // Measure processing time
            for (var timeline of trace.cluster_stats_diff) {
                retval[timeline.service] = timeline.events
                    .filter(function f(evt) { return evt.type == "process_request" || evt.type == "process_response"; })
                    .reduce(function (accum, evt) {
                        return accum + evt[statstype].duration.mean;
                    }, 0);
            }

            var communicationTime = 0;
            for (var timeline of trace.cluster_stats_diff) {
                communicationTime += timeline.events
                .filter(function f(evt) { return evt.type == "send_request" || evt.type == "send_response"; })
                    .reduce(function (accum, evt) {
                        return accum + evt[statstype].duration.mean;
                    }, 0);
            }

            retval["communication"] = communicationTime;

            console.log("durations: " + JSON.stringify(retval));

            return retval;
        }
    } // PieController

    function CategoriesController($scope, $log, $location, $window) {
          console.log("Hello from CategoriesController");

        $scope.window = $window;    // Needed for categories.html to retrieve the URL query param
        $scope.clusters_diffs = [];    // Array of {root_request:, trace_ids:, cluster_stats_diff: }

        $scope.$parent.$watch('clusters_diffs', function(newValue, oldValue) {
            // console.log("CategoriesController clusters watcher fired, got newValue " + newValue + ", a " + typeof newValue);
              $scope.clusters_diffs = newValue;
          });
    } // CategoriesController

})(window.angular);

