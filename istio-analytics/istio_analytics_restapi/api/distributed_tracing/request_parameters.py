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
TAGS_PARAM_STR = 'tags'

trace_list_body_parameters = api.model('trace_list_params', {
    START_TIME_PARAM_STR: fields.DateTime(required=True, dt_format='iso8601',
                            description='ISO8601 timestamp for the beginning of the time range of interest'),
    END_TIME_PARAM_STR: fields.DateTime(required=False, dt_format='iso8601',
                            description='ISO8601 timestamp for the end of the time range of interest; '
                            'if omitted, current time is assumed'),
    MAX_TRACES_PARAM_STR: fields.Integer(required=False, min=1, example=100,
                            description='Maximum number of traces to retrieve; default=100'),
    FILTER_LIST_PARAM_STR: fields.List(fields.String, required=False, example=['istio-mixer','istio-policy'],
                            description='List of service names whose spans will be ignored in processing'),
    TAGS_PARAM_STR: fields.List(fields.String, required=False, example=['tag1_name:value1', 'tag2_name:value2'],
                            description="List of key-value pairs to be used to filter the query results. "
                            "Keys are supposed to refer to tags associated with spans. "
                            "Traces will be selected such that the tag query matches span tags. " 
                            "All key-value pairs in the query must match (AND semantics), but they "
                            "do not have to match all spans; different key-value pairs may match "
                            "different spans")
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
METRIC_REQUIREMENTS_STR = 'metric_requirements'

NAME_PARAM_STR = 'name'
DELTA_MEAN_THRESHOLD_PARAM_STR = 'delta_mean_threshold'
DELTA_STDDEV_THRESHOLD_PARAM_STR = 'delta_stddev_threshold'
DELTA_RATIO_THRESHOLD_PARAM_STR = 'delta_ratio_threshold'
DELTA_MEANABLE_METRIC_THRESHOLD_PARAM_STR = 'delta_meanable_metric_threshold'
DELTA_COUNT_METRIC_THRESHOLD_PARAM_STR = 'delta_count_metric_threshold'
MIN_COUNT_PARAM_STR = 'min_count'
HIGHER_IS_BETTER_PARAM_STR = 'higher_is_better'
METRIC_TYPE_PARAM_STR = 'metric_type'
METRIC_TYPE_MEAN = 'mean'
METRIC_TYPE_COUNT = 'count'

# meanable_metric_requirements_parameters = api.model('metric_requirements_params', {
#     DELTA_MEAN_THRESHOLD_PARAM_STR: fields.Float(required=True, example=0.11,
#                                                  description='Allowable difference in means (as a ratio)'),
#     DELTA_STDDEV_THRESHOLD_PARAM_STR: fields.Float(required=True, example=0.05,
#                                                    description='Allowable difference in standard deviation (as a ratio)'),
# })

# count_metric_requirements_parameters = api.model('metric_requirements_params', {
#     DELTA_RATIO_THRESHOLD_PARAM_STR: fields.Float(required=True, example=0.11,
#                                                  description='Allowable difference in means (as a ratio)'),
# })

metric_requirements_parameters = api.model('metric_requirements_params', {
    NAME_PARAM_STR: fields.String(required=True, example='duration', 
                            description='Label of metric to be evaluated'),
#     DELTA_MEANABLE_METRIC_THRESHOLD_PARAM_STR: fields.Nested(meanable_metric_requirements_parameters, required=False),
#     DELTA_COUNT_METRIC_THRESHOLD_PARAM_STR: fields.Nested(count_metric_requirements_parameters, required=False),
    METRIC_TYPE_PARAM_STR: fields.String(required=True, example='mean',
                                         enum=[METRIC_TYPE_MEAN,
                                               METRIC_TYPE_COUNT],
                                         description='Type of metric indicating how to process it'),
    DELTA_MEAN_THRESHOLD_PARAM_STR: fields.Float(required=False, example=0.2, min=0.0, max=1.0,
                                                 description='Allowable delta mean (as a percentage) for '
                                                 '"mean" metric types'),
    DELTA_STDDEV_THRESHOLD_PARAM_STR: fields.Float(required=False, example=0.1, min=0.0, max=1.0,
                                                   description='Allowable delta standard deviation (as a percentage) '
                                                   'for "mean" metric types'),
    DELTA_RATIO_THRESHOLD_PARAM_STR: fields.Float(required=False, example=0.1, min=0.0, max=1.0,
                                                 description='Allowable delta ratio (as a percentage) for '
                                                 '"count" metric types'),
    MIN_COUNT_PARAM_STR: fields.Integer(required=False, example=100, min=1,
                                         description='Required minimum number of data points needed to gain desired '
                                         'accuracy; default=100'),
    HIGHER_IS_BETTER_PARAM_STR: fields.Boolean(required=False, example=False,
                                                description='Flag indicating whether a higher value (for canary) '
                                                'is better or worse; default=False'),
})

cluster_diff_body_parameters = api.model('cluster_diff_params',{
    BASELINE_STR: fields.Nested(cluster_body_parameters, required=True),
    CANARY_STR: fields.Nested(cluster_body_parameters, required=True),
    METRIC_REQUIREMENTS_STR: fields.List(fields.Nested(metric_requirements_parameters,
                                         example=[{'name': 'duration', 'metric_type': 'mean', 'min_count': 100, 'higher_is_better': False}, {'name': 'error_count', 'metric_type': 'count', 'min_count': 100, 'higher_is_better': False}],
                                         description='List of requirements for metrics to be used to determine success of a canary version of a service.'
    ), required=True)
})