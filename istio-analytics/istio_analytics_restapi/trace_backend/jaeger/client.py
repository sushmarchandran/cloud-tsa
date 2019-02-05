'''
Jaeger client code
'''

from abc import ABC, abstractmethod
import logging
log = logging.getLogger(__name__)

import requests
import json

import istio_analytics_restapi.trace_backend.abstract_client as abstract_client
import istio_analytics_restapi.trace_backend.jaeger.util as jaeger_util

# How far back in the past to look for traces (in microseconds)
JAEGER_START_PARAM = 'start'

# End time in epoch time (microseconds)
JAEGER_END_TIME_PARAM = 'end'

# Maximum number of traces to retrieve
JAEGER_MAX_TRACES_PARAM = 'limit'

# Service to query
JAEGER_SERVICE_PARAM = 'service'

# Service name is a required parameter in query to jaeger server.
# istio-ingressgateway is the default option 
SERVICE_ISTIO_INGRESSGATEWAY_STR = 'istio-ingressgateway'

class JaegerClient(abstract_client.AbstractClient):
    '''
    Jeager client to interact with the Jaeger server via REST
    '''
    def __init__(self, jaeger_host):
        '''
        Constructor
        
        @param jaeger_host (string): URL for the Jaeger REST API. 
               Example: 'http://localhost:16686'
        '''
        self.__base_url = u'{host}'.format(host=jaeger_host)

    def get_traces(self, start_time, end_time, max_traces=100, tags=None):
        '''
        Retrieves a list of traces from Jaeger

        @param start_time (integer): start time (epoch in milliseconds)
        @param end_time (integer): end time (epoch in milliseconds)
        @param max_traces (integer): Maximum number of traces to retrieve
        @param tags (list): List of strings containing key-value pairs
        
        @return On success, a tuple with an array of Jaeger traces and the HTTP code 200
                On error, an error message and an appropriate HTTP code
        @rtype tuple(list or string, integer)
        '''
        url = u'{baseurl}/api/traces'.format(baseurl=self.__base_url)

        # Jaeger expects timestamp in microseconds precision so 1000 is multiplied to inputs
        req_params = {JAEGER_START_PARAM: start_time * 1000, 
                      JAEGER_END_TIME_PARAM: end_time * 1000,
                      JAEGER_MAX_TRACES_PARAM: max_traces,
                      JAEGER_SERVICE_PARAM: SERVICE_ISTIO_INGRESSGATEWAY_STR}
        try:
            response = requests.get(url, params=req_params)
            log.debug(u'Request made to Jaeger: {0}'.format(response.url))
            if response.status_code != 200:
                msg = u'Error while trying to get traces from Jaeger: {0}'.format(response.text)
                return msg, 502
            #log.debug(u'Raw traces received from Jaeger: {0}'.format(response.text))
            traces = json.loads(response.text)[jaeger_util.JAEGER_TRACE_STR]
            if tags:
                log.debug(u'Selecting traces based on tags: {0}'.format(tags))
                traces = self._select_traces_matching_tags(traces, tags)
                log.debug(u'Filtered traces: {0}'.format(traces))
            return traces, 200
        except requests.exceptions.ConnectionError as e:
            msg = u'Error while trying to get traces from Jaeger: {0}'.format(e)
            return msg, 502
        except Exception as e:
            msg = u'Error while trying to get traces from Jaeger: {0} (a {1})'.format(e, e.__class__)
            return msg, 500

    @staticmethod
    def _select_traces_matching_tags(traces, tags):
        '''
        Given a list of traces, select only the traces matching the tag query implied by
        the key-value pairs in the provided list of tags.
        Traces will be selected such that the tag query matches span tags (binary annotations).
        All key-value pairs in the query must match (AND semantics), but they
        do not have to match all spans; different key-value pairs may match different spans.

        @param traces (list): Array of traces
        @param tags (list): List of strings where each string has the form "key:value", where
        the key and value must match a binary annotation key and value, respectively
        
        @return A list of traces matching the list of key-value pairs
        @rtype(list) 
        '''
        filtered_list = []

        # Convert the list of strings encoding key-value pairs to a dict
        tags_to_match = {}
        for key_value in tags:
            key_value_array = key_value.split(':')
            tags_to_match[key_value_array[0]] = key_value_array[1]
        log.debug(u'Matching the following tag names against traces: {0}'.format(tags_to_match))

        matched_tags = set()

        for trace in traces:
            matched_tags.clear()
            for span in trace[jaeger_util.TRACE_SPANS_STR]:
                for tag in span[jaeger_util.SPAN_TAGS_STR]:
                    for key, value in tags_to_match.items():
                        log.debug(u'Trying to match {0}:{1} against tag {2}'
                                  .format(key, value, tag))
                        if ((key == 
                              tag[jaeger_util.TAG_KEY_STR]) and
                            (value in 
                              tag[jaeger_util.TAG_VALUE_STR])
                            ):
                            matched_tags.add(key)
                            log.debug(u'Matched key and value: {0}--{1}'.format(key, value))
            if len(matched_tags) == len(tags_to_match):
                filtered_list.append(trace)

        return filtered_list

    def trace_list_to_istio_analytics_trace_list(self, jaeger_trace_list, filter_list):
        return jaeger_util.trace_list_to_istio_analytics_trace_list(jaeger_trace_list, filter_list)
    
    def trace_list_to_timelines(self, jaeger_trace_list, filter_list):
        return jaeger_util.trace_list_to_timelines(jaeger_trace_list, filter_list)

    
