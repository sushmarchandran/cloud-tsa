'''
Skydive client code
'''
import logging
log = logging.getLogger(__name__)

import requests
import json

# Query expressed in the Gremlin graph query language
GREMLIN_QUERY_PARAM = 'GremlinQuery'

class SkydiveClient:
    '''
    Skydive client to interact with the Skydive server via REST
    '''
    def __init__(self, skydive_host):
        '''
        Constructor
        
        @param skydive_host (string): URL for the Skydive REST API. 
               Example: 'http://localhost:8082'
        '''
        self.__skydive_host = skydive_host
        self.__base_url = u'{host}/api'.format(host=skydive_host)
    
    def start_capture(self, gremlin_query):
        '''
        Asks Skydive to capture network traffic, scoped by the given Gremlin query.
        
        @param gremlin_query (string): String encoding a query in the Gremlin 
        graph language, used by Skydive to query the network topology.

        @return On success, a tuple with details on the Skydive's capture and the HTTP code 200
                On error, an error message and an appropriate HTTP code
        @rtype tuple(dictionary or string, integer)
        '''

        url = u'{baseurl}/capture'.format(baseurl=self.__base_url)
        req_params = {GREMLIN_QUERY_PARAM: gremlin_query}
        try:
            response = requests.post(url, json=req_params)
            log.debug(u'Request made to Skydive: POST {0}'.format(response.url))
            if response.status_code != 200:
                msg = u'Error while asking Skydive to start capturing traffic: {0}'.format(response.text)
                return msg, 502
            return json.loads(response.text), 200
        except requests.exceptions.ConnectionError as e:
            msg = u'Error while asking Skydive to start capturing traffic: {0}'.format(e)
            return msg, 502
        except Exception as e:
            msg = u'Error while asking Skydive to start capturing traffic: {0} (a {1})'.format(e, e.__class__)
            return msg, 500

    def stop_capture(self, capture_id):
        '''
        Asks Skydive to stop a previously started action to capture network traffic
        
        @param capture_id (string): The uuid of an ongoing Skydive capture action

        @return On success, a tuple with None and the HTTP code 200
                On error, an error message and an appropriate HTTP code
        @rtype tuple(None or string, integer)
        '''
        url = u'{baseurl}/capture/{uuid}'.format(baseurl=self.__base_url, uuid=capture_id)
        try:
            response = requests.delete(url)
            log.debug(u'Request made to Skydive: DELETE {0}'.format(response.url))
            if response.status_code == 404 or response.status_code == 400:
                # Skydive seems to return 400 when it should return 404
                msg = u'The capture action {0} was not found in the Skydive server {1}'.format(capture_id, 
                                                                                       self.__skydive_host)
                return msg, 404
            if response.status_code != 200:
                msg = u'Error while asking Skydive to stop capturing traffic: {0}'.format(response.text)
                return msg, 502
            return None, 204
        except requests.exceptions.ConnectionError as e:
            msg = u'Error while asking Skydive to stop capturing traffic: {0}'.format(e)
            return msg, 502
        except Exception as e:
            msg = u'Error while asking Skydive to stop capturing traffic: {0} (a {1})'.format(e, e.__class__)
            return msg, 500

    def list_captures(self):
        '''
        Asks Skydive to list all ongoing network-traffic capturing actions

        @rtype (list)

        @return List of Skydive's captures, where each element contains all capture's attributes 
        '''
        url = u'{baseurl}/capture'.format(baseurl=self.__base_url)
        try:
            response = requests.get(url)
            log.debug(u'Request made to Skydive: GET {0}'.format(response.url))
            if response.status_code != 200:
                msg = u'Error while asking Skydive to start capturing traffic: {0}'.format(response.text)
                return msg, 502
            response_object = json.loads(response.text)
            if len(response_object) == 0:
                ret_val = []
            else:
                log.debug(u'Skydive returned all captures as: {0}'.format(response_object))
                ret_val = list(response_object.values())
                log.debug(u'Skydive client will return all captures as: {0}'.format(ret_val))
            return ret_val, 200
        except requests.exceptions.ConnectionError as e:
            msg = u'Error while asking Skydive to start capturing traffic: {0}'.format(e)
            return msg, 502
        except Exception as e:
            msg = u'Error while asking Skydive to start capturing traffic: {0} (a {1})'.format(e, e.__class__)
            return msg, 500

    def get_topology(self, gremlin_query):
        url = u'{baseurl}/topology'.format(baseurl=self.__base_url)
        req_params = {GREMLIN_QUERY_PARAM: gremlin_query}
        try:
            response = requests.post(url, json=req_params)
            log.debug(u'Request made to Skydive: POST {0}'.format(response.url))
            if response.status_code != 200:
                msg = u'Error while asking Skydive to get a topology: {0}'.format(response.text)
                return msg, 502
            return json.loads(response.text), 200
        except requests.exceptions.ConnectionError as e:
            msg = u'Error while asking Skydive to get a topology: {0}'.format(e)
            return msg, 502
        except Exception as e:
            msg = u'Error while asking Skydive to get a topology: {0} (a {1})'.format(e, e.__class__)
            return msg, 500