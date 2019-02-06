from flask import Flask, request, abort, jsonify, Response
from flask_restful import Resource, Api
import threading
import argparse
import json
import time
import logging
import sched, time
import numpy as np
import datetime, time
import requests
from prometheus_client import start_http_server, Summary, Counter, CollectorRegistry
from prometheus_client.exposition import choose_encoder

from cloudtsa.orchestration.orchestrator import TimeSeriesAnalysis

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(name)-12s %(levelname)-8s %(message)s')
logging.getLogger("requests").setLevel(logging.WARNING)
logging.getLogger("urllib3").setLevel(logging.WARNING)
logging.getLogger("werkzeug").setLevel(logging.WARNING)
logger = logging.getLogger()

app = Flask(__name__)
tsa = TimeSeriesAnalysis() #See if this gets redefined everytime

@app.route('/start', methods=['POST'])
def start():
    logger.info(f"Start API called")
    global tsa
    if tsa.set_configurations:
        logger.info(f"Detectors already running. Nothing to do")
        return "Detectors already running. Nothing to do."
    all_configurations = request.get_json(force = True)
    print(all_configurations)
    tsa.initialize_and_start(all_configurations)
    return "Started Time Series Analysis"

@app.route('/metrics', methods=['GET'])
def metrics():
    encoder, content_type = choose_encoder(request.headers.get('Accept'))
    logger.info(f"Got encoder")
    try:
        output = tsa.metrics(encoder)
    except:
        logger.info(f"Failed to get encoded output. Aborting")
        abort(500, 'error generating metric output')
    logger.info(f"Returning output")
    return(Response(output, mimetype=content_type))


@app.route('/restart', methods=['POST'])
def restart():
    logger.info("Restart API called")
    global tsa
    tsa.shut_down()
    logger.info("Shut Down of old TSA object complete. Creating new object and setting up..")

    tsa = TimeSeriesAnalysis()
    all_configurations = request.get_json(force = True)
    print(all_configurations)
    tsa.initialize_and_start(all_configurations)
    return "Restart complete"

app.run(host='0.0.0.0',port=9080,debug=True, threaded=True)
