'''
Utility functions to manipulate Zipkin data
'''
import logging
log = logging.getLogger(__name__)

import os

import istio_analytics_restapi.api.constants as env_constants
import istio_analytics_restapi.api.distributed_tracing.responses as constants
import istio_analytics_restapi.api.distributed_tracing.skydive_query_util as skydive_query_util

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
ZIPKIN_ANNOTATIONS_ENDPOINT_SERVICENAME_STR = 'serviceName'
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

# Suffix we append to BINARY_ANNOTATION_NODE_ID_STR so that we can add to our dictionary
# a key for a second node_id. Zipkin spans produced by Envoy/Istio contain two node_id tags,
# and we use this suffix for the second entry in the dictionary we create. 
BINARY_ANNOTATION_NODE_ID_SUFFIX_STR = '_2'

# Open Tracing standardize keys
BINARY_ANNOTATION_ALIASES = {
    BINARY_ANNOTATION_RESPONSE_CODE_STR: "http.status_code",
}

# Values of Zipkin regular annotations
ZIPKIN_CS_ANNOTATION = 'cs'
ZIPKIN_CR_ANNOTATION = 'cr'
ZIPKIN_SS_ANNOTATION = 'ss'
ZIPKIN_SR_ANNOTATION = 'sr'
# Currently there is no support for ms (message send), mr (message receive),
# and lc (local component) for async and within-process messages.
# See https://github.com/openzipkin/zipkin/issues/808
# See https://github.com/openzipkin/zipkin/issues/1243

# The service name used in traces from istio 0.1.x for all services
ZIPKIN_01X_SERVICENAME_ISTIOPROXY_STR = 'istio-proxy'

def parse_node_id(node_id):
    '''Given a node_id binary annotation value, extract from it the following
    tuple: (pod IP address, pod name)
    
    Since Istio 0.2, the node_id values are of the form:
      sidecar~10.1.208.199~reviews-v3-2608898768-30qnn.default~default.svc.cluster.local
      
    The field separator is the character '~'. The pod IP address and name appear in the
    second and third fields, respectively.
    
    @param node_id (string): The value of a node_id binary annotation
    
    @rtype: tuple(string, string) 
    @return: A tuple with the IP address and name of a pod extracted from the binary annotation,
    or (None, None) if the given node_id cannot be parsed as expected
    '''
    fields = node_id.split('~')
    if len(fields) < 3:
        return (None, None)
    pod_ip = fields[1]

    pod_name_plus_namespace = fields[2]
    subfields = pod_name_plus_namespace.split('.')
    if len(subfields) < 2:
        return (None, None)
    pod_name = subfields[0]

    return (pod_ip, pod_name)

