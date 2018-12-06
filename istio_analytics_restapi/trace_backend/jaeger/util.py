'''
Utilitiy functions to manipulate Jaeger data
'''

import logging
log = logging.getLogger(__name__)

import istio_analytics_restapi.api.distributed_tracing.responses as constants
# Key for Jaeger trace data
JAEGER_TRACE_STR = 'data'

# Keys for Jaeger trace data
TRACE_TRACEID_STR = 'traceID'
TRACE_SPANS_STR = 'spans'
TRACE_PROCESSES_STR = 'processes'
TRACE_WARNINGS_STR = 'warnings'

# Keys used in Jaeger spans
SPAN_TRACEID_STR = 'traceID'
SPAN_SPANID_STR = 'spanID'
SPAN_OPERATION_NAME_STR = 'operationName'
SPAN_REFERENCES_STR = 'references'
SPAN_START_TIME_INT = 'startTime'
SPAN_DURATION_INT = 'duration'
SPAN_LOGS_STR = 'logs'
SPAN_PROCESSID_STR = 'processID'
SPAN_WARNINGS_STR = 'warnings'
SPAN_TAGS_STR = 'tags'

# Keys used in span references
REFERENCE_REFTYPE_STR = 'refType'
REFERENCE_TRACEID_STR = 'traceID'
REFERENCE_SPANID_STR = 'spanID'

# Values of key REFERENCES_REFTYPE_STR
REFERENCE_REFTYPE_CHILD_OF_STR = 'CHILD_OF'

# Key used in tag
TAG_KEY_STR = 'key'
TAG_VALUE_STR = 'value'

# Values of keys in span tags
TAG_KEY_NODE_ID_STR = 'node_id'
TAG_KEY_REQUEST_SIZE_STR = 'request_size'
TAG_KEY_X_REQUEST_ID_STR = 'guid:x-request-id'
TAG_KEY_RESPONSE_CODE_STR = 'http.status_code'
TAG_KEY_RESPONSE_SIZE_STR = 'response_size'
TAG_KEY_USER_AGENT_STR = 'user_agent'
TAG_KEY_COMPONENT_STR = 'component'
TAG_KEY_HTTP_METHOD_STR = 'http.method'
TAG_KEY_HTTP_URL_STR = 'http.url'
TAG_KEY_DOWNSTREAM_CLUSTER_STR = 'downstream_cluster'
TAG_KEY_HTTP_PROTOCOL_STR = 'http.protocol'
TAG_KEY_RESPONSE_FLAGS_STR = 'response_flags'
TAG_KEY_SPAN_KIND_STR = 'span.kind'
TAG_KEY_HOSTNAME_STR = 'hostname'

# Values of key TAG_SPAN_KIND
TAG_SPAN_KIND_CLIENT_STR = 'client'
TAG_SPAN_KIND_SERVER_STR = 'server'

# Keys used in processes data
PROCESS_SERVICE_NAME_STR = 'serviceName'
PROCESS_TAGS_STR = 'tags'
PROCESS_TAG_KEY_STR = 'key'
PROCESS_TAG_VALUE_STR = 'value'
PROCESS_TAG_TYPE_STR = 'type'

# Values of key PROCESSES_TAG_KEY_STR
PROCESS_TAG_KEY_IP_STR = 'ip'

# Services to be skipped in timeline processing
SERVICE_ISTIO_MIXER_STR = 'istio-mixer'
SERVIVE_ISTIO_POLICY_STR = 'istio-policy'

TIMESTAMP_KIND_STR = 'kind'
OPERATION_NAME_STR = 'operation_name'

def filter_span(span, filter_list, processes):
    '''Filters out the span if its service name is in the filter list
    
    @param span: a span in a Jaeger trace
           filter_list: a list of service name
    @rtype: bool
    @return true if the span satisfies the requirements
    '''

    for key in filter_list:
        if processes[span[SPAN_PROCESSID_STR]][PROCESS_SERVICE_NAME_STR] == key:
            return False
    
    return True

