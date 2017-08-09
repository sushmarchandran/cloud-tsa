'''
REST resource related to the health of the server.
'''
import logging
log = logging.getLogger(__name__)

from flask_restplus import Resource
from istio_analytics_restapi.api.restplus import api

health_namespace = api.namespace('health/health_check', description='Operations to check the server health')

@health_namespace.route('/')
class HealthCheck(Resource):
    
    @api.response(200, 'Server is responsive')
    def get(self):
        '''Checks the server health'''
        log.debug('Checking server status')
        return {'status': 'OK'}