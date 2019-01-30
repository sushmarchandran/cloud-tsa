import json
import requests
import subprocess
import os
import argparse
import yaml

parser = argparse.ArgumentParser(description='Deploy Cloud TSA')
parser.add_argument('-c', '--config', metavar = "<path/to/config.json>", help='the config file with overrides', required=True)
args = parser.parse_args()
config = json.load(open(args.config))

###Deploying the CloudTSA Service
print("Deploying CloudTSA Service")
cloudtsa_service = os.path.join(config["project_home"], "config/cloudtsa.yaml")
subprocess.call([f"kubectl apply -f {cloudtsa_service}"], executable = "/bin/bash", shell = True)

#Exposing CloudAI Nodeport
subprocess.call([f"kubectl expose svc cloudtsa --name=cloudtsa-np --type=NodePort"], executable = "/bin/bash", shell = True)
cloudtsa_port = subprocess.check_output(["kubectl get svc cloudtsa-np -o jsonpath='{.spec.ports[0].nodePort}'"], shell = True, executable = "/bin/bash")
cloudtsa_port = cloudtsa_port.decode('UTF-8')
cloudtsa_url = config["external_ip"] + ":" + cloudtsa_port
print("CloudTSA port for metrics: " + str(cloudtsa_url) + "/metrics")

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