def trace_list_to_istio_analytics_trace_list(jaeger_trace_list, filter_list):
    '''Converts a list of traces as returned by Jaeger into the format 
    specified by the REST API POST /distributed_tracing/traces/.

    @param jaeger_trace_list (list): List of traces as returned by Jaeger GET /api/traces/

    @rtype: list
    @return Trace list as specified by POST /distributed_tracing/traces
    '''

    istio_analytics_traces = []
    for trace in jaeger_trace_list:
        istio_analytics_trace = {}
        istio_analytics_trace[constants.TRACE_ID_STR] = trace[TRACE_TRACEID_STR]
        istio_analytics_trace[constants.SPANS_STR] = []
        client_span_dict = {}
        server_span_dict = {}

        for span in trace[TRACE_SPANS_STR]:
            if not filter_span(span, filter_list, trace[TRACE_PROCESSES_STR]):
                continue
            
            log.debug(u'Operation Name: {0}'.format(span[SPAN_OPERATION_NAME_STR]))

            istio_analytics_span = {}
            istio_analytics_span[constants.SPAN_ID_STR] =  span[SPAN_SPANID_STR]
            istio_analytics_span[OPERATION_NAME_STR] =  span[SPAN_OPERATION_NAME_STR]
            if len(span[SPAN_REFERENCES_STR]) > 0 and \
                span[SPAN_REFERENCES_STR][0][REFERENCE_REFTYPE_STR] == REFERENCE_REFTYPE_CHILD_OF_STR:
                istio_analytics_span[constants.PARENT_SPAN_ID_STR] = \
                    span[SPAN_REFERENCES_STR][0][REFERENCE_SPANID_STR]
            
            tag_dict = {}
            for tag in span[SPAN_TAGS_STR]:
                tag_dict[tag[TAG_KEY_STR]] = tag[TAG_VALUE_STR]

            try:
                istio_analytics_span[constants.REQUEST_URL_STR] = tag_dict[TAG_KEY_HTTP_METHOD_STR] + ' ' +\
                    tag_dict[TAG_KEY_HTTP_URL_STR]
                istio_analytics_span[constants.REQUEST_SIZE_STR] = tag_dict[TAG_KEY_REQUEST_SIZE_STR]
                istio_analytics_span[constants.PROTOCOL_STR] = tag_dict[TAG_KEY_HTTP_PROTOCOL_STR]
                istio_analytics_span[constants.RESPONSE_SIZE_STR] = tag_dict[TAG_KEY_RESPONSE_SIZE_STR]
                istio_analytics_span[constants.RESPONSE_CODE_STR] = tag_dict[TAG_KEY_RESPONSE_CODE_STR]
                istio_analytics_span[constants.USER_AGENT_STR] = tag_dict[TAG_KEY_USER_AGENT_STR]
            except Exception as e:
                log.warning(e)
                continue

            if tag_dict[TAG_KEY_SPAN_KIND_STR] == TAG_SPAN_KIND_CLIENT_STR:
                istio_analytics_span[constants.SOURCE_NAME_STR] = \
                    trace[TRACE_PROCESSES_STR][span[SPAN_PROCESSID_STR]][PROCESS_SERVICE_NAME_STR]
                    
                tags = trace[TRACE_PROCESSES_STR][span[SPAN_PROCESSID_STR]][PROCESS_TAGS_STR]
                for tag in tags:
                    if tag[PROCESS_TAG_KEY_STR] == PROCESS_TAG_KEY_IP_STR:
                        istio_analytics_span[constants.SOURCE_IP_STR] = tag[PROCESS_TAG_VALUE_STR]
                        break
                istio_analytics_span[constants.CLIENT_SEND_TIMESTAMP_STR] = \
                    str(span[SPAN_START_TIME_INT])
                istio_analytics_span[constants.CLIENT_RECEIVE_TIMESTAMP_STR] = \
                    str(span[SPAN_START_TIME_INT] + span[SPAN_DURATION_INT])
                client_span_dict[span[SPAN_SPANID_STR]] = istio_analytics_span
        
            if tag_dict[TAG_KEY_SPAN_KIND_STR] == TAG_SPAN_KIND_SERVER_STR:
                istio_analytics_span[constants.TARGET_NAME_STR] = \
                    trace[TRACE_PROCESSES_STR][span[SPAN_PROCESSID_STR]][PROCESS_SERVICE_NAME_STR]

                tags = trace[TRACE_PROCESSES_STR][span[SPAN_PROCESSID_STR]][PROCESS_TAGS_STR]
                for tag in tags:
                    if tag[PROCESS_TAG_KEY_STR] == PROCESS_TAG_KEY_IP_STR:
                        istio_analytics_span[constants.TARGET_IP_STR] = tag[PROCESS_TAG_VALUE_STR]
                        break
                
                istio_analytics_span[constants.SERVER_RECEIVE_TIMESTAMP_STR] = \
                    str(span[SPAN_START_TIME_INT])
                istio_analytics_span[constants.SERVER_SEND_TIMESTAMP_STR] = \
                    str(span[SPAN_START_TIME_INT] + span[SPAN_DURATION_INT])
                server_span_dict[istio_analytics_span[constants.PARENT_SPAN_ID_STR]] = \
                    istio_analytics_span

        log.debug(u'client_spans:{0}, server_spans:{0}'.format(client_span_dict.keys(), server_span_dict.keys()))
        # Combine server spans and client spans together
        for parent_span_id in server_span_dict:
            if parent_span_id in client_span_dict:
                client_span = client_span_dict[parent_span_id]
                server_span = server_span_dict[parent_span_id]
                if not client_span[constants.REQUEST_URL_STR] == server_span[constants.REQUEST_URL_STR]:
                    continue
                client_span[constants.TARGET_IP_STR] = server_span[constants.TARGET_IP_STR]
                client_span[constants.TARGET_NAME_STR] = server_span[constants.TARGET_NAME_STR]
                client_span[constants.SERVER_RECEIVE_TIMESTAMP_STR] = \
                    server_span[constants.SERVER_RECEIVE_TIMESTAMP_STR]
                client_span[constants.SERVER_SEND_TIMESTAMP_STR] = \
                    server_span[constants.SERVER_SEND_TIMESTAMP_STR]

        for span_id in client_span_dict:
            if client_span_dict[span_id].get(constants.TARGET_NAME_STR, None) == None:
                # The server processing part is missing in the span
                # This could be a timeout
                # Read target service name from operation name
                client_span_dict[span_id][constants.TARGET_NAME_STR] = \
                    client_span_dict[span_id][OPERATION_NAME_STR].split('.')[0]
            
            istio_analytics_trace[constants.SPANS_STR].append(client_span_dict[span_id]) 

        if len(istio_analytics_trace[constants.SPANS_STR]) > 0:
            istio_analytics_traces.append(istio_analytics_trace)

    return istio_analytics_traces

