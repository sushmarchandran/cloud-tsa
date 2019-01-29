import argparse
import json
import requests
import subprocess
import os

parser = argparse.ArgumentParser(description='Experiment with CloudAI')
parser.add_argument('-d', '--detectors', metavar = "<path/to/detector.json>", help='the default detector definition file', required=True)
parser.add_argument('-m', '--metrics', metavar = "<path/to/metrics.json>", help='the default metric definition file', required=True)
parser.add_argument('-c', '--config', metavar = "<path/to/config.json>", help='the config file with overrides', required=True)
parser.add_argument('-t', '--topology', metavar = "<path/to/topology.json>", help='the topology file', required=True)

args = parser.parse_args()

try:
    detector_defaults = json.load(open(args.detectors))
    metric_defaults = json.load(open(args.metrics))
    config = json.load(open(args.config))
    topology = json.load(open(args.topology))
except subprocess.CalledProcessError:
    print(f"Could not decode the json file. Please edit and try again")
    exit(1)

all_configurations = {
    "detectors": detector_defaults,
    "metrics": metric_defaults,
    "config": config,
    "topology": topology
    }

cloudtsa_port = subprocess.check_output(["kubectl get svc cloudtsa-np -o jsonpath='{.spec.ports[0].nodePort}'"], shell = True, executable = "/bin/bash")
cloudtsa_port = cloudtsa_port.decode('UTF-8')
cloudtsa_url = config["external_ip"] + ":" + cloudtsa_port
post_url = cloudtsa_url + "/restart"
r = requests.post(post_url, data = json.dumps(all_configurations))
print("Status: " + str(r.status_code))
