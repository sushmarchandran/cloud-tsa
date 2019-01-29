import json
import requests
import subprocess
import os
import argparse

parser = argparse.ArgumentParser(description='Create Cloud TSA Nodeport')
parser.add_argument('-c', '--config', metavar = "<path/to/config.json>", help='the config file with overrides', required=True)
args = parser.parse_args()
config = json.load(open(args.config))


#Exposing CloudAI Nodeport
subprocess.call([f"kubectl expose svc cloudtsa --name=cloudtsa-np --type=NodePort"], executable = "/bin/bash", shell = True)
cloudtsa_port = subprocess.check_output(["kubectl get svc cloudtsa-np -o jsonpath='{.spec.ports[0].nodePort}'"], shell = True, executable = "/bin/bash")
cloudtsa_port = cloudtsa_port.decode('UTF-8')
cloudtsa_url = config["external_ip"] + ":" + cloudtsa_port
print("CloudTSA port for metrics: " + str(cloudtsa_url) + "/metrics")
