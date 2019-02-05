import argparse
import json
import subprocess
import os
import math

parser = argparse.ArgumentParser(description='Set behavior of Istio Microservice')
parser.add_argument('-p', '--pod', metavar = "<pod_name>", help='the name of the pod', required=True)
parser.add_argument('-d', '--delay', metavar = "<delay>", help='the average delay of the service', required=True)
parser.add_argument('-f', '--failure', metavar = "<failure_percentage>", help='failure probability of the service', required=True)
args = parser.parse_args()

pod = args.pod
delay = float(args.delay)
failure = float(args.failure)

behavior = [{
    "delay": {
    "shape": math.sqrt(delay),
    "scale": math.sqrt(delay)
    },
    "failure": failure
}]

DEVNULL = open(os.devnull, 'wb')
c = "kubectl get pod --selector app=" + pod + " --output jsonpath='{.items[0].metadata.name}'"
full_node_name = subprocess.check_output(c, shell = True, executable = "/bin/bash")
full_node_name = full_node_name.decode('UTF-8')
command = {'CMD': f"kubectl exec -it {full_node_name} -c {pod}"}
os.environ.update(command)
subprocess.call(f"$CMD -- curl -v -X POST {pod}:8080/set_behavior --data '{json.dumps(behavior)}' --silent --output /dev/null", shell = True, executable = "/bin/bash", stdout = DEVNULL)
print(f"Behavior set for {pod}")
