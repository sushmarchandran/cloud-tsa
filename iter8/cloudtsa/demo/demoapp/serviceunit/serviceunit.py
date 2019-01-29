#!flask/bin/python
from flask import Flask, request, abort, jsonify
from flask_restful import Resource, Api
import json
import requests
import numpy as np
import time
import logging
from datetime import datetime, timedelta

# Logger configuration
logger = logging.getLogger()
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s %(name)-12s %(levelname)-8s %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)

logging.getLogger("requests").setLevel(logging.WARNING)
logging.getLogger("urllib3").setLevel(logging.WARNING)
logging.getLogger("werkzeug").setLevel(logging.WARNING)

def getForwardHeaders(request):
    headers = {}
    user_cookie = request.cookies.get("user")
    if user_cookie:
        headers['Cookie'] = 'user=' + user_cookie
    incoming_headers = [ 'x-request-id', 'x-b3-traceid', 'x-b3-spanid', 'x-b3-parentspanid', 'x-b3-sampled', 'x-b3-flags', 'x-ot-span-context']
    for ihdr in incoming_headers:
        val = request.headers.get(ihdr)
        if val is not None:
            headers[ihdr] = val
    return headers


app = Flask(__name__)

# every serviceunit gets its own behavior (for now, shape and scale)
behavior = []
# children: list of services
children = []
# every serviceunit gets one routerule per child
routerules = []

@app.route('/', methods=['GET'])
def index():
    request_receive_timestamp = datetime.now()
    # Forwarding headers
    headers = getForwardHeaders(request)
    # Query each child sequentially with the appropriate routerule
    distribution = request.args.get('distribution')
    if not distribution:
        distribution = 0
    d = {'distribution' : distribution}
    child_responses = []
    for idx, child in enumerate(children):
        child_request_initiation_timestamp = datetime.now()
        for i in range(routerules[idx]["attempts"]):
            try:
                r = requests.get(f"http://{child}:8080", headers=headers, timeout=routerules[idx]["timeout"], params = d)
                duration = (datetime.now() - child_request_initiation_timestamp)/timedelta(microseconds=1)
                child_response = {
                    "child": f"{child}",
                    "status_code": 200,
                    "response": r.json(),
                    "duration": duration
                }
                break
            except (ValueError, requests.exceptions.Timeout) as e:
                logger.info(f"Caught serviceunit exception: {e}")
                duration = (datetime.now() - child_request_initiation_timestamp)/timedelta(microseconds=1)
                child_response = {
                    "child": f"{child}",
                    "status_code": 504,
                    "response": None,
                    "duration": duration
                }
        child_responses.append(child_response)
    logger.debug(f"Distribution before selecting shape/scale {distribution}")
    # Apply behavior
    if len(behavior):
        interval = np.random.gamma(behavior[int(distribution)]['delay']['shape'], behavior[int(distribution)]['delay']['scale'])
        time.sleep(interval)

        # if failure_probability = 0.0, we will always succeed
        if np.random.random() < behavior[int(distribution)]['failure']:
            logger.debug(f"Aborting with distribution = {distribution} and failure probability = {behavior[int(distribution)]['failure']}")
            abort(500) # failure

    duration = (datetime.now() - request_receive_timestamp)/timedelta(microseconds=1)
    # failure_probability == 0 or we succeeded
    
    return jsonify({
        "behavior_set": bool(behavior),
        "duration": duration, # in microseconds
        "child_responses": child_responses
    })

#To pass parameters:
#curl -X POST 'http://localhost:9080/set_behavior' -d 'scalesuccess=1.5' -d 'shapesuccess=0.2' -d 'scalefailure=1.5' -d 'shapefailure=0.2' -d 'probfailure=0.3'
@app.route('/set_behavior', methods=['POST'])
def set_behavior():
    # we can do a better job of exception handling here...
    global behavior
    behavior = request.get_json(force = True)
    logger.info(f"created behavior object: {behavior}")
    return jsonify(behavior)

@app.route('/set_children', methods=['POST'])
def set_children():
    # we can do a better job of exception handling here...
    global children
    children = request.get_json(force = True)
    # resetting routerules because children are getting set
    global routerules
    routerules = [{
        "timeout": 60.0,
        "attempts": 1
    }] * len(children)
    logger.info(f"children set with default routerules: {children}")
    return jsonify(children)

@app.route('/set_routerules', methods=['POST'])
def set_routerules():
    # we can do a better job of exception handling here...
    # assumption is that there is one routerule per child
    global routerules
    routerules = request.get_json(force = True)
    logger.info(f"routerules set: {routerules}")
    return jsonify(routerules)

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=8080,debug=True, threaded=True)
