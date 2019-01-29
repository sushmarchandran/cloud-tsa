
'use strict';

var cellwidth = 100;     // const
var cellheight = 50;    // const
var gridoffsetX = 100;  // const
var gridoffsetY = 100;  // const


var targets = targets(dummy_testdata.clusters);
//console.log(targets);
var am = adjacencyMatrix(dummy_testdata.clusters);
//console.log(am);

var svg = d3.select("#matrix");
var matrix = svg
    .append("g")
        .attr("id", "cells")
        .attr("transform", "translate(" + gridoffsetX + ", " + gridoffsetY + ")");

var rowLabels = svg.selectAll(".rowLabel")
    .data(Object.keys(am))
    .enter().append("text")
        .attr("class", "rowLabel")
        .text(function (d) { return d; })
        .attr("alignment-baseline", "middle")
        .attr("y", function (_, i) { return gridoffsetY + i * cellheight + cellheight / 2; });

var colLabels = svg.selectAll(".colLabel")
    .data(targets)
    .enter().append("text")
        .text(function (d) { return d; })
        .attr("alignment-baseline", "middle")
        .attr("x", function (_, i) { return gridoffsetX + i * cellwidth + cellwidth / 2 + 5; })
        .attr("y", gridoffsetY)
        .attr("transform", function (_, i) {
            return "rotate(-90 x y)"
                .replace(/x/g, gridoffsetX + i * cellwidth + cellwidth / 2)
                .replace(/y/g, gridoffsetY);
        });

var row = matrix.selectAll(".row")
    .data(Object.keys(am))
    .enter().append("g")
        .attr("class", "row");

var cells = row.selectAll(".cell")
    .data(function(d, i) {
        // console.log("creating row with d=" + d + ", i=" + i);
        return targets.map(function (t) {
            // console.log("defining column with t=" + t + ", i=" + i);
            return { row: i, source: d, target: t, data: am[d][t] };
        });
    })
    .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function (d, i) {
            return "translate(x y)"
                .replace(/x/g, cellwidth * i)
                .replace(/y/g, cellheight * d.row);
        });

// Outline the cells
cells.append("rect")
    .attr("width", cellwidth)
    .attr("height", cellheight)
    .style("fill","none")
    .style("stroke", "lightgrey");

// const
var categories = {
    "success": {
        fill: "green",
        textFill: "white",
        textfunc: function(d) { return d.event_count - d.error_count - d.timeout_count; },
        visfunc: function(d) { return (d.event_count - d.error_count - d.timeout_count) > 0; },
    },
    "error": {
        fill: "red",
        textFill: "white",
        textfunc: function(d) { return d.error_count; },
        visfunc: function(d) { return d.error_count > 0; },
    },
    "timeout": {
        fill: "lightblue",
        textFill: "black",
        textfunc: function(d) { return d.timeout_count; },
        visfunc: function(d) { return d.timeout_count > 0; },
    }
}

var numCategories = Object.keys(categories).length;
Object.keys(categories).forEach(function(ele, icat) {
    cells.append("rect")
        .attr("width", cellwidth / numCategories)
        .attr("height", cellheight)
        .attr("x", icat * cellwidth / numCategories)
        .style("fill", function (d) {
            return categories[ele].fill;
        })
        .attr("visibility", function(d) {
            if (!d.data) {
                return "hidden";
            }
            return categories[ele].visfunc(d.data) ? "visible" : "hidden";
        });

    cells.append("text")
        .text(function (d) {
            if (!d.data) {
                return "";
            }

            return categories[ele].textfunc(d.data);
        })
        .attr("x", (icat + 0.5) * cellwidth / numCategories)
        .attr("y", cellheight / 2)
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", "middle")
        .style("fill", categories[ele].textFill)
        .attr("visibility", function(d) { 
            if (!d.data) {
                return "hidden";
            }
            return categories[ele].visfunc(d.data) ? "visible" : "hidden";
        });
});


function targets(clusters) {
    var retval = [];

    for (var cluster of clusters) {
        for (var cluster_stat of cluster.cluster_stats) {
            for (var event of cluster_stat.events) {
                if (event.type == "send_request") {
                    if (retval.indexOf(event.interlocutor) < 0) {
                        retval.push(event.interlocutor);
                    }
                }
            }
        }
    }

    return retval;
}

// Calculate source -> target -> { success: , error: , timeout: }
// It is not a strict adjency matrix, as it has a value (three counts) for each edge.
function adjacencyMatrix(clusters) {
    var retval = {};

    for (var cluster of clusters) {
        for (var cluster_stat of cluster.cluster_stats) {
            for (var event of cluster_stat.events) {
                if (event.type == "send_request") {
                    var source = retval[cluster_stat.service];
                    if (!source) {
                        source = {};
                        retval[cluster_stat.service] = source;
                    }
                    var target = source[event.interlocutor];
                    if (!target) {
                        target = { event_count:0, error_count: 0, timeout_count: 0};
                        source[event.interlocutor] = target;
                    }
                    target.event_count += event.event_count;
                    target.error_count += event.error_count;
                    target.timeout_count += event.timeout_count;
                }
            }
        }
    }

    return retval;
}