'''
Utility functions to manipulate Zipkin data
'''
import istio_analytics_restapi.api.distributed_tracing.responses as constants

# Keys used by Zipkin in the JSON containing a list of traces
ZIPKIN_TRACEID_STR = 'traceId'
ZIPKIN_SPANID_STR = 'id'
ZIPKIN_PARENT_SPANID_STR = 'parentId'
ZIPKIN_NAME_STR = 'name'
ZIPKIN_ANNOTATIONS_STR = 'annotations'
ZIPKIN_ANNOTATIONS_VALUE_STR = 'value'
ZIPKIN_ANNOTATIONS_TIMESTAMP_STR = 'timestamp'
ZIPKIN_ANNOTATIONS_ENDPOINT_STR = 'endpoint'
ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR = 'ipv4'
ZIPKIN_BINARY_ANNOTATIONS_STR = 'binaryAnnotations'
ZIPKIN_BINARY_ANNOTATIONS_KEY_STR = 'key'
ZIPKIN_BINARY_ANNOTATIONS_VALUE_STR = 'value'

# Keys used by Envoy for Zipkin binary annotations
BINARY_ANNOTATION_NODE_ID_STR = 'node_id'
BINARY_ANNOTATION_REQUEST_LINE_STR = 'request_line'
BINARY_ANNOTATION_REQUEST_SIZE_STR = 'request_size'
BINARY_ANNOTATION_RESPONSE_CODE_STR = 'response_code'
BINARY_ANNOTATION_RESPONSE_SIZE_STR = 'response_size'
BINARY_ANNOTATION_USER_AGENT_STR = 'user_agent'

# Values of Zipkin regular annotations
ZIPKIN_CS_ANNOTATION = 'cs'
ZIPKIN_CR_ANNOTATION = 'cr'
ZIPKIN_SS_ANNOTATION = 'ss'
ZIPKIN_SR_ANNOTATION = 'sr'

def build_binary_annotation_dict(zipkin_span):
    '''Given a Zipkin span, creates a dictionary for all of its binary annotations

    @param zipkin_span (dictionary): A Zipkin span

    @rtype: dictionary
    @return: Dictionary with all binary annotations of the span
    '''
    binary_ann_dict = {}
    for binary_annotation in zipkin_span[ZIPKIN_BINARY_ANNOTATIONS_STR]:
        binary_ann_dict[binary_annotation[ZIPKIN_BINARY_ANNOTATIONS_KEY_STR]] = \
            binary_annotation[ZIPKIN_BINARY_ANNOTATIONS_VALUE_STR]
    return binary_ann_dict

def build_annotation_dict(zipkin_span):
    '''Given a Zipkin span, creates a dictionary for all of its regular annotations

    @param zipkin_span (dictionary): A Zipkin span

    @rtype: dictionary
    @return: Dictionary with all regular annotations of the span
    '''
    ann_dict = {}
    for annotation in zipkin_span[ZIPKIN_ANNOTATIONS_STR]:
        ann_dict[annotation[ZIPKIN_ANNOTATIONS_VALUE_STR]] = annotation
    return ann_dict


def get_binary_annotation_value(binary_annotation_dic, key):
    '''Gets the value a binary annotation identified by the given key
    
    @param binary_annotation_dic (dictionary): A dictionary with a span's binary annotations
    @param key (string): A binary-annotation key

    @rtype: string
    @return: The value of a binary annotation, if present in the dictionary
             Empty string if the binary annotation is not present in the dictionary
    '''
    if key in binary_annotation_dic:
        return binary_annotation_dic[key]
    else:
        return ''

def get_trace_root_request(zipkin_trace):
    '''Returns the request URL of the trace's root span

    @param zipkin_trace (dictionary): The representation of a Zipkin trace

    @rtype: string
    @return: the request URL of the given trace's root span
             empty string if the request URL is not found (this should never be the case)
    '''
    binary_annotations = zipkin_trace[0][ZIPKIN_BINARY_ANNOTATIONS_STR]
    for binary_annotation in binary_annotations:
        if binary_annotation[ZIPKIN_BINARY_ANNOTATIONS_KEY_STR] == \
           BINARY_ANNOTATION_REQUEST_LINE_STR:
            request_info = binary_annotation[ZIPKIN_BINARY_ANNOTATIONS_VALUE_STR].split(' ')
            return ' '.join(request_info[0:2])

    # We do not expect to get here, as the request URL must be present
    return ''

