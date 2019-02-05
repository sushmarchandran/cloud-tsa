#has single method called query() - similar to collect_metrics(), returns timestamp, value to update changedetection
# returns newvalue to app.py, app.y will call changedetection
from datetime import datetime, timedelta
import datetime, time
import requests
import logging
import math
from string import Template
import re

logger = logging.getLogger()

class PrometheusQuery():
    def __init__(self, prometheus_url, duration, query_definition, service):
        self.prometheus_url = prometheus_url +  "/api/v1/query"
        self.duration = duration
        self.query_definition = query_definition
        self.service = service
        self.current_timestamp = 0

    def query(self):
        logger.debug("Querying Prometheus..")
        prom_query = self.query_definition["query_template"]
        query_str = Template(prom_query)
        params = {'query': query_str.substitute(durationsec = str(self.duration) + 's', service_name=str(self.service))}
        prom_result = requests.get(self.prometheus_url, params=params).json()
        results = prom_result["data"]["result"]
        if results == []:
            return (self.current_timestamp, 0) if self.query_definition["post_process"]["null_data_handler"] == "zero" else None
        results_for_service = list(filter(lambda x: x['metric']['destination_service_name'] == self.service, results))
        return self.post_process(results_for_service)

    def post_process(self, prom_result):
        raise NotImplementedError()

class IdentityMixIn(object):
    def post_process(self, results_for_service):
        if results_for_service:
            self.current_timestamp = float(results_for_service[0]['value'][0])
            return (results_for_service[0]['value'][0], float(results_for_service[0]['value'][1]))
        logger.info(f"Prometheus Results: {results_for_service}")
        return None

class RateMixIn(object):
    def post_process(self, results_for_service):
        if results_for_service:
            prog = re.compile(self.query_definition["post_process"]["aggregate"]["regex"])
            match_count = sum([float(x['value'][1]) for x in results_for_service if prog.match(x['metric']['response_code'])])
            total_count = sum([float(x['value'][1]) for x in results_for_service])
            rate = match_count/total_count if total_count > 0.0 else 0.0
            return (results_for_service[0]['value'][0], rate)
        return None

class IdentityQuery(IdentityMixIn, PrometheusQuery):
    pass

class RateQuery(RateMixIn, PrometheusQuery):
    pass
