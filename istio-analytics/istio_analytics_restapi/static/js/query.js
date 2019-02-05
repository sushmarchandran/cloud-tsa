
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
            .when('/trace/:ntrace/sequence', {
                templateUrl: '/static/sequence.html',
                templateNamespace: 'svg',
                controller: 'SequenceDiagramController'
            })
            .when('/trace/:ntrace/pie', {
                templateUrl: '/static/pie.html',
                templateNamespace: 'svg',
                controller: 'PieController'
            })
            .when('/trace/:ntrace/categories', {
                templateUrl: '/static/categories.html',
                controller: 'CategoriesController'
            });
        });

    function TraceQueryController($scope, $timeout, $q, $log, $http, $location, $rootScope) {
        console.log("Hello from TraceQueryController");

        $scope.location = $location;
      if ($location.search()) {
          if (typeof $location.search()['start'] == "string") {
              $scope.startTime = $location.search()['start'];
          } else {
              $scope.startTime = "2017-07-06T00:00:00.0Z";    // default
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
          $scope.startTime = "2017-07-06T00:00:00.0Z";    // default
          $scope.endTime = "2017-07-31T00:00:00.0Z"; // default
          $scope.max = 500;
          $scope.nquery = 0;
      }
      $scope.queryStatus = "";
      $scope.rawTraces = null;
      $scope.dataOrigin = "";

      $scope.query = query;

      $rootScope.$on('$locationChangeSuccess', function () {
          // I had trouble listening for $scope.$on('$routeUpdate',...) and losing trace #
          if ($location.path() && $location.path().startsWith("/trace/")) {
              $scope.nquery = parseInt($location.path().substring(7));
          }
      });

      function query() {
          $scope.queryStatus = "Posting query";
          $scope.rawTraces = null;
          $scope.dataOrigin = "";
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

                // TODO remove
                $scope.queryStatus = "Request took " + (new Date() - requestTime) + "ms";

                $scope.dataOrigin = response.data.zipkin_url;

                // The visualization should watch for these changes, rather than being called here.

              }, function errorCallback(response) {
                // alert("Failed, response is " + JSON.stringify(response));
                $scope.queryStatus = "Failed " + JSON.stringify(response);
              });
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
    } // TraceQueryController

    function SequenceDiagramController($scope, $log, $location) {
        $scope.location = $location;

          console.log("Hello from SequenceDiagramController");
          var svg = prepareChart();

          $scope.$parent.$watch('rawTraces', function(newValue, oldValue) {
              console.log("SequenceDiagramController rawTraces watcher fired ");

              if (!$scope.$parent) {
                  // This seems to happen during setup of view
                  console.log("$scope has no $parent at SequenceDiagramController, ignoring rawTraces change");
                  return;
              }

            // 'traces' and 'ntrace' are globals currently -- this is a work-around for strict mode
            // See https://stackoverflow.com/questions/9397778/how-to-declare-global-variables-when-using-the-strict-mode-pragma
            var globals = (1,eval)('this');
            globals.ntrace = $scope.$parent.nquery;
            globals.raw_traces = newValue;
            if (newValue != null) {
                globals.traces = newValue.traces_timelines;

                if (globals.traces.length == 0) {
                    $scope.queryStatus = "No traces for timerange";
                    return;
                }

                showTrace(globals.traces, globals.ntrace);
            }
          });

          $scope.$parent.$watch('nquery', function(newValue, oldValue) {
              console.log("SequenceDiagramController nquery watcher fired, got newValue " + newValue + ", a " + typeof newValue);

            // 'traces' and 'ntrace' are globals currently -- this is a work-around for strict mode
            // See https://stackoverflow.com/questions/9397778/how-to-declare-global-variables-when-using-the-strict-mode-pragma
            var globals = (1,eval)('this');
            globals.ntrace = newValue;

            if (globals.traces) {
                showTrace(globals.traces, globals.ntrace);
            }
          });

        $scope.dumpFlow = function () {
            alert(JSON.stringify($scope.$parent.rawTraces.traces_timelines[$scope.$parent.nquery]));
        };

        // TODO remove
        $scope.randomizeCanary = function () {
            // Hack.  We don't have a global for the summary, so assign random
            // deltas to ALL events.
            for (var traces of $scope.$parent.rawTraces.traces_timelines) {
                for (var timeline of traces.timelines) {
                    for (var event of timeline.events) {
                        event.delta = Math.random() * 300 - 150;
                    }
                }
            }

            // Hack.  Always turning on canary indicators
            var globals = (1,eval)('this');
            globals.showCanaries = true;

            showTrace($scope.$parent.rawTraces.traces_timelines,
                    $scope.$parent.nquery);
        };
    }

    function PieController($scope, $log, $location) {
        $scope.location = $location;
          console.log("Hello from PieController");
          preparePie();

        $scope.$parent.$watch('rawTraces', function(newValue, oldValue) {
            console.log("PieController rawTraces watcher fired ");

            // 'traces' and 'ntrace' are globals currently -- this is a work-around for strict mode
          // See https://stackoverflow.com/questions/9397778/how-to-declare-global-variables-when-using-the-strict-mode-pragma
          var globals = (1,eval)('this');

          if (newValue == null) {
              globals.traces = null;
              globals.ntrace == null;
            } else {
            globals.traces = newValue.traces_timelines;
            if (globals.traces.length == 0) {
                $scope.queryStatus = "No traces for timerange";
                return;
            }

            globals.ntrace = $scope.$parent.nquery;
            }

            showPie(globals.traces, globals.ntrace);
        });

      $scope.prevTrace = prevTrace;
      $scope.nextTrace = nextTrace;

      function prevTrace() {
          // TODO Watch nquery instead of explicitly updating
        if ($scope.$parent.nquery > 0) {
            $scope.$parent.nquery--;
            showPie($scope.$parent.rawTraces.traces_timelines, $scope.$parent.nquery);
        }
      }

      function nextTrace() {
          // TODO Watch nquery instead of explicitly updating
        if ($scope.$parent.nquery < $scope.$parent.rawTraces.traces_timelines.length-1) {
            $scope.$parent.nquery++;
            showPie($scope.$parent.rawTraces.traces_timelines, $scope.$parent.nquery);
        }
      }
  }

  function CategoriesController($scope, $log, $location, $window) {
        console.log("Hello from CategoriesController");

        $scope.window = $window;    // Needed for categories.html to retrieve the URL query param

      $scope.categories = null;
      $scope.traces = null;

        $scope.$parent.$watch('rawTraces', function(newValue, oldValue) {
            console.log("CategoriesController rawTraces watcher fired ");
            if (newValue) {
                $scope.traces = newValue.traces_timelines;
                $scope.categories = categorize(newValue.traces_timelines);
            } else {
                $scope.traces = null;
                $scope.categories = null;
            }
        });

      $scope.traceAnnotations = function(categoryDetails, ntrace) {
          // If we have no statistical details, show no annotations
          if (categoryDetails.durationSummary.min == categoryDetails.durationSummary.max) {
              return "";
          }

          var duration = calculateDuration($scope.traces[ntrace]);

          var retval = "";

          // Note that the down tack and up tack don't change when bolded on OSX.

          // Show min as "down tack"
          if (duration <= categoryDetails.durationSummary.min) {
              retval += "⊤";    // or perhaps use ⫧ or ⫪
          }
          // Show max as "up tack"
          if (duration >= categoryDetails.durationSummary.max) {
              retval += "⊥"; // or perhaps use ⫨ or ⫫
          }
          
          return retval;
      }
  }
  
})(window.angular);

