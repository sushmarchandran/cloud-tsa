#-------------------------------------------------------------
# IBM Confidential
# OCO Source Materials
# (C) Copyright IBM Corp. 2018
# The source code for this program is not published or
# otherwise divested of its trade secrets, irrespective of
# what has been deposited with the U.S. Copyright Office.
#-------------------------------------------------------------

'''
REST resources for operations related to Skydive
'''
import logging
log = logging.getLogger(__name__)

import os
import json
from flask import request
from flask_restplus import Resource, fields
import flask_restplus.errors

from istio_analytics_restapi.api.restplus import api
from istio_analytics_restapi.api.restplus import build_http_error

# See https://github.com/skydive-project/skydive
skydive_namespace = api.namespace('skydive',
                                              description='Skydive-related operations')


capture_body_parameters = api.model('capture_params', {
    'GremlinQuery': fields.String(required=True, example='G.V()',
                            description='Gremlin Query for network interface to capture')
})

capture_response = api.model('capture_response', {
    'UUID': fields.String(required=False, example='a36d3dd5-cc80-4d5f-7973-eba06dee917c',
                            description='UUID'),
    'GremlinQuery': fields.String(required=True, example='G.V()',
                            description='Gremlin Query for network interface to capture'),
    'Count': fields.Integer(required=False,
                            description='TODO'),
    'ExtraTCPMetric': fields.Boolean(required=False,
                            description='TODO'),
    'SocketInfo': fields.Boolean(required=False,
                            description='TODO')
})


##################################
##################################
######      REST API        ######
##################################
##################################

@skydive_namespace.route('/capture/<skydive_host>')
class Capture(Resource):

    @api.expect(capture_body_parameters, validate=True)
    @api.marshal_with(capture_response)
    def post(self, skydive_host):
        '''Invoke Skydive /api/capture
        '''
        log.info('TODO UNIMPLEMENTED')
        ret_val = {"UUID": "UNIMPLEMENTED",
                   "GremlinQuery": "G.V()",
                   "Count": 0,
                   "ExtraTCPMetric": False,
                   "SocketInfo": False}

        return ret_val

    def delete(self, skydive_host):
        '''Invoke Skydive /api/capture
        '''
        log.info('TODO UNIMPLEMENTED')
        flask_restplus.errors.abort(code=500, message="UNIMPLEMENTED")
