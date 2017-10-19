// Licensed Materials - Property of IBM
// (C) Copyright IBM Corp. 2017. All Rights Reserved.
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

// See https://en.wikipedia.org/wiki/Sequence_diagram for Sequence Diagrams.
// Also see https://www.ibm.com/developerworks/rational/library/3101.html

'use strict';

//var margin = {top: 10, right: 10, bottom: 10, left: 10},    // const
var margin = {top: 0, right: 0, bottom: 0, left: 0},    // const
    width = 1200 - margin.left - margin.right,    // const
    height = 1000 - margin.top - margin.bottom;    // const
var processWidth = 100;        // Width of process boxes at the top of the UML diagram.
var processMargin = 10;        // Horizontal distance between process boxes.  (They are spaced (processWidth+processMargin) * N)
var showCanaries = true;

var processHeight = 20;    // const
var activationBoxWidth = 20;    // const
var arrowheadWidth = 5;    // const
var individualActivationRadius = 5;    // const
var tickWidth = 10;    // const
var tickMargin = 3; // const
var timeMargin = 50;    // const
var straightWhiskerMax = 200; // const
var timeScale;                // We use multiplication to scale instead of SVG transforms because they look squashed

function prepareChart() {
    var svg = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("id", "scroller")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    // These aren't really needed ... we use them to make it easier to find a particular

    // SVG element in the Elements debug view.  We could add directly to SVG.
    svg.append("g")
        .attr("id", "scale")
        .attr("transform", makeTranslation(timeMargin, processHeight));
    svg.append("g")
        .attr("id", "lifelines")
    svg.append("g")
        .attr("id", "activationBoxes")
        .attr("transform", makeTranslation(timeMargin, processHeight));
    var activationDurations = svg.append("g")
        .attr("id", "activation_durations")
        .attr("transform", makeTranslation(timeMargin, processHeight));
    var messages = svg.append("g")
        .attr("id", "messageArrows")
        .attr("transform", makeTranslation(timeMargin, processHeight));
    var returnMessages = svg.append("g")
        .attr("id", "messageResponseArrows")
        .attr("transform", makeTranslation(timeMargin, processHeight));
    var returnMessages = svg.append("g")
        .attr("id", "messageLabels")
        .attr("transform", makeTranslation(timeMargin, processHeight));
    svg.append("g")
        .attr("id", "activationMedians")
        .attr("transform", makeTranslation(timeMargin, processHeight));
    svg.append("g")
        .attr("id", "activationSelecteds")
        .attr("transform", makeTranslation(timeMargin, processHeight));
    svg.append("g")
        .attr("id", "timeoutRetries")
        .attr("transform", makeTranslation(timeMargin, processHeight));
    svg.append("g")
        .attr("id", "processRectangles");
    svg.append("g")
        .attr("id", "processRectLabels")
    svg.append("g")
        .attr("id", "debugging")
        .attr("transform", makeTranslation(timeMargin, processHeight));
    svg.append("g")
        .attr("id", "popups")
        .attr("transform", makeTranslation(timeMargin, processHeight));

    return svg;
}

function makeTranslation(timeMargin, processHeight) {

    return "translate(0 " + (timeMargin+processHeight) + ")"
}

//makeSVGTransform makes a transform for aligning text above an arrow
function makeSVGTransform(data, x1, y1, x2, y2) {
    if (isNaN(y1)) {
        throw new Error("makeSVGTransform called with y1 as NaN");
    }

    var adjacent = x2-x1;
    var opposite = y2-y1;
    var theta_rad = Math.atan2(opposite, adjacent);
    var theta_deg = (theta_rad/Math.PI*180) + (theta_rad > 0 ? 0 : 360);
    // console.log("theta_deg=" + theta_deg);
    if (theta_deg >=90 && theta_deg <= 270) {
        // We don't like upside-down text.  If the text would be upside down don't rotate it at all
        theta_deg = 0;
    }
    if (isNaN(theta_deg)) {
        console.log("NaN theta_deg; x1=" + x1 + ", y1=" + y1 + ", x2=" + x2 + ", y2=" + y2);
    }

    return "rotate(angle x y) translate(x y)"
        .replace("angle", theta_deg)
        .replace(/x/g, (x1+x2)/2-5)
        .replace(/y/g, (y1+y2)/2-5);
}

// showTrace() shows a traceSummary which is { cluster_stats_diff: [...] }
function showTrace(traceSummary, magnification, context) {
    if (traceSummary.cluster_stats_diff.length == 0) {
        clearSequenceDiagram();
        return;
    }

    annotateSummary(traceSummary);
    var allEvents = orderEvents(traceSummary);
    var processes = deriveProcessesFromTrace(traceSummary);
    var sequenceData = {
            processes: processes,
            events: allEvents,
            zipkinUrl: context.zipkinUrl,
            debugUI: context.debugUI,
    };

    setupSequenceDiagram(sequenceData, magnification);
}

function scrollTrace(scrollAmt) {
    d3.select("#scroller")
        .attr("transform",
                "translate(" + margin.left + "," + (margin.top - scrollAmt) + ")");

    d3.select("#processRectangles")
        .attr("transform",
            "translate(0 " + scrollAmt + ")");
    d3.select("#processRectLabels")
        .attr("transform",
            "translate(0 " + scrollAmt + ")");
}

// Prepare a summary by denormalizing
function annotateSummary(traceSummary) {
    for (var timeline of traceSummary.cluster_stats_diff) {
        for (var event of timeline.events) {
            event.service = timeline.service;
        }
    }
}

// orderEvents() adds .start and .complete to each event.

