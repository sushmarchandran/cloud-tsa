'''
Specification of the responses for the REST API code related to distributed-tracing analytics
'''
from flask_restplus import fields
from istio_analytics_restapi.api.restplus import api

####
# Schema of the list of traces produced by POST /distributed_tracing/traces/
####
ZIPKIN_URL_STR = 'zipkin_url'
TRACES_STR = 'trace_list'
SPANS_STR = 'spans'

TRACE_ID_STR = 'trace_id'
SPAN_ID_STR = 'span_id'
PARENT_SPAN_ID_STR = 'parent_span_id'
SOURCE_IP_STR = 'source_ip'
SOURCE_NAME_STR = 'source_name'
TARGET_IP_STR = 'target_ip'
TARGET_NAME_STR = 'target_name'
REQUEST_URL_STR = 'request'
REQUEST_SIZE_STR = 'request_size'
PROTOCOL_STR = 'protocol'
RESPONSE_SIZE_STR = 'response_size'
RESPONSE_CODE_STR = 'response_code'
USER_AGENT_STR = 'user_agent'
CLIENT_SEND_TIMESTAMP_STR = 'cs'
CLIENT_RECEIVE_TIMESTAMP_STR = 'cr'
SERVER_RECEIVE_TIMESTAMP_STR = 'sr'
SERVER_SEND_TIMESTAMP_STR = 'ss'

span_details = api.model('span_details', {
    SPAN_ID_STR: fields.String(required=True, example='0000820a44d42d65',
                                 description='The span id (64-bit hex string)'),
    PARENT_SPAN_ID_STR: fields.String(required=True, example='0000999a44d42d65',
                                 description='The parent-span id (64-bit hex string)'),
    SOURCE_IP_STR: fields.String(required=True, example='172.30.88.229',
                                 description='The IP address of the microservice that made the call'),
    SOURCE_NAME_STR: fields.String(required=True, example='my_service_1',
                                 description='The name of the microservice that made the call'),                            
    TARGET_IP_STR: fields.String(required=True, example='172.30.88.250',
                                 description='The IP address of the microservice to which the call was intended'),
    TARGET_NAME_STR: fields.String(required=True, example='my_service_2',
                                 description='The name of the microservice to which the call was intended'),
    REQUEST_URL_STR: fields.String(required=True, example='GET /orders',
                                 description='The URL corresponding to the call'),
    REQUEST_SIZE_STR: fields.Integer(required=True, example=1296, min=0,
                                 description='The size in bytes of the data sent by the caller'),
    PROTOCOL_STR: fields.String(required=True, example='HTTP/1.1',
                                 description='The protocol used for the call'),
    RESPONSE_SIZE_STR: fields.Integer(required=True, example=6743, min=0,
                                 description='The size in bytes of the response returned by the target'),
    RESPONSE_CODE_STR: fields.Integer(required=True, example=200, min=0,
                                 description='The response code (e.g., HTTP code) returned by the target'),
    USER_AGENT_STR: fields.String(required=True, example='python-requests/2.11.1',
                                 description='String representing what code or library the call originated from'),
    CLIENT_SEND_TIMESTAMP_STR: fields.Integer(required=True, example=1502228258105333,
                                 description='Timestamp in microsecond epoch time indicating '
                                 'when the call (request) was made by the source'),
    SERVER_RECEIVE_TIMESTAMP_STR: fields.Integer(required=True, example=1502228258135333,
                                 description='Timestamp in microsecond epoch time indicating '
                                 'when the request was received by the target'),
    SERVER_SEND_TIMESTAMP_STR: fields.Integer(required=True, example=1502228258195333,
                                 description='Timestamp in microsecond epoch time indicating '
                                 'when the response was returned by the target'),
    CLIENT_RECEIVE_TIMESTAMP_STR: fields.Integer(required=True, example=1502228258205333,
                                 description='Timestamp in microsecond epoch time indicating '
                                 'when the response was received by the source')
})

trace = api.model('trace', {
    TRACE_ID_STR: fields.String(required=True, example='0000820a44d42d65', 
                                description='The trace id (64-bit hex string)'),
    SPANS_STR: fields.List(fields.Nested(span_details))
})

