import subprocess
import argparse
import json
import os
import time
import re
import requests
import yaml
from yaml.representer import SafeRepresenter

parser = argparse.ArgumentParser(description='Configuring Sample App and CloudTSA service')
parser.add_argument('-dc', '--democonfig', metavar = "<path/to/democonfig.json>", help='the project configuration file', required=True)
args = parser.parse_args()

democonfig = json.load(open(args.democonfig))
config = json.load(open(democonfig["config_file_path"]))


###Extracting Ingress port and pasting into config
ingress_ip = subprocess.check_output(["kubectl get svc istio-ingressgateway -n istio-system -o jsonpath='{.status.loadBalancer.ingress[0].ip}'"], shell = True, executable = "/bin/bash")
ingress_port = subprocess.check_output(["kubectl get svc istio-ingressgateway -n istio-system -o jsonpath='{.spec.ports[0].nodePort}'"], shell = True, executable = "/bin/bash")
ingress_port = ingress_port.decode('UTF-8')
ingress_ip = ingress_ip.decode('UTF-8')
gateway_url = "http://" + str(ingress_ip) + ":" + str(ingress_port)
print("Gateway URL: "+ gateway_url)
print("Writing this to democonfig.json")
democonfig["gateway_url"] = gateway_url
with open(args.democonfig, 'w') as outfile:
    json.dump(democonfig, outfile, sort_keys=True, indent=2, separators=(',', ': '))

###Starting Istio Demo Application
print("Creating Istio App")
pods_without_envoy = os.path.join(config["project_home"], "config/podswithoutenvoy.yaml")
pods_with_envoy = os.path.join(config["project_home"], "config/podswithenvoy.yaml")
apipath = os.path.join(config["project_home"], "config/apipath.yaml")
subprocess.call([f"kubectl create -f <(istioctl kube-inject -f {pods_with_envoy})"], executable = "/bin/bash", shell = True)
subprocess.call([f"kubectl apply -f {pods_without_envoy}"], executable = "/bin/bash", shell = True)
subprocess.call([f"istioctl create -f {apipath}"], executable = "/bin/bash", shell = True)


###Deploying the CloudTSA Service
print("Deploying CloudTSA Service")
cloudtsa_service = os.path.join(config["project_home"], "config/cloudtsa.yaml")
#cloudtsa_service = os.path.join(config["project_home"], "config/cloudtsa.yaml")
subprocess.call([f"kubectl apply -f {cloudtsa_service}"], executable = "/bin/bash", shell = True)

##Creating a CloudTSA Nodeport
subprocess.call([f"kubectl expose svc cloudtsa --name=cloudtsa-np --type=NodePort"], executable = "/bin/bash", shell = True)
cloudtsa_port = subprocess.check_output(["kubectl get svc cloudtsa-np -o jsonpath='{.spec.ports[0].nodePort}'"], shell = True, executable = "/bin/bash")
cloudtsa_port = cloudtsa_port.decode('UTF-8')
cloudtsa_url = "http://" + config["external_ip"] + ":" + cloudtsa_port
print("Exposed CloudTSA as a Node Port")

###Updating Prometheus to scrape a new metrics endpoint from CLoudTSA Service
prometheus_configmaps_raw = subprocess.check_output([f"kubectl get configmaps -n istio-system prometheus -o yaml"], executable = "/bin/bash", shell = True)
prometheus_configmaps_raw = prometheus_configmaps_raw.decode('UTF-8')
prometheus_configmaps = list(yaml.load_all(prometheus_configmaps_raw))

old_scrape_details = prometheus_configmaps[0]["data"]["prometheus.yml"]
old_scrape_details = list(yaml.load_all(old_scrape_details))
new_scrape_details = {"job_name": "cloudtsa", "scheme": "http","scrape_interval": "25s", "static_configs": [{"targets": ["cloudtsa.default.svc.cluster.local:9080"]}]}


class literal_str(str): pass

# this function takes in a PyYaml representer and outputs a new representer with the specified style
def change_style(style, representer):
    def new_representer(dumper, data):
        scalar = representer(dumper, data)
        scalar.style = style
        return scalar
    return new_representer

def updating_prometheus():
    old_scrape_details[0]['scrape_configs'].append(new_scrape_details)
    updated_scrape_details = yaml.dump(old_scrape_details[0], default_flow_style = False)

    # gets the new representer for a literal_str with the style '|'
    represent_literal_str = change_style('|', SafeRepresenter.represent_str)
    # register the representer for the literal_str
    yaml.add_representer(literal_str, represent_literal_str)

    prometheus_configmaps[0]["data"]['prometheus.yml'] = literal_str(updated_scrape_details[:-1])
    prometheus_configmaps[0]['metadata']['creationTimestamp'] = prometheus_configmaps[0]['metadata']['creationTimestamp'].isoformat() + 'Z'

    for key in prometheus_configmaps[0]['metadata']['annotations'].keys():
      if key == 'kubectl.kubernetes.io/last-applied-configuration':
          prometheus_configmaps[0]['metadata']['annotations'][key] = literal_str(prometheus_configmaps[0]['metadata']['annotations'][key])

    with open("promscrape.yaml", 'w') as yaml_file:
        yaml.dump_all(prometheus_configmaps, stream = yaml_file, default_flow_style = False)
    subprocess.check_output([f"kubectl apply -f promscrape.yaml -n istio-system"], executable = "/bin/bash", shell = True)

    #Deleting old prometheus pod
    print("Restarting Prometheus pod")
    prometheus_pod_name = subprocess.check_output("kubectl get pod --selector app=prometheus -n istio-system --output jsonpath='{.items[0].metadata.name}'", shell = True, executable = "/bin/bash")
    prometheus_pod_name = prometheus_pod_name.decode('UTF-8')
    subprocess.check_output("kubectl delete pods " + prometheus_pod_name + " -n istio-system", shell = True, executable = "/bin/bash")

###Check if jobname cloudtsa is already a part of the configs
if any(t['job_name'] == 'cloudtsa' for t in old_scrape_details[0]['scrape_configs']):
    print("Prometheus already scraping CloudTSA Metrics endpoint")
else:
    print("Updating Prometheus to scrape the CLoudTSA Metrics endpoint")
    updating_prometheus()


###Import CloudTSA Grafana Dashboard
print("Importing CloudTSA grafana Dashboard")
dashboard_path = os.path.join(config["project_home"], "config/grafana/cloudtsademo.json")
with open(dashboard_path) as json_data:
    payload = json.load(json_data)

headers = {"Accept": "application/json",
           "Content-Type": "application/json"
           }

r = requests.post('http://admin:admin@localhost:3000/api/dashboards/db', headers=headers, json={"dashboard": payload, "overwrite": True})
print(r.status_code, r.reason)
