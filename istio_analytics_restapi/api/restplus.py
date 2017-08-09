import logging

from flask_restplus import Api
from jsonschema import FormatChecker

log = logging.getLogger(__name__)

#  Instantiate a Flask-RESTPlus API
api = Api(version='1.0', title='Istio Analytics REST API',
          description='API to perform analytics to get insights from the cloud and the microservice mesh',
          format_checker=FormatChecker(formats=("date-time",)))

def build_http_error(msg, http_code):
    '''Returns a specific error message and HTTP code that can be used by the REST API'''
    return {'message': msg}, http_code

@api.errorhandler
def default_error_handler(e):
    '''Error handler for uncaught exceptions'''
    message = 'An unexpected error occurred'
    log.exception(message)
    return {'message': message}, 500