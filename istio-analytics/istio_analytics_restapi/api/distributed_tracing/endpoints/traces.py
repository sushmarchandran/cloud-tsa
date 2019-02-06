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
import istio_analytics_restapi.api.distributed_tracing.responses as client_constants

import istio_analytics_restapi.util.time_util

import istio_analytics_restapi.api.distributed_tracing.request_parameters as request_parameters
import istio_analytics_restapi.api.distributed_tracing.responses as responses

import istio_analytics_restapi.trace_backend.client_adapter as client_adapter

import istio_analytics_restapi.analytics.distributed_tracing as distributed_tracing

distributed_tracing_namespace = api.namespace('distributed_tracing',
                                              description='Analytics on distributed-tracing data')
trace_client = client_adapter.get_trace_client()

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
        filter_list = ["istio-mixer", "istio-policy"]

    # Check if tags and values were passed as parameters
    tags = None
    if request_parameters.TAGS_PARAM_STR in request_body:
        tags = request_body[request_parameters.TAGS_PARAM_STR]

    log.debug(u'Parameters: start_time = {0}; end_time = {1}; max = {2}; filter_list = {3}; tags = {4}'.
              format(start_time_milli, end_time_milli, max_traces, filter_list, tags))
    return start_time_milli, end_time_milli, max_traces, filter_list, tags

def init_response():
    '''Initialize a response with common information
    '''
    response = {}
    trace_backend = os.getenv(constants.ISTIO_ANALYTICS_TRACE_BACKEND_ENV)
    response[client_constants.TRACE_BACKEND_STR] = trace_backend

    skydive_host = os.getenv(constants.ISTIO_ANALYTICS_SKYDIVE_HOST_ENV)
    skydive_override = os.getenv(constants.ISTIO_ANALYTICS_SKYDIVE_OVERRIDE_ENV)
    response[client_constants.SKYDIVE_URL_STR] = skydive_host or skydive_override

    server_url = os.getenv(constants.ISTIO_ANALYTICS_TRACE_SERVER_URL_ENV)
    server_override = os.getenv(constants.ISTIO_ANALYTICS_TRACE_SERVER_OVERRIDE_ENV)
    response[client_constants.TRACE_SERVER_URL_STR] = server_override or server_url
    return response
