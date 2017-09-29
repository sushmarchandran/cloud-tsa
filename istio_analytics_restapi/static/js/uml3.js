// Licensed Materials - Property of IBM
// (C) Copyright IBM Corp. 2017. All Rights Reserved.
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

// See https://en.wikipedia.org/wiki/Sequence_diagram for Sequence Diagrams.
// Also see https://www.ibm.com/developerworks/rational/library/3101.html

var margin = {top: 10, right: 10, bottom: 10, left: 10},    // const
    width = 1200 - margin.left - margin.right,    // const
    height = 1000 - margin.top - margin.bottom;    // const
var processWidth = 100;        // Width of process boxes at the top of the UML diagram.
var processMargin = 10;        // Horizontal distance between process boxes.  (They are spaced (processWidth+processMargin) * N) 
var processHeight = 20;    // const
var activationBoxWidth = 20;    // const
var arrowheadWidth = 5;    // const
var individualActivationRadius = 5;    // const
var tickWidth = 10;    // const
var tickMargin = 3; // const
var timeMargin = 50;    // const
var straightWhiskerMax = 200; // const
var timeScale;                // We use multiplication to scale instead of SVG transforms because they look squashed
var magnification = 1;
var showDurations = true;
var showCanaries = false;


function showTrace(traces, ntrace) {
    var selectedTrace = traces[ntrace];

    var siblingTraces = matchingTraces(traces[ntrace], traces);
    var traceSummary = summarizeTraces(siblingTraces, selectedTrace);
    console.log("traceSummary is " + JSON.stringify(traceSummary));
    orderEvents(traceSummary);
    var processes = deriveProcessesFromTrace(selectedTrace);
    var sequenceData = { processes: processes, events: allEvents(traceSummary) };

    setupSequenceDiagram(sequenceData);

    var date = new Date(getServiceTimeline(selectedTrace, getServices(selectedTrace)[0]).events[0].timestamp/1000);
    document.getElementById("traceno").textContent = ntrace.toString();
    document.getElementById("initiated").textContent = date.toLocaleString("en-US");
    document.getElementById("tracelength").textContent = formatMicroseconds(greatestTime(sequenceData.events));
    document.getElementById("sibling_cnt").textContent = siblingTraces.length;
    document.getElementById("zoomlevel").textContent = magnification.toString();

    document.getElementById("prevTrace").disabled = (ntrace <= 0);
    document.getElementById("nextTrace").disabled = (ntrace >= traces.length - 1);
    document.getElementById("smaller").disabled = (magnification <= 1);
}

function setupSequenceDiagram(data) {
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

    addSelectedTrace(data);

    addCommunication(data);

    addRetries(data);

    addCanaryIndicators(data);

    addDebugging(data);
}