// These are timestamps relative to 0 for the whole trace, based on median time of previous events.
function orderEvents(trace) {

    var events = trace.cluster_stats_diff.reduce(function (accumulator, timeline) { return accumulator.concat(timeline.events); }, []);

    // sort by sequence number
    events.sort(function (a, b) { return a.canary_stats.global_event_sequence_number - b.canary_stats.global_event_sequence_number; });

    // Remember the previous send_request for each service
    var requests = {};

    // Remember the send_request for each span
    //var spans = {}

    // Using the median data from canary stats
    var ver = "canary_stats";

    var basetime = 0;
    for (var i in events) {
        //console.log("setting next/start/complete for " + events[i].service + "/"
         //       + events[i].type + " " + events[i].request + " which has "
         //       + events[i].timeout_count + " timeout(s)");

        //events[i].nextEvent = events[i+1];
        //events[i].prevEvent = events[i-1];

        if (events[i].type == "send_request") {
            requests[events[i].service] = events[i];
            // spans[events[i].span_id] = events[i];
        }

        //if (events[i].timeout && events[i].type == "process_response") {
        //    // When we are processing as a result of timing out, the start time
        //    // should be the timeout median after the previous send_request from the same service.
        //    basetime = requests[events[i].service].start + events[i].timeout.median;
        //}

        //if (events[i].type == "process_request") {
        //    // Set the basetime/start from the send_request's stop time.
        //    if (spans[events[i].span_id] == undefined) {
        //        throw new Error("Expected to find span " + events[i].span_id + " but the only spans are " + JSON.stringify(Object.keys(spans)));
        //    }
        //    basetime = spans[events[i].span_id].complete;
        //}

        events[i].start = basetime;
        events[i].complete = basetime + events[i].canary_stats.duration.median;
        if (events[i][ver].duration.median < 0) {
            console.log("Warning: negative duration for event " + JSON.stringify(events[i]));
        }

        basetime = basetime + events[i][ver].duration.median;

        //console.log("Set start to " + events[i].start + " for " + events[i].service + "/"

        //        + events[i].type + " " + events[i].request);
    }

    return events;
}

//Returns an array of {id:"productpage", title:"productpage", color:"purple"}
function deriveProcessesFromTrace(trace) {
    // console.log("messages is " + JSON.stringify(messages));

    var defaultColors = ["purple", "red", "gold", "navy"];
    var processes = getServices(trace);

    var internalServices = trace.cluster_stats_diff.map(function (t) { return t.service; });

    return processes.map(function(process, index) {
        return {id: process, title: prettyProcessName(process),
            color: defaultColors[index%defaultColors.length],
            external: internalServices.indexOf(process) < 0
        };
    });
}

function getServices(trace) {
    if (!trace.cluster_stats_diff) {
        throw new Error("trace has no cluster_stats_diff: " + JSON.stringify(trace));
    }

    // Get all of the services that have timelines
    var retval = trace.cluster_stats_diff.map(function (t) { return t.service; });

    // Sort by earliest timestamp
    retval.sort(function (a, b) {
        return getServiceTimeline(trace, a).events[0].start - getServiceTimeline(trace, b).events[0].start;
    });

    // Add in the interlocutors that lack timelines
    // console.log("trace.cluster_stats_diff = " + JSON.stringify(trace.cluster_stats_diff));
    for (var timeline of trace.cluster_stats_diff) {
        // console.log("timeline.events = " + JSON.stringify(timeline.events));
        for (var event of timeline.events) {
            if (retval.indexOf(event.interlocutor) < 0) {
                retval.push(event.interlocutor);
            }
        }
    }

    return retval;
}

function prettyProcessName(host) {
    if (typeof host != "string") {
        throw new Error("'host' must be a string but got " + JSON.stringify(host));
    }

    // Is this a numeric IP?  If so, use it unchanged
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(host)) {
        return host;
    }

    // In the interest of space chop off the namespace and domain name
    return  host.split('.')[0];
}

function getServiceTimeline(trace, service) {
    var retval = trace.cluster_stats_diff.find(function (t) { return t.service == service; });
    if (retval) {
        return retval;
    }

    // Create a dummy empty timeline for interlocutors that lack an entry.
    return { service: service, events: []};
}

function setupSequenceDiagram(data, magnification) {
    timeScale = 1 / (greatestTime(data.events) / height) * 0.3 * magnification;
    console.log("timeScale is " + timeScale);
    if (!isFinite(timeScale)) {
        // This sometimes happens if there is null duration on every event
        timeScale = 1 * 0.3 * magnification;
    }

    addScale(data)

    // UML process diagram process box for each process/microservice
    addProcesses(data);

    addActivations(data);

    addDurations(data);

    addCommunication(data);

    addCanaryIndicators(data);

    if (data.debugUI) {
        addDebugging(data);
    } else {
        d3.select("#debugging")
             .selectAll(function() { return this.childNodes; })
             .remove();
    }
}

function greatestTime(events) {
    if (!Array.isArray(events)) {
        throw new Error("events must be an array but it is a " + typeof events);
    }
    return Math.max.apply(null, events.map(function (evt) { return evt.complete; }));
}

