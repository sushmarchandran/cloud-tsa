'''
Zipkin client code
'''

from abc import ABC, abstractmethod
import logging
log = logging.getLogger(__name__)

import requests
import json

import istio_analytics_restapi.trace_backend.zipkin.util as zipkin_util
import istio_analytics_restapi.trace_backend.abstract_client as abstract_client

# How far back in the past to look for traces (in milliseconds)
ZIPKIN_LOOKBACK_PARAM = 'lookback'

# End time in epoch time (milliseconds)
ZIPKIN_END_TIME_PARAM = 'endTs'

# Maximum number of traces to retrieve
ZIPKIN_MAX_TRACES_PARAM = 'limit'

class ZipkinClient(abstract_client.AbstractClient):
    '''
    Zipkin client to interact with the Zipkin server via REST
    '''
    def __init__(self, zipkin_host):
        '''
        Constructor
        
        @param zipkin_host (string): URL for the Zipkin REST API. 
               Example: 'http://localhost:9411'
        '''
        self.__zipkin_host = zipkin_host
        self.__base_url = u'{host}/api/v1'.format(host=zipkin_host)
    
    def get_traces(self, start_time, end_time, max_traces=100, tags=None):
        '''
        Retrieves a list of traces from Zipkin

        @param start_time (integer): start time (epoch in milliseconds)
        @param end_time (integer): end time (epoch in milliseconds)
        @param max_traces (integer): Maximum number of traces to retrieve
        @param tags (list): List of strings containing key-value pairs
        
        @return On success, a tuple with an array of Zipkin traces and the HTTP code 200
                On error, an error message and an appropriate HTTP code
        @rtype tuple(list or string, integer)
        '''
        url = u'{baseurl}/traces/'.format(baseurl=self.__base_url)
        req_params = {ZIPKIN_LOOKBACK_PARAM: (end_time - start_time), 
                      ZIPKIN_END_TIME_PARAM: end_time,
                      ZIPKIN_MAX_TRACES_PARAM: max_traces}
        try:
            response = requests.get(url, params=req_params)
            log.debug(u'Request made to Zipkin: {0}'.format(response.url))
            if response.status_code != 200:
                msg = u'Error while trying to get traces from Zipkin: {0}'.format(response.text)
                return msg, 502
            log.debug(u'Traces received from Zipkin: {0}'.format(response.text))
            traces = json.loads(response.text)
            if tags:
                # We do not rely on Zipkin annotation queries because Zipkin does not 
                # support partial matching in such queries
                log.debug(u'Selecting traces based on tags: {0}'.format(tags))
                traces = self._select_traces_matching_tags(traces, tags)
            return traces, 200
        except requests.exceptions.ConnectionError as e:
            msg = u'Error while trying to get traces from Zipkin: {0}'.format(e)
            return msg, 502
        except Exception as e:
            msg = u'Error while trying to get traces from Zipkin: {0} (a {1})'.format(e, e.__class__)
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
            for span in trace:
                for binary_annotation in span[zipkin_util.ZIPKIN_BINARY_ANNOTATIONS_STR]:
                    for key, value in tags_to_match.items():
                        log.debug(u'Trying to match {0}:{1} against binary annotation {2}'
                                  .format(key, value, binary_annotation))
                        if ((key == 
                              binary_annotation[zipkin_util.ZIPKIN_BINARY_ANNOTATIONS_KEY_STR]) and
                            (value in 
                              binary_annotation[zipkin_util.ZIPKIN_BINARY_ANNOTATIONS_VALUE_STR])
                            ):
                            matched_tags.add(key)
                            log.debug(u'Matched key and value: {0}--{1}'.format(key, value))
            if len(matched_tags) == len(tags_to_match):
                filtered_list.append(trace)

        return filtered_list

    def trace_list_to_istio_analytics_trace_list(self, traces_or_error_msg, filter_list):
        return zipkin_util.zipkin_trace_list_to_istio_analytics_trace_list(traces_or_error_msg, filter_list)
    
    def trace_list_to_timelines(self, traces_or_error_msg, filter_list):
        return zipkin_util.zipkin_trace_list_to_timelines(traces_or_error_msg, filter_list)