'''
Zipkin client code
'''
import logging
log = logging.getLogger(__name__)

import requests

# How far back in the past to look for traces (in milliseconds)
ZIPKIN_LOOKBACK_PARAM = 'lookback'

# End time in epoch time (milliseconds)
ZIPKIN_END_TIME_PARAM = 'endTs'

# Maximum number of traces to retrieve
ZIPKIN_MAX_TRACES_PARAM = 'limit'

class ZipkinClient:
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
    
    def get_traces(self, start_time, end_time, max_traces=100):
        '''
        Retrieves a list of traces from Zipkin
        
        @param start_time (integer): start time (epoch in milliseconds)
        @param end_time (integer): end time (epoch in milliseconds)
        @param max_traces (integer): Maximum number of traces to retrieve
        
        @return On success, a tuple with an array of Zipkin traces as a string and the HTTP code 200
                On error, an error message and an appropriate HTTP code
        @rtype tuple(string, integer)
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
            return response.text, 200
        except Exception as e:
            msg = u'Error while trying to get traces from Zipkin: {0}'.format(e)
            return msg, 504