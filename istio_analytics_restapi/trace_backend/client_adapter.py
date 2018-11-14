'''
Client Class Code
'''

import os
import logging
log = logging.getLogger(__name__)

from istio_analytics_restapi.api import constants
import istio_analytics_restapi.api.distributed_tracing.responses as client_constants
import istio_analytics_restapi.trace_backend.zipkin.client as zipkin_client
import istio_analytics_restapi.trace_backend.jaeger.client as jaeger_client

import istio_analytics_restapi.trace_backend.zipkin.util as zipkin_util
import istio_analytics_restapi.trace_backend.jaeger.util as jaeger_util

def get_trace_client():
    '''Init the trace client from env var
    '''
    trace_backend = os.getenv(constants.ISTIO_ANALYTICS_TRACE_BACKEND_ENV)
    if trace_backend == 'zipkin':
        return zipkin_client.ZipkinClient(os.getenv(constants.ISTIO_ANALYTICS_TRACE_SERVER_URL_ENV))
    elif trace_backend == 'jaeger':
        return jaeger_client.JaegerClient(os.getenv(constants.ISTIO_ANALYTICS_TRACE_SERVER_URL_ENV))
    else:
        log.error(u'Can not recognize trace backend: {0}'.format(trace_backend))
        return None