def build_and_sort_timestamps(istio_analytics_trace):
    '''Extract timestamps in all spans to build a sorted map

    @param istio_analytics_trace: one trace returned by /distributed_tracing/traces/
    
    @rtype: dict, list
    @return A span dictionary and a timestamp list with sorted keys
    '''

    span_dict = {}
    timestamp_list = []
    for span in istio_analytics_trace[constants.SPANS_STR]:
        span_id = span[constants.SPAN_ID_STR]
        span_dict[span_id] = span
        for ts_kind in constants.CLIENT_SEND_TIMESTAMP_STR,\
                        constants.CLIENT_RECEIVE_TIMESTAMP_STR,\
                        constants.SERVER_SEND_TIMESTAMP_STR,\
                        constants.SERVER_RECEIVE_TIMESTAMP_STR:
            try:            
                timestamp_list.append({
                    TIMESTAMP_KIND_STR: ts_kind,
                    constants.TIMESTAMP_STR: span[ts_kind],
                    constants.SPAN_ID_STR: span_id,
                })
            except Exception:
                continue

    return span_dict, sorted(timestamp_list, key=lambda item:item[constants.TIMESTAMP_STR])

def init_event(span):
    event = {
        constants.SPAN_ID_STR: span[constants.SPAN_ID_STR],
        constants.PARENT_SPAN_ID_STR: span.get(constants.PARENT_SPAN_ID_STR, None),
        constants.REQUEST_URL_STR: span[constants.REQUEST_URL_STR],
        constants.REQUEST_SIZE_STR: span[constants.REQUEST_SIZE_STR],
        constants.PROTOCOL_STR: span[constants.PROTOCOL_STR],
        constants.RESPONSE_SIZE_STR: span[constants.RESPONSE_SIZE_STR],
        constants.RESPONSE_CODE_STR: span[constants.RESPONSE_CODE_STR],
        constants.USER_AGENT_STR: span[constants.USER_AGENT_STR],
    }

    return event