function addScale(data) {
    // inspired by Paul Heckbert, "Nice Numbers for Graph Labels" from _Graphics Gems_, Academic Press, 1990

    // We want to show about 10 ticks
    var ntick = 10;  // desired tickmarks

    var min = 0;
    var max = greatestTime(data.events);

    // Math.max() is -Infinity, and this happens if we have no data.  Remove the scale.
    if (max == -Infinity) {
        d3.select("#scale").selectAll(".scaleTick").remove();
        return;
    }

    if (max <= 0) {
        console.log("Max problem; max=" + max);
        max = 500;
    }

    /* we expect min!=max */
    var range = nicenum(max-min, false);
    var delta = nicenum(range/(ntick-1), true);        // increment
    var graphmin = Math.floor(min / delta) * delta;
    var graphmax = Math.ceil(max / delta) * delta;

    function tickPosition(_d, i) {
        return (i * delta + min) * timeScale;
    }

    var dummy = new Array(Math.ceil((max + 0.5 * delta - min) / delta));    // dummy array entry for each tick we want to see

    // Ticks
    var scaleTicks = d3.select("#scale")
        .selectAll(".scaleTick")
        .data(dummy);
    scaleTicks.enter().append("line")
        .attr("class", "scaleTick")
        .attr("x2", tickWidth)
    scaleTicks.exit().remove();
    scaleTicks.transition().duration(0)
        .attr("y1", tickPosition)
        .attr("y2", tickPosition);

    // Labels for ticks
    var tickLables = d3.select("#scale")
        .selectAll(".tickLabel")
        .data(dummy);
    tickLables.enter().append("text")
        .attr("class", "tickLabel")
        .attr("x", tickWidth + tickMargin)
        .attr("alignment-baseline", "middle");
    tickLables.exit().remove();
    tickLables.transition().duration(0)
        //.text(function (_d, i) { return (i * delta).toFixed(nfrac); })
        .text(function (_d, i) { return prettyMicroseconds(i * delta, max); })
        .attr("y", tickPosition)
}

function addProcesses(data) {

    // UML process diagram process box for each process/microservice
    var processes = d3.select("#processRectangles")
        .selectAll(".processRect")
        .data(data.processes);
    processes.exit().remove();
    processes.enter().append("rect")
            .attr("class", "processRect")
            .attr("x", function(d, i) { return i * (processWidth+processMargin); })
            .attr("y", 0)
            .attr("width", processWidth)
            .attr("height", processHeight)
    processes.transition().duration(0)
            .attr("fill", function(d) { return d.external ? "none" : d.color; })
            .attr("stroke", function(d) { return d.external ? d.color : ""; });

    // Labels for each process/microservice box
    var processLabels = d3.select("#processRectLabels")
    .selectAll(".processLabel")
    .data(data.processes);
    processLabels.enter().append("text")
        .attr("class", "processLabel")
        .attr("x", function(d, i) { return i * (processWidth+processMargin) + processWidth/2; })
        .attr("y", processHeight / 2)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");
    processLabels.exit().remove();
    processLabels.transition().duration(0)
        .text(function(d) { return d.title; })
        .attr("fill", function (d) { return d.external ? "black" : "white"; });

    // UML process diagram lifelines for each process/microservice box
    var lifelines = d3.select("#lifelines")
    .selectAll(".lifeline")
    .data(data.processes);
    lifelines.enter().append("line")
        .attr("class", "lifeline")
        .attr("x1", function(d, i) { return (i + 0.5) * (processWidth+processMargin); })
        .attr("x2", function(d, i) { return (i + 0.5) * (processWidth+processMargin); })
        .attr("y1", processHeight)
        .attr("y2", height * 100)
        .attr("stroke", "black")
        .attr("stroke-dasharray", "5,5");
    lifelines.exit().remove();
}

function clearSequenceDiagram() {
    setupSequenceDiagram({ processes: [], events: [] });
}

