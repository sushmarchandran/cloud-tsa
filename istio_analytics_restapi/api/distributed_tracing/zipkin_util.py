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

def zipkin_trace_list_to_istio_analytics_trace_list(zipkin_trace_list, zipkin_host):
    '''Converts a list of traces as returned by Zipkin into the format 
    specified by the REST API POST /distributed_tracing/traces/.
    
    @param zipkin_trace_list (list): List of traces as returned by Zipkin GET /api/v1/traces/
    @param zipkin_host (string): URL to the Zipkin server that returned the trace list
    
    @rtype: dictionary
    @return List of traces in a dictionary as specified by POST /distributed_tracing/traces
    '''
    ret_val = {
        constants.ZIPKIN_URL_STR: zipkin_host
    }
    istio_analytics_trace_list = []
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
        istio_analytics_trace_list.append(istio_analytics_trace)

    ret_val[constants.TRACES_STR] = istio_analytics_trace_list
    return ret_val