def process_metric_requirements(request_body):
    '''Helper method used to process common REST parameters.

    @param request_body (dictionary): Dictionary containing the outer key 
    request_parameters.METRIC_REQUIREMENTS_STR and the following inner keys:
      @see: request_parameters.NAME_PARAM_STR (string)
      @see: request_parameters.METRIC_TYPE_PARAM_STR (string)
      @see: request_parameters.DELTA_RATIO_THRESHOLD_PARAM_STR (float)
      @see: request_parameters.DELTA_MEAN_THRESHOLD_PARAM_STR (float)
      @see: request_parameters.DELTA_STDDEV_THRESHOLD_PARAM_STR (float)
      @see: request_parameters.MIN_COUNT_PARAM_STR (integer)
      @see: request_parameters.HIGHER_IS_BETTER_PARAM_STR (boolean)

    @rtype: tuple(dict, string)
    @return: If parameter validation is successful, it returns a tuple containing 
        the dictionary passed as parameter with default values set if needed and None.
        In case parameter validation indicates an error, it returns a tuple containing
        None and a string with an appropriate error message.
    '''
    metric_requirements = \
        request_body[request_parameters.METRIC_REQUIREMENTS_STR]

    for metric_req in metric_requirements:
        # name is a required parameter; so, it is validated by Swagger.
        metric_name = metric_req[request_parameters.NAME_PARAM_STR]

        # metric_type is a required parameter; so, it is validated by Swagger.
        metric_type = metric_req[request_parameters.METRIC_TYPE_PARAM_STR]

        if metric_type == request_parameters.METRIC_TYPE_MEAN:
            # if metric_type is "mean" then expect delta_mean_threshold and delta_stddev_threshold
            if request_parameters.DELTA_RATIO_THRESHOLD_PARAM_STR in metric_req:
                error_msg = (u'Incorrect specification for metric {0}: '
                              'parameter {1} does not make sense for "mean" metric type').\
                    format(metric_name, request_parameters.DELTA_RATIO_THRESHOLD_PARAM_STR)
                log.debug(error_msg)
                return None, error_msg
            elif (not request_parameters.DELTA_MEAN_THRESHOLD_PARAM_STR in metric_req or
                  not request_parameters.DELTA_STDDEV_THRESHOLD_PARAM_STR in metric_req):
                error_msg = (u'Incorrect specification for metric {0}: '
                              'Parameters {1} and {2} are required for "mean" metric type').\
                    format(metric_name, request_parameters.DELTA_MEAN_THRESHOLD_PARAM_STR,
                           request_parameters.DELTA_STDDEV_THRESHOLD_PARAM_STR)
                log.debug(error_msg)
                return None, error_msg
        else:
            # if metric_type is "count" then expect delta_ratio_threshold
            if (request_parameters.DELTA_MEAN_THRESHOLD_PARAM_STR in metric_req or
                request_parameters.DELTA_STDDEV_THRESHOLD_PARAM_STR in metric_req):
                error_msg = (u'Incorrect specification for metric {0}: '
                              'parameters {1} and {2} do not make sense for "count" metric type').\
                    format(metric_name, request_parameters.DELTA_MEAN_THRESHOLD_PARAM_STR,
                           request_parameters.DELTA_STDDEV_THRESHOLD_PARAM_STR)
                log.debug(error_msg)
                return None, error_msg
            elif not request_parameters.DELTA_RATIO_THRESHOLD_PARAM_STR in metric_req:
                error_msg = (u'Incorrect specification for metric {0}: '
                              'parameter {1} is required for "count" metric type').\
                    format(metric_name, request_parameters.DELTA_RATIO_THRESHOLD_PARAM_STR)
                return None, error_msg

        if not request_parameters.MIN_COUNT_PARAM_STR in metric_req:
            log.debug(u'min_count parameter was omitted for metric {0}; defaulting to 100'.\
                format(metric_name))
            metric_req[request_parameters.MIN_COUNT_PARAM_STR] = 100

        if not request_parameters.HIGHER_IS_BETTER_PARAM_STR in metric_req:
            log.debug(u'higher_is_better parameter was omitted for metric {0}; defaulting to False'.\
                format(metric_name))
            metric_req[request_parameters.HIGHER_IS_BETTER_PARAM_STR] = False

        log.info(u'Metric requirement parameters: metric name: {0}; details: {1}'.\
            format(metric_name, metric_req))
    return metric_requirements, None

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

        traces_or_error_msg, http_code = \
            trace_client.get_traces(start_time_milli, end_time_milli, max_traces=max_traces, tags=tags)

        if http_code == 200:
            ret_val = init_response()
            ret_val[client_constants.TRACES_STR] = \
                    trace_client.trace_list_to_istio_analytics_trace_list(traces_or_error_msg, filter_list)
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

        traces_or_error_msg, http_code = \
            trace_client.get_traces(start_time_milli, end_time_milli, max_traces=max_traces, tags=tags)

        if http_code == 200:
            ret_val = init_response()
            ret_val[client_constants.TRACES_TIMELINES_STR] = \
                    trace_client.trace_list_to_timelines(traces_or_error_msg, filter_list)
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

        traces_or_error_msg, http_code = \
            trace_client.get_traces(start_time_milli, end_time_milli, max_traces=max_traces, tags=tags)

        if http_code == 200:
            ret_val = init_response()
            traces_timelines = \
                    trace_client.trace_list_to_timelines(traces_or_error_msg, filter_list)
            ret_val[client_constants.CLUSTERS_STR] = \
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

        metric_requirements, error_msg = \
            process_metric_requirements(request_body)
        
        if error_msg:
            # The metric-requirement parameter validation failed
            ret_val, http_code = build_http_error(error_msg, 400)
            log.warn(error_msg)
            flask_restplus.errors.abort(code=http_code, message=error_msg)

        baseline_traces_or_error_msg, http_code = \
                trace_client.get_traces(start_time_milli_baseline,
                                        end_time_milli_baseline,
                                        max_traces=max_traces_baseline,
                                        tags=tags_baseline)
        
        if http_code == 200:
            ret_val = init_response()
            canary_traces_or_error_msg, http_code = \
                trace_client.get_traces(start_time_milli_canary,
                                        end_time_milli_canary,
                                        max_traces=max_traces_canary,
                                        tags=tags_canary)
            if http_code != 200:
                    log.warn(canary_traces_or_error_msg)
                    ret_val, http_code = build_http_error(canary_traces_or_error_msg, http_code)
                    flask_restplus.errors.abort(code=http_code, message=canary_traces_or_error_msg)

            # Cluster the baseline traces
            baseline_traces_timelines = \
                trace_client.trace_list_to_timelines(baseline_traces_or_error_msg, filter_list_baseline)
            baseline_clusters = \
                distributed_tracing.cluster_traces(baseline_traces_timelines)

            # Cluster the canary traces
            canary_traces_timelines = \
                trace_client.trace_list_to_timelines(canary_traces_or_error_msg, filter_list_canary)
            canary_clusters = \
                distributed_tracing.cluster_traces(canary_traces_timelines)

            ret_val[client_constants.CLUSTERS_DIFFS] = \
                distributed_tracing.compare_clusters(baseline_clusters, canary_clusters, metric_requirements)
        else:
                log.warn(baseline_traces_or_error_msg)
                ret_val, http_code = build_http_error(baseline_traces_or_error_msg, http_code)
                flask_restplus.errors.abort(code=http_code, message=baseline_traces_or_error_msg)
        
        log.info('Finished processing request to compare clusters of traces')
        return ret_val