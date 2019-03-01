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
    def __init__(self, prometheus_url, query_definition):
        self.prometheus_url = prometheus_url +  "/api/v1/query"
        self.duration = query_definition["duration"]
        self.query_definition = query_definition["query_template"]
        self.prom_result = {"timestamp": 0, "entity_keys": [],"data": []}

    def query(self):
        logger.debug("Querying Prometheus..")
        prom_query = self.query_definition
        query_str = Template(prom_query)
        params = {'query': query_str.substitute(durationsec = str(self.duration) + 's')}
        prom_result = requests.get(self.prometheus_url, params=params).json()
        return self.post_process(prom_result)


    def post_process(self, prom_result):
        results = prom_result["data"]["result"]
        ##clean up line 30-33
        if results == []:
            return self.prom_result if self.query_definition["post_process"]["null_data_handler"] == "zero" else None
        data = []
        self.prom_result["timestamp"] = float(results[0]['value'][0])
        self.prom_result["entity_keys"] = tuple(results[0]['metric'].keys())
        for entity_result in results:
            entity = []
            for entity_key in self.prom_result["entity_keys"]:
                entity.append(entity_result["metric"][entity_key])
            data.append({"entity": tuple(entity), "value": float(entity_result['value'][1])})
        self.prom_result["data"] = data
        return self.prom_result
