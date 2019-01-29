'use strict';

function units(d) {
    return d.type
}

// TODO the width and height should come from the <svg> node, not JavaScript.
var margin = {top: 10, right: 10, bottom: 10, left: 10};

var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d); },
    color = d3.scaleOrdinal(d3.schemeCategory20);

function prepareSankey(chartId, $scope) {
    var rawSVG = d3.select(chartId);
    var width = rawSVG.attr("width") - margin.left - margin.right;
    var height = rawSVG.attr("height") - margin.top - margin.bottom;

    // Create a canvas within the margins
    var svg = rawSVG
        .append("g")
            .attr("class", "sankey_canvas")
            .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");

    var sankey = d3.sankey()
        .nodeWidth(36)
        .nodePadding(10)
        .size([width, height * 0.67]);

    // Save our global variables so we can use them in showSankey()
    return { rawSVG: rawSVG, svg: svg, sankey: sankey };
}

function showSankey(traceList, context) {
    var sankey = context.sankey;
    var path = sankey.link(); // path is a function

    var rawSVG = context.rawSVG;
    var svg = context.svg;

    // At this point convert traceList into nodes and links.
    // nodes is a list of {name:<string>}
    // links is a list of {"source":<string>,"target":<string>,"value":<number as string>,
    // "type":"normal" or "bad_codes" or "timeout" (or other strings in sankey.css)}

    var sankeyLinks = istioAnalyticsToGraph(traceList);
    var sankeyNodes = getSankeyNodesFromLinks(sankeyLinks);

    var graph = {
            nodes: sankeyNodes,
            links: sankeyLinks
    };

    // var sankey_data = JSON.parse(serializedSankeyData);

    var nodeMap = {};
    graph.nodes.forEach(function(x) { nodeMap[x.name] = x; });
    graph.links = graph.links.map(function(x) {
      return {
        source: nodeMap[x.source],
        target: nodeMap[x.target],
        value: x.value,
        type: x.type
      };
    });

    sankey
      .nodes(graph.nodes)
      .links(graph.links)
      .layout(32);

    // Remove any previously created graphs
    svg.selectAll(".link").remove();
    svg.selectAll(".node").remove();

    // add in the links
    var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("path")
        // Set two classes, "link" (so we can find all the links) and
        // "normal_link" (so we can get CSS attributes specific to the type normal/bad_codes/timeout)
        .attr("class", function(d) { return "link " + d.type + "_link" })
        .attr("d", path)  // The d attribute is a string containing a series of path descriptions
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy; });

    // add the link titles
    link.append("title")
        .text(function(d) {
        return d.source.name + " → " + 
                d.target.name + "\n" + format(d.value) + " " + d.type; });

    // add in the nodes
    var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")"; })
      .call(d3.drag()
          .on("start", function() {
              this.parentNode.appendChild(this); // TODO use raise() like https://bl.ocks.org/d3noob/204d08d309d2b2903e12554b0aef6a4d
          })
          .on("drag", dragmove)
      );
 
// add the rectangles for the nodes
  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { 
          return d.color = color(d.name.replace(/ .*/, "")); })
      .style("stroke", function(d) { 
          return d3.rgb(d.color).darker(2); })
    .append("title")
      .text(function(d) {
          return d.name + "\n" + format(d.value) + " calls"; });

  // add the title for the nodes
  node.append("text")
      //.attr("y", function(d) { return d.dy / 2; })
      // .attr("dy", ".35em")
      .attr("transform", function(d) {
          return "rotate(90) translate({x} {y})"
              .replace("{y}", sankey.nodeWidth() / -2)
              .replace("{x}", d.dy / 2);
      })
      .text(function(d) { return d.name; })
      //.attr("x", 0)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle");

    // The function for moving the nodes
    function dragmove(d) {
      // Move the node
      d3.select(this).attr("transform",
          "translate(" + (
                 d.x = Math.max(0, Math.min(rawSVG.attr("width") - d.dx, d3.event.x))
              ) + "," + (
                     d.y = Math.max(0, Math.min(rawSVG.attr("height") - d.dy, d3.event.y))
              ) + ")");
      // Move the links
      sankey.relayout();
      svg.selectAll(".link").attr("d", path);
  }
}

//istioAnalyticsToGraph generates a table of the form
//{"source": <string>, "target": <string>, "value": <string thickness>, "type": "normal"},
//type can also be "timeout" or "bad_codes"
//"source" is "internet" or a hostname, or a incoming or outgoing nickname
//"target" is an internal or remote hostname, or a incoming or outgoing nickname
function istioAnalyticsToGraph(traceList) {

    // string source -> string target -> string type -> int count
    var accum = {};

    // console.log("found " + traceList.length + " traces");

    for (var trace of traceList) {
        for (var span of trace.spans) {
            // console.log("span is " + JSON.stringify(trace));
            // span will look like
            // {"span_id":"00000045989004b2",
            //  "parent_span_id":null,
            //  "source_ip":"172.17.0.7",
            //  "source_name":"ingress",
            //  "target_ip":"172.17.0.23",
            //  "target_name":"192.168.64.2",
            //  "request":"GET /productpage",
            //  "request_size":0,
            //  "protocol":"HTTP/1.1",
            //  "response_size":4618,
            //  "response_code":200,
            //  "user_agent":"curl/7.51.0",
            //  "cs":1505849364836135,
            //  "sr":1505849364836876,
            //  "ss":1505849364891668,
            //  "cr":1505849364892409}

            // Detect self-calls
            if (span.source_name == span.target_name) {
                console.log("Ignoring self-call span for "
                        + span.source_name + ".  trace_id= " + trace.trace_id + " span_id=" + span.span_id);
                continue;
            }

            var src = accum[span.source_name];
            if (src == undefined) {
                src = {};
                accum[span.source_name] = src;
            }

            var dst = src[span.target_name];
            if (dst == undefined) {
                dst = {};
                src[span.target_name] = dst;
            }

            var category = "normal";
            if (span.response_code <= 0) {
                category = "timeout";
            } else if (span.response_code >= 400) {
                category = "bad_codes";
            }

            // In this version we will just count but we could look at the timings instead
            dst[category] = (dst[category] || 0) + 1;
        }
    }

    var retval = [];

    for (var source in accum) {
        var targets = accum[source];
        for (var target in targets) {
            var categories = targets[target];
            for (var typ in categories) {
                retval.push({
                    source: source,
                    target: target,
                    type: typ,
                    value: categories[typ],
                });
            }
        }
    }

    return retval
}

function getSankeyNodesFromLinks(rows) {
    var nodes = {};

    for (var row of rows) {
        nodes[row.source] = true;
        nodes[row.target] = true;
    }

    var names = Object.keys(nodes);
    names.sort();   // Sort so that the colors are rendered consistently by sankey.html
    return names.map(function (name) {
        return { name: name };
    });
}
