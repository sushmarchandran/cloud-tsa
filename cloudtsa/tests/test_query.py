import pytest
import json
from cloudtsa.prometheus.prometheusquery import PrometheusQuery

prom_result = json.load(open("prom_result.json"))

def test_prometheusquery():
    # pquery = PrometheusQuery(config["prometheus_url"], metric["metrics"]["error_rates"])
    # r = pquery.post_process(prom_result)
    # print(r)
    prom_url = "http://169.47.97.150:30270"
    query = {
    #"query_template":  "sum(increase(istio_requests_total{source_app='istio-ingressgateway', reporter='source', destination_service_namespace='default'}[30s])) by (destination_service_name)",
    "query_template": "(sum(increase(istio_requests_total{response_code=~'5..', source_app='istio-ingressgateway', reporter='source', source_app='istio-ingressgateway', destination_service_namespace='default'}[30s])) by (destination_service_name)) / (sum(increase(istio_requests_total{source_app='istio-ingressgateway', reporter='source', source_app='istio-ingressgateway'}[30s])) by (destination_service_name))",
    "duration": 30
    }
    pquery = PrometheusQuery(prom_url, query)
    print(pquery.query())


test_prometheusquery()
