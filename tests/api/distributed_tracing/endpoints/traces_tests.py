'''
Tests for the distributed-tracing analytics REST API
'''
import logging
log = logging.getLogger(__name__)

import unittest
import requests_mock
import os.path
import json

from istio_analytics_restapi import app as flask_app

import istio_analytics_restapi.api.constants as constants
import istio_analytics_restapi.api.distributed_tracing.request_parameters as req_params
import istio_analytics_restapi.api.distributed_tracing.responses as responses
import tests.api.distributed_tracing.endpoints.util as util

class Test(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        '''Setup common to all tests'''
        
        # Initialize the Flask app for testing
        flask_app.app.testing = True
        flask_app.config_logger()
        flask_app.initialize(flask_app.app)

        # Get an internal Flask test client
        cls.flask_test = flask_app.app.test_client()
        
        # Location of test files with expected results from the Istio Analytics REST API

        # Backend trace server name(zipkin or jaeger)
        cls.trace_backend = os.getenv(constants.ISTIO_ANALYTICS_TRACE_BACKEND_ENV)

        # Trace server url (calls to it will actually be mocked)
        cls.server_url = os.getenv(constants.ISTIO_ANALYTICS_TRACE_SERVER_URL_ENV)
        
        # Set location of test data files with traces
        # Get test files list/ Set endpoint to get traces
        # Set Parameters used to get the traces from the mock server
        if cls.trace_backend == constants.TRACE_BACKEND_ZIPKIN:
            cls.test_data_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                               '..', '..', '..', 'data', 'request_loads', 'zipkin')
            cls.trace_test_files = util.zipkin_trace_test_files
            cls.traces_endpoint = '{0}/api/v1/traces/'.format(cls.server_url)
            cls.traces_start_time = '2017-07-07T14:20:35.644Z'
            cls.responses_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                               '..', '..', '..',  'data', 
                                               'istio_analytics_responses', 'zipkin')
        elif cls.trace_backend == constants.TRACE_BACKEND_JAEGER:
            cls.test_data_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                               '..', '..', '..', 'data', 'request_loads', 'jaeger')
            cls.trace_test_files = util.jaeger_trace_test_files
            cls.traces_endpoint = '{0}/api/traces'.format(cls.server_url)
            cls.traces_start_time = '2017-07-07T14:20:35.644Z' 
            cls.responses_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                               '..', '..', '..',  'data', 
                                               'istio_analytics_responses', 'jaeger')
        
        cls.istio_analytics_req_payload = json.dumps({
            req_params.START_TIME_PARAM_STR: cls.traces_start_time
        })

        log.info('Completed initialization for testing the distributed-tracing analytics REST API')

    def test_traces(self):
        '''Tests the REST endpoint /distributed_tracing/traces/'''
        
        if self.trace_backend == constants.TRACE_BACKEND_ZIPKIN:
            istio_analytics_traces_response_files = util.zipkin_traces_response_files
        elif self.trace_backend == constants.TRACE_BACKEND_JAEGER:
            istio_analytics_traces_response_files = util.jaeger_traces_response_files
        
        log.info('===TESTING THE ENDPOINT /distributed_tracing/traces')
        with requests_mock.mock() as m:
            for i in range(len(self.trace_test_files)):
                log.info('======STARTING TEST {0}'.format(i))
                
                # Get the trace files from the test data file path
                test_file_fullname = os.path.abspath(os.path.join(
                                        self.test_data_directory,
                                        self.trace_test_files[i]))
                with open(test_file_fullname) as f:
                    trace = f.read()

                log.info(u'Trace Endpoint: {0}'.format(self.traces_endpoint))
                # Set a mock response from the mock server endpoint
                m.get(self.traces_endpoint, json=json.loads(trace))

                log.info(u'Server mock response set to trace from file {0}'
                         .format(test_file_fullname))

                # Call the Istio Analytics REST API via the test client
                resp = self.flask_test.post('/api/v1/distributed_tracing/traces/',
                                            data=self.istio_analytics_req_payload,
                                            content_type='application/json')

                msg = 'Unexpected status code when getting traces from Istio Analytics'
                self.assertEqual(resp.status_code, 200, msg)
                
                response_dict = json.loads(resp.data)
                log.debug(u'Traces data returned by Istio Analytics: {0}'.format(response_dict))