trace_list_response = api.model('trace_list_response', {
    ZIPKIN_URL_STR: fields.String(required=True, example='http://localhost:9411',
                                  description='URL of the Zipkin service where the tracing data is stored'),
    TRACES_STR: fields.List(fields.Nested(trace), required=True,
                            description='List of traces. Each trace is represented by a list of spans, '
                            'where each span depicts a call made from one microservice (source) '
                            'to another (target)')                    
})

####
# Schema of the list of traces' timelines produced by POST /distributed_tracing/traces/timelines
####
SKYDIVE_URL_STR = 'skydive_url'
TRACES_TIMELINES_STR = 'traces_timelines'
TIMELINES_STR = 'timelines'
SERVICE_STR = 'service'
EVENTS_STR = 'events'

EVENT_TYPE_STR = 'type'
INTERLOCUTOR_STR = 'interlocutor'
TIMESTAMP_STR = 'timestamp'
DURATION_STR = 'duration'
TIMEOUT_STR = 'timeout'

EVENT_SEND_REQUEST = 'send_request'
EVENT_SEND_RESPONSE = 'send_response'
EVENT_PROCESS_REQUEST = 'process_request'
EVENT_PROCESS_RESPONSE = 'process_response'

SKYDIVE_QUERY_STR = 'skydive_query'

event_details = api.model('event_details', {
    SPAN_ID_STR: fields.String(required=True, example='0000820a44d42d65',
                                 description='The span id (64-bit hex string)'),
    PARENT_SPAN_ID_STR: fields.String(required=True, example='0000999a44d42d65',
                                 description='The parent-span id (64-bit hex string)'),
    EVENT_TYPE_STR: fields.String(required=True, example='send_request',
                                  enum=[EVENT_SEND_REQUEST,
                                        EVENT_SEND_RESPONSE,
                                        EVENT_PROCESS_REQUEST,
                                        EVENT_PROCESS_RESPONSE],
                                  description='The event type'),
    INTERLOCUTOR_STR: fields.String(required=True, example='catalog',
                                    description='The other microservice participating in this event'),
    TIMESTAMP_STR: fields.Integer(required=True, example=1502228258105333,
                                 description='Timestamp in microsecond epoch time indicating '
                                 'when the event has started'),
    DURATION_STR: fields.Integer(required=True, example=3478,
                                 description='Duration of the event in microseconds'),
    REQUEST_URL_STR: fields.String(required=True, example='GET /catalog',
                                 description='The URL corresponding to the event'),
    REQUEST_SIZE_STR: fields.Integer(required=True, example=1296, min=0,
                                 description='The size in bytes of the request related to the event'),
    PROTOCOL_STR: fields.String(required=True, example='HTTP/1.1',
                                 description='The protocol used for the request related to the event'),
    RESPONSE_SIZE_STR: fields.Integer(required=True, example=6743, min=0,
                                 description='The size in bytes of the response related to the event'),
    RESPONSE_CODE_STR: fields.Integer(required=True, example=200, min=0,
                                 description='The response code (e.g., HTTP code) related to the event'),
    USER_AGENT_STR: fields.String(required=True, example='python-requests/2.11.1',
                                 description='String representing what code or library was used '
                                 'to make the request related to the event'),
    TIMEOUT_STR: fields.Integer(required=True, example=10000000,
                                description='Timeout (in microseconds) observed for the request related '
                                'to the event'),
    SKYDIVE_QUERY_STR: fields.String(required=True, example="/topology?filter=G.V().Has('Manager',NE('k8s'),'Docker.Labels.io.kubernetes.container.name', Regex('reviews.*|productpage.*'),'Docker.Labels.io.kubernetes.pod.name', Regex('reviews-v3.*|productpage-v1.*')).Both().Out().Has('Name',Regex('eth0|k8s_reviews.*|k8s_productpage.*')).ShortestPathTo(Metadata('Name','TOR1'))",
                                     description='Skydive query to analyze the network latency at the '
                                     'infrastructure level between the two corresponding endpoints')
})

timeline_details = api.model('timeline_details', {
    SERVICE_STR: fields.String(required=True, example='orders',
                               description='Microservice name'),
    EVENTS_STR: fields.List(fields.Nested(event_details), required=True)
})

