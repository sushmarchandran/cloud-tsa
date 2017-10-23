import logging
import os
import sys

from flask import Flask, Blueprint, redirect

from istio_analytics_restapi.api.restplus import api
from istio_analytics_restapi.api.health.endpoints.health import health_namespace
from istio_analytics_restapi.api.distributed_tracing.endpoints.traces import distributed_tracing_namespace
from istio_analytics_restapi.api import constants

#  Create a Flask application
app = Flask(__name__)

# Make sure we can serve requests to endpoints with or without trailing slashes
app.url_map.strict_slashes = False

# Disable Flask-Restplus X-Fields header used for partial object fetching
app.config['RESTPLUS_MASK_SWAGGER'] = False

@app.route("/")
def index():
    return redirect('static/welcome.html')

@app.route("/favicon.ico")
def favicon():
    return app.send_static_file('favicon.ico')

@app.route("/uml/trace/<traceno>/<view>")
def uml(traceno, view):
    return app.send_static_file('uml.html')

@app.route("/uml5/sequence/flow/<flow>/trace/<traceid>")
def uml5sequence(flow, traceid):
    return app.send_static_file('uml5.html')

@app.route("/uml5/categories")
def uml5categories():
    return app.send_static_file('uml5.html')

@app.route("/uml5/pie/flow/<flow>")
def uml5pie(flow):
    return app.send_static_file('uml5.html')

@app.route("/canary/sequence/flow/<flow>/trace/<traceid>")
def canarysequence(flow, traceid):
    return app.send_static_file('canary.html')

@app.route("/canary/categories")
def canarycategories():
    return app.send_static_file('canary.html')

@app.route("/canary/pie/flow/<flow>")
def canarypie(flow):
    return app.send_static_file('canary.html')

@app.route("/volume4")
def volume4():
    return app.send_static_file('volume4.html')

@app.after_request
def modify_headers(response):
    '''Sets the server HTTP header returned to the clients for all requests 
    to hide the runtime information'''
    response.headers['server'] = 'Istio Analytics'
    return response

def config_logger():
    '''Configures the global logger for the entire server'''
    logger = logging.getLogger('')
    handler = logging.StreamHandler()
    debug_mode = os.getenv(constants.ISTIO_ANALYTICS_DEBUG_ENV, 'false')
    if debug_mode == '1' or str.lower(debug_mode) == 'true':
        logger.setLevel(logging.DEBUG)
        handler.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.INFO)
        handler.setLevel(logging.INFO)
    formatter = logging.Formatter(fmt='%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logging.getLogger(__name__).info("Configured logger")


def config_env():
    '''Reads the environment variables that control the server behavior and 
    populates the config dictionary'''
    logging.getLogger(__name__).info('Configuring Istio Analytics server')
    
    if not os.getenv(constants.ISTIO_ANALYTICS_ZIPKIN_HOST_ENV):
        logging.getLogger(__name__).critical(u'The environment variable {0} was not set. '
                                             'Example of a valid value: "http://localhost:9411". '
                                             'Aborting!'.
                                             format(constants.ISTIO_ANALYTICS_ZIPKIN_HOST_ENV))
        sys.exit(1)
    
    app.config[constants.ISTIO_ANALYTICS_SERVER_PORT_ENV] = \
        os.getenv(constants.ISTIO_ANALYTICS_SERVER_PORT_ENV, 5555)
    logging.getLogger(__name__).info(u'The Istio Analytics server will listen on port {0}. '
                                      'This value can be set by the environment variable {1}'.
                                     format(app.config[constants.ISTIO_ANALYTICS_SERVER_PORT_ENV],
                                     constants.ISTIO_ANALYTICS_SERVER_PORT_ENV))
        
    debug_mode = os.getenv(constants.ISTIO_ANALYTICS_DEBUG_ENV, 'false')
    if debug_mode == '1' or str.lower(debug_mode) == 'true':
        app.config[constants.ISTIO_ANALYTICS_DEBUG_ENV] = True
    else:
        app.config[constants.ISTIO_ANALYTICS_DEBUG_ENV] = False
    logging.getLogger(__name__).info(u'Debug mode: {0}'.format(debug_mode))
    
def initialize(flask_app):
    '''Initializes the Flask application'''
    blueprint = Blueprint('api_v1', __name__, url_prefix='/api/v1')
    api.init_app(blueprint)
    api.add_namespace(health_namespace)
    api.add_namespace(distributed_tracing_namespace)
    flask_app.register_blueprint(blueprint)
    config_env()
    
#######
#### main function
#######
if __name__ == '__main__':
    config_logger()
    initialize(app)
    logging.getLogger(__name__).info('Starting Istio Analytics server')
    app.run(host='0.0.0.0', debug=app.config[constants.ISTIO_ANALYTICS_DEBUG_ENV],
            port=int(app.config[constants.ISTIO_ANALYTICS_SERVER_PORT_ENV]))