import pytest
import json
from cloudtsa.prometheus.prometheusquerytemp import PrometheusQuery

prom_result = json.load(open("tests/prom_result.json"))

def test_prometheusquery():
    pquery = PrometheusQuery(config["prometheus_url"], 30, metric["metrics"]["error_rates"])
    r = pquery.post_process(prom_result)
    print(r)

test_prometheusquery()
