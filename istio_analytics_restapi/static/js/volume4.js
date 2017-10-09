// Licensed Materials - Property of IBM
// (C) Copyright IBM Corp. 2017. All Rights Reserved.
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

'use strict';

// inspired by https://bl.ocks.org/mbostock/3883195

var margin = { top: 20, right: 20, bottom: 30, left: 50 };  // const

var heightSelArea = 30; // const
var selTitles = ["Baseline", "Canary"]; // const
var selectionId = ["baseline", "canary"]; // const
var nSelections = selTitles.length;    // const
var TIMEFORMAT = d3.timeFormat("%m-%d %H:%M:%S"); // const

function prepareChart(chartId, $scope) {
    var svg = d3.select(chartId);
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom - nSelections * heightSelArea;

    var g = svg.append("g")
        .attr("id", "inner")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // x is a D3 continuous scale
    // https://github.com/d3/d3-scale/blob/master/README.md#continuous-scales
    var x = d3.scaleTime().rangeRound([0, width]);

    var y = d3.scaleLinear().rangeRound([height, 0]);

    // These ten colors can be seen at https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9
    var z = d3.scaleOrdinal(d3.schemeCategory10);

    // Stacked area graph
    var stack = d3.stack();

    var retval = {
        volchart: svg,
        stack: stack,
        x: x,
        y: y,
        z: z,
        selections: [
            {start: undefined, end: undefined}, // baseline
            {start: undefined, end: undefined}, // canary
            ],
        angularScope: $scope
    };

    // Add selection areas
    var selections = [];
    for (var i = 0; i < nSelections; i++) {
        selections.push(retval);
    }

    var dbSelection = d3.drag()
        .on("start", dragStartSelection)
        .on("drag", dragMoveSelection)
        .on("end", dragEndSelection);

    // Create this on <svg> instead of on <g id="inner"> because showVolume() deletes everything
    var sels = svg.selectAll(".selRange")
        .data(selections);
    var gsels = sels.enter().append("g")
        .attr("class", "selRange")
        .attr("id", function(_, i) { return selectionId[i]; })
        .call(dbSelection)
        .attr("transform", function (_, i) {
            return "translate(" + margin.left + "," + (margin.top + height + (i+1) * heightSelArea) + ")";
        });
    gsels.append("rect")
            .attr("fill", "LightGray")
            .attr("width", width)
            .attr("height", heightSelArea)
    gsels.append("text")
            .attr("fill", "black")
            // .attr("x", width / 2)
            .attr("x", 10) // a small margin
            .attr("y", heightSelArea / 2)
            // .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle");
    // no need to do transform() or exit() because nSelections is constant

    var dragBehavior = d3.drag()
        .on("start", dragStart)
        .on("drag", dragMove)
        .on("end", dragEnd);

    g.call(dragBehavior);

    return retval;
}