trace_timelines = api.model('trace_timelines', {
    TRACE_ID_STR: fields.String(required=True, example='0000820a44d42d65',
                                description='The trace id (64-bit hex string)'),
    REQUEST_URL_STR: fields.String(required=True, example='GET /orders',
                                description="The URL corresponding to the trace's root request"),
    TIMELINES_STR: fields.List(fields.Nested(timeline_details), required=True)
})

timelines_response = api.model('timelines_response', {
    ZIPKIN_URL_STR: fields.String(required=True, example='http://localhost:9411',
                                  description='URL of the Zipkin service where the tracing data is stored'),
    SKYDIVE_URL_STR: fields.String(required=True, example='http://localhost:8082',
                                  description='URL of the Skydive service monitoring the infrastructure network'),
    TRACES_TIMELINES_STR: fields.List(fields.Nested(trace_timelines), required=True,
                            description='Timelines of traces. Each trace is represented by one timeline per '
                            'microservice, where each timeline is a chronologically-sorted list of events')
})

####
# Schema of the trace clusters produced by POST /distributed_tracing/traces/timelines/clusters
####
ROOT_REQUEST_STR = 'root_request'
CLUSTERS_STR = 'clusters'
CLUSTER_STATS_STR = 'cluster_stats'
TRACE_IDS_STR = 'trace_ids'
EVENT_SEQUENCE_NUMBER_STR = 'global_event_sequence_number'

MIN_STR = 'min'
MAX_STR = 'max'
MEAN_STR = 'mean'
STD_DEV_STR = 'stddev'
FIRST_QUARTILE_STR = 'first_quartile'
MEDIAN_STR = 'median'
THIRD_QUARTILE_STR = 'third_quartile'
PERCETILE_95_STR = '95th_percentile'
PERCETILE_99_STR = '99th_percentile'

DURATIONS_AND_CODES_STR = 'durations_and_codes'

EVENT_COUNT_STR = 'event_count'
ERROR_COUNT_STR = 'error_count'
TIMEOUT_COUNT_STR = 'timeout_count'
AVG_TIMEOUT_SEC_STR = 'avg_timeout_seconds'
RETRY_COUNT_STR = 'retry_count'

base_stats = api.model('base_stats', {
    MIN_STR: fields.Float(required=True, example=3.5,
                          description='The mininum data point of the underlying distribution'), 
    MAX_STR: fields.Float(required=True, example=768,
                          description='The maximum data point of the underlying distribution'),
    MEAN_STR: fields.Float(required=True, example=56.8,
                           description='The mean of the underlying distribution'),
    STD_DEV_STR: fields.Float(required=True, example=14.78,
                              description='The standard deviation of the underlying distribution'),
    FIRST_QUARTILE_STR: fields.Float(required=True, example=200,
                                     description='The first quartile of the underlying distribution'),
    MEDIAN_STR: fields.Float(required=True, example=70,
                             description='The median of the underlying distribution'),
    THIRD_QUARTILE_STR: fields.Float(required=True, example=200,
                                     description='The third quartile of the underlying distribution'),
    PERCETILE_95_STR: fields.Float(required=True, example=600,
                                     description='The 95th percentile of the underlying distribution'),
    PERCETILE_99_STR: fields.Float(required=True, example=750,
                                     description='The 99th percentile of the underlying distribution')
})

duration_and_code = api.model('duration_and_code', {
    DURATION_STR: fields.Integer(required=True, example=3478,
                                 description='Duration of one event in microseconds'),
    RESPONSE_CODE_STR: fields.Integer(required=True, example=200, min=0,
                                 description='The response code (e.g., HTTP code) related to the event'),
})

