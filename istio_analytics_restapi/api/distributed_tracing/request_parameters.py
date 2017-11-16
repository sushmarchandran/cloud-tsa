'''
Specification of the parameters for the REST API code related to distributed-tracing analytics
'''
from flask_restplus import fields
from istio_analytics_restapi.api.restplus import api

####
# Schema of the request body with the parameters for POST /distributed_tracing/traces/
# to retrieve a list of traces
####
START_TIME_PARAM_STR = 'start_time'
END_TIME_PARAM_STR = 'end_time'
MAX_TRACES_PARAM_STR = 'max'
FILTER_LIST_PARAM_STR = 'filter'

trace_list_body_parameters = api.model('trace_list_params', {
    START_TIME_PARAM_STR: fields.DateTime(required=True, dt_format='iso8601',
                            description='ISO8601 timestamp for the beginning of the time range of interest'),
    END_TIME_PARAM_STR: fields.DateTime(required=False, dt_format='iso8601',
                            description='ISO8601 timestamp for the end of the time range of interest; '
                            'if omitted, current time is assumed'),
    MAX_TRACES_PARAM_STR: fields.Integer(required=False, min=1, example=100,
                            description='Maximum number of traces to retrieve; default=100'),
    FILTER_LIST_PARAM_STR: fields.List(fields.String, required=False, example=['istio-mixer'],
                            description='List of service names whose spans will be ignored in processing')
})

####
# Schema of the request body with the parameters for POST /distributed_tracing/traces/timelines 
#
# Note that this schema inherits from the schema for POST /distributed_tracing/traces/
####
timelines_body_parameters = api.inherit('timelines_params',
                                        trace_list_body_parameters, {
})

####
# Schema of the request body with the parameters for POST /distributed_tracing/traces/timelines/cluster
#
# Note that this schema inherits from the schema for POST /distributed_tracing/traces/
####
cluster_body_parameters = api.inherit('cluster_params',
                                      trace_list_body_parameters, {
})

####
# Schema of the request body with the parameters for POST /distributed_tracing/traces/timelines/cluster/diff
#
####
BASELINE_STR = 'baseline'
CANARY_STR = 'canary'

cluster_diff_body_parameters = api.model('cluster_diff_params',{
    BASELINE_STR: fields.Nested(cluster_body_parameters, required=True),
    CANARY_STR: fields.Nested(cluster_body_parameters, required=True)
})