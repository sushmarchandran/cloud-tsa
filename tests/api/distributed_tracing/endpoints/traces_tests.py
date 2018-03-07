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

        # Location of test data files with Zipkin traces
        cls.test_data_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                               '..', '..', '..',  'data', 'zipkin')
        
        # Location of test files with expected results from the Istio Analytics REST API
        cls.responses_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                               '..', '..', '..',  'data', 
                                               'istio_analytics_responses')

        # Zipkin host (calls to it will actually be mocked)
        cls.zipkin_host = os.getenv(constants.ISTIO_ANALYTICS_ZIPKIN_HOST_ENV)
        
        # Zipkin endpoint to get traces
        cls.zipkin_traces_endpoint = '{0}/api/v1/traces/'.format(cls.zipkin_host)

        # Parameters used to get the traces from the mock Zipkin        
        cls.zipkin_traces_start_time = '2017-07-07T14:20:35.644Z'
        cls.istio_analytics_req_payload = json.dumps({
            req_params.START_TIME_PARAM_STR: cls.zipkin_traces_start_time
        })

        # Files with traces returned by Zipkin
        cls.zipkin_trace_test_files = [
            # Bookinfo; 1 trace; normal trace; reviews version 2; istio 0.1.6
            'zipkin-trace-reviews_v2-normal.json',
            
            # Bookinfo; 1 trace; normal trace; reviews version 3; istio 0.1.6
            'zipkin-trace-reviews_v3-normal.json',
            
            # Bookinfo; 1 trace; reviews version 3; reviews times out and returns a 500 to 
            # productpage as a result; istio 0.1.6
            'zipkin-trace-reviews_v3-delay.json',
            
            # Bookinfo; 1 trace; reviews version 2; productpage times out and reviews keeps
            # going regardless; istio 0.1.6
            'zipkin-trace-reviews_v2-delay_7s.json',
            
            # Bookinfo; 1 trace; reviews version 2; productpage times out and then reviews times out; istio 0.1.6
            'zipkin-trace-reviews_v2-delay_13s.json',

            # DLaaS; 1 trace and 1 span; a service calling itself; istio 0.1.6
            'zipkin-trace-self-call.json',
            
            # Bookinfo; 1 trace; normal trace; reviews version 2; istio 0.2.9
            'zipkin-trace-reviews_V2-normal-029.json',
            
            # Bookinfo; 1 trace; normal trace; reviews version 3; istio 0.2.9
            'zipkin-trace-reviews_V3-normal-029.json',
            
            # Bookinfo; 1 trace; reviews version 2; productpage times out and reviews keeps
            # going regardless; istio 0.2.9
            'zipkin-trace-reviews_V2-delay7s-029.json',
            
            # Bookinfo; 1 trace; reviews version 2; productpage times out and then reviews times out; istio 0.2.9
            'zipkin-trace-reviews_V2-delay13s-029.json',
            
            # Bookinfo; 1 trace; reviews version 3; reviews times out and returns a 500 to 
            # productpage as a result; istio 0.2.9
            'zipkin-trace-reviews_V3-delay7s-029.json',
            'zipkin-trace-reviews_V3-delay13s-029.json',
        ]

        log.info('Completed initialization for testing the distributed-tracing analytics REST API')

    def test_traces(self):
        '''Tests the REST endpoint /distributed_tracing/traces/'''
        
        # The order here needs to match the order in the array
        # cls.zipkin_trace_test_files
        istio_analytics_traces_response_files = [
            'traces_response-reviews_v2-normal.json',
            'traces_response-reviews_v3-normal.json',
            'traces_response-reviews_v3-delay.json',
            'traces_response-reviews_v2-delay_7s.json',
            'traces_response-reviews_v2-delay_13s.json',
            'traces_self-trace.json',
            'traces_response-reviews_V2-normal_029.json',
            'traces_response-reviews_V3-normal_029.json',
            'traces_response-reviews_V2-delay_7s-029.json',
            'traces_response-reviews_V2-delay_13s-029.json',
            'traces_response-reviews_V3-delay_7s-029.json',
            'traces_response-reviews_V3-delay_13s-029.json'
        ]

        log.info('===TESTING THE ENDPOINT /distributed_tracing/traces')
        with requests_mock.mock() as m:
            for i in range(len(self.zipkin_trace_test_files)):
                log.info('======STARTING TEST {0}'.format(i))
                
                # Get the Zipkin trace from the test data file
                test_file_fullname = os.path.abspath(os.path.join(
                                        self.test_data_directory,
                                        self.zipkin_trace_test_files[i]))
                with open(test_file_fullname) as f:
                    zipkin_trace = f.read()

                # Set a mock response from the mock Zipkin endpoint /api/v1/traces/
                m.get(self.zipkin_traces_endpoint, json=json.loads(zipkin_trace))

                log.info(u'Zipkin mock response set to trace from file {0}'
                         .format(test_file_fullname))

                # Call the Istio Analytics REST API via the test client
                resp = self.flask_test.post('/api/v1/distributed_tracing/traces/',
                                            data=self.istio_analytics_req_payload,
                                            content_type='application/json')

                msg = 'Unexpected status code when getting traces from Istio Analytics'
                self.assertEqual(resp.status_code, 200, msg)
                
                response_dict = json.loads(resp.data)
                
                msg = 'Unexpected value for zipkin_url key'
                self.assertEqual(response_dict[responses.ZIPKIN_URL_STR],
                                 self.zipkin_host,
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
        istio_analytics_timelines_response_files = [
            'timelines_v2_normal.json',
            'timelines_v3_normal.json',
            'timelines_v3_delay_reviews-timeout_and-return-500.json',
            'timelines_v2_delay_7s_pp-timeout_reviews-keeps_going.json',
            'timelines_v2_delay_13s_pp-timeout_reviews-timeout_mismatch.json',
            'timelines_self-trace.json',
            'timelines_V2_normal_029.json',
            'timelines_V3_normal_029.json',
            'timelines_V2_delay_7s_pp-timeout_reviews-keeps_going-029.json',
            'timelines_V2_delay_13s_pp-timeout_reviews-timeout_mismatch-029.json',
            'timelines_V3_delay_7s_reviews-timeout_and_return_500-029.json',
            'timelines_V3_delay_13s_reviews-timeout_and_return_500-029.json'
        ]

        log.info('===TESTING THE ENDPOINT /distributed_tracing/traces/timelines')
        with requests_mock.mock() as m:
            for i in range(len(self.zipkin_trace_test_files)):
                log.info('======STARTING TEST {0}'.format(i))
                
                # Get the Zipkin trace from the test data file
                test_file_fullname = os.path.abspath(os.path.join(
                                        self.test_data_directory,
                                        self.zipkin_trace_test_files[i]))
                with open(test_file_fullname) as f:
                    zipkin_trace = f.read()

                # Set a mock response from the mock Zipkin endpoint /api/v1/traces/
                m.get(self.zipkin_traces_endpoint, json=json.loads(zipkin_trace))

                log.info(u'Zipkin mock response set to trace from file {0}'
                         .format(test_file_fullname))

                # Call the Istio Analytics REST API via the test client
                resp = self.flask_test.post('/api/v1/distributed_tracing/traces/timelines',
                                            data=self.istio_analytics_req_payload,
                                            content_type='application/json')

                msg = 'Unexpected status code when getting timelines from Istio Analytics'
                self.assertEqual(resp.status_code, 200, msg)
                
                response_dict = json.loads(resp.data)
                log.debug(u'Timeline data returned by Istio Analytics: {0}'.format(response_dict))
                
                msg = 'Unexpected value for zipkin_url key'
                self.assertEqual(response_dict[responses.ZIPKIN_URL_STR],
                                 self.zipkin_host,
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