event_stat_details = api.model('event_stat_details', {
    EVENT_TYPE_STR: fields.String(required=True, example='send_request',
                                  enum=[EVENT_SEND_REQUEST,
                                        EVENT_SEND_RESPONSE,
                                        EVENT_PROCESS_REQUEST,
                                        EVENT_PROCESS_RESPONSE],
                                  description='The event type'),
    INTERLOCUTOR_STR: fields.String(required=True, example='catalog',
                                    description='The other microservice participating in this event'),
    REQUEST_URL_STR: fields.String(required=True, example='GET /catalog',
                                 description='The URL corresponding to the event'),
    SKYDIVE_QUERY_STR: fields.String(required=True, example="/topology?filter=G.V().Has('Manager',NE('k8s'),'Docker.Labels.io.kubernetes.container.name', Regex('reviews.*|productpage.*'),'Docker.Labels.io.kubernetes.pod.name', Regex('reviews-v3.*|productpage-v1.*')).Both().Out().Has('Name',Regex('eth0|k8s_reviews.*|k8s_productpage.*')).ShortestPathTo(Metadata('Name','TOR1'))",
                                     description='Skydive query to analyze the network latency at the '
                                     'infrastructure level between the two corresponding endpoints'),
    TRACE_IDS_STR: fields.List(fields.String, required=True,
                                description='The ids (64-bit hex strings) of the traces to which '
                                'the events aggregated under these statistics belong'),
    EVENT_SEQUENCE_NUMBER_STR: fields.Integer(required=True, example=8, min=0,
                                              description='Global event sequence number for the trace'),
    DURATION_STR: fields.Nested(base_stats, required=True,
                                description='Statistics on the duration of the event in microseconds'),
    REQUEST_SIZE_STR: fields.Nested(base_stats, required=True,
                                    description='Statistics on the size in bytes of the request related '
                                    'to the event'),
    RESPONSE_SIZE_STR: fields.Nested(base_stats, required=True,
                                     description='Statistics on the size in bytes of the response '
                                     'related to the event'),
    EVENT_COUNT_STR: fields.Integer(required=True, example=10, min=1,
                                    description='The number of events corresponding to these '
                                                'statistics'),
    ERROR_COUNT_STR: fields.Integer(required=True, example=5, min=0,
                                    description='The number of errors (e.g., 5xx HTTP codes) '
                                                'related to the event'),
    TIMEOUT_COUNT_STR: fields.Integer(required=True, example=3, min=0,
                                      description='The number of timeouts observed for the request related '
                                                  'to the event'),
    AVG_TIMEOUT_SEC_STR: fields.Float(required=True, example=3.3, min=0.0,
                                      description='Average timeout observed for this event'),
    RETRY_COUNT_STR: fields.Integer(required=True, example=3, min=0,
                                    description='The number retries observed for the request related '
                                                  'to the event'),
    DURATIONS_AND_CODES_STR: fields.List(fields.Nested(duration_and_code), required=True,
                                         description='Data points used to compute the duration statistics')
})

cluster_stats = api.model('cluster_stats', {
    SERVICE_STR: fields.String(required=True, example='orders',
                               description='Microservice name'),
    EVENTS_STR: fields.List(fields.Nested(event_stat_details), required=True)
})

trace_cluster = api.model('trace_cluster', {
    ROOT_REQUEST_STR: fields.String(required=True, example='GET /orders',
                                    description='The URL corresponding to the root request for a cluster'),
    TRACE_IDS_STR: fields.List(fields.String, required=True,
                               description='List of all trace ids (64-bit hex strings) that are '
                               'part of this cluster'),
    CLUSTER_STATS_STR: fields.List(fields.Nested(cluster_stats), required=True)
}) 

clusters_response = api.model('clusters_response', {
    ZIPKIN_URL_STR: fields.String(required=True, example='http://localhost:9411',
                                  description='URL of the Zipkin service where the tracing data is stored'),
    SKYDIVE_URL_STR: fields.String(required=True, example='http://localhost:8082',
                                  description='URL of the Skydive service monitoring the infrastructure network'),
    CLUSTERS_STR: fields.List(fields.Nested(trace_cluster), required=True,
                            description='Clusters of traces. Each cluster combines similar traces, '
                            'summarizing and aggregating them statistically. Statistics are computed '
                            'for all events of all timelines of all microservices involved.')
})

####
# Schema of the trace clusters diff produced by POST /distributed_tracing/traces/timelines/clusters/diff
####
BASELINE_TRACE_IDS_STR = 'baseline_trace_ids'
CANARY_TRACE_IDS_STR = 'canary_trace_ids'
CLUSTERS_DIFFS = 'clusters_diffs'
CLUSTER_STATS_DIFF_STR = 'cluster_stats_diff'
BASELINE_STATS_STR = 'baseline_stats'
CANARY_STATS_STR = 'canary_stats'

