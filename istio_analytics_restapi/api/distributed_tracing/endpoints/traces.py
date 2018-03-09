'''
REST resources for operations related to distributed-tracing analytics
'''
import logging
log = logging.getLogger(__name__)

import os
from flask import request
from flask_restplus import Resource
import flask_restplus.errors

from istio_analytics_restapi.api.restplus import api
from istio_analytics_restapi.api.restplus import build_http_error
from istio_analytics_restapi.api import constants
import istio_analytics_restapi.api.distributed_tracing.responses as zipkin_constants

import istio_analytics_restapi.util.time_util
from istio_analytics_restapi.zipkin.zipkin_client import ZipkinClient

import istio_analytics_restapi.api.distributed_tracing.zipkin_util as zipkin_util
import istio_analytics_restapi.api.distributed_tracing.request_parameters as request_parameters
import istio_analytics_restapi.api.distributed_tracing.responses as responses

import istio_analytics_restapi.analytics.distributed_tracing as distributed_tracing

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
      @see: request_parameters.FILTER_LIST_PARAM_STR(list of strings)
      @see: request_parameters.TAGS_PARAM_STR(list of strings)

    @rtype: tuple(integer, integer, integer, list, list)
    @return: The values of the parameters start time, end time, max number of traces, filter list, and tags.
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
    
    # The list of spans to be filtered out during processing
    if request_parameters.FILTER_LIST_PARAM_STR in request_body:
        filter_list = request_body[request_parameters.FILTER_LIST_PARAM_STR]
    else:
        ## TODO: Remove this constant and add filter option in the analytics UI
        # This is the default service to be filtered out
        filter_list = ["istio-mixer"]

    # Check if tags and values were passed as parameters
    tags = None
    if request_parameters.TAGS_PARAM_STR in request_body:
        tags = request_body[request_parameters.TAGS_PARAM_STR]

    log.debug(u'Parameters: start_time = {0}; end_time = {1}; max = {2}; filter_list = {3}; tags = {4}'.
              format(start_time_milli, end_time_milli, max_traces, filter_list, tags))
    return start_time_milli, end_time_milli, max_traces, filter_list, tags

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

        Each trace in the returned list is described in a compact way, more compact than how Zipkin
        represents traces.
        '''
        log.info('Started processing request to get traces')
        request_body = request.json
        start_time_milli, end_time_milli, max_traces, filter_list, tags = \
            process_common_parameters(request_body)

        # Call Zipkin
        traces_or_error_msg, http_code = \
            zipkin_client.get_traces(start_time_milli, end_time_milli, max_traces=max_traces, tags=tags)

        if http_code == 200:
            zipkin_host = os.getenv(constants.ISTIO_ANALYTICS_ZIPKIN_HOST_ENV)
            zipkin_override = os.getenv(constants.ISTIO_ANALYTICS_ZIPKIN_OVERRIDE_ENV)
            ret_val = {
                zipkin_constants.ZIPKIN_URL_STR: zipkin_override or zipkin_host
            }
            ret_val[zipkin_constants.TRACES_STR] = \
                zipkin_util.zipkin_trace_list_to_istio_analytics_trace_list(traces_or_error_msg, filter_list)
        else:
            log.warn(traces_or_error_msg)
            ret_val, http_code = build_http_error(traces_or_error_msg, http_code)
            flask_restplus.errors.abort(code=http_code, message=traces_or_error_msg)

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
        start_time_milli, end_time_milli, max_traces, filter_list, tags = \
            process_common_parameters(request_body)

        # Call Zipkin
        traces_or_error_msg, http_code = \
            zipkin_client.get_traces(start_time_milli, end_time_milli, max_traces=max_traces, tags=tags)

        if http_code == 200:
            zipkin_host = os.getenv(constants.ISTIO_ANALYTICS_ZIPKIN_HOST_ENV)
            zipkin_override = os.getenv(constants.ISTIO_ANALYTICS_ZIPKIN_OVERRIDE_ENV)
            skydive_host = os.getenv(constants.ISTIO_ANALYTICS_SKYDIVE_HOST_ENV)
            skydive_override = os.getenv(constants.ISTIO_ANALYTICS_SKYDIVE_OVERRIDE_ENV)
            ret_val = {
                zipkin_constants.ZIPKIN_URL_STR: zipkin_override or zipkin_host,
                zipkin_constants.SKYDIVE_URL_STR: skydive_host or skydive_override
            }
            ret_val[zipkin_constants.TRACES_TIMELINES_STR] = \
                zipkin_util.zipkin_trace_list_to_timelines(traces_or_error_msg, filter_list)
        else:
            log.warn(traces_or_error_msg)
            ret_val, http_code = build_http_error(traces_or_error_msg, http_code)
            flask_restplus.errors.abort(code=http_code, message=traces_or_error_msg)

        log.info('Finished processing request to get timelines')
        return ret_val

@distributed_tracing_namespace.route('/traces/timelines/clusters')
class TraceCluster(Resource):

    @api.expect(request_parameters.cluster_body_parameters, validate=True)
    @api.marshal_with(responses.clusters_response)
    def post(self):
        '''Retrieves clusters of traces timelines given a time interval'''
        log.info('Started processing request to get clusters of traces')
        request_body = request.json
        start_time_milli, end_time_milli, max_traces, filter_list, tags = \
            process_common_parameters(request_body)

        # Call Zipkin
        traces_or_error_msg, http_code = \
            zipkin_client.get_traces(start_time_milli, end_time_milli, max_traces=max_traces, tags=tags)

        if http_code == 200:
            zipkin_host = os.getenv(constants.ISTIO_ANALYTICS_ZIPKIN_HOST_ENV)
            zipkin_override = os.getenv(constants.ISTIO_ANALYTICS_ZIPKIN_OVERRIDE_ENV)
            skydive_host = os.getenv(constants.ISTIO_ANALYTICS_SKYDIVE_HOST_ENV)
            skydive_override = os.getenv(constants.ISTIO_ANALYTICS_SKYDIVE_OVERRIDE_ENV)
            ret_val = {
                zipkin_constants.ZIPKIN_URL_STR: zipkin_override or zipkin_host,
                zipkin_constants.SKYDIVE_URL_STR: skydive_host or skydive_override
            }
            traces_timelines = \
                zipkin_util.zipkin_trace_list_to_timelines(traces_or_error_msg, filter_list)
            ret_val[zipkin_constants.CLUSTERS_STR] = \
                distributed_tracing.cluster_traces(traces_timelines)
        else:
            log.warn(traces_or_error_msg)
            ret_val, http_code = build_http_error(traces_or_error_msg, http_code)
            flask_restplus.errors.abort(code=http_code, message=traces_or_error_msg)

        log.info('Finished processing request to get clusters of traces')
        return ret_val

@distributed_tracing_namespace.route('/traces/timelines/clusters/diff')
class TraceClusterDiff(Resource):

    @api.expect(request_parameters.cluster_diff_body_parameters, validate=True)
    @api.marshal_with(responses.clusters_diff_response)
    def post(self):
        '''
        Compares two sets of clusters of traces given two time intervals

        The baseline and canary parameters specify the queries to retrieve the two sets of traces that 
        will be compared. 
        '''
        log.info('Started processing request to compare clusters of traces')
        request_body = request.json

        start_time_milli_baseline, end_time_milli_baseline, max_traces_baseline, \
            filter_list_baseline, tags_baseline = \
            process_common_parameters(request_body[request_parameters.BASELINE_STR])
        start_time_milli_canary, end_time_milli_canary, max_traces_canary, \
            filter_list_canary, tags_canary = \
            process_common_parameters(request_body[request_parameters.CANARY_STR])

        # Call Zipkin to get traces corresponding to the baseline period
        baseline_traces_or_error_msg, http_code = \
            zipkin_client.get_traces(start_time_milli_baseline,
                                     end_time_milli_baseline,
                                     max_traces=max_traces_baseline,
                                     tags=tags_baseline)

        if http_code == 200:
            zipkin_host = os.getenv(constants.ISTIO_ANALYTICS_ZIPKIN_HOST_ENV)
            zipkin_override = os.getenv(constants.ISTIO_ANALYTICS_ZIPKIN_OVERRIDE_ENV)
            skydive_host = os.getenv(constants.ISTIO_ANALYTICS_SKYDIVE_HOST_ENV)
            skydive_override = os.getenv(constants.ISTIO_ANALYTICS_SKYDIVE_OVERRIDE_ENV)
            ret_val = {
                zipkin_constants.ZIPKIN_URL_STR: zipkin_override or zipkin_host,
                zipkin_constants.SKYDIVE_URL_STR: skydive_host or skydive_override
            }

            # Call Zipkin to get traces corresponding to the canary period
            canary_traces_or_error_msg, http_code = \
                zipkin_client.get_traces(start_time_milli_canary,
                                     end_time_milli_canary,
                                     max_traces=max_traces_canary,
                                     tags=tags_canary)
            if http_code != 200:
                log.warn(canary_traces_or_error_msg)
                ret_val, http_code = build_http_error(canary_traces_or_error_msg, http_code)
                flask_restplus.errors.abort(code=http_code, message=canary_traces_or_error_msg)

            # Cluster the baseline traces
            baseline_traces_timelines = \
                zipkin_util.zipkin_trace_list_to_timelines(baseline_traces_or_error_msg, filter_list_baseline)
            baseline_clusters = \
                distributed_tracing.cluster_traces(baseline_traces_timelines)

            # Cluster the canary traces
            canary_traces_timelines = \
                zipkin_util.zipkin_trace_list_to_timelines(canary_traces_or_error_msg, filter_list_canary)
            canary_clusters = \
                distributed_tracing.cluster_traces(canary_traces_timelines)

            ret_val[zipkin_constants.CLUSTERS_DIFFS] = \
                distributed_tracing.compare_clusters(baseline_clusters, canary_clusters)
        else:
            log.warn(baseline_traces_or_error_msg)
            ret_val, http_code = build_http_error(baseline_traces_or_error_msg, http_code)
            flask_restplus.errors.abort(code=http_code, message=baseline_traces_or_error_msg)
 
        log.info('Finished processing request to compare clusters of traces')
        return ret_val