def process_cs_timestamp(span_dict, prev_event, ts_item, trace_timelines, service_dict):
    '''Process CS(Client Send) timestamp item

    @param span_dict: Dictionary of spans with span id as key
    @param prev_event: Last generated event in current trace
    @param ts_item: The current timestamp to be processed
    @param trace_timelines: The timelines dict related to current trace
    @param service_dict: A dictionary from service name to list of events

    @rtype: dictionary
    @return A new event related to the current timestamp
    '''

    span = span_dict[ts_item[constants.SPAN_ID_STR]]

    # Set root request url if necessary and possible
    if trace_timelines[constants.REQUEST_URL_STR] == None and \
        span.get(constants.PARENT_SPAN_ID_STR, None) == None:
        trace_timelines[constants.REQUEST_URL_STR] = span[constants.REQUEST_URL_STR]

    # Generate a SEND_REQUEST event
    event = init_event(span)
    event[constants.EVENT_TYPE_STR] = constants.EVENT_SEND_REQUEST
    event[constants.INTERLOCUTOR_STR] = span[constants.TARGET_NAME_STR]
    event[constants.TIMESTAMP_STR] = span[constants.CLIENT_SEND_TIMESTAMP_STR]
    
    # Process timeout case
    if event[constants.RESPONSE_CODE_STR] == '0':
        event[constants.TIMEOUT_STR] = int(span[constants.CLIENT_RECEIVE_TIMESTAMP_STR]) - \
                                    int(span[constants.CLIENT_SEND_TIMESTAMP_STR])
    elif constants.SERVER_RECEIVE_TIMESTAMP_STR in span: 
        event[constants.DURATION_STR] = int(span[constants.SERVER_RECEIVE_TIMESTAMP_STR]) - \
                                    int(span[constants.CLIENT_SEND_TIMESTAMP_STR])
    else:
        log.warning(u'sr timestamp is missing in span: {0}'.format(span[constants.SPAN_ID_STR]))
        return None
    
    service = span[constants.SOURCE_NAME_STR]
    # Add event to service_dict
    event_list = service_dict.get(service, [])
    event_list.append(event)
    service_dict[service] = event_list
            
    # Process a possible PROCESS_RESPONSE event
    if prev_event and prev_event.get(constants.DURATION_STR, None) == None:
        log.debug(u'prev event: {0}'.format(prev_event))
        prev_event[constants.DURATION_STR] = \
            int(event[constants.TIMESTAMP_STR]) - int(prev_event[constants.TIMESTAMP_STR])
    return event


