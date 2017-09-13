'''
Utility functions to manipulate Zipkin data
'''
import logging
log = logging.getLogger(__name__)

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
    '''
    Given a Zipkin trace, this function produces (1) a list of all regular annotations of
    all its spans, globally sorted by timestamp, and (2) a lookup table, indexed by span id,
    to fetch the corresponding span, its binary annotations, and its annotations. The latter
    is used for caching, to speed up the algorithm implemented as part of the function
    zipkin_trace_list_to_timelines.
    
    @param zipkin_trace (dictionary): The representation of a Zipkin trace
    
    @rtype: tuple(dictionary, list)
    @return: A tuple containing (1) the span-lookup table and (2) the sorted list of all
    annotations of all spans 
    '''
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

def initialize_event(zipkin_span, annotation, bin_ann_dict, event_sequence_number):
    '''
    Helper function used to initialize an event given a span, one of its regular annotations,
    and its binary annotations. After the call to this function, the caller will further
    define the event, for instance, to determine its type (send_request, send_response, 
    process_request, or process_response) and other attributes.
    
    @param zipkin_span (dictionary): The representation of a Zipkin span
    @param annotation (dictionary): The representation of a regular annotation of the given span
    @param bin_ann_dict (dictionary): Lookup table for the span's binary annotations
    @param event_sequence_number (integer): Global (trace level) event sequence number
    
    @rtype: dictionary
    @return The representation of an event, as defined  at 
      istio_analytics_restapi.api.distributed_tracing.responses.event_details.
    '''
    request_info = \
        get_binary_annotation_value(bin_ann_dict,
                                    BINARY_ANNOTATION_REQUEST_LINE_STR).split(' ')
    event = {
        constants.EVENT_SEQUENCE_NUMBER_STR: event_sequence_number,
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

def update_events_per_span(events_per_span, event, span_id, event_type):
    '''
    Updates a cached lookup table that contains references to all events currently
    associated with each span. The table is indexed by span id and event type.
    
    @param events_per_span (dictionary): The lookup table to be updated
    @param event: The event to be added to the lookup table
    @param span_id: The span associated with the event to be added
    @param event_type: The type of the event to be added
    '''
    if not span_id in events_per_span:
        events_per_span[span_id] = {}
    events_per_span[span_id][event_type] = event

def process_cs_annotation(cs_ann, zipkin_span_dict, ip_to_name_lookup_table,
                          events_per_service, events_per_span, previous_event,
                          event_sequence_number):
    '''
    Processes a CS annotation to create a send_request event.

    @param cs_ann (dictionary): The CS annotation to be used to create the event
    @param zipkin_span_dict (dictionary): Lookup table, indexed by span id, referencing
    the span's annotations and binary annotations.
    @param ip_to_name_lookup_table (dictionary): A table mapping IP addresses to service names
    @param events_per_service (list): Dictionary, indexed by service name, containing a list of
    events (sorted by time) in which the corresponding service participates.
    @param events_per_span (dictionary): lookup table that contains references to all events currently
    associated with each span.
    @param previous_event (dictionary): The representation of an event that immediately precedes the 
    one to be created by this function.

    @rtype: dictionary
    @return: A new send_request event
    '''
    span_id = cs_ann['span_id']
    zipkin_span = zipkin_span_dict[span_id]['zipkin_span']
    ann_dict = zipkin_span_dict[span_id]['annotations']
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
    event = initialize_event(zipkin_span, cs_ann['annotation'], bin_ann_dict,
                             event_sequence_number)
    event[constants.EVENT_TYPE_STR] = constants.EVENT_SEND_REQUEST
    event[constants.INTERLOCUTOR_STR] = zipkin_span[ZIPKIN_NAME_STR].split(':')[0]

    if get_binary_annotation_value(bin_ann_dict,
                                   BINARY_ANNOTATION_RESPONSE_CODE_STR) == '0':
        # This is probably a timeout
        cr_ann_time = ann_dict[ZIPKIN_CR_ANNOTATION][ZIPKIN_ANNOTATIONS_TIMESTAMP_STR]
        cs_ann_time = cs_ann['annotation'][ZIPKIN_ANNOTATIONS_TIMESTAMP_STR]
        event[constants.TIMEOUT_STR] = cr_ann_time - cs_ann_time

    if ZIPKIN_SR_ANNOTATION in ann_dict:
        # Set the duration of the new send_request event
        sr_ann_time = ann_dict[ZIPKIN_SR_ANNOTATION][ZIPKIN_ANNOTATIONS_TIMESTAMP_STR]
        cs_ann_time = cs_ann['annotation'][ZIPKIN_ANNOTATIONS_TIMESTAMP_STR]
        event[constants.DURATION_STR] = sr_ann_time - cs_ann_time
    elif (ZIPKIN_CR_ANNOTATION in ann_dict and
          event[constants.INTERLOCUTOR_STR] == service_name):
        # This is a self-call. We also need to set its duration
        cr_ann_time = ann_dict[ZIPKIN_CR_ANNOTATION][ZIPKIN_ANNOTATIONS_TIMESTAMP_STR]
        cs_ann_time = cs_ann['annotation'][ZIPKIN_ANNOTATIONS_TIMESTAMP_STR]
        event[constants.DURATION_STR] = cr_ann_time - cs_ann_time

    # Add the new event to the list of events of the service making the call
    events_per_service[service_name][constants.EVENTS_STR].append(event)
    update_events_per_span(events_per_span, event, span_id, constants.EVENT_SEND_REQUEST)
    
    if previous_event:
        if (  (previous_event[constants.EVENT_TYPE_STR] == constants.EVENT_PROCESS_REQUEST and
               previous_event[constants.SPAN_ID_STR] == event[constants.PARENT_SPAN_ID_STR]) or
              (previous_event[constants.EVENT_TYPE_STR] == constants.EVENT_PROCESS_RESPONSE and
               previous_event[constants.PARENT_SPAN_ID_STR] == event[constants.PARENT_SPAN_ID_STR])
           ):
            # If this event follows either a process_request event of a parent span,
            #   or a process_response event at the same level,
            # then set the previous event duration
            previous_event_duration = (event[constants.TIMESTAMP_STR] -
                                       previous_event[constants.TIMESTAMP_STR])
            previous_event[constants.DURATION_STR] = previous_event_duration

    # Return the send_request event created here
    return event

def process_sr_annotation(sr_ann, zipkin_span_dict, ip_to_name_lookup_table, 
                          events_per_service, events_per_span, event_sequence_number):
    '''
    Processes an SR annotation to create a process_request event.

    @param sr_ann (dictionary): The SR annotation to be used to create the event
    @param zipkin_span_dict (dictionary): Lookup table, indexed by span id, referencing
    the span's annotations and binary annotations.
    @param ip_to_name_lookup_table (dictionary): A table mapping IP addresses to service names
    @param events_per_service (list): Dictionary, indexed by service name, containing a list of
    events (sorted by time) in which the corresponding service participates.
    @param events_per_span (dictionary): lookup table that contains references to all events currently
    associated with each span.

    @rtype: dictionary
    @return: A new process_request event
    '''
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
    event = initialize_event(zipkin_span, sr_ann['annotation'], bin_ann_dict,
                             event_sequence_number)
    event[constants.EVENT_TYPE_STR] = constants.EVENT_PROCESS_REQUEST

    cs_ip_address = ann_dict[ZIPKIN_CS_ANNOTATION]\
                            [ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                            [ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR]
    event[constants.INTERLOCUTOR_STR] = ip_to_name_lookup_table[cs_ip_address]

    # Add the new event to the list of events of the service receiving the call
    events_per_service[service_name][constants.EVENTS_STR].append(event)
    update_events_per_span(events_per_span, event, span_id, constants.EVENT_PROCESS_REQUEST)

    # Return the new process_request event created here
    return event

def process_ss_annotation(ss_ann, zipkin_span_dict, ip_to_name_lookup_table,
                          events_per_service, events_per_span, previous_event,
                          event_sequence_number):
    '''
    Processes an SS annotation to create a send_response event.

    @param ss_ann (dictionary): The SS annotation to be used to create the event
    @param zipkin_span_dict (dictionary): Lookup table, indexed by span id, referencing
    the span's annotations and binary annotations.
    @param ip_to_name_lookup_table (dictionary): A table mapping IP addresses to service names
    @param events_per_service (list): Dictionary, indexed by service name, containing a list of
    events (sorted by time) in which the corresponding service participates.
    @param events_per_span (dictionary): lookup table that contains references to all events currently
    associated with each span.
    @param previous_event (dictionary): The representation of an event that immediately precedes the 
    one to be created by this function.

    @rtype: dictionary
    @return: Either a new send_response event, or 
             None if the corresponding send_request event timed out
    '''
    span_id = ss_ann['span_id']
    zipkin_span = zipkin_span_dict[span_id]['zipkin_span']
    ann_dict = zipkin_span_dict[span_id]['annotations']
    bin_ann_dict = zipkin_span_dict[span_id]['binary_annotations']

    if get_binary_annotation_value(bin_ann_dict,
                                   BINARY_ANNOTATION_RESPONSE_CODE_STR) == '0':
        # This is probably a timeout
        if previous_event[constants.SPAN_ID_STR] == span_id:
            # We need to compute the duration of the process_request event
            # of this span. This is needed to deal with the case where
            # the caller of the send_request event times out and the
            # CR and SS annotations are out of order.
            sr_ann_time = ann_dict[ZIPKIN_CR_ANNOTATION][ZIPKIN_ANNOTATIONS_TIMESTAMP_STR]
            ss_ann_time = ss_ann['annotation'][ZIPKIN_ANNOTATIONS_TIMESTAMP_STR]
            dangling_process_request_duration = ss_ann_time - sr_ann_time
            events_per_span[span_id][constants.EVENT_PROCESS_REQUEST][constants.DURATION_STR] = \
                dangling_process_request_duration

        # We do not create a send_response event when the send_request event times out
        return None

    ip_address = ss_ann['annotation'][ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                       [ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR]

    service_name = ip_to_name_lookup_table[ip_address]

    # Create a new send_response event
    event = initialize_event(zipkin_span, ss_ann['annotation'], bin_ann_dict,
                             event_sequence_number)
    event[constants.EVENT_TYPE_STR] = constants.EVENT_SEND_RESPONSE

    cs_ip_address = ann_dict[ZIPKIN_CS_ANNOTATION]\
                            [ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                            [ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR]
    event[constants.INTERLOCUTOR_STR] = ip_to_name_lookup_table[cs_ip_address]

    if ZIPKIN_CR_ANNOTATION in ann_dict:
        # Set the duration of the new send_response event
        cr_ann_time = ann_dict[ZIPKIN_CR_ANNOTATION][ZIPKIN_ANNOTATIONS_TIMESTAMP_STR]
        ss_ann_time = ss_ann['annotation'][ZIPKIN_ANNOTATIONS_TIMESTAMP_STR]
        event[constants.DURATION_STR] = cr_ann_time - ss_ann_time

    # Add the new event to the list of events of the service sending the response
    events_per_service[service_name][constants.EVENTS_STR].append(event)
    update_events_per_span(events_per_span, event, span_id, constants.EVENT_SEND_RESPONSE)

    if previous_event:
        if (  (previous_event[constants.EVENT_TYPE_STR] == constants.EVENT_PROCESS_REQUEST and
               previous_event[constants.SPAN_ID_STR] == event[constants.SPAN_ID_STR]) or
            
              (previous_event[constants.EVENT_TYPE_STR] == constants.EVENT_PROCESS_RESPONSE and
               previous_event[constants.PARENT_SPAN_ID_STR] == event[constants.SPAN_ID_STR] and 
               events_per_span[previous_event[constants.SPAN_ID_STR]]
                              [constants.EVENT_SEND_REQUEST][constants.TIMESTAMP_STR] >
               events_per_span[event[constants.SPAN_ID_STR]]
                              [constants.EVENT_SEND_REQUEST][constants.TIMESTAMP_STR])
           ):
            # If this event follows either a process_request event of the same span,
            #   or a process_response event of a later child span
            # then set the previous event duration
            previous_event_duration = (event[constants.TIMESTAMP_STR] -
                                       previous_event[constants.TIMESTAMP_STR])
            previous_event[constants.DURATION_STR] = previous_event_duration

    # Return the send_response event created here
    return event

def process_cr_annotation(cr_ann, zipkin_span_dict, ip_to_name_lookup_table, 
                          events_per_service, events_per_span, event_sequence_number):
    '''
    Processes a CR annotation to create a process_response event.

    @param cr_ann (dictionary): The CR annotation to be used to create the event
    @param zipkin_span_dict (dictionary): Lookup table, indexed by span id, referencing
    the span's annotations and binary annotations.
    @param ip_to_name_lookup_table (dictionary): A table mapping IP addresses to service names
    @param events_per_service (list): Dictionary, indexed by service name, containing a list of
    events (sorted by time) in which the corresponding service participates.
    @param events_per_span (dictionary): lookup table that contains references to all events currently
    associated with each span.

    @rtype: dictionary
    @return: A new process_response event
    '''
    span_id = cr_ann['span_id']
    zipkin_span = zipkin_span_dict[span_id]['zipkin_span']

    ann_dict = zipkin_span_dict[span_id]['annotations']
    bin_ann_dict = zipkin_span_dict[span_id]['binary_annotations']

    ip_address = cr_ann['annotation'][ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                       [ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR]

    service_name = ip_to_name_lookup_table[ip_address]

    # Create a new process_response event
    event = initialize_event(zipkin_span, cr_ann['annotation'], bin_ann_dict,
                             event_sequence_number)
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
    update_events_per_span(events_per_span, event, span_id, constants.EVENT_PROCESS_RESPONSE)

    # Return the new process_response event created here
    return event

def clean_up_timelines(timeline_list):
    '''
    Removes all process_response events with no duration from the timelines
    associated with each service. These events correspond to either the last event 
    of the trace's root span, or the last events of "dangling" spans.
    A dangling span can happen when a service calls another and the client service 
    times out and the server service continues regardless.
    
    @param timeline_list (list): List of dictionaries where each element contains
    a service name and a list of events (sorted by time) corresponding to the service's 
    timeline of events. The timeline_list parameter is updated in place.
    '''
    for timeline in timeline_list:
        new_event_list = [e for e in timeline[constants.EVENTS_STR] 
                            if not (e[constants.EVENT_TYPE_STR] == constants.EVENT_PROCESS_RESPONSE and
                                    not constants.DURATION_STR in e)
                         ]
        timeline[constants.EVENTS_STR] = new_event_list

def zipkin_trace_list_to_timelines(zipkin_trace_list):
    '''Converts each trace of a list of traces as returned by Zipkin into timelines
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

        # Events per service; the keys of this dictionary are service names;
        # each value contains a service name and an array of events
        events_per_service = {}
        
        # Events per span; the outter keys of this dictionary are span ids,
        # the inner keys are event types, and the actual values are events
        events_per_span = {}

        # Lookup table that associates IP addresses to names of microservices
        ip_to_name_lookup_table = {}

        # Sequence number for the events of a trace
        # This is done so that the function distributed_tracing.cluster_traces() can
        # explicitly indicate the global order of events for a cluster to help the
        # UI properly place the aggregated events of a cluster on the screen
        event_sequence_number = 0

        previous_event = None
        current_event = None
        for annotation in sorted_annotations:
            if annotation['annotation']\
                         [ZIPKIN_ANNOTATIONS_VALUE_STR] == ZIPKIN_CS_ANNOTATION:
                current_event = process_cs_annotation(annotation, zipkin_span_dict,
                                                      ip_to_name_lookup_table,
                                                      events_per_service,
                                                      events_per_span, previous_event,
                                                      event_sequence_number)
            elif annotation['annotation']\
                           [ZIPKIN_ANNOTATIONS_VALUE_STR] == ZIPKIN_SR_ANNOTATION:
                current_event = process_sr_annotation(annotation, zipkin_span_dict,
                                                      ip_to_name_lookup_table,
                                                      events_per_service, events_per_span,
                                                      event_sequence_number)
            elif annotation['annotation']\
                           [ZIPKIN_ANNOTATIONS_VALUE_STR] == ZIPKIN_SS_ANNOTATION:
                current_event = process_ss_annotation(annotation, zipkin_span_dict,
                                                      ip_to_name_lookup_table, 
                                                      events_per_service, 
                                                      events_per_span, previous_event,
                                                      event_sequence_number)
            elif annotation['annotation']\
                           [ZIPKIN_ANNOTATIONS_VALUE_STR] == ZIPKIN_CR_ANNOTATION:
                current_event = process_cr_annotation(annotation,  zipkin_span_dict,
                                                      ip_to_name_lookup_table,
                                                      events_per_service, events_per_span,
                                                      event_sequence_number)
            # Note that current_event can be None if this is an SS annotation 
            # in a span with a timeout.
            # In this case, because a send_request event has timed out, we
            # should not create a send_response event.
            if current_event:
                previous_event = current_event
                event_sequence_number += 1

        timeline_list = list(events_per_service.values())
        clean_up_timelines(timeline_list)

        trace_timelines[constants.TIMELINES_STR] = timeline_list 
        ret_val.append(trace_timelines)

    return ret_val