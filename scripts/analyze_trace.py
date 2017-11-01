#!/usr/bin/env python

import json
import sys

import istio_analytics_restapi.api.distributed_tracing.zipkin_util

def main():

    if len(sys.argv) != 2:
        sys.exit("usage: analyze_trace.py <filename>")

    json_file = sys.argv[1]
    json_data=open(json_file)
    zipkin_trace_list = json.load(json_data)
    parsed = istio_analytics_restapi.api.distributed_tracing.zipkin_util.zipkin_trace_list_to_timelines(zipkin_trace_list)
    print json.dumps(parsed)

# Standard boilerplate to call the main() function to begin
# the program.
if __name__ == '__main__':
  main()
