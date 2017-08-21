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
import istio_analytics_restapi.api.distributed_tracing.responses as zipkin_constants

import istio_analytics_restapi.util.time_util
from istio_analytics_restapi.zipkin.zipkin_client import ZipkinClient

import istio_analytics_restapi.api.distributed_tracing.zipkin_util as zipkin_util
import istio_analytics_restapi.api.distributed_tracing.request_parameters as request_parameters
import istio_analytics_restapi.api.distributed_tracing.responses as responses

distributed_tracing_namespace = api.namespace('distributed_tracing',
                                              description='Analytics on distributed-tracing data')

zipkin_client = ZipkinClient(os.getenv(constants.ISTIO_ANALYTICS_ZIPKIN_HOST_ENV))

def process_common_parameters(request_body):
    '''Helper method used to process common REST parameters.

    @param request_body (dictionary): Dictionary containing the following keys
    identifying request-body parameters:
      @see: request_parameters.START_TIME_PARAM_STR (ISO8601 datetime)
      @see: request_parameters.END_TIME_PARAM_STR (ISO8601 datatime)
      @see: request_parameters.MAX_TRACES_PARAM_STR (integer)

    @rtype: tuple(integer, integer, integer)
    @return: The values of the parameters start time, end time, and max number of traces.
             Note that the returned times are in millisecond epoch time
    '''
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
    return start_time_milli, end_time_milli, max_traces

##################################
##################################
######      REST API        ######
##################################
##################################

@distributed_tracing_namespace.route('/traces')
class Traces(Resource):

    @api.expect(request_parameters.trace_list_body_parameters, validate=True)
    @api.marshal_with(responses.trace_list_response)
    def post(self):
        '''Retrieves a list of traces given a time interval

        Each trace in the returned list is described in a compact way, similar to how Zipkin
        represents traces.
        '''
        log.info('Started processing request to get traces')
        request_body = request.json
        start_time_milli, end_time_milli, max_traces = process_common_parameters(request_body)

        # Call Zipkin
        traces_or_error_msg, http_code = \
            zipkin_client.get_traces(start_time_milli, end_time_milli, max_traces=max_traces)

        if http_code == 200:
            zipkin_host = os.getenv(constants.ISTIO_ANALYTICS_ZIPKIN_HOST_ENV)
            ret_val = {
                zipkin_constants.ZIPKIN_URL_STR: zipkin_host
            }
            ret_val[zipkin_constants.TRACES_STR] = \
                zipkin_util.zipkin_trace_list_to_istio_analytics_trace_list(json.loads(traces_or_error_msg))
        else:
            log.warn(traces_or_error_msg)
            ret_val = build_http_error(traces_or_error_msg, http_code)

        log.info('Finished processing request to get traces')
        return ret_val

@distributed_tracing_namespace.route('/traces/timelines')
class Timelines(Resource):

    @api.expect(request_parameters.timelines_body_parameters, validate=True)
    @api.marshal_with(responses.timelines_response)
    def post(self):
        '''
        Returns timelines for each trace found in the given time interval

        This method gets a list of traces and converts each trace into a  list of events
        sorted chronologically. Each microservice in a trace is given its own list of events.

        Besides time of occurrence and duration, other important pieces of metadata are associated with
        the events.

        The following event types are reported:

        * `send_request`: indicates when a microservice called another. The duration of this event is
        the time it took the request to reach its destination (communication time).

        * `process_request`: indicates when a microservice processed a call made by another. The duration
        of this event is the interval between the time when the request was received and that when the
        microservice in question either made a call or sent the response to the caller.

        * `send_response`: indicates when a microservice sent the response to a call it had received. The
        duration of this event is the time it took the response to reach its destination (communication
        time).

        * `process_response`: indicates when a microservice processed the response to a call it had made.
        The duration of this event is the interval between the time when the response was received
        and that when the microservice in question either made another call or sent the response to a previous
        call.
        '''
        log.info('Started processing request to get timelines')
        request_body = request.json
        start_time_milli, end_time_milli, max_traces = process_common_parameters(request_body)

        # Call Zipkin
        traces_or_error_msg, http_code = \
            zipkin_client.get_traces(start_time_milli, end_time_milli, max_traces=max_traces)

        if http_code == 200:
            zipkin_host = os.getenv(constants.ISTIO_ANALYTICS_ZIPKIN_HOST_ENV)
            ret_val = {
                zipkin_constants.ZIPKIN_URL_STR: zipkin_host
            }
            ret_val[zipkin_constants.TRACES_TIMELINES_STR] = \
                zipkin_util.zipkin_trace_list_to_timelines(json.loads(traces_or_error_msg))
        else:
            log.warn(traces_or_error_msg)
            ret_val = build_http_error(traces_or_error_msg, http_code)

        log.info('Finished processing request to get timelines')
        return ret_val

# @distributed_tracing_namespace.route('/traces/timelines/cluster')
# class TraceCluster(Resource):
#       
#     @api.expect(request_parameters.timelines_body_parameters, validate=True)
#     def post(self):
#         '''Retrieves clusters of traces timelines given a time interval.'''
# #         pass
# #         
# #            The body-parameter `clustering_algorithm` determines how the clusters are constructed and
# #            how the statistical aggregations are computed.
# #            
# #            Valid values (as string) for the `clustering_algorithm` parameter are:
# #            
# #            * `PLAIN`: groups traces strictly based on the request URL and aggregates
# #            statistics on identical spans without taking into account structural
# #            changes due to, for instance, retries.
# #         '''
# #         log.info('Started processing request to get trace clusters')
# #         request_body = request.json
# #         start_time_milli, end_time_milli, max_traces = process_common_parameters(request_body)
# # 
# #         # Call Zipkin
# #         traces_or_error_msg, http_code = \
# #             zipkin_client.get_traces(start_time_milli, end_time_milli, max_traces=max_traces)
# # 
# #         if http_code == 200:
# #             zipkin_host = os.getenv(constants.ISTIO_ANALYTICS_ZIPKIN_HOST_ENV)
# #             ret_val = {
# #                 zipkin_constants.ZIPKIN_URL_STR: zipkin_host
# #             }
# # 
# #             trace_list = \
# #                 zipkin_util.zipkin_trace_list_to_istio_analytics_trace_list(json.loads(traces_or_error_msg))
# #             
# # 
# #         else:
# #             log.warn(traces_or_error_msg)
# #             ret_val = build_http_error(traces_or_error_msg, http_code)
# #             
# #         log.info('Finished processing request to get trace clusters')
# #         return ret_val