DELTA_STR = 'delta'

DECISION_STR = 'decision'
OVERALL_DECISION_STR = 'overall_decision'
DECISION_REASON_STR = 'reason'
DELTA_MEAN_STR = 'delta_mean'
DELTA_MEAN_PCT_STR = 'delta_mean_percentage'
DELTA_STDDEV_STR = 'delta_stddev'
DELTA_STDDEV_PCT_STR = 'delta_stddev_percentage'
BASELINE_DATA_POINTS_STR = 'baseline_data_points'
CANARY_DATA_POINTS_STR = 'canary_data_points'

DECISION_BETTER_STR = 'better'
DECISION_WORSE_STR = 'worse'
DECISION_NEEDS_MORE_DATA = 'needs_more_data'

all_stats = api.model('all_stats', {
    TRACE_IDS_STR: fields.List(fields.String, required=True,
                                description='The ids (64-bit hex strings) of the traces to which '
                                'the events aggregated under these statistics belong'),
    EVENT_SEQUENCE_NUMBER_STR: fields.Integer(required=True, example=8, min=0,
                                              description='Global event sequence number for the trace'),
    DURATION_STR: fields.Nested(base_stats, required=True,
                                description='Statistics on the duration of the event in microseconds'),
    REQUEST_SIZE_STR: fields.Nested(base_stats, required=True,
                                    description='Statistics on the size in bytes of the request related '
                                    'to the event'),
    RESPONSE_SIZE_STR: fields.Nested(base_stats, required=True,
                                     description='Statistics on the size in bytes of the response '
                                     'related to the event'),
    EVENT_COUNT_STR: fields.Integer(required=True, example=10, min=1,
                                    description='The number of events corresponding to these '
                                                'statistics'),
    ERROR_COUNT_STR: fields.Integer(required=True, example=5, min=0,
                                    description='The number of errors (e.g., 5xx HTTP codes) '
                                                'related to the event'),
    TIMEOUT_COUNT_STR: fields.Integer(required=True, example=3, min=0,
                                      description='The number of timeouts observed for the request related '
                                                  'to the event'),
    AVG_TIMEOUT_SEC_STR: fields.Float(required=True, example=3.3, min=0.0,
                                      description='Average timeout observed for this event'),
    RETRY_COUNT_STR: fields.Integer(required=True, example=3, min=0,
                                    description='The number retries observed for the request related '
                                                  'to the event'),
    DURATIONS_AND_CODES_STR: fields.List(fields.Nested(duration_and_code), required=True,
                                         description='Data points used to compute the duration statistics')
})

base_delta = api.model('base_delta', {
    DELTA_MEAN_STR: fields.Float(required=True, example=19.3,
                                 description='The difference between canary mean and baseline mean '
                                    'for this metric'),
    DELTA_MEAN_PCT_STR: fields.Float(required=True, example=1.3,
                                 description='(canary_mean - baseline_mean) / baseline_mean '
                                 'for this metric'),
    DELTA_STDDEV_STR: fields.Float(required=True, example=0.5,
                                   description='The difference between canary standard deviation and '
                                   'baseline standard deviation for this metric'),
    DELTA_STDDEV_PCT_STR: fields.Float(required=True, example=0.8,
                                 description='(canary_stddev - baseline_stddev) / baseline_mean '
                                 'for this metric'),
    BASELINE_DATA_POINTS_STR: fields.Integer(required=True, example=100,
                                         description='Number of baseline data points considered for '
                                         'this metric of this event'),
    CANARY_DATA_POINTS_STR: fields.Integer(required=True, example=100,
                                         description='Number of canary data points considered for '
                                         'this metric of this event'),
    DECISION_STR: fields.String(required=True, example=DECISION_NEEDS_MORE_DATA,
                                  enum=[DECISION_BETTER_STR,
                                        DECISION_WORSE_STR,
                                        DECISION_NEEDS_MORE_DATA],
                                  description='Indicates whether or not the canary is better than '
                                  'the baseline with respect to this metric'),
})

