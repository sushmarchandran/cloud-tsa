// Licensed Materials - Property of IBM
// (C) Copyright IBM Corp. 2017. All Rights Reserved.
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

'use strict';

// inspired by https://bl.ocks.org/mbostock/3883195

var svg = d3.select("svg");
var margin = { top: 20, right: 20, bottom: 30, left: 50 };
var width = +svg.attr("width") - margin.left - margin.right;
var height = +svg.attr("height") - margin.top - margin.bottom;

var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleTime().rangeRound([0, width]);

var y = d3.scaleLinear().rangeRound([height, 0]);

// These ten colors can be seen at https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9
var z = d3.scaleOrdinal(d3.schemeCategory10);

// Stacked area graph
var stack = d3.stack();
var area = d3.area()
    .x(function(d) { return x(d.data.date); })
    .y0(function(d) { return y(d[0] || 0); })
    .y1(function(d) { return y(d[1] || 0); });

// TODO replace this with a call to /api/v1/distributed_tracing/traces
//d3.tsv("/static/js/data.tsv", function(d) {
//    d.date = parseTime(d.date);
//    d.close = +d.close;
//return d;
//}, function(error, data) {
//    if (error) throw error;
    var spans = allSpans(raw_tracelist.trace_list)
        .filter(function (s) { return s.sr; });     // spans with non-null Server Receive
    // spans = spans.sort(function(a, b) { return new Date(b.sr / 1000) - new Date(a.sr / 1000); });
    // console.log("Found " + spans.length + " span(s)");

    // bucketize based on the .target_name key in buckets of 10 seconds
    var bucketSizeInSeconds = 5; // const
    var buckets = bucketize(spans, "target_name", "sr", bucketSizeInSeconds,
        function (accum, _span) {
            return accum + 1;
        });

    // Convert the dict date->target->count to make the date a peer of the target counts
    var data = Object.entries(buckets).map(function(d) {
        // return Object.assign({ date: Date.parse(d[0]) }, d[1]);
        var retval = d[1];
        retval.date = Date.parse(d[0])
        return retval;
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));

    var keys = getKeys(raw_tracelist.trace_list, "target_name");
    // console.log("keys are " + keys + " (length " + keys.length + ")");
    z.domain(keys);
    stack.keys(keys);

    var series = stack(data);
    //console.log("series=" + JSON.stringify(series));

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
    /*
    t.append("tspan")
        .attr("dy", "1.2em")
        .text("foo");
        */
//});

function allSpans(tracelist) {
    var retval = [];

    for (var trace of raw_tracelist.trace_list) {
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

    for (var trace of raw_tracelist.trace_list) {
        for (var span of trace.spans) {
            if (retval.indexOf(span[keyField]) < 0) {
                retval.push(span[keyField]);
            }
        }
    }

    return retval;
}
