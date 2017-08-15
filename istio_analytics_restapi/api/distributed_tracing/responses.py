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
    PARENT_SPAN_ID_STR: fields.String(required=True, example='0000820a44d42d65',
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
