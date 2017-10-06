// Licensed Materials - Property of IBM
// (C) Copyright IBM Corp. 2017. All Rights Reserved.
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

'use strict';

// inspired by https://bl.ocks.org/mbostock/3883195

var margin = { top: 20, right: 20, bottom: 30, left: 50 };  // const

function prepareChart(chartId) {
    var svg = d3.select(chartId);
    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;

    var g = svg.append("g")
        .attr("id", "inner")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleTime().rangeRound([0, width]);

    var y = d3.scaleLinear().rangeRound([height, 0]);

    // These ten colors can be seen at https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9
    var z = d3.scaleOrdinal(d3.schemeCategory10);

    // Stacked area graph
    var stack = d3.stack();

    return {
        volchart: svg,
        stack: stack,
        x: x,
        y: y,
        z: z
    };
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
        .y0(function(d) { return y(d[0] || 0); })
        .y1(function(d) { return y(d[1] || 0); });

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
    console.log("series=" + JSON.stringify(series));

    console.log("stack(spans).length is " + series.length);
    for (var i = 0; i < series.length; i++) {
        console.log("stack(spans)[" + i + "] is " + series[i] + " (" + series[i].length + " elements)");
    }

    y.domain([0, d3.max(series, function(d) {
        return d3.max(d, function(d2) {
            return Math.max(d2[0], d2[1]);
        });
    })]);

    // console.log("area(stack(data)[0])=" + area(series[0]));
    var g = svg.selectAll("#inner");

    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;

    // Blow away existing children.  TODO replace this with D3 transitions
    g.selectAll("g").remove();
    g.selectAll("text").remove()

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
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%m-%d %H:%M:%S")));

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