function addScale(data) {
    // inspired by Paul Heckbert, "Nice Numbers for Graph Labels" from _Graphics Gems_, Academic Press, 1990 

    // We want to show about 10 ticks
    var ntick = 10;  // desired tickmarks
    
    var min = 0;
    var max = greatestTime(data.events);
    
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

function addActivations(data) {
    var activations = data.events.filter(function f(evt) { return evt.type == "process_request" || evt.type == "process_response"; });
    
    // Add a lifeline for each activation, so that Javascript doesn't need to keep data in a closure
    for (activation of activations) {
        activation.lifelineX = lifelineX(data, activation.service);;
    }
    
    var activationBoxes = d3.select("#activationBoxes")
        .selectAll(".activationBox")
        .data(activations);
    activationBoxes.enter().append("rect")
        .attr("class", "activationBox")
        .attr("width", activationBoxWidth)
        .on("mouseenter", popupWhiskers)
        .on("mouseleave", removeWhiskers);
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
        .text(function(d) { return formatMicroseconds(d.complete - d.start); })
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
        if (!activation.traceDurations) {
            continue;
        }

        for (var traceId of Object.keys(activation.traceDurations)) {
            durations.push({
                lifelineX: activation.lifelineX,

                y: toScaledBox(activation, activation.traceDurations[traceId]),
                traceId: traceId
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
            var win = window.open(raw_traces.zipkin_url + "/zipkin/traces/" + d.traceId, '_blank');
            win.focus();
        });
    durationsCircles.exit().remove();
    durationsCircles.transition().duration(0)
        .attr("cx", function(d) { return d.lifelineX; })
        .attr("cy", function(d) { return d.y; })
        .attr("visibility", showDurations ? "visible" : "hidden");
}

function addSelectedTrace(data) {
    var activations = data.events.filter(function f(evt) { return evt.type == "process_request" || evt.type == "process_response"; });

    var activationSelecteds = d3.select("#activationSelecteds")
    .selectAll(".activationSelected")
    .data(activations);
    activationSelecteds.enter().append("circle")
        .attr("class", "activationSelected")
        .attr("r", individualActivationRadius)
        .on("click", function(d, i) {
            // This ignores d.span_id
            var win = window.open(raw_traces.zipkin_url + "/zipkin/traces/" + d.trace_id, '_blank');
            win.focus();
        })
        .on("mouseenter", function(d) {
            // Add class so that the apperance changes when we mouseover
            var activation = d3.select(this);
            activation.classed("activationSelectedMouseover", true);

            // Add a label
            var t = d3.select("#popups").append("text")
                .attr("class", "activationDetails")
                .attr("alignment-baseline", "middle")
                .attr("fill", "black")
                .attr("filter", "url(#LabelBackground)")
                .attr("x", parseFloat(activation.attr("cx")) + parseFloat(activation.attr("r")) + 5)
                .attr("y", activation.attr("cy"))
                .text(prettyMicroseconds(d.duration.selected))
        })
        .on("mouseleave", function(d, i) {
            // Remove class to restore original appearance
            d3.select(this).classed("activationSelectedMouseover", false);

            // Remove the label
            d3.select("#popups").selectAll(".activationDetails").remove();
        });
    activationSelecteds.exit().remove();
    activationSelecteds.transition().duration(0)
        .attr("cx", function(d, i) { return lifelineX(data, source(d)); })
        .attr("cy", function(d, i) { return toScaledBox(d, d.duration.selected); });
}

function addRetries(data) {
    // If we see a send_request on the same service with the same interlocutor and same request
    // and same parent_span_id and there is a timeout on the first one then the second is probably
    // a retry.

    var inferredRetries = [];
    var timeoutTimestamps = {};
    for (var event of data.events) {
        if (event.timeout == null || event.type != "send_request") {
            continue;
        }

        var details = event.parent_span_id + "/" + event.service + "/" + event.interlocutor + "/" + event.request;
        if (timeoutTimestamps[details]) {
            inferredRetries.push({
                service: event.service,
                start: timeoutTimestamps[details],
                complete: event.start
            })
            // console.log("Timeout Retry first at " + timeoutTimestamps[details] + " again at " + event.start + " for " + details);
        }
        timeoutTimestamps[details] = event.start;
        // console.log("Timeout in " + details);
    }

    function timeoutX(d) {
        return lifelineX(data, d.service) + processWidth/2;
    }

    var timeoutRetries = d3.select("#timeoutRetries")
        .selectAll(".retryInterval")
        .data(inferredRetries);
    timeoutRetries.enter().append("line")
        .attr("class", "retryInterval")
        .attr("marker-start", "url(#SolidTimeoutStartArrowhead)")
        .attr("marker-end", "url(#SolidTimeoutArrowhead)")
    timeoutRetries.exit().remove();
    timeoutRetries.transition().duration(0)
        .attr("x1", timeoutX)
        .attr("x2", timeoutX)
        .attr("y1", function(d) { return d.start * timeScale + arrowheadWidth; })
        .attr("y2", function(d) { return d.complete * timeScale - arrowheadWidth; });

    var timeoutRetryLabels = d3.select("#timeoutRetries")
        .selectAll(".timeoutRetryLabel")
        .data(inferredRetries);
    timeoutRetryLabels.enter().append("text")
        .attr("class", "timeoutRetryLabel")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("filter", "url(#ArrowLabelBackground)")
    timeoutRetryLabels.exit().remove();
    timeoutRetryLabels.transition().duration(0)
        .text(function(d) { return prettyMicroseconds(d.complete - d.start); })
        .attr("x", timeoutX)
        .attr("y", function(d) { return (d.complete + d.start)/2 * timeScale; })
        .attr("transform", function(d) {
            return "rotate(90 x y)"
                .replace("x", timeoutX(d))
                .replace("y", (d.complete + d.start)/2 * timeScale); 
        });
}

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
                .text(d.delta.toFixed() + "%");
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
        .attr("transform", function(d) {
            var theta_deg = Math.max(Math.min(d.delta || 0, 80), -80);
            if (isNaN(theta_deg)) {
                console.warn("NaN theta_deg; d.delta=" + d.delta);
            }
            return "rotate(angle x y) translate(x y)"
                .replace("angle", theta_deg)
                .replace(/x/g, lifelineX(data, source(d)))
                .replace(/y/g, (d.complete + d.start)/2 * timeScale); 
        });

    var responses = data.events.filter(function f(evt) { return evt.type == "send_response"; });

    var canaryIndicators = d3.select("#activationSelecteds")
        .selectAll(".canaryResponseNeedle")
        .data(responses);
    canaryIndicators.enter().append("polygon")
        .attr("class", "canaryResponseNeedle")
    canaryIndicators.exit().remove();
    canaryIndicators.transition().duration(0)
        .attr("points", "0,-20 -2,20, 2,20")
        .attr("visibility", function(d) { return showCanaries ? "visible" : "hidden"; })
        .attr("transform", function(d) {
            var theta_deg = 0; // TODO restore // Math.max(Math.min(d.delta, 80), -80);
            return "rotate(angle x y) translate(x y)"
                .replace("angle", theta_deg)
                .replace(/x/g, (lifelineX(data, source(d)) + lifelineX(data, target(d))) / 2)
                .replace(/y/g, (d.complete + d.start)/2 * timeScale); 
        });
}

function addDebugging(data) {
    return; // comment out to get the debugging visualization

    // For debugging, add an indicator for the timestamps to make sure the rendering is
    // roughly congruent to the timestamps when a single trace is used.
    var timestamps = d3.select("#debugging")
    .selectAll(".timestamp")
    .data(data.events);
    timestamps.enter().append("rect")
        .attr("class", "timestamp")
        .attr("width", 6)
        .attr("height", 6)
        .attr("fill", "red");
    timestamps.exit().remove();
    timestamps.transition().duration(0)
        .attr("x", function(d) { return lifelineX(data, source(d)) - 3; })
        .attr("y", function(d) { return timeScale * (d.timestamp - data.events[0].timestamp) - 3; });
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
        .attr("y2", height)
        .attr("stroke", "black")
        .attr("stroke-dasharray", "5,5");
    lifelines.exit().remove();
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
        
    var messageLabels = d3.select("#messageLabels")
    .selectAll(".messageLabel")
    .data(requests);
    messageLabels.enter().append("text")
        .attr("class", "messageLabel")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("fill", "black")
        .on("mouseenter", function(d, i) {
            var t = d3.select("#popups").append("text")
                .attr("class", "messageLabelDetails")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr("fill", "black")
                .attr("filter", "url(#LabelBackground)")
                //.text(textFiveNumberSummary(d.duration))
                t.append("tspan").attr("x", 0).attr("dy", "1.2em").text(textFiveNumberSummary(d.duration))
                t.append("tspan").attr("x", 0).attr("dy", "1.2em").text("{count} request(s)".replace("{count}", d.duration.count))
                t.attr("transform", function(innerd) {
                    return makeSVGTransform(
                            data,
                            outgoingProcessBoxEdge(d),
                            d.start * timeScale + 2,
                            incomingProcessBoxEdge(d),
                            d.complete * timeScale + 2
                            );
                });
            })
        .on("mouseleave", function(d, i) {
            d3.select("#popups").selectAll(".messageLabelDetails").remove();
        });
    messageLabels.exit().remove();
    messageLabels.transition().duration(0)
        .text(function(d) { return d.request; })
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
        .on("mouseenter", function(d, i) {
            var t = d3.select("#popups").append("text")
                .attr("class", "messageLabelDetails")
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "middle")
                .attr("filter", "url(#LabelBackground)")
                .attr("fill", "black")
                t.append("tspan").attr("x", 0).attr("dy", "1.2em").text(textFiveNumberSummary(d.duration))
                t.append("tspan").attr("x", 0).attr("dy", "1.2em").text("{count} request(s)".replace("{count}", d.duration.count))
                t.attr("transform", function(innerd) {
                    return makeSVGTransform(
                            data,
                            lifelineX(data, target(d))+activationBoxWidth/2,
                            d.complete * timeScale + 2,
                            lifelineX(data, source(d))-activationBoxWidth/2,
                            d.start * timeScale + 2
                            );
                });
            })
        .on("mouseleave", function(d, i) {
            d3.select("#popups").selectAll(".messageLabelDetails").remove();
        })
    messageLabels.exit().remove();
    messageLabels.transition().duration(0)
        // .text(function(d) { return d.response_code; })
        .text(function(d) { return d.responseCodes; })
        .attr("transform", function(d) {
            return makeSVGTransform(
                    data,
                    lifelineX(data, target(d))+activationBoxWidth/2,
                    d.complete * timeScale + 4,
                    lifelineX(data, source(d))-activationBoxWidth/2,
                    d.start * timeScale + 4
                    );
        })
        .attr("visibility", function(d) { return d.response_code != "0" ? "visible" : "hidden"; });
}