def process_sr_timestamp(span_dict, prev_event, ts_item, trace_timelines, service_dict):
    '''Process SR(Server Receive) timestamp item

    @param span_dict: Dictionary of spans with span id as key
    @param prev_event: Last generated event in current trace
    @param ts_item: The current timestamp to be processed
    @param trace_timelines: The timelines dict related to current trace
    @param service_dict: A dictionary from service name to list of events

    @rtype: dictionary
    @return A new event related to the current timestamp
    '''
    span = span_dict[ts_item[constants.SPAN_ID_STR]]

    # Generate a PROCESS_REQUEST event
    event = init_event(span)
    event[constants.EVENT_TYPE_STR] = constants.EVENT_PROCESS_REQUEST
    event[constants.INTERLOCUTOR_STR] = span[constants.SOURCE_NAME_STR]
    event[constants.TIMESTAMP_STR] = span[constants.SERVER_RECEIVE_TIMESTAMP_STR]
    event[constants.DURATION_STR] = int(span[constants.SERVER_SEND_TIMESTAMP_STR]) - \
                                    int(span[constants.SERVER_RECEIVE_TIMESTAMP_STR])
                        
    service = span[constants.TARGET_NAME_STR]
    # Add event to service_dict
    event_list = service_dict.get(service, [])
    event_list.append(event)
    service_dict[service] = event_list
            
    return event


def process_ss_timestamp(span_dict, prev_event, ts_item, trace_timelines, service_dict):
    '''Process SS(Server Send) timestamp item

    @param span_dict: Dictionary of spans with span id as key
    @param prev_event: Last generated event in current trace
    @param ts_item: The current timestamp to be processed
    @param trace_timelines: The timelines dict related to current trace
    @param service_dict: A dictionary from service name to list of events

    @rtype: dictionary
    @return A new event related to the current timestamp
    '''

    span = span_dict[ts_item[constants.SPAN_ID_STR]]

    # Generate a SEND_RESPONSE event
    event = init_event(span)

    # Process timeout case
    #if event[constants.RESPONSE_CODE_STR] == 0:
    #    return None

    event[constants.EVENT_TYPE_STR] = constants.EVENT_SEND_RESPONSE
    event[constants.INTERLOCUTOR_STR] = span[constants.SOURCE_NAME_STR]
    event[constants.TIMESTAMP_STR] = span[constants.SERVER_SEND_TIMESTAMP_STR]
    event[constants.DURATION_STR] = int(span[constants.CLIENT_RECEIVE_TIMESTAMP_STR]) - \
                                    int(span[constants.SERVER_SEND_TIMESTAMP_STR])
                        
    service = span[constants.TARGET_NAME_STR]
    # Add event to service_dict
    event_list = service_dict.get(service, [])
    event_list.append(event)
    service_dict[service] = event_list
            
    # Process a possible PROCESS_RESPONSE event
    if prev_event and prev_event.get(constants.DURATION_STR, None) == None:
        prev_event[constants.DURATION_STR] = \
            int(event[constants.TIMESTAMP_STR]) - int(prev_event[constants.TIMESTAMP_STR])
    return event


def process_cr_timestamp(span_dict, prev_event, ts_item, trace_timelines, service_dict):
    '''Process CR(Client Receive) timestamp item

    @param span_dict: Dictionary of spans with span id as key
    @param prev_event: Last generated event in current trace
    @param ts_item: The current timestamp to be processed
    @param trace_timelines: The timelines dict related to current trace
    @param service_dict: A dictionary from service name to list of events

    @rtype: dictionary
    @return A new event related to the current timestamp
    '''
    span = span_dict[ts_item[constants.SPAN_ID_STR]]

    # Generate a PROCESS_RESPONSE event
    event = init_event(span)
    event[constants.EVENT_TYPE_STR] = constants.EVENT_PROCESS_RESPONSE
    event[constants.INTERLOCUTOR_STR] = span[constants.TARGET_NAME_STR]
    event[constants.TIMESTAMP_STR] = span[constants.CLIENT_RECEIVE_TIMESTAMP_STR]
                        
    service = span[constants.SOURCE_NAME_STR]
    # Add event to service_dict
    event_list = service_dict.get(service, [])
    event_list.append(event)
    service_dict[service] = event_list
            
    return event