delta = api.model('delta', {
    OVERALL_DECISION_STR: fields.String(required=True, example=DECISION_NEEDS_MORE_DATA,
                                  enum=[DECISION_BETTER_STR,
                                        DECISION_WORSE_STR,
                                        DECISION_NEEDS_MORE_DATA],
                                  description='Indicates whether or not the canary is better than '
                                  'the baseline overall'),
    DECISION_REASON_STR: fields.String(required=True, example='Not enough data points',
                                       description='Explanation for the decision made'),
    
    DURATION_STR: fields.Nested(base_delta, required=True,
                                description='Delta between the baseline and canary clusters '
                                'for the duration (in microseconds) of an event'),
    ERROR_COUNT_STR: fields.Nested(base_delta, required=True,
                                description='Delta between the baseline and canary clusters '
                                'for the error count associated with an event')
})

event_stat_diff_details = api.model('event_stat_diff_details', {
    EVENT_TYPE_STR: fields.String(required=True, example='send_request',
                                  enum=[EVENT_SEND_REQUEST,
                                        EVENT_SEND_RESPONSE,
                                        EVENT_PROCESS_REQUEST,
                                        EVENT_PROCESS_RESPONSE],
                                  description='The event type'),
    INTERLOCUTOR_STR: fields.String(required=True, example='catalog',
                                    description='The other microservice participating in this event'),
    REQUEST_URL_STR: fields.String(required=True, example='GET /catalog',
                                 description='The URL corresponding to the event'),
    SKYDIVE_QUERY_STR: fields.String(required=True, example="/topology?filter=G.V().Has('Manager',NE('k8s'),'Docker.Labels.io.kubernetes.container.name', Regex('reviews.*|productpage.*'),'Docker.Labels.io.kubernetes.pod.name', Regex('reviews-v3.*|productpage-v1.*')).Both().Out().Has('Name',Regex('eth0|k8s_reviews.*|k8s_productpage.*')).ShortestPathTo(Metadata('Name','TOR1'))",
                                     description='Skydive query to analyze the network latency at the '
                                     'infrastructure level between the two corresponding endpoints'),
    BASELINE_STATS_STR: fields.Nested(all_stats, required=True, 
                                      description='Aggregation of all statistics computed on a cluster '
                                      'of traces for the baseline period'),
    CANARY_STATS_STR: fields.Nested(all_stats, required=True, 
                                      description='Aggregation of all statistics computed on a cluster '
                                      'of traces for the canary period'),
    DELTA_STR: fields.Nested(delta, required=True,
                             description='Delta between the canary and the baseline clusters')
})

cluster_stats_diff = api.model('cluster_stats_diff', {
    SERVICE_STR: fields.String(required=True, example='orders',
                               description='Microservice name'),
    EVENTS_STR: fields.List(fields.Nested(event_stat_diff_details), required=True)
})

trace_cluster_diff = api.model('trace_cluster_diff', {
    ROOT_REQUEST_STR: fields.String(required=True, example='GET /orders',
                                    description='The URL corresponding to the root request for a cluster'),
    BASELINE_TRACE_IDS_STR: fields.List(fields.String, required=True,
                               description='List of all trace ids (64-bit hex strings) that are part '
                               'of this baseline cluster'),
    CANARY_TRACE_IDS_STR: fields.List(fields.String, required=True,
                               description='List of all trace ids (64-bit hex strings) that are part '
                               'of this canary cluster'),
    CLUSTER_STATS_DIFF_STR: fields.List(fields.Nested(cluster_stats_diff), required=True)
})

clusters_diff_response = api.model('clusters_diff_response', {
    ZIPKIN_URL_STR: fields.String(required=True, example='http://localhost:9411',
                                  description='URL of the Zipkin service where the tracing data is stored'),
    SKYDIVE_URL_STR: fields.String(required=True, example='http://localhost:8082',
                                  description='URL of the Skydive service monitoring the infrastructure network'),
    CLUSTERS_DIFFS: fields.List(fields.Nested(trace_cluster_diff), required=True,
                                description='A list where each element is the comparison of a cluster pair '
                                '(baseline and canary); the compared clusters have the same '
                                'root request')
})
