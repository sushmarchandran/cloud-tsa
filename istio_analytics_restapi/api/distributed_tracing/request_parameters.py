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

trace_list_body_parameters = api.model('trace_list_params', {
    START_TIME_PARAM_STR: fields.DateTime(required=True, dt_format='iso8601',
                            description='ISO8601 timestamp for the beginning of the time range of interest'),
    END_TIME_PARAM_STR: fields.DateTime(required=False, dt_format='iso8601',
                            description='ISO8601 timestamp for the end of the time range of interest; '
                            'if omitted, current time is assumed'),
    MAX_TRACES_PARAM_STR: fields.Integer(required=False, min=1, example=100,
                            description='Maximum number of traces to retrieve; default=100')
})