function addCommunication(data) {
    var requests = data.events.filter(function f(evt) { return evt.type == "send_request"; });

    function outgoingProcessBoxEdge(d) {
        var xSource = lifelineX(data, source(d));
        var xTarget = lifelineX(data, target(d));
        if (xSource < xTarget) {
            return xSource + activationBoxWidth/2;
        }
        return xSource - activationBoxWidth/2;
    }

    function incomingProcessBoxEdge(d) {
        var xSource = lifelineX(data, source(d));
        var xTarget = lifelineX(data, target(d));
        if (xSource < xTarget) {
            return xTarget - activationBoxWidth/2 - arrowheadWidth;
        }
        return xTarget + activationBoxWidth/2 + arrowheadWidth;
    }

    // TODO: if source and target are the same, draw an S-shaped spline instead of simple line.
    var messageArrows = d3.select("#messageArrows")
    .selectAll(".message")
    .data(requests);
    messageArrows.enter().append("line")
        .on("click", function(d) {
            alert("Debug: This is global event " + d.canary_stats.global_event_sequence_number); // TODO remove
        })
        .attr("class", "message");
    messageArrows.exit().remove();
    // TODO x1 and x2 are incorrect if x1 > x2
    messageArrows.transition().duration(0)
        .attr("x1", outgoingProcessBoxEdge)
        .attr("x2", incomingProcessBoxEdge)
        .attr("y1", function(d) { return d.start * timeScale; })
        .attr("stroke", function (d) { return d.timeout ? "lightblue" : "black"; })
        .attr("marker-end", function (d) { return d.timeout ? "url(#SolidTimeoutArrowhead)" : "url(#SolidArrowhead)"; })
        .attr("y2", function(d) { return d.complete * timeScale; })
        .attr("visibility", function(d) { return (source(d) != target(d)) ? "visible" : "hidden"; });

    // Some messages (e.g. DLaaS health checks) have the same source and target.
    var selfRequests = requests.filter(function f(d) { return source(d) == target(d); });
    for (var selfRequest of selfRequests) {
        selfRequest.lifelineX = lifelineX(data, selfRequest.service);
    }
    var messageArrows = d3.select("#messageArrows")
        .selectAll(".selfMessage")
        .data(selfRequests);
    messageArrows.enter().append("polyline")
        .on("click", function(d) {
            alert("Debug: This is global event " + d.canary_stats.global_event_sequence_number); // TODO remove
        })
        .attr("class", "selfMessage");
    messageArrows.exit().remove();
    messageArrows.transition().duration(0)
        .attr("points", selfRequestPoints)
        .attr("stroke", function (d) { return d.timeout ? "lightblue" : "black"; })
        .attr("marker-end", function (d) { return d.timeout ? "url(#SolidTimeoutArrowhead)" : "url(#SolidArrowhead)"; })

    var messageLabels = d3.select("#messageLabels")
    .selectAll(".messageLabel")
    .data(requests);
    messageLabels.enter().append("text")
        .attr("class", "messageLabel")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", messageLabelFillColor)
        .on("mouseleave", function(d, i) {
            d3.select("#popups").selectAll(".messageLabelDetails").remove();
        });
    messageLabels.exit().remove();
    messageLabels.transition().duration(0)
        .text(function(d) { return d.request; })
        .each(function (d) {
            // We can't do transition().on() so we use each() and do the on() there.
            // This is because 'data' is a closure and will be stale if we set on()
            // during enter().
            d3.select(this)
                .on("mouseenter", function(d2) {
                    var t = d3.select("#popups").append("text")
                    .attr("class", "messageLabelDetails")
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "middle")
                    .attr("fill", "black")
                    .attr("filter", "url(#LabelBackground)")
                    t.append("tspan").attr("x", 0).attr("dy", "1.2em").text(
                            "{5number} vs {canary_5number}"
                            .replace("{5number}", textFiveNumberSummary(d.baseline_stats.duration))
                            .replace("{canary_5number}", textFiveNumberSummary(d.canary_stats.duration))
                            )
                    t.append("tspan").attr("x", 0).attr("dy", "1.2em").text("{count} vs {canary_count} request(s)"
                            .replace("{count}", d.baseline_stats.event_count)
                            .replace("{canary_count}", d.canary_stats.event_count)
                            )
                    t.append("tspan").attr("x", 0).attr("dy", "1.2em").text("{error_count} vs {canary_error_count} error(s)"
                            .replace("{error_count}", d.baseline_stats.error_count)
                            .replace("{canary_error_count}", d.canary_stats.error_count)
                            )
                    t.append("tspan").attr("x", 0).attr("dy", "1.2em").text("{timeout_count} vs {canary_timeout_count} timeout(s)"
                            .replace("{timeout_count}", d.baseline_stats.timeout_count)
                            .replace("{canary_timeout_count}", d.canary_stats.timeout_count)
                            )
                    t.append("tspan").attr("x", 0).attr("dy", "1.2em").text("{retry_count} vs {canary_retry_count} retry(ies)"
                            .replace("{retry_count}", d.baseline_stats.retry_count)
                            .replace("{canary_retry_count}", d.canary_stats.retry_count)
                            )
                    t.attr("transform", function(innerd) {
                        return makeSVGTransform(
                                data,
                                outgoingProcessBoxEdge(d),
                                d.start * timeScale + 2,
                                incomingProcessBoxEdge(d),
                                d.complete * timeScale + 2
                                );
                    });
                });
        })
        .attr("transform", function(d) {
            return makeSVGTransform(
                    data,
                    lifelineX(data, source(d))+activationBoxWidth/2,
                    d.start * timeScale,
                    lifelineX(data, target(d))-activationBoxWidth/2,
                    d.complete * timeScale
                    );
        });

    var responses = data.events.filter(function f(evt) { return evt.type == "send_response"; });

    var returnMessages = d3.select("#messageResponseArrows")
    .selectAll(".returnMessage")
    .data(responses);
    returnMessages.enter().append("line")
        .attr("class", "returnMessage")
        .attr("stroke", "black")
        .attr("stroke-dasharray", "2,2")
        .on("click", function(d) {
            alert("Debug: This is global event " + d.canary_stats.global_event_sequence_number); // TODO remove
        })
        .attr("marker-end", "url(#OpenArrowhead)");
    returnMessages.exit().remove();
    returnMessages.transition().duration(0)
        .attr("x1", outgoingProcessBoxEdge)
        .attr("x2", incomingProcessBoxEdge)
        .attr("y1", function(d) { return d.start * timeScale; })
        .attr("y2", function(d) { return d.complete * timeScale; })
        .attr("visibility", function(d) { return d.response_code != "0" ? "visible" : "hidden"; });

    // TODO use a transform so that we can draw at cs and it gets moved below processHeight and scaled
    var messageLabels = d3.select("#messageResponseArrows")
    .selectAll(".messageLabel")
    .data(responses);
    messageLabels.enter().append("text")
        .attr("class", "messageLabel")
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .on("mouseleave", function(d, i) {
            d3.select("#popups").selectAll(".messageLabelDetails").remove();
        })
    messageLabels.exit().remove();
    messageLabels.transition().duration(0)
        .text(function(d) { return responseCodes(d); })
        .each(function (d) {
            // We can't do transition().on() so we use each() and do the on() there.
            // This is because 'data' is a closure and will be stale if we set on()
            // during enter().
            d3.select(this)
                .on("mouseenter", function(d2) {
                    var t = d3.select("#popups").append("text")
                    .attr("class", "messageLabelDetails")
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "middle")
                    .attr("filter", "url(#LabelBackground)")
                    .attr("fill", "black")
                    t.append("tspan").attr("x", 0).attr("dy", "1.2em").text(
                            "{dur} vs {canaryDur}"
                            .replace("{dur}", textFiveNumberSummary(d.baseline_stats.duration))
                            .replace("{canaryDur}", textFiveNumberSummary(d.canary_stats.duration))
                    )
                    t.append("tspan").attr("x", 0).attr("dy", "1.2em").text(
                            "{count} vs {canaryCount} request(s)"
                            .replace("{count}", d.baseline_stats.event_count)
                            .replace("{canaryCount}", d.canary_stats.event_count)
                    )
                    t.attr("transform", function(innerd) {
                        return makeSVGTransform(
                                data,
                                lifelineX(data, target(d))+activationBoxWidth/2,
                                d.complete * timeScale + 2,
                                lifelineX(data, source(d))-activationBoxWidth/2,
                                d.start * timeScale + 2
                                );
                    });
                });
        })
        .attr("transform", function(d) {
            return makeSVGTransform(
                    data,
                    lifelineX(data, target(d))+activationBoxWidth/2,
                    d.complete * timeScale + 4,
                    lifelineX(data, source(d))-activationBoxWidth/2,
                    d.start * timeScale + 4
                    );
        });
}