def add_skydive_query(event, service_name, cs_ann, bin_ann_dict):
    '''
    Provided that all data in the span related to the given CS annotation contains the 
    expected information, this function will add to the given send_request event a Skydive 
    query to express the shortest path between the two involved endpoints.

    @param event (dictionary): The send_request event to which the Skydive query will be added
    @param service_name (string): The name of the service to whose timeline the event belongs
    @param cs_ann (dictionary): The Zipkin CS annotation corresponding to the send_request event
    @param bin_ann_dict (dictionary): The dictionary with the binary annotations of the 
    corresponding span 
    '''
    node_id_1 = get_binary_annotation_value(bin_ann_dict, BINARY_ANNOTATION_NODE_ID_STR)
    node_id_2 = get_binary_annotation_value(bin_ann_dict, BINARY_ANNOTATION_NODE_ID_STR + 
                                                BINARY_ANNOTATION_NODE_ID_SUFFIX_STR)
    if node_id_1 and node_id_2:
        (pod_ip_1, pod_name_1) = parse_node_id(node_id_1)
        if pod_name_1 != None:
            (_ , pod_name_2) = parse_node_id(node_id_2)
            if pod_name_2 != None:
                client_ip_address = cs_ann['annotation'][ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                    .get(ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR, 'NO-IP')
                if client_ip_address != 'NO-IP':
                    if pod_ip_1 == client_ip_address:
                        source_pod_name = pod_name_1
                        target_pod_name = pod_name_2
                    else:
                        source_pod_name = pod_name_2
                        target_pod_name = pod_name_1
                    # If we get here, all data validation succeeded.
                    # So, let's finally build the Skydive query.
                    event[constants.SKYDIVE_QUERY_STR] = \
                        skydive_query_util.ids_from_shortest_path_query(
                            service_name, 
                            source_pod_name, 
                            event[constants.INTERLOCUTOR_STR], 
                            target_pod_name
                        )

def build_binary_annotation_dict(zipkin_span):
    '''Given a Zipkin span, creates a dictionary for all of its binary annotations

    @param zipkin_span (dictionary): A Zipkin span

    @rtype: dictionary
    @return: Dictionary with all binary annotations of the span
    '''
    binary_ann_dict = {}
    if ZIPKIN_BINARY_ANNOTATIONS_STR not in zipkin_span:
        log.warn("No binary annotations in {}"
                 .format(zipkin_span.get("id", "<MISSING ID>")))
        return binary_ann_dict

    for binary_annotation in zipkin_span[ZIPKIN_BINARY_ANNOTATIONS_STR]:
        if (binary_annotation[ZIPKIN_BINARY_ANNOTATIONS_KEY_STR] == BINARY_ANNOTATION_NODE_ID_STR
            and BINARY_ANNOTATION_NODE_ID_STR in binary_ann_dict):
            # In case there are two node_id annotations in the same span,
            # we want to add both to the dictionary.
            # This will allow us to properly add a Skydive query via add_skydive_query()
            key = BINARY_ANNOTATION_NODE_ID_STR + BINARY_ANNOTATION_NODE_ID_SUFFIX_STR
        else:
            key = binary_annotation[ZIPKIN_BINARY_ANNOTATIONS_KEY_STR]
        binary_ann_dict[key] = \
            binary_annotation[ZIPKIN_BINARY_ANNOTATIONS_VALUE_STR]
    return binary_ann_dict

def build_annotation_dict(zipkin_span):
    '''Given a Zipkin span, creates a dictionary for all of its regular annotations

    @param zipkin_span (dictionary): A Zipkin span

    @rtype: dictionary
    @return: Dictionary with all regular annotations of the span
    '''
    ann_dict = {}
    if ZIPKIN_ANNOTATIONS_STR not in zipkin_span:
        log.warn("no annotations in {}"
                 .format(zipkin_span.get("id", "<MISSING ID>")))
        return ann_dict

    for annotation in zipkin_span[ZIPKIN_ANNOTATIONS_STR]:
        ann_dict[annotation[ZIPKIN_ANNOTATIONS_VALUE_STR]] = annotation
    return ann_dict


def get_binary_annotation_value(binary_annotation_dic, key, defaultVal=''):
    '''Gets the value a binary annotation identified by the given key
    
    @param binary_annotation_dic (dictionary): A dictionary with a span's binary annotations
    @param key (string): A binary-annotation key

    @rtype: string
    @return: The value of a binary annotation, if present in the dictionary
             Empty string if the binary annotation is not present in the dictionary
    '''
    if key in binary_annotation_dic:
        return binary_annotation_dic[key]
    elif key in BINARY_ANNOTATION_ALIASES and BINARY_ANNOTATION_ALIASES[key] in binary_annotation_dic:
        return binary_annotation_dic[BINARY_ANNOTATION_ALIASES[key]]
    else:
        return defaultVal

def get_trace_root_request(zipkin_trace):
    '''Returns the request URL of the trace's root span

    @param zipkin_trace (dictionary): The representation of a Zipkin trace

    @rtype: string
    @return: the request URL of the given trace's root span
             empty string if the request URL is not found (this should never be the case)
    '''
    if ZIPKIN_BINARY_ANNOTATIONS_STR not in zipkin_trace[0]:
        log.warn("no binary annotations in {}"
                 .format(zipkin_trace[0].get("id", "<MISSING_ID>")))
        return 'MISSING-METHOD ' + zipkin_trace[0].get("name", "<MISSING_NAME>") + ' MISSING-PROTOCOL'

    binary_annotations = zipkin_trace[0][ZIPKIN_BINARY_ANNOTATIONS_STR]
    for binary_annotation in binary_annotations:
        if binary_annotation[ZIPKIN_BINARY_ANNOTATIONS_KEY_STR] == \
           BINARY_ANNOTATION_REQUEST_LINE_STR:
            request_info = binary_annotation[ZIPKIN_BINARY_ANNOTATIONS_VALUE_STR].split(' ')
            return ' '.join(request_info[0:2])

    # Look for the new, three-part version
    method = 'MISSING-METHOD'
    url = 'MISSING-URL'
    protocol = 'MISSING-PROTOCOL'
    for binary_annotation in binary_annotations:
        if binary_annotation[ZIPKIN_BINARY_ANNOTATIONS_KEY_STR] == 'http.method':
            method = binary_annotation[ZIPKIN_BINARY_ANNOTATIONS_VALUE_STR]
        elif binary_annotation[ZIPKIN_BINARY_ANNOTATIONS_KEY_STR] == 'http.url':
            url = binary_annotation[ZIPKIN_BINARY_ANNOTATIONS_VALUE_STR]
        elif binary_annotation[ZIPKIN_BINARY_ANNOTATIONS_KEY_STR] == 'http.protocol':
            protocol = binary_annotation[ZIPKIN_BINARY_ANNOTATIONS_VALUE_STR]
    return ' '.join([method, url, protocol])

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

def zipkin_trace_list_to_istio_analytics_trace_list(zipkin_trace_list, filter_list):
    '''Converts a list of traces as returned by Zipkin into the format 
    specified by the REST API POST /distributed_tracing/traces/.

    @param zipkin_trace_list (list): List of traces as returned by Zipkin GET /api/v1/traces/

    @rtype: list
    @return Trace list as specified by POST /distributed_tracing/traces
    '''
            
    # Specify the spans that should be filtered out
    span_filter = Zipkin_Span_Filter()
    for service_name in filter_list:
        span_filter.add_service(service_name)
    
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
            if span_filter.filter(zipkin_span) == False:
                continue
            
            bin_ann_dict = build_binary_annotation_dict(zipkin_span)
            istio_analytics_span = {}
            if ZIPKIN_ANNOTATIONS_STR not in zipkin_span:
                log.warn("span {} does not contain annotations"
                         .format(zipkin_span.get("id", "<MISSING_ID>")))
                continue

            annotations = zipkin_span[ZIPKIN_ANNOTATIONS_STR]
            # Process each regular annotation of the span
            for annotation in annotations:
                ip_address = annotation[ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                                       .get(ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR, 'NO-IP')

                # Set IP and name for source and target based on the current annotation being processed
                if annotation[ZIPKIN_ANNOTATIONS_VALUE_STR] == ZIPKIN_CS_ANNOTATION:
                    # This is the source (microservice that made the call)

                    # Set the source IP address
                    istio_analytics_span[constants.SOURCE_IP_STR] = ip_address                    

                    # Set the source name
                    # Get service name directly from span
                    istio_analytics_span[constants.SOURCE_NAME_STR] = \
                        annotation.get(ZIPKIN_ANNOTATIONS_ENDPOINT_STR)\
                                  .get(ZIPKIN_ANNOTATIONS_ENDPOINT_SERVICENAME_STR, ZIPKIN_01X_SERVICENAME_ISTIOPROXY_STR)
                    
                    # For traces collected from istio 0.1.x, service name can only be obtained by reading from lookup table
                    if istio_analytics_span[constants.SOURCE_NAME_STR] == ZIPKIN_01X_SERVICENAME_ISTIOPROXY_STR:
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
                    # Get service name directly from span
                    istio_analytics_span[constants.TARGET_NAME_STR] = \
                        annotation.get(ZIPKIN_ANNOTATIONS_ENDPOINT_STR)\
                                  .get(ZIPKIN_ANNOTATIONS_ENDPOINT_SERVICENAME_STR, ZIPKIN_01X_SERVICENAME_ISTIOPROXY_STR)
                    
                    # For traces collected from istio 0.1.x, service name can only be obtained by reading from lookup table                
                    if istio_analytics_span[constants.TARGET_NAME_STR] == ZIPKIN_01X_SERVICENAME_ISTIOPROXY_STR:
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
                                            BINARY_ANNOTATION_RESPONSE_SIZE_STR, 0)

            istio_analytics_span[constants.RESPONSE_CODE_STR] = \
                    get_binary_annotation_value(bin_ann_dict,
                                                BINARY_ANNOTATION_RESPONSE_CODE_STR, '-1')

            istio_analytics_span[constants.USER_AGENT_STR] = \
                get_binary_annotation_value(bin_ann_dict,
                                            BINARY_ANNOTATION_USER_AGENT_STR)

            request_info = [
                get_binary_annotation_value(bin_ann_dict, 'http.method', 'NO-METHOD'),
                get_binary_annotation_value(bin_ann_dict, 'http.url', 'NO-URL'),
                get_binary_annotation_value(bin_ann_dict, 'http.protocol', 'NO-PROTCOL')
                ]
            if request_info[0] == 'NO-METHOD':
                request_info = \
                    get_binary_annotation_value(bin_ann_dict,
                                                BINARY_ANNOTATION_REQUEST_LINE_STR,
                                                "NO-METHOD NO-URL NO-PROTOCOL").split(' ')
            istio_analytics_span[constants.REQUEST_URL_STR] = ' '.join(request_info[0:2])
            istio_analytics_span[constants.PROTOCOL_STR] = request_info[2]

            istio_analytics_span[constants.REQUEST_SIZE_STR] = \
                get_binary_annotation_value(bin_ann_dict,
                                            BINARY_ANNOTATION_REQUEST_SIZE_STR, 0)

            istio_analytics_span[constants.SPAN_ID_STR] = zipkin_span[ZIPKIN_SPANID_STR]
            if ZIPKIN_PARENT_SPANID_STR in zipkin_span:
                istio_analytics_span[constants.PARENT_SPAN_ID_STR] = zipkin_span[ZIPKIN_PARENT_SPANID_STR]

            istio_analytics_spans.append(istio_analytics_span)

        istio_analytics_trace[constants.SPANS_STR] = istio_analytics_spans
        
        # Do not display empty-span traces
        if len(istio_analytics_trace[constants.SPANS_STR]) > 0:
            ret_val.append(istio_analytics_trace)

    return ret_val

def global_sort_annotations(zipkin_trace, span_filter):
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
        if span_filter.filter(zipkin_span) == False:
            continue
  
        for annotation in zipkin_span.get(ZIPKIN_ANNOTATIONS_STR, []):
            global_annotations.append({
                'span_id': zipkin_span[ZIPKIN_SPANID_STR],
                'annotation': annotation
            })
        span_dict[zipkin_span[ZIPKIN_SPANID_STR]] = {
            'zipkin_span': zipkin_span,
            'binary_annotations': build_binary_annotation_dict(zipkin_span),
            'annotations': build_annotation_dict(zipkin_span)
        }

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

    request_info = None
    if BINARY_ANNOTATION_REQUEST_LINE_STR in bin_ann_dict:
        request_info = \
            get_binary_annotation_value(bin_ann_dict,
                                        BINARY_ANNOTATION_REQUEST_LINE_STR).split(' ')
    else:
        request_info = [bin_ann_dict.get('http.method', 'MISSING-METHOD'),
                        bin_ann_dict.get('http.url', 'MISSING-URL'),
                        bin_ann_dict.get('http.protocol', 'MISSING-PROTOCOL')]

    event = {
        constants.EVENT_SEQUENCE_NUMBER_STR: event_sequence_number,
        constants.SPAN_ID_STR: zipkin_span[ZIPKIN_SPANID_STR],
        constants.TIMESTAMP_STR: annotation[ZIPKIN_ANNOTATIONS_TIMESTAMP_STR],
        constants.REQUEST_URL_STR: ' '.join(request_info[0:2]),
        constants.REQUEST_SIZE_STR: get_binary_annotation_value(bin_ann_dict,
                                        BINARY_ANNOTATION_REQUEST_SIZE_STR, 0),
        constants.PROTOCOL_STR: request_info[2],
        constants.RESPONSE_SIZE_STR: get_binary_annotation_value(bin_ann_dict,
                                        BINARY_ANNOTATION_RESPONSE_SIZE_STR, 0),
        constants.RESPONSE_CODE_STR: get_binary_annotation_value(bin_ann_dict,
                                        BINARY_ANNOTATION_RESPONSE_CODE_STR, '-1'),
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

    # For istio 0.2.x, service name is directly available from spans
    service_name = cs_ann['annotation'][ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                       .get(ZIPKIN_ANNOTATIONS_ENDPOINT_SERVICENAME_STR)
    
    # Service names are the same for all services in data from istio 0.1.x 
    # A lookup table is used to map the service ip to service name                  
    if service_name == ZIPKIN_01X_SERVICENAME_ISTIOPROXY_STR:
        ip_address = cs_ann['annotation'][ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                       .get(ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR, 'NO-IP')
        if ip_address not in ip_to_name_lookup_table:
        # This is the root span of the trace
            node_id = get_binary_annotation_value(bin_ann_dict,
                                              BINARY_ANNOTATION_NODE_ID_STR)
            ip_to_name_lookup_table[ip_address] = node_id

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
    
    # The interlocutor can be derived from service name in span from istio 0.2.x
    # For istio 0.1.x, it's read from the span name for the less meaningful service names
    event[constants.INTERLOCUTOR_STR] = ann_dict.get(ZIPKIN_SS_ANNOTATION, {})\
                                                .get(ZIPKIN_ANNOTATIONS_ENDPOINT_STR, {})\
                                                .get(ZIPKIN_ANNOTATIONS_ENDPOINT_SERVICENAME_STR, ZIPKIN_01X_SERVICENAME_ISTIOPROXY_STR)                                            
    if event[constants.INTERLOCUTOR_STR] == ZIPKIN_01X_SERVICENAME_ISTIOPROXY_STR:
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

        if os.getenv(env_constants.ISTIO_ANALYTICS_SKYDIVE_HOST_ENV):
            # Try to add to the send_request event a shortest-path Skydive query for latency analysis
            add_skydive_query(event, service_name, cs_ann, bin_ann_dict)
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
        if ((previous_event[constants.EVENT_TYPE_STR] == constants.EVENT_PROCESS_REQUEST and
               constants.PARENT_SPAN_ID_STR in event and
               previous_event[constants.SPAN_ID_STR] == event[constants.PARENT_SPAN_ID_STR]) or
              (previous_event[constants.EVENT_TYPE_STR] == constants.EVENT_PROCESS_RESPONSE and
               constants.PARENT_SPAN_ID_STR in previous_event and
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
    
    # For istio 0.2.x, service name is directly available from spans
    service_name = sr_ann['annotation'][ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                       .get(ZIPKIN_ANNOTATIONS_ENDPOINT_SERVICENAME_STR)

    # Service names are the same for all services in data from istio 0.1.x 
    # A lookup table is used to map the service ip to service name 
    if service_name == ZIPKIN_01X_SERVICENAME_ISTIOPROXY_STR:
        ip_address = sr_ann['annotation'][ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                       .get(ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR, 'NO-IP')

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

    if not ZIPKIN_CS_ANNOTATION in ann_dict:
        # The client of the span was not traced; therefore, we could not find
        # a CS annotation in the span
        event[constants.INTERLOCUTOR_STR] = "NO-NAME"
    else:
        # The interlocutor can be derived from service name in span from istio 0.2.x
        # For istio 0.1.x, it's read from the span name for the less meaningful service names
        event[constants.INTERLOCUTOR_STR] = ann_dict.get(ZIPKIN_CS_ANNOTATION, {})\
            .get(ZIPKIN_ANNOTATIONS_ENDPOINT_STR)\
            .get(ZIPKIN_ANNOTATIONS_ENDPOINT_SERVICENAME_STR, ZIPKIN_01X_SERVICENAME_ISTIOPROXY_STR)
                                        
    if event[constants.INTERLOCUTOR_STR] == ZIPKIN_01X_SERVICENAME_ISTIOPROXY_STR:                     
        cs_ip_address = ann_dict.get(ZIPKIN_CS_ANNOTATION, {})\
                            .get(ZIPKIN_ANNOTATIONS_ENDPOINT_STR, {})\
                            .get(ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR, "NO-IP")
                            
        if cs_ip_address == 'NO-IP':
            log.warn("Could not find cs IP address in {annotations}".format(annotations=ann_dict))
        event[constants.INTERLOCUTOR_STR] = ip_to_name_lookup_table.get(cs_ip_address, "NO-NAME")

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

    # For istio 0.2.x, service name is directly available from spans
    # Service names are the same for all services in data from istio 0.1.x 
    # A lookup table is used to map the service ip to service name 
    service_name = ss_ann['annotation'][ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                       .get(ZIPKIN_ANNOTATIONS_ENDPOINT_SERVICENAME_STR)
    if service_name == ZIPKIN_01X_SERVICENAME_ISTIOPROXY_STR:
        ip_address = ss_ann['annotation'][ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                       .get(ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR, 'NO-IP')

        service_name = ip_to_name_lookup_table[ip_address]

    # Create a new send_response event
    event = initialize_event(zipkin_span, ss_ann['annotation'], bin_ann_dict,
                             event_sequence_number)
    event[constants.EVENT_TYPE_STR] = constants.EVENT_SEND_RESPONSE

    if not ZIPKIN_CS_ANNOTATION in ann_dict:
        # The client of the span was not traced; therefore, we could not find
        # a CS annotation in the span
        event[constants.INTERLOCUTOR_STR] = "NO-NAME"
    else:
        # The interlocutor can be derived from service name in span from istio 0.2.x
        # For istio 0.1.x, it's read from the span name for the less meaningful service names
        event[constants.INTERLOCUTOR_STR] = ann_dict.get(ZIPKIN_CS_ANNOTATION, {})\
            .get(ZIPKIN_ANNOTATIONS_ENDPOINT_STR, {})\
            .get(ZIPKIN_ANNOTATIONS_ENDPOINT_SERVICENAME_STR, ZIPKIN_01X_SERVICENAME_ISTIOPROXY_STR)

    if event[constants.INTERLOCUTOR_STR] == ZIPKIN_01X_SERVICENAME_ISTIOPROXY_STR:
        cs_ip_address = ann_dict.get(ZIPKIN_CS_ANNOTATION, {})\
                            .get(ZIPKIN_ANNOTATIONS_ENDPOINT_STR, {})\
                            .get(ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR, "NO-IP")
        if cs_ip_address == 'NO-IP':
            log.warn("Could not find cs IP address in {annotations}".format(annotations=ann_dict))
        event[constants.INTERLOCUTOR_STR] = ip_to_name_lookup_table.get(cs_ip_address, "NO-NAME")

    if ZIPKIN_CR_ANNOTATION in ann_dict:
        # Set the duration of the new send_response event
        cr_ann_time = ann_dict[ZIPKIN_CR_ANNOTATION][ZIPKIN_ANNOTATIONS_TIMESTAMP_STR]
        ss_ann_time = ss_ann['annotation'][ZIPKIN_ANNOTATIONS_TIMESTAMP_STR]
        event[constants.DURATION_STR] = cr_ann_time - ss_ann_time

    if previous_event:
        if ((previous_event[constants.EVENT_TYPE_STR] == constants.EVENT_PROCESS_REQUEST and
               previous_event[constants.SPAN_ID_STR] == event[constants.SPAN_ID_STR]) or

              (previous_event[constants.EVENT_TYPE_STR] == constants.EVENT_PROCESS_RESPONSE and
               constants.PARENT_SPAN_ID_STR in previous_event and
               previous_event[constants.PARENT_SPAN_ID_STR] == event[constants.SPAN_ID_STR] and
                (
                    (constants.EVENT_SEND_REQUEST in events_per_span[previous_event[constants.SPAN_ID_STR]] and
                     constants.EVENT_SEND_REQUEST in events_per_span[event[constants.SPAN_ID_STR]] and
                     events_per_span[previous_event[constants.SPAN_ID_STR]]
                              [constants.EVENT_SEND_REQUEST][constants.TIMESTAMP_STR] > 
                    events_per_span[event[constants.SPAN_ID_STR]]
                              [constants.EVENT_SEND_REQUEST][constants.TIMESTAMP_STR]) 
                    or
                    (events_per_span[previous_event[constants.SPAN_ID_STR]]
                              [constants.EVENT_PROCESS_REQUEST][constants.TIMESTAMP_STR] > 
                    events_per_span[event[constants.SPAN_ID_STR]]
                              [constants.EVENT_PROCESS_REQUEST][constants.TIMESTAMP_STR])
                )
              )
           ):
            # If this event follows either a process_request event of the same span,
            #   or a process_response event of a later child span
            # then set the previous event duration
            previous_event_duration = (event[constants.TIMESTAMP_STR] - 
                                       previous_event[constants.TIMESTAMP_STR])
            previous_event[constants.DURATION_STR] = previous_event_duration

    if not ZIPKIN_CS_ANNOTATION in ann_dict:
        # The client of this span is not traced.
        # We do not create a send_response event if we do not know the client
        return None

    # Add the new event to the list of events of the service sending the response
    events_per_service[service_name][constants.EVENTS_STR].append(event)
    update_events_per_span(events_per_span, event, span_id, constants.EVENT_SEND_RESPONSE)

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

    # For istio 0.2.x, service name is directly available from spans
    # Service names are the same for all services in data from istio 0.1.x 
    # A lookup table is used to map the service ip to service name 
    service_name = cr_ann['annotation'][ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                       .get(ZIPKIN_ANNOTATIONS_ENDPOINT_SERVICENAME_STR)
    if service_name == ZIPKIN_01X_SERVICENAME_ISTIOPROXY_STR:
        ip_address = cr_ann['annotation'][ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                       .get(ZIPKIN_ANNOTATIONS_ENDPOINT_IPV4_STR, 'NO-IP')

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

    # The interlocutor can be derived from service name in span from istio 0.2.x
    # For istio 0.1.x, it's read from the span name for the less meaningful service names
    event[constants.INTERLOCUTOR_STR] = ann_dict.get(ZIPKIN_SS_ANNOTATION, {})\
                                                .get(ZIPKIN_ANNOTATIONS_ENDPOINT_STR, {})\
                                                .get(ZIPKIN_ANNOTATIONS_ENDPOINT_SERVICENAME_STR, ZIPKIN_01X_SERVICENAME_ISTIOPROXY_STR)
    if event[constants.INTERLOCUTOR_STR] == ZIPKIN_01X_SERVICENAME_ISTIOPROXY_STR:
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

def zipkin_trace_list_to_timelines(zipkin_trace_list, filter_list):
    '''Converts each trace of a list of traces as returned by Zipkin into timelines
    as specified by the REST API POST /distributed_tracing/traces/timelines.

    @param zipkin_trace_list (list): List of traces as returned by Zipkin GET /api/v1/traces/
    @param filter_list(list): List of service names whose spans will be skipped

    @rtype: list
    @return List of trace timelines as specified by POST /distributed_tracing/traces/timelines
    '''
    ret_val = []
    for zipkin_trace in zipkin_trace_list:
        assert isinstance(zipkin_trace, list), "zipkin_trace is a {}".format(type(zipkin_trace))
        assert isinstance(zipkin_trace[0], dict), "zipkin_trace[0] is a {}".format(type(zipkin_trace))

        # Get the trace id from the first span in the trace
        # All spans of a given trace will have the same trace id value
        trace_id = zipkin_trace[0][ZIPKIN_TRACEID_STR]

        trace_timelines = {
            constants.TRACE_ID_STR: trace_id,
            constants.REQUEST_URL_STR: get_trace_root_request(zipkin_trace)
        }

        # Specify the spans that should be filtered out
        span_filter = Zipkin_Span_Filter()
        for service_name in filter_list:
            span_filter.add_service(service_name)

        # Sort all annotations of the trace globally and filter out the spans speified in the filter
        zipkin_span_dict, sorted_annotations = global_sort_annotations(zipkin_trace, span_filter)
        # If there is no span left in the trace, then the zipkin_span_dict is empty.
        # We need to skip the processing of this trace in the rest of the loop.
        if len(zipkin_span_dict) == 0:
            continue

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
                current_event = process_cr_annotation(annotation, zipkin_span_dict,
                                                      ip_to_name_lookup_table,
                                                      events_per_service, events_per_span,
                                                      event_sequence_number)
            # Note that current_event can be None if this is an SS annotation 
            # and either (1) it belongs to a span with a timeout, or (2) the client
            # of the span is not traced. 
            # In these cases we should not create a send_response event.
            if current_event:
                previous_event = current_event
                event_sequence_number += 1

        timeline_list = list(events_per_service.values())
        clean_up_timelines(timeline_list)

        trace_timelines[constants.TIMELINES_STR] = timeline_list 
        ret_val.append(trace_timelines)

    return ret_val

class Zipkin_Span_Filter:
    # Currently just filter out spans according to their service names
    def __init__(self):
        self.service_names = []
        
    def add_service(self, service_name):
        self.service_names.append(service_name)
        
    def filter(self, zipkin_span):
        for name in self.service_names:
            if ZIPKIN_ANNOTATIONS_STR in zipkin_span: 
                for annotation in zipkin_span[ZIPKIN_ANNOTATIONS_STR]:
                    if annotation[ZIPKIN_ANNOTATIONS_ENDPOINT_STR]\
                        [ZIPKIN_ANNOTATIONS_ENDPOINT_SERVICENAME_STR] == name:
                        return False
        return True