function toScaledBox(d, x) {
    if (typeof x === "undefined") {
        throw new Error("toScaledBox() got undefined x");
    }

    var retval;
    if (d.duration.q3 == d.duration.q1) {
        if (x < d.duration.q1) {
            factor = (x - d.duration.q1) / d.duration.median;
            retval = (d.start + factor * d.duration.median) * timeScale;
        } else if (x > d.duration.q3) {
            factor = (x - d.duration.q3) / d.duration.median;
            retval = (d.complete + factor * d.duration.median) * timeScale;
        } else { // x == q1 == median == q3
            retval = (d.start+d.complete)/2 * timeScale;
        }
    } else {
        var factor = (x - d.duration.q1)/(d.duration.q3 - d.duration.q1);

        if (isNaN(factor)) {
            console.log("toScaledBox() failed to calculate factor; x=" + x + ", d.duration=" + JSON.stringify(d.duration));
        }
        
        retval = (d.start + factor * d.duration.median) * timeScale;
    }
    
    if (isNaN(retval)) {
        console.log("toScaledBox() failed; d.start=" + d.start + ", factor=" + factor + ", d.duration.median=" + d.duration.median);
    }
    
    return retval;
}

function scaledBoxMedian(d) { return toScaledBox(d, d.duration.median);  }