/** Show if processing time improved/same or got worse */
function addCanaryIndicators(data) {

    var activations = data.events.filter(function f(evt) { return evt.type == "process_request" || evt.type == "process_response"; });

    var canaryIndicators = d3.select("#activationSelecteds")
        .selectAll(".canaryIndicatorNeedle")
        .data(activations);
    canaryIndicators.enter().append("polygon")
        .attr("class", "canaryIndicatorNeedle")
        .on("mouseenter", function(d) {
            // Add class so that the apperance changes when we mouseover
            var activation = d3.select(this);
            activation.classed("canarySelectedMouseover", true);

            // Add a label
            var t = d3.select("#popups").append("text")
                .attr("class", "canaryNeedleDetails")
                .attr("alignment-baseline", "middle")
                .attr("fill", "black")
                .attr("x", lifelineX(data, source(d)))
                .attr("y", (d.complete + d.start)/2 * timeScale)
                .text(function (d2) {
                    return getNeedleCaption(d.delta.duration, "μs");
                });
        })
        .on("mouseleave", function(d, i) {
            // Remove class to restore original appearance
            d3.select(this).classed("canarySelectedMouseover", false);

            // Remove the label
            d3.select("#popups").selectAll(".canaryNeedleDetails").remove();
        });
    canaryIndicators.exit().remove();
    canaryIndicators.transition().duration(0)
        .attr("points", "0,-20 -2,20, 2,20")
        .attr("visibility", function(d) { return showCanaries ? "visible" : "hidden"; })
        .attr("fill", function (d) { return colorFromDecision(d.delta.duration); })
        .attr("transform", function(d) {
            var theta_deg = getNeedleAngle(d.delta.duration);
            return "rotate(angle x y) translate(x y)"
                .replace("angle", theta_deg)
                .replace(/x/g, lifelineX(data, source(d)))
                .replace(/y/g, (d.complete + d.start)/2 * timeScale); 
        });

    var responses = data.events.filter(function f(evt) { return evt.type == "send_response"; });

    // TODO add labels for these

    var canaryIndicators = d3.select("#activationSelecteds")
        .selectAll(".canaryResponseNeedle")
        .data(responses);
    canaryIndicators.enter().append("polygon")
        .attr("class", "canaryResponseNeedle")
        .on("mouseenter", function(d) {
            // Add class so that the apperance changes when we mouseover
            var activation = d3.select(this);
            activation.classed("canarySelectedMouseover", true);

            // Add a label
            var t = d3.select("#popups").append("text")
                .attr("class", "canaryNeedleDetails")
                .attr("alignment-baseline", "middle")
                .attr("fill", "black")
                .attr("x", (lifelineX(data, source(d)) + lifelineX(data, target(d))) / 2)
                .attr("y", (d.complete + d.start)/2 * timeScale)
                .text(function (d2) { return getNeedleCaption(d.delta.error_count, " errors"); });
        })
        .on("mouseleave", function(d, i) {
            // Remove class to restore original appearance
            d3.select(this).classed("canarySelectedMouseover", false);

            // Remove the label
            d3.select("#popups").selectAll(".canaryNeedleDetails").remove();
        });
    canaryIndicators.exit().remove();
    canaryIndicators.transition().duration(0)
        .attr("points", "0,-20 -2,20, 2,20")
        .attr("visibility", function(d) { return showCanaries ? "visible" : "hidden"; })
        .attr("fill", function (d) { return colorFromDecision(d.delta.error_count); })
        .attr("transform", function(d) {
            var theta_deg = getNeedleAngle(d.delta.error_count);
            return "rotate(angle x y) translate(x y)"
                .replace("angle", theta_deg)
                .replace(/x/g, (lifelineX(data, source(d)) + lifelineX(data, target(d))) / 2)
                .replace(/y/g, (d.complete + d.start)/2 * timeScale); 
        });
}

