
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
                templateUrl: '/static/sequence5.html',
                templateNamespace: 'svg',
                controller: 'SequenceDiagramController',
                reloadOnSearch: false,
            })
            .when('/categories', {
                templateUrl: '/static/categories5.html',
                controller: 'CategoriesController',
                reloadOnSearch: false,
            })
            .when('/pie/flow/:flow', {
                templateUrl: '/static/pie5.html',
                controller: 'PieController',
                reloadOnSearch: false,
            });
        });

    function TraceQueryController($scope, $timeout, $q, $log, $http, $location, $rootScope) {
        console.log("Hello from TraceQueryController");

        $scope.location = $location;
        $scope.queryStatus = "";
        $scope.dataOrigin = "";
        $scope.traceBackend = "";
        $scope.clusters = [];    // Array of {root_request:, trace_ids:, cluster_stats: }
        $scope.startTime = "";
        $scope.endTime = "";
        $scope.maxTraces = 500;

        $scope.query = query;

        $rootScope.$on('$locationChangeSuccess', function () {
            // I had trouble listening for $scope.$on('$routeUpdate',...) and losing trace #
            console.log("TraceQueryController $locationChangeSuccess triggered, $location.path()=" + $location.path());

            $scope.startTime = parseTime($location.search()['start']);
            $scope.endTime = parseTime($location.search()['end']);

            if ('max' in $location.search()) {
                $scope.maxTraces = parseInt($location.search()['max']);
            }
            if (parseBoolean($location.search()['auto'])) {
                query(true);
            }
        });

        function query(automatic) {
            // TODO 'query' disable button?
            $scope.queryStatus = "Posting cluster query";

            if (!automatic) {
                // See https://stackoverflow.com/questions/20884551/set-url-query-parameters-without-state-change-using-angular-ui-router
                //$state.transitionTo('search', {q: 'updated search term'}, { notify: false });
                $location.search({
                    start: $scope.startTime,
                    end: $scope.endTime,
                    max: $scope.maxTraces,
                });
            }

            var requestTime = new Date();
            $http({
                  method: 'POST',
                  url: '/api/v1/distributed_tracing/traces/timelines/clusters',
                  data: {
                      start_time: $scope.startTime,
                      end_time: $scope.endTime,
                      max: $scope.maxTraces
                  }
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.queryStatus = "";
                $scope.dataOrigin = response.data.trace_server_url;
                $scope.traceBackend = response.data.trace_backend;
                // We sort the data so that if we query again the flow # in the UI is stable
                response.data.clusters.sort(function (a, b) { 
                    return a.root_request < b.root_request ? -1 :
                        (a.root_request > b.root_request ? 1 : 0);
                });
                $scope.clusters = response.data.clusters;

                // TODO remove
                $scope.queryStatus = "Request took " + (new Date() - requestTime) + "ms";

                annotateFlows(response.data.clusters);

                // The visualizations watch for these changes, rather than being called here.

            }, function errorCallback(response) {
                    $scope.queryStatus = "Failed " + JSON.stringify(response);
                    $scope.clusters = [];
            });
        }

        function annotateFlows(flows) {
            // Explicitly set the index, so that we can retrieve the true index after sorting
            for (var nflow in flows) {
                flows[nflow].index = nflow;
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

        // Currently the only special time format we support is "NOW";
        // otherwise s must be an ISO time string
        function parseTime(s) {
            if (s && s.toUpperCase() == "NOW") {
                var d = new Date();
                return d.toISOString();
            }
            return s;
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
    } // TraceQueryController

    function SequenceDiagramController($scope, $log, $location, $rootScope) {
        $scope.location = $location;

        $scope.clusters = [];    // Array of {root_request:, trace_ids:, cluster_stats: }
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

        console.log("Hello from SequenceDiagramController");

        //$rootScope.$on('$locationChangeSuccess', function() {
        //    console.log("SequenceDiagramController $locationChangeSuccess triggered, $location.path()=" + $location.path());
        //    parseForFlowAndTraceno();
        //});

        $scope.$parent.$watch('clusters', function(newValue, oldValue) {
            console.log("SequenceDiagramController clusters watcher fired");
              $scope.clusters = newValue;
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

        $scope.dumpFlow = function () { alert(JSON.stringify($scope.clusters[$scope.nflow])); };

        $scope.selectedFlowTitle = function() {
            if (!$scope.clusters[$scope.nflow]) {
                return "";
            }

            return $scope.clusters[$scope.nflow].root_request;
        };

        $scope.selectedTraceId = function() {
            if (!$scope.clusters[$scope.nflow]) {
                return "";
            }

            return $scope.clusters[$scope.nflow].trace_ids[$scope.ntrace];
        }

        $scope.prevFlow = function() {
            if ($scope.nflow > 0) {
                $scope.nflow--;
            }
        }

        $scope.nextFlow = function() {
            if ($scope.nflow < $scope.clusters.length-1) {
                $scope.nflow++;
            }
        }

        function refreshTrace() {
              if ($scope.nflow >= $scope.clusters.length) {
                    showTrace({cluster_stats: []}, $scope.magnification,
                            { debugUI: $scope.debugUI });
                  return;
              }

              if ($scope.$parent == null) {
                  console.error("Reached refreshTrace() with null parent");
                  return;
              }

              showTrace($scope.clusters[$scope.nflow], $scope.magnification,
                  {
                      serverUrl: $scope.$parent.dataOrigin,
                      traceBackend: $scope.$parent.traceBackend,
                      debugUI: $scope.debugUI,
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
            // $scope.clusters may not be ready yet.
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

        $scope.clusters = [];    // Array of {root_request:, trace_ids:, cluster_stats: }
        $scope.nflow = 0;        // Cursor for cluster in clusters

        console.log("Hello from PieController");

        $scope.$parent.$watch('clusters', function(newValue, oldValue) {
            console.log("PieController clusters watcher fired, got newValue " + newValue + ", a " + typeof newValue);
              $scope.clusters = newValue;

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
            if ($scope.nflow < $scope.clusters.length-1) {
                $scope.nflow++;
            }
        }

        $scope.categoriesUrl = function() {
            return $location.absUrl().replace(/pie\/flow\/[0-9]+/, 'categories');
        }
        $scope.sequenceUrl = function() {
            return $location.absUrl().replace(/pie\/flow\/([0-9]+)/, 'sequence/flow/$1/trace/0');
        }

        preparePie();

        function showPie() {
            if ($scope.clusters.length <= $scope.nflow) {
                return;
            }

            var selectedTrace = $scope.clusters[$scope.nflow];
            // console.log("selectedTrace is " + JSON.stringify(selectedTrace));

            // var siblingTraces = matchingTraces(traces[ntrace], traces);
            var processes = deriveProcessesFromTrace(selectedTrace);
            processes.push({id:"communication", title:"Communication", color:"black"});
            var sequenceData = { processes: processes, processToDuration: measureProcessAndNetworkDuration(selectedTrace) };

            setupPieDiagram(sequenceData);
        }

        function setupPieDiagram(data) {
            var svg = d3.select("#pie");
            if (svg.size() == 0) {
                return;
            }

            var width = +svg.attr("width");
            var height = +svg.attr("height");
            var radius = Math.min(width, height) / 2;
            var g = d3.select("#translatedPie");

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

        function preparePie() {
            var svg = d3.select("#pie")
            var g = svg.append("g")
                .attr("id", "translatedPie")
            g.append("text")
                .text("No data");    // This gets covered if there is data
            return svg; 
        }

        function measureProcessAndNetworkDuration(trace) {
            var retval = {};

            // Measure processing time
            for (var timeline of trace.cluster_stats) {
                retval[timeline.service] = timeline.events
                    .filter(function f(evt) { return evt.type == "process_request" || evt.type == "process_response"; })
                    .reduce(function (accum, evt) {
                        return accum + evt.duration.mean;
                    }, 0);
            }

            var communicationTime = 0;
            for (var timeline of trace.cluster_stats) {
                communicationTime += timeline.events
                .filter(function f(evt) { return evt.type == "send_request" || evt.type == "send_response"; })
                    .reduce(function (accum, evt) {
                        return accum + evt.duration.mean;
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
        $scope.clusters = [];    // Array of {root_request:, trace_ids:, cluster_stats: }

        $scope.$parent.$watch('clusters', function(newValue, oldValue) {
            // console.log("CategoriesController clusters watcher fired, got newValue " + newValue + ", a " + typeof newValue);
              $scope.clusters = newValue;
          });
    } // CategoriesController

})(window.angular);