// TODO Move these category-specific functions into another file.

function categorize(traces) {
    /*
    return [
        {
            // StructureTitle: "GET productpage; GET details; GET ratings; GET reviews",
            StructureTitle: traceTitle(traces[0]),
            Traces: [0, 5, 10]
        }
    ];
    */
    
    var categorized = {};
    for (var ntrace in traces) {
        var tt = traceTitle(traces[ntrace]);
        var members = categorized[tt];
        if (!members) {
            members = [];
            categorized[tt] = members;
        }
        members.push(ntrace);
    }
    
    var retval = [];
    for (category in categorized) {
        var durations = categorized[category].map(function (ntrace) {
            return calculateDuration(traces[ntrace]);
        });
        retval.push({
            StructureTitle: category,
            Traces: categorized[category],
            durationSummary: summarize(durations) 
        });
    }
    
    return retval;
}

function calculateDuration(trace) {
    var requests = allEvents(trace);
    return greatestTimestamp(requests) - leastTimestamp(requests);
}

function greatestTimestamp(events) {
    return Math.max.apply(null, events.map(function (evt) { return evt.timestamp; }));
}

function leastTimestamp(events) {
    return Math.min.apply(null, events.map(function (evt) { return evt.timestamp; }));
}

function traceTitle(trace) {
    var requests = allEvents(trace)
        .filter(function (evt) { return evt.type == "send_request"; })
        .map(function (evt) {
            return {
                timestamp: evt.timestamp,
                req: evt.request.split(' ')[0] + " " + prettyProcessName(evt.interlocutor),
            }
        });
    requests.sort(function (a, b) { return a.timestamp - b.timestamp; });
    return requests.map(function (timedReq) { return timedReq.req; }).join("; ");
}

// TODO Move these pie functions elsewhere

function showPie(traces, ntrace) {
    if (!traces) {
        return;
    }
    
    var selectedTrace = traces[ntrace];
    console.log("selectedTrace is " + JSON.stringify(selectedTrace));
    
    // var siblingTraces = matchingTraces(traces[ntrace], traces);
    var processes = deriveProcessesFromTrace(selectedTrace);
    processes.push({id:"communication", title:"Communication", color:"black"});
    var sequenceData = { processes: processes, processToDuration: measureProcessAndNetworkDuration(selectedTrace) };
    
    setupPieDiagram(sequenceData);
    
    var date = new Date(getServiceTimeline(selectedTrace, getServices(selectedTrace)[0]).events[0].timestamp/1000);
    document.getElementById("traceno").textContent = ntrace.toString();
    document.getElementById("initiated").textContent = date.toLocaleString("en-US");
    
    document.getElementById("prevTrace").disabled = (ntrace <= 0);
    document.getElementById("nextTrace").disabled = (ntrace >= traces.length - 1);
}

function setupPieDiagram(data) {
    var svg = d3.select("#pie");
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
    for (var timeline of trace.timelines) {
        retval[timeline.service] = timeline.events
            .filter(function f(evt) { return evt.type == "process_request" || evt.type == "process_response"; })
            .reduce(function (accum, evt) {
                return accum + evt.duration;
            }, 0);
    }

    var communicationTime = 0;
    for (var timeline of trace.timelines) {
        communicationTime += timeline.events
        .filter(function f(evt) { return evt.type == "send_request" || evt.type == "send_response"; })
            .reduce(function (accum, evt) {
                return accum + evt.duration;
            }, 0);
    }
    
    retval["communication"] = communicationTime;
    
    return retval;
}