#                log.info(u'***TEST FILE***: {0}'.format(test_file_fullname))
#                log.info(u'***RESPONSE***: {0}'.format(response_dict))
                
                msg = 'Unexpected value for trace_server_url key'
                self.assertEqual(response_dict[responses.TRACE_SERVER_URL_STR],
                                 self.server_url,
                                 msg)
                
                # Check that we got only 1 Istio Analytics trace
                n_traces = len(response_dict[responses.TRACES_STR])
                msg = u'Expected only 1 trace, but received {0}'.format(n_traces)
                self.assertEqual(n_traces, 1, msg)

                # Get the expected Istio Analytics response from the response data file 
                response_file_fullname = os.path.abspath(os.path.join(
                                        self.responses_directory,
                                        istio_analytics_traces_response_files[i]))
                with open(response_file_fullname) as f:
                    istio_analytics_trace = f.read()

                log.info(u'Expected Istio analytics trace set from file {0}'
                         .format(response_file_fullname))
                
                # Check if Istio Analytics response matches
                msg = 'Unexpected Istio Analytics trace structure'
                self.assertEqual("".join(istio_analytics_trace.split()), 
                                 "".join(json.dumps(response_dict).split()), 
                                 msg)

                log.info('======FINISHED TEST {0}'.format(i))
        log.info('===FINISHED TESTING THE ENDPOINT /distributed_tracing/traces')

    def test_timelines(self):
        '''Tests the REST endpoint /distributed_tracing/traces/timelines'''

        # The order here needs to match the order in the array
        # cls.zipkin_trace_test_files
        if self.trace_backend == 'zipkin':
            istio_analytics_timelines_response_files = util.zipkin_timelines_response_files
        elif self.trace_backend == 'jaeger':
            istio_analytics_timelines_response_files = util.jaeger_timelines_response_files

        log.info('===TESTING THE ENDPOINT /distributed_tracing/traces/timelines')
        with requests_mock.mock() as m:
            for i in range(len(self.trace_test_files)):
                log.info('======STARTING TEST {0}'.format(i))
                
                # Get the trace from the test data file
                test_file_fullname = os.path.abspath(os.path.join(
                                        self.test_data_directory,
                                        self.trace_test_files[i]))
                with open(test_file_fullname) as f:
                    trace = f.read()

                # Set a mock response from the mock server endpoint
                m.get(self.traces_endpoint, json=json.loads(trace))

                log.info(u'mock response set to trace from file {0}'
                         .format(test_file_fullname))

                # Call the Istio Analytics REST API via the test client
                resp = self.flask_test.post('/api/v1/distributed_tracing/traces/timelines',
                                            data=self.istio_analytics_req_payload,
                                            content_type='application/json')

                msg = 'Unexpected status code when getting timelines from Istio Analytics'
                self.assertEqual(resp.status_code, 200, msg)
                
                response_dict = json.loads(resp.data)
                log.debug(u'Timeline data returned by Istio Analytics: {0}'.format(response_dict))
                
#                log.info(u'***TEST FILE***: {0}'.format(test_file_fullname))
#                log.info(u'***RESPONSE***: {0}'.format(response_dict))

                msg = 'Unexpected value for trace_server_url key'
                self.assertEqual(response_dict[responses.TRACE_SERVER_URL_STR],
                                 self.server_url,
                                 msg)
                
                # Check that we got only 1 Istio Analytics trace timeline
                n_traces = len(response_dict[responses.TRACES_TIMELINES_STR])
                msg = (u'Expected timelines for 1 trace, but received timelines for {0} traces'
                       .format(n_traces))
                self.assertEqual(n_traces, 1, msg)

                # Get the expected Istio Analytics response from the response data file 
                response_file_fullname = os.path.abspath(os.path.join(
                                        self.responses_directory,
                                        istio_analytics_timelines_response_files[i]))
                
                with open(response_file_fullname) as f:
                    istio_analytics_trace = f.read()

                log.info(u'Expected Istio analytics trace timelines set from file {0}'
                         .format(response_file_fullname))
                
                # Check if Istio Analytics response matches
                msg = 'Unexpected Istio Analytics timeline structure'
                self.assertEqual("".join(istio_analytics_trace.split()), 
                                 "".join(json.dumps(response_dict).split()), 
                                 msg)

                log.info('======FINISHED TEST {0}'.format(i))
        log.info('===FINISHED TESTING THE ENDPOINT /distributed_tracing/traces/timelines')

if __name__ == "__main__":
    unittest.main()