function popupWhiskers(d, i) {
    var label = d3.select("#executionDurationLabel" + i);
    // Don't recalculate oldTrans if we have used it before (because animations might mean transform isn't completed)
    var oldTrans = label.attr("oldTrans");
    if (!oldTrans) {
        oldTrans = label.attr("transform");
    }
    label.transition().duration(500)
        .text(textFiveNumberSummary(d.duration) + " selected " + prettyMicroseconds(d.duration.selected))
        .attr("text-anchor", "start")
        .attr("transform", "")
        .attr("oldTrans", oldTrans);

    // Don't draw whiskers if we have only one data point and no real min/q1 q3/max separation
    if (d.duration.min == d.duration.q1 || d.duration.max == d.duration.q3) {
        return;
    }
    
    var whiskerTopTrue = toScaledBox(d, d.duration.min);
    var whiskerBottomTrue = toScaledBox(d, d.duration.max);
    var whiskerTop = Math.max(whiskerTopTrue, 0, timeScale * d.start - straightWhiskerMax);
    var whiskerBottom = Math.min(whiskerBottomTrue, height, timeScale * d.complete + straightWhiskerMax);
    var whiskerX = d.lifelineX;
    var compressTop = whiskerTopTrue < whiskerTop;
    var compressBottom = whiskerBottomTrue > whiskerBottom;
    
    d3.select("#popups").append("line")            // Whisker top bar
        .attr("class", "activationWhisker")
        .attr("x1", whiskerX - activationBoxWidth/2)
        .attr("x2", whiskerX + activationBoxWidth/2)
        .attr("y1", whiskerTop)
        .attr("y2", whiskerTop);
    d3.select("#popups").append("polyline")            // Whisker top "vertical"
        .attr("class", "activationWhisker")
        .attr("points", boxplotPolylinePoints(compressTop, whiskerX, whiskerTop, d.start * timeScale))
    d3.select("#popups").append("line")                // Whisker bottom bar
        .attr("class", "activationWhisker")
        .attr("x1", whiskerX - activationBoxWidth/2)
        .attr("x2", whiskerX + activationBoxWidth/2)
        .attr("y1", whiskerBottom)
        .attr("y2", whiskerBottom);
    d3.select("#popups").append("polyline")                // Whisker bottom vertical
        .attr("class", "activationWhisker")
        .attr("points", boxplotPolylinePoints(compressBottom, whiskerX, d.complete * timeScale, whiskerBottom))
    d3.select("#popups").append("text")
        .attr("class", "activationWhiskerLabel")
        .attr("x", whiskerX + activationBoxWidth/2 + 5)
        .attr("y", whiskerTop)
        .attr("alignment-baseline", "middle")
        .text(prettyMicroseconds(d.duration.min));
    d3.select("#popups").append("text")
        .attr("class", "activationWhiskerLabel")
        .attr("x", whiskerX + activationBoxWidth/2 + 5)
        .attr("y", whiskerBottom)
        .attr("alignment-baseline", "middle")
        .text(prettyMicroseconds(d.duration.max));
    
    // TODO: move activation if it is outside the clamping region straightWhiskerMax?
};