def process_timestamp(span_dict, prev_event, ts_item, trace_timelines, service_dict):
    '''Process the timestamp item according to its kind and initialize 
    corresponding events

    @param span_dict: Dictionary of spans with span id as key
    @param prev_event: Last generated event in current trace
    @param ts_item: The current timestamp to be processed
    @param trace_timelines: The timelines dict related to current trace
    @param service_dict: A dictionary from service name to list of events

    @rtype: dictionary
    @return A new event related to the current timestamp
    '''
    switcher = {
        constants.CLIENT_SEND_TIMESTAMP_STR: process_cs_timestamp,
        constants.CLIENT_RECEIVE_TIMESTAMP_STR: process_cr_timestamp,
        constants.SERVER_SEND_TIMESTAMP_STR: process_ss_timestamp,
        constants.SERVER_RECEIVE_TIMESTAMP_STR: process_sr_timestamp,
    }
    # Get the function from switcher dictionary
    func = switcher.get(ts_item[TIMESTAMP_KIND_STR], lambda: "Invalid timestamp kind")
    # Execute the function
    return func(span_dict, prev_event, ts_item, trace_timelines, service_dict)

def generate_service_dictionary(trace, trace_timelines):
    '''Process the istio analytics trace data into a collection of event list, where events
    in each list are initialized by the same service. If the trace is not complete(might be
    due to errors in the conversion of traces), an empty collection will be returned.

    @param trace: A trace returned by endpoint /distributed_tracing/traces/
    @param trace_timelines: The timelines dict related to current trace

    @rtype: dictionary
    @return A dictionary mapping service name to a list of events initilized by the service
    '''
    span_dict, sorted_ts = build_and_sort_timestamps(trace)
            
    prev_event = None
    curr_event = None
    event_seq_num = 0
    service_dict = {}

    for ts_item in sorted_ts:
        curr_event = process_timestamp(span_dict, prev_event, ts_item, trace_timelines, service_dict)
        if curr_event == None:
            return None
        curr_event[constants.EVENT_SEQUENCE_NUMBER_STR] = event_seq_num
        prev_event = curr_event
        event_seq_num = event_seq_num + 1

    return service_dict

def trace_list_to_timelines(jaeger_trace_list, filter_list):
    '''Converts each trace of a list of traces as returned by Jaeger into timelines
    as specified by the REST API POST /distributed_tracing/traces/timelines.

    @param jaeger_trace_list (list): List of traces as returned by Jaeger GET /api/v1/traces/
    @param filter_list(list): List of service names whose spans will be skipped

    @rtype: list
    @return List of trace timelines as specified by POST /distributed_tracing/traces/timelines
    '''

    istio_analytics_trace_list = \
        trace_list_to_istio_analytics_trace_list(jaeger_trace_list, filter_list)

    log.debug(u'length of response: {0}'.format(len(istio_analytics_trace_list)))
    traces_timelines = []
    for trace in istio_analytics_trace_list:
        trace_timelines = {
            constants.TRACE_ID_STR: trace[constants.TRACE_ID_STR],
            constants.TIMELINES_STR: [],
            constants.REQUEST_URL_STR: None,
        }

        service_dict = generate_service_dictionary(trace, trace_timelines)

        if service_dict == None or trace_timelines[constants.REQUEST_URL_STR] == None:
            log.error(u'no root url found for trace:{0}'.format(trace_timelines[constants.TRACE_ID_STR]))
            continue
        
        for service in service_dict:
            trace_timelines[constants.TIMELINES_STR].append({
                constants.SERVICE_STR: service,
                constants.EVENTS_STR: service_dict[service],
            })

        traces_timelines.append(trace_timelines)

    return traces_timelines