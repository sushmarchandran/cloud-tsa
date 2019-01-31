import subprocess
import argparse
import time
import numpy as np
import json
import logging
import datetime
from ping import pinger
import os

parser = argparse.ArgumentParser(description='Set Demo Scenario behavior')
parser.add_argument('-dc', '--democonfig', metavar = "<path/to/democonfig.json>", help='the demo configuration file', required=True)
parser.add_argument('-s', '--scenario', metavar = "<scenario>", help='scenario describing how the application behavior is modified', required=True)
args = parser.parse_args()

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(name)-12s %(levelname)-8s %(message)s')
logging.getLogger("requests").setLevel(logging.WARNING)
logging.getLogger("urllib3").setLevel(logging.WARNING)
logger = logging.getLogger()


scenario = str(args.scenario)
democonfig = json.load(open(args.democonfig))

demo_initialization_timestamp = democonfig["demo_initialization_timestamp"]
demo_initialization_timestamp = datetime.datetime.strptime(demo_initialization_timestamp, "%Y-%m-%d %H:%M:%S")
current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
current_time = datetime.datetime.strptime(current_time, "%Y-%m-%d %H:%M:%S")

print("Checking if it has been atleast 40 seconds since initialization")
if ((current_time - demo_initialization_timestamp).total_seconds()) <= 40:
    time.sleep(40)

if scenario == "gradual_latency":
    for i in np.arange(0.125, 8.0, 0.125): # increase from 0.125 to 8.0 in steps of 0.125
        subprocess.check_call(["python3.6", "set_behavior.py", "-d", str(i), "-f", "0.0", "-p", "svc0"])
        print("Delay: "+ str(i) + ", Failure Probability: 0.0 for Svc0")
        time.sleep(5)

elif scenario == "abrupt_latency_part1":
    subprocess.check_call(["python3.6", "set_behavior.py", "-d", "5.0", "-f", "0.0", "-p", "svc1"])

elif scenario == "abrupt_latency_part2":
    subprocess.check_call(["python3.6", "set_behavior.py", "-d", "10.0", "-f", "0.0", "-p", "svc1"])

elif scenario == "abrupt_errors":
    subprocess.check_call(["python3.6", "set_behavior.py", "-d", "0.1", "-f", "0.2", "-p", "svc2"])

elif scenario == "peak":
    topology = {
    "nodes": ["svc3"],
    "apis": {
        "/": "svc3"
        }
    }
    for i in range(0,4):
        print("Pinging for the next 30 seconds")
        pinger(democonfig, topology, pingspec = {"mean_query_frequency": float(30), "num_queries": 1200})
        print("Sleeping for the next 45 seconds")
        time.sleep(45)
else:
    print("Demo scenario not accepted. Please try again")