function removeWhiskers(d, i) {
    var label = d3.select("#executionDurationLabel" + i);
    label.transition().duration(500)
        .text(function(d) { return formatMicroseconds(d.complete - d.start); })
        .attr("text-anchor", "middle")
        .attr("transform", label.attr("oldTrans"));
    
    // Remove the whiskers
    d3.select("#popups").selectAll(".activationWhisker").remove();
    d3.select("#popups").selectAll(".activationWhiskerLabel").remove();
}


// makeSVGTransform makes a transform for aligning text above an arrow
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
        console.warn("NaN theta_deg; x1=" + x1 + ", y1=" + y1 + ", x2=" + x2 + ", y2=" + y2);
    }

    return "rotate(angle x y) translate(x y)"
        .replace("angle", theta_deg)
        .replace(/x/g, (x1+x2)/2-5)
        .replace(/y/g, (y1+y2)/2-5);
}

function makeTranslation(timeMargin, processHeight) {
 
    return "translate(0 " + (timeMargin+processHeight) + ")"
}

// nicenum() finds a "nice" number approximately equal to x.  If `round` is `true` rounds, otherwise takes ceiling.
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

function formatMicroseconds(ms) {
    return prettyMicroseconds(ms); // TODO factor out formatMicroseconds()
}

// Like formatMicroseconds (TODO replace formatMicroseconds)
function prettyMicroseconds(ms, msOfLargest) {
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

function textFiveNumberSummary(details) {
    return "{min} {q1} {median} {q3} {max}"
        //.replace("{count}", details.count)
        .replace("{min}", formatMicroseconds(details.min))
        .replace("{q1}", formatMicroseconds(details.q1))
        .replace("{median}", formatMicroseconds(details.median))
        .replace("{q3}", formatMicroseconds(details.q3))
        .replace("{max}", formatMicroseconds(details.max));
}

function source(event) {
    retval = event.service;
    // console.log(retval + " is the source of " + JSON.stringify(event));
    return retval;
}

function target(event) {
    retval = event.interlocutor;
    // console.log(retval + " is the target of " + JSON.stringify(event));
    return retval;
}

// Give a process name, return the X coordinate of its lifeline
function lifelineX(data, processName) {
    if (!processName) {
        throw new Error("missing processName");
    }
    
    var index = data.processes.findIndex(function(ele) { return ele.id == processName; });
    return (index + 0.5) * (processWidth+processMargin);
}

// Returns an array of {id:"productpage", title:"productpage", color:"purple"}
function deriveProcessesFromTrace(trace) {
    // console.log("messages is " + JSON.stringify(messages));
    
    var defaultColors = ["purple", "red", "gold", "navy"];
    var processes = getServices(trace);
    
    var internalServices = trace.timelines.map(function (t) { return t.service; });

    return processes.map(function(process, index) {
        return {id: process, title: prettyProcessName(process), 
            color: defaultColors[index%defaultColors.length], 
            external: internalServices.indexOf(process) < 0
        };
    });
}

function greatestTime(events) {
    if (!Array.isArray(events)) {
        throw new Error("events must be an array but it is a " + typeof events);
    }
    return Math.max.apply(null, events.map(function (evt) { return evt.complete; }));
}

function generateProcessTitleMap(spans) {
    var retval = {};
    
    for (i in spans) {
        var ip = annotationEndpointIPV4(spans[i], "ss");
        var nodeId = binaryAnnotation(spans[i], "node_id");
        var hostHeader = binaryAnnotation(spans[i], "host_header");
        if (nodeId == "ingress") {
            //retval[ip] = nodeId;
            // Special case
            retval[annotationEndpointIPV4(spans[i], "cr")] = nodeId;
            retval[ip] = hostHeader.split(':')[0];
        } else {
            var host = hostHeader.split(':')[0];
            if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(host)) {
                retval[ip] = host;
            } else {
                retval[ip] = host.split('.')[0];
            }
        }
    }
    
    return retval;
}