function addDebugging(data) {
    var activations = data.events.filter(function f(evt) { return evt.type == "process_request" || evt.type == "process_response"; });
    var communication = data.events.filter(function f(evt) { return evt.type == "send_request" || evt.type == "send_response"; });

    var activationSequence = d3.select("#debugging")
        .selectAll(".sequenceActivation")
        .data(activations);
    activationSequence.enter().append("text")
        .attr("class", "sequenceActivation")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");
    activationSequence.exit().remove();
    activationSequence.transition().duration(0)
        .attr("x", function(d) { return d.lifelineX; })
        .attr("y", function(d) { return timeScale * (d.start + d.complete) / 2.0; })
        .text(function (d, i) { return d.canary_stats.global_event_sequence_number; })

    var communicationSequence = d3.select("#debugging")
        .selectAll(".sequenceCommunication")
        .data(communication);
    communicationSequence.enter().append("text")
        .attr("class", "sequenceCommunication")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle");
    communicationSequence.exit().remove();
    communicationSequence.transition().duration(0)
        .attr("x", function(d) { return (lifelineX(data, source(d)) + lifelineX(data, target(d))) / 2.0; })
        .attr("y", function(d) { return timeScale * (d.start + d.complete) / 2.0; })
        .text(function (d, i) { return d.canary_stats.global_event_sequence_number; })
}

function colorFromDecision(canaryScore) {
    // TODO currently we aren't getting a decision or # of points, so we can't
    // show the case of insufficient data.
    // return "black";
    // Note that delta_mean_percentage isn't a percentage.  1.00 is 100%
    if (canaryScore.delta_mean_percentage < -0.33) {
        return "red";
    }
    return "green";
}

function getNeedleAngle(canaryScore) {
    var theta_deg = Math.max(Math.min(canaryScore.delta_mean_percentage * 100 || 0, 80), -80);
    if (isNaN(theta_deg)) {
        console.warn("NaN theta_deg; canaryScore.delta_mean_percentage=" + canaryScore.delta_mean_percentage);
        theta_deg = 0;
    }
    return theta_deg;
}

function getNeedleCaption(canaryScore, units) {
    return "{decision} {percentage}% {rawdelta}{units} (std dev {sdpct}% {rawsd}) based on {basecnt},{canarycnt} points"
        .replace("{decision}", canaryScore.decision || "") // TODO remove the || ""
        .replace("{percentage}", (canaryScore.delta_mean_percentage*100 || 0).toFixed())
        .replace("{rawdelta}", (canaryScore.delta_mean || 0).toFixed())
        .replace("{units}", units)
        .replace("{sdpct}", (canaryScore.delta_stddev_percentage*100 || 0).toFixed())
        .replace("{rawsd}", (canaryScore.delta_stddev || 0).toFixed())
        .replace("{basecnt}", canaryScore.baseline_data_points)
        .replace("{canarycnt}", canaryScore.canary_data_points);
}


//nicenum() finds a "nice" number approximately equal to x.  If `round` is `true` rounds, otherwise takes ceiling.
function nicenum(x, round) {
    // inspired by Paul Heckbert, "Nice Numbers for Graph Labels" from _Graphics Gems_, Academic Press, 1990

    var expv = Math.floor(Math.log10(x));    // exponent of x
    var f = x/Math.pow(10., expv);            // fractional part of x; between 1 and 10
    var nf;                                    // nice, rounded fraction

    if (round)
        if (f<1.5) nf = 1;
        else if (f<3) nf = 2;
        else if (f<7) nf = 5;
        else nf = 10;
    else
        if (f<=1) nf = 1;
        else if (f<=2) nf = 2;
        else if (f<=5) nf = 5;
        else nf = 10;

    return nf * Math.pow(10, expv);
}

function prettyMicroseconds(ms, msOfLargest) {
    if (ms==null) {
        return "null";
    }

    // If we get a second parameter, format the first using the units of the second
    if (typeof msOfLargest == "undefined") {
        msOfLargest = ms;
    }

    if (msOfLargest < 1000) {
        return ms.toFixed() + "μs";    // We use toFixed(), which isn't needed for Zipkin data, to be general
    }
    if (msOfLargest < 1000000) {
        return (ms/1000).toFixed() + "ms";
    }
    return (ms/1000000).toFixed(1) + "s";
}

function addActivations(data) {
    var activations = data.events.filter(function f(evt) { return evt.type == "process_request" || evt.type == "process_response"; });

    // Add a lifeline for each activation, so that Javascript doesn't need to keep data in a closure
    for (var activation of activations) {
        activation.lifelineX = lifelineX(data, activation.service);
    }

    var activationBoxes = d3.select("#activationBoxes")
        .selectAll(".activationBox")
        .data(activations);
    activationBoxes.enter().append("rect")
        .attr("class", "activationBox")
        .attr("width", activationBoxWidth)
        .on("click", function(d) {
            alert("Debug: This is global event " + d.canary_stats.global_event_sequence_number); // TODO remove
        })
        .on("mouseenter", showActivation)
        .on("mouseleave", hideActivation);
    activationBoxes.exit().remove();
    // (Note that transition().duration(0) does nothing and should be removed throughout this code if we don't use it.)
    activationBoxes.transition()
        .duration(0)
            .attr("x", function(d) { return lifelineX(data, source(d)) - activationBoxWidth/2; })
            .attr("y", function(d) { return timeScale * d.start; })
            .attr("fill", function(d) { return d.timeout ? "lightblue": "orange"; })
            .attr("height", function(d) { return timeScale * (d.complete - d.start); });

    var activationMedians = d3.select("#activationMedians")
    .selectAll(".activationMedianLine")
    .data(activations);
    activationMedians.enter().append("line")
        .attr("class", "activationMedianLine")
    activationMedians.exit().remove();
    activationMedians.transition().duration(0)
        .attr("stroke", "white")
        .attr("x1", function(d, i) { return lifelineX(data, source(d)) - activationBoxWidth/2; })
        .attr("x2", function(d, i) { return lifelineX(data, source(d)) + activationBoxWidth/2; })
        .attr("y1", scaledBoxMedian)
        .attr("y2", scaledBoxMedian);

    var activationDurations = d3.select("#activation_durations")
    .selectAll(".executionDurationLabel")
    .data(activations);
    activationDurations.enter().append("text")
        .attr("class", "executionDurationLabel")
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", "middle")
        .attr("id", function (d, i) { return "executionDurationLabel" + i; });
    activationDurations.exit().remove();
    activationDurations.transition().duration(0)
        .text(function(d) { return prettyMicroseconds(d.complete - d.start); })
        .attr("x", function(d) { return lifelineX(data, source(d)) + activationBoxWidth/2+5; })
        .attr("y", function(d) { return (d.complete + d.start)/2 * timeScale; })
        .attr("fill", function (d) { return d.mouseActivate ? "black": ""; })
        .attr("transform", function(d) {
            return "rotate(90 x y)"
                .replace("x", lifelineX(data, source(d)) + activationBoxWidth/2+5)
                .replace("y", (d.complete + d.start)/2 * timeScale);

        })
        .attr("visibility", function(d) { return ((d.complete - d.start) > 1000) ? "visible" : "hidden"; });

}

