from flask import Flask, request, abort, jsonify, Response
from flask_restful import Resource, Api

import logging
import sched, time
import threading
import numpy as np
import datetime, time
import requests

from prometheus_client import start_http_server, Summary, Counter, CollectorRegistry
from prometheus_client.exposition import choose_encoder

from cloudtsa.prometheus.prometheusquery import IdentityQuery, RateQuery
from cloudtsa.tsa.changedetection import ChangeDetection
from cloudtsa.tsa.thresholdpolicy import ThresholdPolicy
from cloudtsa.tsa.peakdetection import PeakDetection
from cloudtsa.tsa.predictivethresholddetection import PredictiveThresholdDetection
from cloudtsa.prometheus.connectedtoprometheus import connected_to_prometheus

logger = logging.getLogger()

class TimeSeriesAnalysis():
    def __init__(self):
        self.queries = []
        self.query_scheduler = sched.scheduler(time.time, time.sleep)
        self.set_configurations = False
        self.reg = CollectorRegistry()
        self.alarm_counter = Counter(name = 'cloudtsa_alarm_count', documentation = 'Cloud TSA Alarms', labelnames = ['detector_type', 'metric_name', 'source', 'destination'], registry = self.reg)
        self.lock = threading.RLock()
        self.shut_down_initiated = False

    def initialize(self, all_configurations):
        self.topology = all_configurations["topology"]
        self.config = all_configurations["config"]
        self.metric_defaults = self.create_metric_config(all_configurations["metrics"])
        self.detector_defaults = self.create_detector_config(all_configurations["detectors"])

    def create_metric_config(self, metrics):
        metric_defaults = metrics["metrics"]
        for each_metric in metric_defaults.keys():
            if "duration" not in each_metric.keys():
                metric_defaults["duration"] = metrics["duration"]
        return metric_defaults


    def initialize_and_start(self, all_configurations):
        self.initialize(all_configurations)
        self.start()

    def execute_query(self, index):
        #prom = self.detectors[index][0]
        #metric_name = self.detectors[index][1]
        #create detetctors disctionary from create_detector_config() function
        #{
        #"metric1": {
        #           "detectors": [d1,d2,d3]
        #           "entity_keys": ['destination_service_name', 'status_code', 'method'],
        #           "entity_details": {
        #                   ('svc3', 500, 'get'): {
        #                               d1: <obj>,
        #                               d2: <obj>
        #                               }
        #                       }
        #           }
        #}
        #create the above dictionary in self.create_detector_config()
        #tsm = prom.query() # get time series metric
        #if tsm is not None:
            #for each_detector in self.metric_detector_dict["metric_name"]["detectors"]
                    #for each_entity in tsm:
                        #if each_entity is not in self.metric_detector_dict["metric_name"]["entity"][tsm[entity_keys]]
                            #create a detector object
                        #call detector.update() which calls detector.detect() internally and sets self.alarm
                        #if alarm is generated, log the information
                        # other shut down, isnan conditions same as before
            #schedule the query again
        #else:
        #    logger.error(f"TSM Returned None. Will not schedule this query again.")

    def fire(self):
        if not self.set_configurations:
            logger.info("Configurations not set yet")
        else:
            logger.info("Starting Time Series Analysis")
            #checking if connection to prometheus is running
            connected_to_prometheus(self.config["prometheus_url"], self.config["test_connection_query"])
            self.detector_scheduler.run()

    def create_detector_config(self):
        ##modify this function as necessary
        detector_config = {}
        for detector_type in self.detector_defaults.keys():
            detector_config[detector_type] = {}
            if "metrics_subset" in self.metric_defaults.keys():
                metrics = self.metric_defaults["metrics_subset"]
            else:
                metrics = list(self.metric_defaults.keys())
                metrics.remove("services")
            for metric_name in metrics:
                if ("overrides" in self.config.keys()) and (detector_type in self.config["overrides"]) and (metric_name in self.config["overrides"][detector_type].keys()):
                    detector_config[detector_type][metric_name] = {
                    **self.detector_defaults[detector_type][metric_name],
                    **self.config["overrides"][detector_type][metric_name]}
                else:
                    if (metric_name in self.detector_defaults[detector_type].keys()):
                        detector_config[detector_type][metric_name] = self.detector_defaults[detector_type][metric_name]
        return detector_config

    def start(self):
        prom_url = self.config["prometheus_url"]
        index = 0
        for each_metric in self.metric_defaults.keys():
            q = PrometheusQuery(prom_url, self.metric_defaults["each_metric"])
            self.queries.append([q, each_metric])
            self.query_scheduler.enter(self.metric_defaults["each_metric"]["duration"], 1, self.execute_query, kwargs={'index': index})
            logger.info(f"Created {each_metric} object")
        self.set_configurations = True
        self.fire_thread = threading.Thread(target=self.fire)
        self.fire_thread.start()

    def metrics(self, encoder):
        logger.info(f"Metrics API called")
        with self.lock:
            output = encoder(self.reg)
            logger.info(f"Got encoder output")
            return output

    def shut_down(self):
        logger.info("Shutting down...")
        self.shut_down_initiated = True
        list(map(self.detector_scheduler.cancel, self.detector_scheduler.queue))
        while not self.detector_scheduler.empty():
            time.sleep(10)