function timelineToEvents(events) {
    return events.map(function (evt) { return evt.interlocutor + "/" + evt.request; });
}

// traceToEvents() produces a list of "service/interlocutor/request" strings
function traceToEvents(trace) {
    var retval = [];
    for (var timeline of trace.timelines) {
        var timelineEvents = timelineToEvents(timeline.events);
        retval = retval.concat(timelineEvents.map(function (strEvent) { return timeline.service + "/" + strEvent; }));
    }
    return retval;
}

// matchingTraces returns those traces that match 'trace'
function matchingTraces(trace, zipkin_traces) {
    // return [trace];

    console.log("Chosen trace has " + trace.timelines.length + " processes");
    var strTraceEvents = JSON.stringify(traceToEvents(trace));
    console.log("Chosen trace has events" + strTraceEvents);

    var retval = [];
    var count = 0;
    for (i in zipkin_traces) {
        // We are interested in the request_lines (URLs), not the source/target process
        if (strTraceEvents == JSON.stringify(traceToEvents(zipkin_traces[i]))) {
            // console.log("Trace " + i + " matches");
            count++;
            retval.push(zipkin_traces[i]);
        }
    }
    
    console.log("Found " + count + " matching traces");
    return retval;
}

// summarizeTraces() creates a summary of Fabio's
// /api/v1/distributed_tracing/traces/timelines output, with names and spanids
// from a selected trace.
//
// 'siblingTraces' is an array of Fabio's output.
// summarizeTraces() generates an object in Fabio's format, but with added median/min/max/q1/q3/count/avg 
function summarizeTraces(siblingTraces, selectedTrace) {

    summary = {
        request_type: selectedTrace.requestType,
        timelines: []
    };

    for (var service of getServices(selectedTrace)) {
        var summaryTimeline = {
            service: service,
            events: []
        };

        // console.log("summarizeTraces() summarizing service " + JSON.stringify(service));

        var selectedEvents = getServiceTimeline(selectedTrace, service).events;
        console.log("service=" + service + ", selectedEvents.length=" + selectedEvents.length);

        for (var i in selectedEvents) {
            var nthEvents = getNthTimelineEvents(siblingTraces, service, i)
            // console.log("nthEvents is " + JSON.stringify(nthEvents));
            nthBlockingEvents = nthEvents.filter(function (evt) { return !evt.timeout; });

            if (nthBlockingEvents.length > 0) {
                var selectedEvent = selectedEvents[i];
                var summaryEvent = {
                    trace_id: selectedTrace.trace_id,
                    span_id: selectedEvent.span_id,
                    parent_span_id: selectedEvent.parent_span_id,
                    type: selectedEvent.type,
                    service: service,                            // denormalize the service (each event shall refer to it)
                    interlocutor: selectedEvent.interlocutor, 
                    request: selectedEvent.request,                // TODO summarize request
                    response_code: selectedEvent.response_code,    // TODO summarize response_code
                    responseCodes: summarizeResponseCodes(nthBlockingEvents.map(function (evt) { return evt.response_code; })),
                    duration: summarize(nthBlockingEvents.map(function (evt) { return evt.duration; })),
                    timestamp: selectedEvent.timestamp,
                    traceDurations: {},
                    delta: selectedEvent.delta || 0,                     // Hack. We should get delta by comparison against a baseline, not from the randomize delta hack
                };
                if (!selectedEvents[i].timeout) {
                    summaryEvent.duration.selected = selectedEvents[i].duration;
                }

                // calculate traceDurations
                for (var j in siblingTraces) {
                    summaryEvent.traceDurations[siblingTraces[j].trace_id] = nthBlockingEvents[j].duration;
                }

                // console.log("summarizeTraces() about to push " + JSON.stringify(summaryEvent));
                summaryTimeline.events.push(summaryEvent);
            }

            nthTimeoutEvents = nthEvents.filter(function (evt) { return evt.timeout; });
            if (nthTimeoutEvents.length > 0) {
                console.log("handling " + nthTimeoutEvents.length + " timeout events")
                var selectedEvent = selectedEvents[i];
                var summaryEvent = {
                    trace_id: selectedTrace.trace_id,
                    span_id: selectedEvent.span_id,
                    parent_span_id: selectedEvent.parent_span_id,
                    type: selectedEvent.type,
                    service: service,                            // denormalize the service (each event shall refer to it)
                    interlocutor: selectedEvent.interlocutor, 
                    request: selectedEvent.request,                // TODO summarize request
                    // response_code: selectedEvent.response_code,
                    duration: summarize(nthTimeoutEvents.map(function (evt) { return evt.duration; })),
                    timestamp: selectedEvent.timestamp,
                    timeout: summarize(nthTimeoutEvents.map(function (evt) { return evt.timeout; })),
                };
                if (selectedEvents[i].timeout) {
                    summaryEvent.duration.selected = selectedEvents[i].duration;
                }

                // console.log("summarizeTraces() about to push TIMEOUT " + JSON.stringify(summaryEvent));
                summaryTimeline.events.push(summaryEvent);
            }
        }
        
        summary.timelines.push(summaryTimeline);
    }
    
    return summary;
}