function addDurations(data) {
    var activations = data.events.filter(function f(evt) { return evt.type == "process_request" || evt.type == "process_response"; });

    // Durations have {lifelineX:, y:}
    var durations = [];
    for (var activation of activations) {

        if (!activation.canary_stats.durations_and_codes) {
            continue;
        }

        var ver = "canary_stats";
        for (var i in activation[ver].durations_and_codes) {
            var durAndCode = activation[ver].durations_and_codes[i];
            durations.push({
                lifelineX: activation.lifelineX,

                y: toScaledBox(activation, durAndCode.duration),
                responseCode: durAndCode.response_code,
                traceId: activation[ver].trace_ids[i],
                url: data.zipkinUrl + "/zipkin/traces/" + activation[ver].trace_ids[i],
                sequenceNumber: activation[ver].global_event_sequence_number
            });
        }
    }

    var durationsCircles = d3.select("#activation_durations")
        .selectAll(".duration")
        .data(durations);
    durationsCircles.enter().append("circle")
        .attr("class", "duration")
        .attr("r", individualActivationRadius)
        .style("opacity", 0.5)
        .on("click", function(d) {
            var win = window.open(d.url, '_blank');
            win.focus();
        });
    durationsCircles.exit().remove();
    durationsCircles.transition().duration(0)
            .attr("fill", function(d) { return responseCodeToColor(d.responseCode); })
            .attr("cx", function(d) { return d.lifelineX; })
            .attr("cy", function(d) { return d.y; });
}

function toScaledBox(d, x) {
    if (typeof x === "undefined") {
        throw new Error("toScaledBox() got undefined x");
    }

    var ver = "canary_stats";

    var retval;
    if (d[ver].duration.third_quartile == d[ver].duration.first_quartile) {
        if (x < d[ver].duration.first_quartile) {
            factor = (x - d[ver].duration.first_quartile) / d[ver].duration.median;
            retval = (d.start + factor * d[ver].duration.median) * timeScale;
        } else if (x > d[ver].duration.third_quartile) {
            factor = (x - d[ver].duration.third_quartile) / d[ver].duration.median;
            retval = (d.complete + factor * d[ver].duration.median) * timeScale;
        } else { // x == first_quartile == median == third_quartile
            retval = (d.start+d.complete)/2 * timeScale;
        }
    } else {
        var factor = (x - d[ver].duration.first_quartile)/(d[ver].duration.third_quartile - d[ver].duration.first_quartile);

        if (isNaN(factor)) {
            console.log("toScaledBox() failed to calculate factor; x=" + x + ", d[ver].duration=" + JSON.stringify(d[ver].duration));
        }

        retval = (d.start + factor * d[ver].duration.median) * timeScale;
    }

    if (isNaN(retval)) {
        console.log("toScaledBox() failed; d.start=" + d.start + ", factor=" + factor + ", d[ver].duration.median=" + d[ver].duration.median);
    }

    return retval;
}

// TODO support baseline and canary
function scaledBoxMedian(d) { return toScaledBox(d, d.canary_stats.duration.median);  }

function showActivation(d, i) {
    var durationsCircles = d3.select("#activation_durations")
        .selectAll(".duration")
        .filter(function(dur) { return dur.sequenceNumber == d.canary_stats.global_event_sequence_number; })
        .classed("durationHighlighted", true);
}

function hideActivation(d, i) {
    var durationsCircles = d3.select("#activation_durations")
        .selectAll(".duration")
        .classed("durationHighlighted", false);
}

//Give a process name, return the X coordinate of its lifeline
function lifelineX(data, processName) {
    if (!processName) {
        throw new Error("missing processName");
    }

    var index = data.processes.findIndex(function(ele) { return ele.id == processName; });
    return (index + 0.5) * (processWidth+processMargin);
}

function source(event) {
    var retval = event.service;
    // console.log(retval + " is the source of " + JSON.stringify(event));
    return retval;
}

function target(event) {
    var retval = event.interlocutor;
    // console.log(retval + " is the target of " + JSON.stringify(event));
    return retval;
}

function textFiveNumberSummary(details) {
    // By passing max with the desired number we ensure the units are the same on all examples
    var retval = "{min} {first_quartile} {median} {third_quartile} {max}"
        .replace("{min}", prettyMicroseconds(details.min, details.max))
        .replace("{first_quartile}", prettyMicroseconds(details.first_quartile, details.max))
        .replace("{median}", prettyMicroseconds(details.median, details.max))
        .replace("{third_quartile}", prettyMicroseconds(details.third_quartile, details.max))
        .replace("{max}", prettyMicroseconds(details.max));

    return retval;
}