function showVolume(traceList, context) {

    var spans = allSpans(traceList)
        .filter(function (s) { return s.sr; });     // spans with non-null Server Receive

    // diagnoseSpans2(spans);

    // bucketize based on the .target_name key in buckets of 10 seconds
    var bucketSizeInSeconds = 5; // const
    var buckets = bucketize(spans, "target_name", "sr", bucketSizeInSeconds,
        function (accum, _span) {
            return accum + 1;
        });

    // Convert the dict date->target->count to make the date a peer of the target counts
    var data = Object.entries(buckets).map(function(d) {
        var retval = d[1];
        retval.date = Date.parse(d[0])
        return retval;
    });

    var svg = context.volchart;
    var stack = context.stack;
    var x = context.x;
    var y = context.y;
    var z = context.z;

    var area = d3.area()
        .x(function(d) { return x(d.data.date); })
        .y0(function(d) { return y(d[0] /*|| 0*/); })
        .y1(function(d) { return y(d[1] /*|| 0*/); });

    x.domain(d3.extent(data, function(d) { return d.date; }));

    var keys = getKeys(traceList, "target_name");
    console.log("keys are " + keys + " (length " + keys.length + ")");
    z.domain(keys);
    stack.keys(keys);

    // Put a 0 in every piece of data that we don't have a value for
    // console.log("data is " + JSON.stringify(data));
    for (var datum of data) {
        for (var key of keys) {
            if (datum[key] === undefined) {
                datum[key] = 0;
            }
        }
    }
    // console.log("data is now " + JSON.stringify(data));

    var series = stack(data);
    // console.log("series=" + JSON.stringify(series));

    //console.log("stack(spans).length is " + series.length);
    //for (var i = 0; i < series.length; i++) {
    //    console.log("stack(spans)[" + i + "] is " + series[i] + " (" + series[i].length + " elements)");
    //}

    y.domain([0, d3.max(series, function(d) {
        return d3.max(d, function(d2) {
            return Math.max(d2[0], d2[1]);
        });
    })]);

    // console.log("area(stack(data)[0])=" + area(series[0]));
    var g = svg.selectAll("#inner");

    // Connect the thing we are graphing to the SVG object
    g.data([context]);

    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom - nSelections * heightSelArea;

    // Blow away existing children.  TODO replace this with D3 transitions
    g.selectAll('*').remove();
    //g.selectAll("text").remove()

    // Create a rect in the background color because we will be selecting
    // regions using d3.drag() and <g> elements do not receive drag events
    g.append("rect")
        .attr("opacity", 0)
        .attr("width", width)
        .attr("height", height);

    // Create a .layer for each series
    var layer = g.selectAll(".layer")
        .data(series)
       .enter().append("g")
            .attr("class", "layer");

    // Add a path for each layer with the desired color
    layer.append("path")
        .attr("class", "area")
        .style("fill", function(d) { return z(d.key); })
        .attr("d", area);

    // Create bottom axis and scale
    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(TIMEFORMAT));

    // Create left axis and scale.  TODO Limit ticks to the integers.
    g.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Count");

    // Show the keys
    var t = g.append("text")
        .attr("text-anchor", "end");

    t.selectAll(".service")
        .data(keys)
        .enter().append("tspan")
        .attr("dy", "1.2em")
        .attr("x", width)
        .attr("class", "service")
        .attr("fill", function(d) { return z(d); })
        .text(function (d) { return d; });

    // Reset the selection ranges for Baseline and Canary
    context.angularScope.baselineStart = null;
    context.angularScope.baselineEnd = null;
    context.angularScope.canaryStart = null;
    context.angularScope.canaryEnd = null;
    svg.selectAll(".selRange")
        .each(function (d, i) {
            d.selections[i].start = null;
            d.selections[i].end = null;
            var g = svg.select("#" + selectionId[i]);
            showRangeAsText(g,
                    d.x,
                    selTitles[i],
                    d.selections[i].start, d.selections[i].end);
            g.selectAll("#selection").remove();
        });
}

function allSpans(traceList) {
    var retval = [];

    for (var trace of traceList) {
        retval = retval.concat(trace.spans);
    }

    return retval;
}

// Compute timebucket -> keyField -> val, where val is reduced from all
// matching spans.
function bucketize(spans, keyField, timeField, bucketDur, f) {
    var retval = {};
    var coeff = 1000 * bucketDur;

    for (var span of spans) {
        var roundedDate = new Date(Math.round(span[timeField] / (1000 * coeff)) * coeff);
        var bucket = retval[roundedDate];
        if (!bucket) {
            bucket = {};
            retval[roundedDate] = bucket;
        }
        var key = span[keyField];
        // bucket[key] = (bucket[key] || 0) + 1;
        bucket[key] = f(bucket[key] || 0, span);
    }

    return retval;
}

// Return the unique values of a key field
function getKeys(tracelist, keyField) {
    var retval = [];

    for (var trace of tracelist) {
        for (var span of trace.spans) {
            if (retval.indexOf(span[keyField]) < 0) {
                retval.push(span[keyField]);
            }
        }
    }

    return retval;
}