function getServices(trace) {
    if (!trace.timelines) {
        throw new Error("trace has no timelines: " + JSON.stringify(trace));
    }
    
    // Get all of the services that have timelines
    var retval = trace.timelines.map(function (t) { return t.service; });
    
    // Sort by earliest timestamp
    retval.sort(function (a, b) {
        return getServiceTimeline(trace, a).events[0].timestamp - getServiceTimeline(trace, b).events[0].timestamp;
    });
    
    // Add in the interlocutors that lack timelines
    // console.log("trace.timelines = " + JSON.stringify(trace.timelines));
    for (var timeline of trace.timelines) {
        // console.log("timeline.events = " + JSON.stringify(timeline.events));
        for (var event of timeline.events) {
            if (retval.indexOf(event.interlocutor) < 0) {
                retval.push(event.interlocutor);
            }
        }
    }
    
    return retval;
}

function getServiceTimeline(trace, service) {
    var retval = trace.timelines.find(function (t) { return t.service == service; });
    if (retval) {
        return retval;
    }
    
    // Create a dummy empty timeline for interlocutors that lack an entry.
    return { service: service, events: []};
}

function getNthTimelineEvents(traces, service, n) {
    return traces
        .map(function (trace) { return getServiceTimeline(trace, service); })
        .map(function (timeline) { return timeline.events[n]; });
}

