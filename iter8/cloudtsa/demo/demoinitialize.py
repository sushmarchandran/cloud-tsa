import subprocess
import argparse
import time
import datetime
import json
import os
# before this script even begins, we require cloudtsa service to be running and exposed as a node port
parser = argparse.ArgumentParser(description='Bring up istioapp routerules, services and deployments')
parser.add_argument('-dc', '--democonfig', metavar = "<path/to/democonfig.json>", help='the project configuration file', required=True)
args = parser.parse_args()

democonfig = json.load(open(args.democonfig))

detectors_file_path = democonfig["detectors_file_path"]
metrics_file_path = democonfig["metrics_file_path"]
config_file_path = democonfig["config_file_path"]
topology_file_path = democonfig["topology_file_path"]

subprocess.check_call(["python3.6", "set_behavior.py", "-d", "0.1", "-f", "0.0", "-p", "svc0"])
subprocess.check_call(["python3.6", "set_behavior.py", "-d", "0.1", "-f", "0.0", "-p", "svc1"])
subprocess.check_call(["python3.6", "set_behavior.py", "-d", "0.1", "-f", "0.0", "-p", "svc2"])
subprocess.check_call(["python3.6", "set_behavior.py", "-d", "0.1", "-f", "0.0", "-p", "svc3"])
subprocess.check_call(["python3.6", "set_behavior.py", "-d", "0.1", "-f", "0.0", "-p", "svcwithenvoy"])

print("Behavior for all the pods: Delay: 0.1 sec, Failure Probability: 0.0")
print("Sleeping 15 sec for things to settle")

#Prometheus has a ~14 second resolution. This will make sure Prometheus has some initial data
time.sleep(15)
config = json.load(open(config_file_path))
startandfire_file_path = os.path.join(config["project_home"], "utils/startandfire.py")

try:
    subprocess.check_call(["python3.6", startandfire_file_path, "-d", detectors_file_path, "-t", topology_file_path, "-c", config_file_path, "-m", metrics_file_path])
except subprocess.CalledProcessError as e:
    if e.returncode == 1:
        print("Please edit and try again")
        exit(1)

##Writing the current timestamp to democonfig.json
print("Updating democonfig.json with Demo Initialization Timestamp")
democonfig_file_path = os.path.join(config["project_home"], "demo/democonfig.json")
democonfig = json.load(open(democonfig_file_path))
democonfig["demo_initialization_timestamp"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
with open("democonfig.json", 'w') as outfile:
    json.dump(democonfig, outfile, sort_keys=True, indent=2, separators=(',', ': '))
