#!/usr/bin/env python3

#
# cluster_traces.py provides a command-line equivalent of the REST
# call traces/timelines/clusters which is implemented by
# istio_analytics_restapi/api/distributed_tracing/endpoints/traces.py#TraceCluster()
#
# The input file should look like the data returned by Zipkin's {baseurl}/traces/
#

import json
import sys

import istio_analytics_restapi.api.distributed_tracing.zipkin_util as zipkin_util
import istio_analytics_restapi.analytics.distributed_tracing as distributed_tracing

def main():

    if len(sys.argv) != 2:
        sys.exit("usage: cluster_traces.py <filename>")

    json_file = sys.argv[1]
    json_data = open(json_file)
    zipkin_trace_list = json.load(json_data)

    # Verify that this is traces, not spans
    if not isinstance(zipkin_trace_list, list):
        sys.stderr.write('filename not a list of traces\n')
        return 1
    if not isinstance(zipkin_trace_list[0], list):
        sys.stderr.write('filename not a list of traces (perhaps it is spans)\n')
        return 1
    if 'traceId' not in zipkin_trace_list[0][0]:
        sys.stderr.write('filename not a list of traces (no traceId)\n')
        return 1

    # zipkin_span_list = json.load(json_data)
    # zipkin_trace_list = [zipkin_span_list]
    assert isinstance(zipkin_trace_list, list), "file should contain a Zipkin trace but zipkin_trace_list is a {}".format(type(zipkin_trace_list))
    assert isinstance(zipkin_trace_list[0], list), "file should contain a Zipkin trace but zipkin_trace_list[0] is a {}".format(type(zipkin_trace_list[0]))
    assert isinstance(zipkin_trace_list[0][0], dict), "file should contain a Zipkin trace but zipkin_trace_list[0][0] is a {}".format(type(zipkin_trace_list[0][0]))
    timelines = zipkin_util.zipkin_trace_list_to_timelines(zipkin_trace_list)
    # printTimelines(timelines)
    clusters = distributed_tracing.cluster_traces(timelines)
    print(json.dumps(clusters))

def printTimelines(timelines):
    print("Found", len(timelines), "timelines")
    for timeline in timelines:
        print("   request", timeline["request"], "trace_id", timeline["trace_id"],
              len(timeline["timelines"]), "timelines")
        for tl2 in timeline["timelines"]:
            printTimeline(tl2)

def printTimeline(timeline):
    print("      Service", timeline["service"], "has", len(timeline["events"]), "events")

# Standard boilerplate to call the main() function to begin
# the program.
if __name__ == '__main__':
  main()