function diagnoseSpans2(spans) {
    var timeFields = ["cs", "sr", "ss", "cr"];
    console.log("Checked " + spans.length + " spans");
    for (var timeField of timeFields) {
        var fmTime = function (span) { return span[timeField]; }
        var minField = Math.min.apply(null, spans.map(fmTime));
        var maxField = Math.max.apply(null, spans.map(fmTime));
        if (minField < Infinity) {
            console.log("Lowest " + timeField + " was " + minField + " = " + new Date(minField/1000).toISOString());
        }
        if (maxField > 0) {
            console.log("Highest " + timeField + " was " + maxField + " = " + new Date(maxField/1000).toISOString());
        }
    }
}

function dragStart(d) {
    var p = d3.mouse(this);
    d.dragStart = p[0];

    var g = d3.select(this);
    var selection = g.selectAll("#selection");
    selection.remove();

    g.append("rect")
        .attr("id", "selection")
        .attr("opacity", 0.1)
        .attr("x", p[0])
        .attr("y", 0)
        .attr("height", this.getBoundingClientRect().height)
        .attr("width", 1);
}

function dragMove(d) {
    var p = d3.mouse(this);

    var selection = d3.select(this).selectAll("#selection");
    selection.transition().duration(0)
        .attr("x", Math.min(d.dragStart, p[0]))
        .attr("width", Math.abs(p[0] - d.dragStart));
}

function dragEnd(d) {

    var selection = d3.select(this).selectAll("#selection");
    var xStart = +selection.attr("x");
    var xEnd = xStart + +selection.attr("width");

    var start = d.x.invert(xStart);
    var end = d.x.invert(xEnd);
    console.log("selected " + start + " to " + end);

    alert("TODO: clamp UI to " + start + " to " + end);
}

function dragStartSelection(d, i) {
    // this is an SVGGElement
    var p = d3.mouse(this);
    d.selections[i] = { dragStart: p[0] };

    var xStart = p[0];
    var start = d.x.invert(xStart);
    if (isNaN(start.getTime())) {
        // Don't accept clicks if there is no data
        return;
    }

    var g = d3.select(this);
    var selection = g.selectAll("#selection");
    selection.remove();

    g.append("rect")
        .attr("id", "selection")
        .attr("opacity", 0.1)
        .attr("x", p[0])
        .attr("y", 0)
        .attr("height", this.getBoundingClientRect().height)
        .attr("width", 1);

    // d.selections[i].start = start;
    showRangeAsText(g, d.x, selTitles[i], start, start);
}

function dragMoveSelection(d, i) {
    var p = d3.mouse(this);

    var selection = d3.select(this).selectAll("#selection");
    var xStart = Math.min(d.selections[i].dragStart, p[0]);
    var start = d.x.invert(xStart);

    if (isNaN(start.getTime())) {
        // Don't accept clicks if there is no data
        return;
    }

    var width = Math.abs(p[0] - d.selections[i].dragStart);
    selection.transition().duration(0)
        .attr("x", xStart)
        .attr("width", width);

    d.selections[i].start = start;
    var xEnd = xStart + width;
    var end = d.x.invert(xEnd);
    d.selections[i].end = end;
    var g = d3.select(this);
    showRangeAsText(d3.select(this), d.x, selTitles[i], start, end);
}

function dragEndSelection(d, i) {

    // Report the new selection to AngularJS which may have watchers

    var internalToStartAngular = [ "baselineStart", "canaryStart" ];
    var internalToEndAngular = [ "baselineEnd", "canaryEnd" ];

    d.angularScope[internalToStartAngular[i]] = d.selections[i].start;
    d.angularScope[internalToEndAngular[i]] = d.selections[i].end;
}

function showRangeAsText(ele, x, title, start, end) {
    if (!start) {
        ele.select("text")
            .text(" {title}: <click and drag>"
                    .replace("{title}", title)
            );
        return;
    }

    ele.select("text")
        .text(
            "{title}: {first} to {last}"
                .replace("{title}", title)
                .replace("{first}", TIMEFORMAT(start))
                .replace("{last}", TIMEFORMAT(end))
        );
        //.attr("x", (x(start) + x(end)) / 2);
}