def has_sr_annotation(zipkin_span):
    '''Checks if the given Zipkin span contains an SR (Server Receive) annotation

     @param zipkin_span (dictionary): A Zipkin span

     @rtype: bool
     @return: True of the span contains the SR annotation;
              False otherwise
    '''
    annotations = zipkin_span[ZIPKIN_ANNOTATIONS_STR]
    for annotation in annotations:
        if annotation[ZIPKIN_ANNOTATIONS_VALUE_STR] == ZIPKIN_SR_ANNOTATION:
            return True
    return False

def zipkin_trace_list_to_istio_analytics_trace_list(zipkin_trace_list):
    '''Converts a list of traces as returned by Zipkin into the format 
    specified by the REST API POST /distributed_tracing/traces/.
    
    @param zipkin_trace_list (list): List of traces as returned by Zipkin GET /api/v1/traces/
    
    @rtype: list
    @return Trace list as specified by POST /distributed_tracing/traces
    '''
    ret_val = []
    for zipkin_trace in zipkin_trace_list:
        # Get the trace id from the first span in the trace
        # All spans of a given trace will have the same trace id value
        trace_id = zipkin_trace[0][ZIPKIN_TRACEID_STR]

        istio_analytics_trace = {
            constants.TRACE_ID_STR: trace_id
        }
        
        istio_analytics_spans = []
        
        # Lookup table that associates IP addresses to names of microservices
        ip_to_name_lookup_table = {}
        
        # Process each span of the current trace
        for zipkin_span in zipkin_trace:
            bin_ann_dict = build_binary_annotation_dict(zipkin_span)
            istio_analytics_span = {}
            annotations = zipkin_span[ZIPKIN_ANNOTATIONS_STR]
            # Process each regular annotation of the span
            for annotation in annotations:
                ip_address = annotation[ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                                       [ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR] 

                # Set IP and name for source and target based on the current annotation being processed
                if annotation[ZIPKIN_ANNOTATIONS_VALUE_STR] == ZIPKIN_CS_ANNOTATION:
                    # This is the source (microservice that made the call)
                    
                    # Set the source IP address
                    istio_analytics_span[constants.SOURCE_IP_STR] = ip_address                    
                    
                    # Set the source name
                    if ip_address not in ip_to_name_lookup_table:
                        # This is the root span of the trace
                        node_id = get_binary_annotation_value(bin_ann_dict,
                                                              BINARY_ANNOTATION_NODE_ID_STR)
                        ip_to_name_lookup_table[ip_address] = node_id
                    istio_analytics_span[constants.SOURCE_NAME_STR] = \
                        ip_to_name_lookup_table[ip_address]
                elif annotation[ZIPKIN_ANNOTATIONS_VALUE_STR] == ZIPKIN_SR_ANNOTATION:
                    # This is the target (microservice that received the call)
                    
                    # Set the target IP address
                    istio_analytics_span[constants.TARGET_IP_STR] = ip_address
                    
                    # Set the target name
                    if not ip_address in ip_to_name_lookup_table:
                        ip_to_name_lookup_table[ip_address] = zipkin_span[ZIPKIN_NAME_STR].split(':')[0]
                    istio_analytics_span[constants.TARGET_NAME_STR] = \
                        ip_to_name_lookup_table[ip_address]

                # Set the CS/CR/SS/SR timestamps
                istio_analytics_span[annotation[ZIPKIN_ANNOTATIONS_VALUE_STR]] = \
                    annotation[ZIPKIN_ANNOTATIONS_TIMESTAMP_STR]

            if not has_sr_annotation(zipkin_span):
                # The span does not have an SR annotation.
                # Thus, no target IP address info is available, but we can still get a
                # target service name.
                istio_analytics_span[constants.TARGET_NAME_STR] = \
                    zipkin_span[ZIPKIN_NAME_STR].split(':')[0]
                    
            istio_analytics_span[constants.RESPONSE_SIZE_STR] = \
                get_binary_annotation_value(bin_ann_dict,
                                            BINARY_ANNOTATION_RESPONSE_SIZE_STR)
            istio_analytics_span[constants.RESPONSE_CODE_STR] = \
                get_binary_annotation_value(bin_ann_dict,
                                            BINARY_ANNOTATION_RESPONSE_CODE_STR)
            istio_analytics_span[constants.USER_AGENT_STR] = \
                get_binary_annotation_value(bin_ann_dict,
                                            BINARY_ANNOTATION_USER_AGENT_STR)

            request_info = \
                get_binary_annotation_value(bin_ann_dict,
                                            BINARY_ANNOTATION_REQUEST_LINE_STR).split(' ')
            istio_analytics_span[constants.REQUEST_URL_STR] = ' '.join(request_info[0:2])
            istio_analytics_span[constants.PROTOCOL_STR] = request_info[2]
            
            istio_analytics_span[constants.REQUEST_SIZE_STR] = \
                get_binary_annotation_value(bin_ann_dict,
                                            BINARY_ANNOTATION_REQUEST_SIZE_STR)

            istio_analytics_span[constants.SPAN_ID_STR] = zipkin_span[ZIPKIN_SPANID_STR]
            if ZIPKIN_PARENT_SPANID_STR in zipkin_span:
                istio_analytics_span[constants.PARENT_SPAN_ID_STR] = zipkin_span[ZIPKIN_PARENT_SPANID_STR]
                
            istio_analytics_spans.append(istio_analytics_span)
            
        istio_analytics_trace[constants.SPANS_STR] = istio_analytics_spans
        ret_val.append(istio_analytics_trace)

    return ret_val

def global_sort_annotations(zipkin_trace):
    global_annotations = []
    span_dict = {}
    for zipkin_span in zipkin_trace:
        span_dict[zipkin_span[ZIPKIN_SPANID_STR]] = {
            'zipkin_span': zipkin_span,
            'binary_annotations': build_binary_annotation_dict(zipkin_span),
            'annotations': build_annotation_dict(zipkin_span)
        }
        for annotation in zipkin_span[ZIPKIN_ANNOTATIONS_STR]:
            global_annotations.append({
                'span_id': zipkin_span[ZIPKIN_SPANID_STR],
                'annotation': annotation
            })

    sorted_global_annotations = sorted(global_annotations, key=lambda d:
                                       d['annotation'][ZIPKIN_ANNOTATIONS_TIMESTAMP_STR])
    return span_dict, sorted_global_annotations

def initialize_event(zipkin_span, annotation, bin_ann_dict):
    request_info = \
        get_binary_annotation_value(bin_ann_dict,
                                    BINARY_ANNOTATION_REQUEST_LINE_STR).split(' ')
    event = {
        constants.SPAN_ID_STR: zipkin_span[ZIPKIN_SPANID_STR],
        constants.TIMESTAMP_STR: annotation[ZIPKIN_ANNOTATIONS_TIMESTAMP_STR],
        constants.REQUEST_URL_STR: ' '.join(request_info[0:2]),
        constants.REQUEST_SIZE_STR: get_binary_annotation_value(bin_ann_dict,
                                        BINARY_ANNOTATION_REQUEST_SIZE_STR),
        constants.PROTOCOL_STR: request_info[2],
        constants.RESPONSE_SIZE_STR: get_binary_annotation_value(bin_ann_dict,
                                        BINARY_ANNOTATION_RESPONSE_SIZE_STR),
        constants.RESPONSE_CODE_STR: get_binary_annotation_value(bin_ann_dict,
                                        BINARY_ANNOTATION_RESPONSE_CODE_STR),
        constants.USER_AGENT_STR: get_binary_annotation_value(bin_ann_dict,
                                        BINARY_ANNOTATION_USER_AGENT_STR),
    }

    if ZIPKIN_PARENT_SPANID_STR in zipkin_span:
        event[constants.PARENT_SPAN_ID_STR] = zipkin_span[ZIPKIN_PARENT_SPANID_STR]

    return event

def process_cs_annotation(cs_ann, zipkin_span_dict,
                          ip_to_name_lookup_table, events_per_service):
    span_id = cs_ann['span_id']
    zipkin_span = zipkin_span_dict[span_id]['zipkin_span']
    bin_ann_dict = zipkin_span_dict[span_id]['binary_annotations']

    ip_address = cs_ann['annotation'][ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                       [ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR]
    if ip_address not in ip_to_name_lookup_table:
        # This is the root span of the trace
        node_id = get_binary_annotation_value(bin_ann_dict,
                                              BINARY_ANNOTATION_NODE_ID_STR)
        ip_to_name_lookup_table[ip_address] = node_id

        service_name = ip_to_name_lookup_table[ip_address]
    else:
        service_name = ip_to_name_lookup_table[ip_address]

    if not service_name in events_per_service:
        # Initialize the events data structure for this service
        events_per_service[service_name] = {
            constants.SERVICE_STR: service_name,
            constants.EVENTS_STR: []
        }

    # Create a new send_request event
    event = initialize_event(zipkin_span, cs_ann['annotation'], bin_ann_dict)
    event[constants.EVENT_TYPE_STR] = constants.EVENT_SEND_REQUEST
    event[constants.INTERLOCUTOR_STR] = zipkin_span[ZIPKIN_NAME_STR].split(':')[0]

    if get_binary_annotation_value(bin_ann_dict,
                                   BINARY_ANNOTATION_RESPONSE_CODE_STR) == '0':
        # This is probably a timeout
        ann_dict = zipkin_span_dict[span_id]['annotations']
        cr_ann_time = ann_dict[ZIPKIN_CR_ANNOTATION][ZIPKIN_ANNOTATIONS_TIMESTAMP_STR]
        cs_ann_time = cs_ann['annotation'][ZIPKIN_ANNOTATIONS_TIMESTAMP_STR]
        event[constants.TIMEOUT_STR] = cr_ann_time - cs_ann_time

    # Add the new event to the list of events of the service making the call
    events_per_service[service_name][constants.EVENTS_STR].append(event)

    # Return the send_request event created here
    return event

def process_sr_annotation(sr_ann, zipkin_span_dict,
                          ip_to_name_lookup_table, events_per_service):
    span_id = sr_ann['span_id']
    zipkin_span = zipkin_span_dict[span_id]['zipkin_span']
    ann_dict = zipkin_span_dict[span_id]['annotations']
    bin_ann_dict = zipkin_span_dict[span_id]['binary_annotations']

    ip_address = sr_ann['annotation'][ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                       [ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR]
    if not ip_address in ip_to_name_lookup_table:
        ip_to_name_lookup_table[ip_address] = zipkin_span[ZIPKIN_NAME_STR].split(':')[0]

    service_name = ip_to_name_lookup_table[ip_address]

    if not service_name in events_per_service:
        # Initialize the events data structure for this service
        events_per_service[service_name] = {
            constants.SERVICE_STR: service_name,
            constants.EVENTS_STR: []
        }

    # Create a new process_request event
    event = initialize_event(zipkin_span, sr_ann['annotation'], bin_ann_dict)
    event[constants.EVENT_TYPE_STR] = constants.EVENT_PROCESS_REQUEST

    cs_ip_address = ann_dict[ZIPKIN_CS_ANNOTATION]\
                            [ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                            [ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR]
    event[constants.INTERLOCUTOR_STR] = ip_to_name_lookup_table[cs_ip_address]

    # Add the new event to the list of events of the service receiving the call
    events_per_service[service_name][constants.EVENTS_STR].append(event)

    # Return the new process_request event created here
    return event

def process_ss_annotation(ss_ann, zipkin_span_dict,
                          ip_to_name_lookup_table, events_per_service):
    span_id = ss_ann['span_id']
    zipkin_span = zipkin_span_dict[span_id]['zipkin_span']
    ann_dict = zipkin_span_dict[span_id]['annotations']
    bin_ann_dict = zipkin_span_dict[span_id]['binary_annotations']

    ip_address = ss_ann['annotation'][ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                       [ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR]

    service_name = ip_to_name_lookup_table[ip_address]

    # Create a new send_response event
    event = initialize_event(zipkin_span, ss_ann['annotation'], bin_ann_dict)
    event[constants.EVENT_TYPE_STR] = constants.EVENT_SEND_RESPONSE

    cs_ip_address = ann_dict[ZIPKIN_CS_ANNOTATION]\
                            [ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                            [ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR]
    event[constants.INTERLOCUTOR_STR] = ip_to_name_lookup_table[cs_ip_address]

    # Add the new event to the list of events of the service sending the response
    events_per_service[service_name][constants.EVENTS_STR].append(event)

    # Return the send_response event created here
    return event

def process_cr_annotation(cr_ann, zipkin_span_dict,
                          ip_to_name_lookup_table, events_per_service):
    span_id = cr_ann['span_id']
    zipkin_span = zipkin_span_dict[span_id]['zipkin_span']

    if not ZIPKIN_PARENT_SPANID_STR in zipkin_span:
        # The root span should not be associated with a process_response event
        return None

    ann_dict = zipkin_span_dict[span_id]['annotations']
    bin_ann_dict = zipkin_span_dict[span_id]['binary_annotations']

    ip_address = cr_ann['annotation'][ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                       [ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR]

    service_name = ip_to_name_lookup_table[ip_address]

    # Create a new process_response event
    event = initialize_event(zipkin_span, cr_ann['annotation'], bin_ann_dict)
    event[constants.EVENT_TYPE_STR] = constants.EVENT_PROCESS_RESPONSE

    if get_binary_annotation_value(bin_ann_dict,
                                   BINARY_ANNOTATION_RESPONSE_CODE_STR) == '0':
        # This is probably a timeout
        cs_ann_time = ann_dict[ZIPKIN_CS_ANNOTATION][ZIPKIN_ANNOTATIONS_TIMESTAMP_STR]
        cr_ann_time = cr_ann['annotation'][ZIPKIN_ANNOTATIONS_TIMESTAMP_STR]
        event[constants.TIMEOUT_STR] = cr_ann_time - cs_ann_time

    event[constants.INTERLOCUTOR_STR] = zipkin_span[ZIPKIN_NAME_STR].split(':')[0]

    # Add the new event to the list of events of the service receiving the response
    events_per_service[service_name][constants.EVENTS_STR].append(event)

    # Return the new process_response event created here
    return event

def zipkin_trace_list_to_timelines(zipkin_trace_list):
    '''Converts a list of traces as returned by Zipkin into timelines
    as specified by the REST API POST /distributed_tracing/traces/timelines.

    @param zipkin_trace_list (list): List of traces as returned by Zipkin GET /api/v1/traces/

    @rtype: list
    @return List of trace timelines as specified by POST /distributed_tracing/traces/timelines
    '''
    ret_val = []
    for zipkin_trace in zipkin_trace_list:
        # Get the trace id from the first span in the trace
        # All spans of a given trace will have the same trace id value
        trace_id = zipkin_trace[0][ZIPKIN_TRACEID_STR]

        trace_timelines = {
            constants.TRACE_ID_STR: trace_id,
            constants.REQUEST_URL_STR: get_trace_root_request(zipkin_trace)
        }

        # Sort all annotations of the trace globally
        zipkin_span_dict, sorted_annotations = global_sort_annotations(zipkin_trace)

        # Events per service; the keys of this dictionary are service names
        events_per_service = {}

        # Lookup table that associates IP addresses to names of microservices
        ip_to_name_lookup_table = {}

        previous_event = None
        current_event = None
        for annotation in sorted_annotations:
            if annotation['annotation']\
                         [ZIPKIN_ANNOTATIONS_VALUE_STR] == ZIPKIN_CS_ANNOTATION:
                current_event = process_cs_annotation(annotation, zipkin_span_dict,
                                                      ip_to_name_lookup_table,
                                                      events_per_service)
            elif annotation['annotation']\
                           [ZIPKIN_ANNOTATIONS_VALUE_STR] == ZIPKIN_SR_ANNOTATION:
                current_event = process_sr_annotation(annotation, zipkin_span_dict,
                                                      ip_to_name_lookup_table,
                                                      events_per_service)
            elif annotation['annotation']\
                           [ZIPKIN_ANNOTATIONS_VALUE_STR] == ZIPKIN_SS_ANNOTATION:
                current_event = process_ss_annotation(annotation, zipkin_span_dict,
                                                      ip_to_name_lookup_table,
                                                      events_per_service)
            elif annotation['annotation']\
                           [ZIPKIN_ANNOTATIONS_VALUE_STR] == ZIPKIN_CR_ANNOTATION:
                current_event = process_cr_annotation(annotation,  zipkin_span_dict,
                                                      ip_to_name_lookup_table,
                                                      events_per_service)
            # Note that current_event is None if this is the last CR annotation of the trace
            # because it must not lead to the creation of a process_response event
            if current_event and previous_event:
                # Set the duration of the previous event
                # This will not be done for the trace's first and last annotations
                # The first CS annotation has no previous event
                # The last CR annotation does not result in a process_response event
                previous_event_duration = (current_event[constants.TIMESTAMP_STR] -
                                           previous_event[constants.TIMESTAMP_STR])
                previous_event[constants.DURATION_STR] = previous_event_duration
            previous_event = current_event

        trace_timelines[constants.TIMELINES_STR] = list(events_per_service.values())
        ret_val.append(trace_timelines)

    return ret_val