// Generate points for a polyline from self to self that looks like a UML process diagram
// activation box sending a message to the same process.
function selfRequestPoints(d) {
    // ---
    //    |
    // <--

    var retval = "x1,y1, x2,y1, x2,y2, x1,y2"
        .replace(/x1/g, d.lifelineX + activationBoxWidth/2)
        .replace(/x2/g, d.lifelineX + activationBoxWidth/2 + 10)
        .replace(/y1/g, d.start * timeScale)
        .replace(/y2/g, d.complete * timeScale);
    return retval;
}

// Draw a whisker line, optionally with an indication that it is long and has been shortened
function boxplotPolylinePoints(longline, x, start, finish) {
    var retval;

    if (longline) {

        // Draw a long line break
        //
        //  | x, y1
        //  |
        //   - xp, yb1 AKA x + width, y1 + .45*(y2-y1)
        //  /
        // -   xm, yb2 AKA y - width, y1 + .55*(y2-y1)/3
        //  |
        //  | x, y2

        var width = 5;
        //var str = "x,y1 x,yb1 xp,yb1 xm,yb2 x,yb2 x,y2";
        var str = "x,y1, x,yb1, xp,yb1, xm,yb2, x,yb2, x,y2";
        var y1 = start, y2 = finish;
        var retval = str.replace(/y1/g, start).replace(/y2/g, finish)
            .replace(/xp/g, x+width).replace(/xm/g, x-width)
            .replace(/yb1/g, y1+.45*(y2-y1)).replace(/yb2/g, y1+.55*(y2-y1))
            .replace(/x/g, x);
    } else {

        // Finish is fine, no need to make a long line break
        var str = "x,y1 x,y2";
        var retval = str.replace(/x/g, x).replace("y1", start).replace("y2", finish);
    }

    // console.log("boxplotPolylinePoints returning " + retval);
    return retval;
}

// TODO replace this with adding a class so that we can use CSS to define colors
function messageLabelFillColor(d) {
    if (d.error_count > 0 && d.timeout_count) {
        return "purple";
    }

    if (d.error_count > 0) {
        return "red";
    }

    if (d.timeout_count) {
        return "lightblue";
    }

    return "black";
}

function responseCodeToColor(responseCode) {
    // Server error
    if (responseCode >= 500) {
        return "red";
    }

    // Client error
    if (responseCode >= 400) {
        return "fuchsia";
    }

    return "";  // Use default from CSS
}

function responseCodes(event) {
    if (!event.durations_and_codes) {
        return "none";
    }

    return summarizeResponseCodes(event.durations_and_codes.map(function (dac) {
        return dac.response_code;
    }));
}

// Given an array of integers, create a string that explains them.
// TODO have short/medium/longterm option
function summarizeResponseCodes(codes) {
    // Given [200, 401, 401, 401, 401, 401, 401, 401, 401, 401,
    //        200, 200, 200, 200, 200, 200, 200, 200, 500,   0]
    // produce "401 (45%), 500 (5%), timeout (5%) count 20"

    var bucketToCodes = {};
    var bucketCounts = {};

    for (var code of codes) {
        var bucket = bucketHttpStatusCode(code);

        bucketCounts[bucket] = (bucketCounts[bucket] || 0) + 1;

        if (!bucketToCodes[bucket]) {
            bucketToCodes[bucket] = [];
        }
        if (bucketToCodes[bucket].indexOf(code) < 0) {
            bucketToCodes[bucket].push(code);
         }
     }

     var breakdown = Object.keys(bucketCounts)
         // Originally I filtered out the 20x which looks better but prevents the mouse-over from working
         //.filter(function (bucket) {
         //    return bucket != "20x";
         //})
     .map(function (bucket) {
         if (bucketCounts[bucket]/codes.length == 1) {
             return summarizeBucketCodes(bucket, bucketToCodes[bucket]);
         }

         return "{bucket} {percent}"
             .replace("{bucket}", summarizeBucketCodes(bucket, bucketToCodes[bucket]))
             .replace("{percent}", prettyPercent(bucketCounts[bucket]/codes.length));
     })
     .join(", ");

     return (codes.length == 1) ?
             breakdown :
             "{breakdown} (count {count})"
             .replace("{breakdown}", breakdown)
             .replace("{count}", codes.length);
}

// Given an HTTP code, combine codes that are rarely cared about
function bucketHttpStatusCode(code) {
    if (code == 0) {
        return "timeout";
    }

    // See https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
    if (code < 100) {
        return code;
    }
    if (code == 202) {
        return code;
    }
    if (code < 300) {
        return "20x";
    }
    if (code < 400) {
        return "30x";
    }
    if (code == 401 || code == 403) {
        return code;
    }
    if (code == 502 || code == 504) {
        return code;
    }
    if (code < 500) {
        return "40x";
    }
    if (code < 600) {
        return "50x";
    }
    return code;
}

// If there is only one code return it, otherwise return the summary label
function summarizeBucketCodes(summaryLabel, codes) {
    if (summaryLabel == "timeout") {
        return "timeout";
    }

    return (codes.length > 1) ? summaryLabel : codes[0];
}

function prettyPercent(pct) {
    if (pct > 0.01) {
        return (pct*100).toFixed() + "%";
    }
    if (pct > 0.001) {
        return (pct*100).toFixed(1) + "%";
    }
    if (pct > 0.0001) {
        return (pct*100).toFixed(2) + "%";
    }
    return "<0.01%";
}
