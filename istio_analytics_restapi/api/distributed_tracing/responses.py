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
                                 description='The span id (32-bit hex string)'),
    PARENT_SPAN_ID_STR: fields.String(required=True, example='0000999a44d42d65',
                                 description='The parent-span id (32-bit hex string)'),
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
                                description='The trace id (32-bit hex string)'),
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

event_details = api.model('event_details', {
    SPAN_ID_STR: fields.String(required=True, example='0000820a44d42d65',
                                 description='The span id (32-bit hex string)'),
    PARENT_SPAN_ID_STR: fields.String(required=True, example='0000999a44d42d65',
                                 description='The parent-span id (32-bit hex string)'),
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
                                'to the event')
})

timeline_details = api.model('timeline_details', {
    SERVICE_STR: fields.String(required=True, example='orders',
                               description='Microservice name'),
    EVENTS_STR: fields.List(fields.Nested(event_details), required=True)
})

trace_timelines = api.model('trace_timelines', {
    TRACE_ID_STR: fields.String(required=True, example='0000820a44d42d65',
                                description='The trace id (32-bit hex string)'),
    REQUEST_URL_STR: fields.String(required=True, example='GET /orders',
                                description="The URL corresponding to the trace's root request"),
    TIMELINES_STR: fields.List(fields.Nested(timeline_details), required=True)
})

timelines_response = api.model('timelines_response', {
    ZIPKIN_URL_STR: fields.String(required=True, example='http://localhost:9411',
                                  description='URL of the Zipkin service where the tracing data is stored'),
    TRACES_TIMELINES_STR: fields.List(fields.Nested(trace_timelines), required=True,
                            description='Timelines of traces. Each trace is represented by one timeline per, '
                            'microservice, where each timeline is a chronologically-sorted list of events')
})

####
# Schema of the trace clusters produced by POST /distributed_tracing/traces/timelines/clusters
####
ROOT_REQUEST_STR = 'root_request'
CLUSTERS_STR = 'clusters'
CLUSTER_STATS_STR = 'cluster_stats'
TRACE_IDS_STR = 'trace_ids'

MIN_STR = 'min'
MAX_STR = 'max'
MEAN_STR = 'mean'
STD_DEV_STR = 'stddev'
FIRST_QUARTILE_STR = 'first_quartile'
MEDIAN_STR = 'median'
THIRD_QUARTILE_STR = 'third_quartile'
PERCETILE_95_STR = '95th_percentile'
PERCETILE_99_STR = '99th_percentile'

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

event_stat_details = api.model('event_stat_details', {
    EVENT_TYPE_STR: fields.String(required=True, example='send_request',
                                  enum=[EVENT_SEND_REQUEST,
                                        EVENT_SEND_RESPONSE,
                                        EVENT_PROCESS_REQUEST,
                                        EVENT_PROCESS_RESPONSE],
                                  description='The event type'),
    INTERLOCUTOR_STR: fields.String(required=True, example='catalog',
                                    description='The other microservice participating in this event'),
    TRACE_IDS_STR: fields.List(fields.String(required=True, example='0000820a44d42d65',
                                description='The ids (32-bit hex strings) of the traces to which '
                                'the events aggregated under these statistics belong')),
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
                                                  'to the event')
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
                               description='List of all trace ids that are part of this cluster'),
    CLUSTER_STATS_STR: fields.List(fields.Nested(cluster_stats), required=True)
}) 

clusters_response = api.model('clusters_response', {
    ZIPKIN_URL_STR: fields.String(required=True, example='http://localhost:9411',
                                  description='URL of the Zipkin service where the tracing data is stored'),
    CLUSTERS_STR: fields.List(fields.Nested(trace_cluster), required=True,
                            description='Clusters of traces. Each cluster combines similar traces, '
                            'summarizing and aggregating them statistically. Statistics are computed '
                            'for all events of all timelines of all microservices involved.')
})