// summarize() takes a non-empty array of number and returns { min:, q1:, mean:, q3:, max:, avg:, count: }
function summarize(arr) {
    if (arr.length == 0) {
        throw new Error("arr empty");
    }
    
    arr.sort(sortNumber);
    // console.log("in summarize(), sorted arr is " + JSON.stringify(arr));

    var lowMiddle = Math.floor((arr.length - 1) / 2);
    var highMiddle = Math.ceil((arr.length - 1) / 2);
    var lowQ1 = Math.floor((arr.length - 1) / 4);
    var highQ1 = Math.ceil((arr.length - 1) / 4);
    var lowQ3 = Math.floor(3 * (arr.length - 1) / 4);
    var highQ3 = Math.ceil(3 * (arr.length - 1) / 4);
    
    return {
        median: (arr[lowMiddle] + arr[highMiddle]) / 2,
        max: Math.max.apply(null, arr),
        min: Math.min.apply(null, arr),
        q1: (arr[lowQ1] + arr[highQ1]) / 2,
        q3: (arr[lowQ3] + arr[highQ3]) / 2,
        count: arr.length,
        avg: arr.reduce(function(a, b) { return a + b; }) / arr.length
    };
}

function sortNumber(a,b) {
    return a - b;
}

function allEvents(trace) {
    return trace.timelines.reduce(function (accumulator, timeline) { return accumulator.concat(timeline.events); }, []);
}

// Add .nextEvent to each event
// Also adds .start and .complete to each event.  These are timestamps relative to 0 for the whole trace, based on median time.
function orderEvents(trace) {

    var events = allEvents(trace)

    // Just sort by timestamp
    events.sort(function (a, b) { return a.timestamp - b.timestamp; });

    // Remember the previous send_request for each service
    var requests = {};

    // Remember the send_request for each span
    var spans = {}

    var basetime = 0;
    for (var i in events) {
        //console.log("setting next/start/complete for " + events[i].service + "/" 
        //        + events[i].type + " " + events[i].request + " which has timeout " 
        //        + JSON.stringify(events[i].timeout));

        events[i].nextEvent = allEvents[i+1];
        events[i].prevEvent = allEvents[i-1];

        if (events[i].type == "send_request") {
            requests[events[i].service] = events[i];
            spans[events[i].span_id] = events[i];
        }

        if (events[i].timeout && events[i].type == "process_response") {
            // When we are processing as a result of timing out, the start time
            // should be the timeout median after the previous send_request from the same service.
            basetime = requests[events[i].service].start + events[i].timeout.median;
        }

        if (events[i].type == "process_request") {
            // Set the basetime/start from the send_request's stop time.
            if (spans[events[i].span_id] == undefined) {
                console.warn("Expected to find span " + events[i].span_id + " but the only send_request spans are " + JSON.stringify(Object.keys(spans)));
            } else {
                basetime = spans[events[i].span_id].complete;
            }
        }

        events[i].start = basetime;
        events[i].complete = basetime + events[i].duration.median;
        if (events[i].duration.median < 0) {
            console.log("Warning: negative duration for event " + JSON.stringify(events[i]));
        }
        basetime = basetime + events[i].duration.median;

        //console.log("Set start to " + events[i].start + " for " + events[i].service + "/" 
        //        + events[i].type + " " + events[i].request + " which has timestamp " 
        //        + events[i].timestamp);
    }
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

function prepareChart() {
    var svg = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");
          
    // These aren't really needed ... we use them to make it easier to find a particular 
    // SVG element in the Elements debug view.  We could add directly to SVG.
    svg.append("g")
        .attr("id", "scale")
        .attr("transform", makeTranslation(timeMargin, processHeight));
    svg.append("g")
        .attr("id", "processRectangles");
    svg.append("g")
        .attr("id", "processRectLabels")
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
        .attr("id", "popups")
        .attr("transform", makeTranslation(timeMargin, processHeight));
    svg.append("g")
        .attr("id", "debugging")
        .attr("transform", makeTranslation(timeMargin, processHeight));
    
    return svg;
}

//From https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
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
