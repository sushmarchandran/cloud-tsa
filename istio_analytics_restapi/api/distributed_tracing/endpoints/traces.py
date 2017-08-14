'''
REST resources for operations related to distributed-tracing analytics
'''
import logging
log = logging.getLogger(__name__)

import os
import json
from flask import request
from flask_restplus import Resource

from istio_analytics_restapi.api.restplus import api
from istio_analytics_restapi.api.restplus import build_http_error
from istio_analytics_restapi.api import constants

import istio_analytics_restapi.util.time_util
from istio_analytics_restapi.zipkin.zipkin_client import ZipkinClient

import istio_analytics_restapi.api.distributed_tracing.zipkin_util as zipkin_util
import istio_analytics_restapi.api.distributed_tracing.request_parameters as request_parameters
import istio_analytics_restapi.api.distributed_tracing.responses as responses

distributed_tracing_namespace = api.namespace('distributed_tracing',
                                              description='Analytics on distributed-tracing data')

zipkin_client = ZipkinClient(os.getenv(constants.ISTIO_ANALYTICS_ZIPKIN_HOST_ENV))

@distributed_tracing_namespace.route('/traces')
class Traces(Resource):

    @api.expect(request_parameters.trace_list_body_parameters, validate=True)
    @api.marshal_with(responses.trace_list_response)
    def post(self):
        '''Retrieves all traces given a time interval'''
        log.info('Processing request to get traces')
        request_body = request.json

        # Start time is a required parameter
        start_time = request_body[request_parameters.START_TIME_PARAM_STR]
        log.debug(u'Original start_time = {0}'.format(start_time))

        start_time_milli = istio_analytics_restapi.util.time_util.iso8601_to_milliseconds_epoch(start_time)

        # If end time is not given, default to current time
        if request_parameters.END_TIME_PARAM_STR in request_body:
            end_time = request_body[request_parameters.END_TIME_PARAM_STR]
            log.debug(u'Original end_time = {0}'.format(end_time))
            end_time_milli = istio_analytics_restapi.util.time_util.iso8601_to_milliseconds_epoch(end_time)
        else:
            log.debug(u'end_time parameter was omitted; defaulting to current time')
            end_time_milli = istio_analytics_restapi.util.time_util.current_milliseconds_epoch_time()

        # If max is not given, default to 100
        max_traces = (request_body[request_parameters.MAX_TRACES_PARAM_STR]
                      if request_parameters.MAX_TRACES_PARAM_STR in request_body
                      else 100)

        log.debug(u'Parameters: start_time = {0}; end_time = {1}; max = {2}'.
                  format(start_time_milli, end_time_milli, max_traces))

        # Call Zipkin
        traces_or_error_msg, http_code = \
            zipkin_client.get_traces(start_time_milli, end_time_milli, max_traces=max_traces)

        log.info('Finished processing request to get traces')
        if http_code == 200:
            # ret_val = json.loads(traces_or_error_msg)
            zipkin_host = os.getenv(constants.ISTIO_ANALYTICS_ZIPKIN_HOST_ENV)
            ret_val = \
                zipkin_util.zipkin_trace_list_to_istio_analytics_trace_list(json.loads(traces_or_error_msg),
                                                                            zipkin_host)
        else:
            log.warn(traces_or_error_msg)
            ret_val = build_http_error(traces_or_error_msg, http_code)
        return ret_val

# @distributed_tracing_namespace.route('/traces/cluster')
# class TraceCluster(Resource):
#     def post(self):
#         pass