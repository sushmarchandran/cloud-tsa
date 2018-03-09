'''
REST resources for executing actions on Skydive.

These resources allow our UI to use the Istio Analytics server to make REST calls to Skydive,
preventing a cross-origin security violation. This implementation is not necessary
in a situation where both Istio Analytics and Skydive run on the same domain, which is
the case on ICp. In other words, in ICp, the UI could call Skydive directly, without going through
our server.
'''
import logging
log = logging.getLogger(__name__)

import os
from flask import request
from flask_restplus import Resource, fields
import flask_restplus.errors

from istio_analytics_restapi.api.restplus import api
from istio_analytics_restapi.api.restplus import build_http_error

import istio_analytics_restapi.api.distributed_tracing.responses as dt_responses

from istio_analytics_restapi.api import constants
from istio_analytics_restapi.skydive.skydive_client import SkydiveClient

skydive_client = SkydiveClient(os.getenv(constants.ISTIO_ANALYTICS_SKYDIVE_HOST_ENV))

# See https://github.com/skydive-project/skydive
skydive_namespace = api.namespace('skydive', description='Resources to execute Skydive commands')

GREMLIN_QUERY_PARAM_STR = 'GremlinQuery'
MESSAGE_STR = 'message'

capture_body_parameters = api.model('capture_params', {
    GREMLIN_QUERY_PARAM_STR: fields.String(required=True, example='G.V()',
                            description='Gremlin Query limiting the network interfaces/hosts considered ' 
                            'for capturing the network traffic')
})

capture_response = api.model('capture_response', {
    dt_responses.SKYDIVE_URL_STR: fields.String(required=True, example='http://localhost:8082',
                                  description='URL of the Skydive service monitoring the infrastructure network'),
    'UUID': fields.String(required=True, example='a36d3dd5-cc80-4d5f-7973-eba06dee917c',
                            description='UUID'),
    'GremlinQuery': fields.String(required=True, example='G.V()',
                            description='Gremlin Query limiting the network interfaces/hosts considered ' 
                            'for capturing the network traffic'),
    'Count': fields.Integer(required=True, description='TODO', default=0),
    'ExtraTCPMetric': fields.Boolean(required=True, default=False,
                            description='TODO'),
    'SocketInfo': fields.Boolean(required=True, default=False,
                            description='TODO')
})

stop_capture_response = api.model('stop_capture_response', {
    dt_responses.SKYDIVE_URL_STR: fields.String(required=True, example='http://localhost:8082',
                                  description='URL of the Skydive service monitoring the infrastructure network'),
    MESSAGE_STR: fields.String(required=True, example=None, description='Message providing details about the response '
                             'when applicable')
})

##################################
##################################
######      REST API        ######
##################################
##################################

@skydive_namespace.route('/action/capture')
class CaptureCollection(Resource):

    @api.expect(capture_body_parameters, validate=True)
    @api.marshal_with(capture_response)
    @api.response(201, 'Action to capture network traffic successfully started')
    def post(self):
        '''
        Asks Skydive to start capturing network traffic
        
        The hosts and network interfaces considered for capturing the network traffic are 
        scoped by the given Gremlin query. Gremlim is a graph query language that Skydive adopts
        to allow queries on the overall network topology.
        
        This implementation makes a **POST** REST call to Skydive's `/api/capture` resource. 
        '''
        log.info('Started processing request to ask Skydive to capture network traffic')
        gremlin_query = request.json[GREMLIN_QUERY_PARAM_STR]

        # Call Skydive
        result_payload_or_error_msg, http_code = skydive_client.start_capture(gremlin_query)

        if http_code == 200:
            skydive_host = os.getenv(constants.ISTIO_ANALYTICS_SKYDIVE_HOST_ENV)
            skydive_override = os.getenv(constants.ISTIO_ANALYTICS_SKYDIVE_OVERRIDE_ENV)
            ret_val = {
                dt_responses.SKYDIVE_URL_STR: skydive_override or skydive_host
            }
            ret_val.update(result_payload_or_error_msg)
        else:
            log.warn(result_payload_or_error_msg)
            ret_val, http_code = build_http_error(result_payload_or_error_msg, http_code)
            flask_restplus.errors.abort(code=http_code, message=result_payload_or_error_msg)

        log.info('Finished processing request to ask Skydive to capture network traffic')        
        return ret_val, 201

@skydive_namespace.route('/action/capture/<string:capture_uuid>')
class CaptureItem(Resource):

    @api.response(204, 'Action to capture network traffic successfully stopped')
    @api.marshal_with(stop_capture_response, code=404)
    def delete(self, capture_uuid):
        '''Asks Sydive to stop capturing network traffic

        This call takes a path parameter containing for the UUID of a previously-started action 
        to begin capturing network traffic

        This implementation makes a **DELETE** REST call to Skydive's `/api/capture/<uuid>` resource.
        '''
        log.info('Started processing request to ask Skydive to stop capturing network traffic')

        error_msg, http_code = skydive_client.stop_capture(capture_uuid)

        if http_code == 404:
            skydive_host = os.getenv(constants.ISTIO_ANALYTICS_SKYDIVE_HOST_ENV)
            skydive_override = os.getenv(constants.ISTIO_ANALYTICS_SKYDIVE_OVERRIDE_ENV)
            ret_val = {
                dt_responses.SKYDIVE_URL_STR: skydive_override or skydive_host,
                MESSAGE_STR: error_msg
            }
            return ret_val, 404
        elif http_code != 204:
            log.warn(error_msg)
            ret_val, http_code = build_http_error(error_msg, http_code)
            flask_restplus.errors.abort(code=http_code, message=error_msg)

        log.info('Finished processing request to ask Skydive to stop capturing network traffic')
        return None, 204