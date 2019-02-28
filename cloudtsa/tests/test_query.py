import pytest
import json
from cloudtsa.prometheus.prometheusquery import PrometheusQuery

prom_result = json.load(open("prom_result.json"))

def test_prometheusquery():
    pquery = PrometheusQuery(config["prometheus_url"], 30, metric["metrics"]["error_rates"])
    r = pquery.post_process(prom_result)
    print(r)

test_prometheusquery()
