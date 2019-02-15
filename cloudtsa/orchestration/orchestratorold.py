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
        self.detectors = []
        self.detector_scheduler = sched.scheduler(time.time, time.sleep)
        self.set_configurations = False
        self.reg = CollectorRegistry()
        self.alarm_counter = Counter(name = 'cloudtsa_alarm_count', documentation = 'Cloud TSA Alarms', labelnames = ['detector_type', 'metric_name', 'source', 'destination'], registry = self.reg)
        self.lock = threading.RLock()
        self.shut_down_initiated = False

    def initialize(self, all_configurations):
        self.detector_defaults = all_configurations["detectors"]
        self.metric_defaults = all_configurations["metrics"]
        self.topology = all_configurations["topology"]
        self.config = all_configurations["config"]


    def initialize_and_start(self, all_configurations):
        self.initialize(all_configurations)
        self.start()

    def execute_detector(self, index):
        prom = self.detectors[index][0]
        detector_type = self.detectors[index][2]
        metric_name = self.detectors[index][3]
        logger.info("Executing Query for Service:" + str(prom.service))
        tsm = prom.query() # get time series metric
        if tsm is not None:
            detector = self.detectors[index][1]
            logger.info(f"Metric: {metric_name}")
            (timestamp, metric) = tsm
            if np.isnan(metric):
                logger.info(f"Service {prom.service} returned NaN. Scheduling this after {prom.duration} sec")
                if not self.shut_down_initiated:
                    self.detector_scheduler.enter(prom.duration, 1, self.execute_detector, kwargs={'index': index})
                return
            detector.update(timestamp, metric)
            if detector.is_alarm_set(): # after each update, alarm will be set or unset
                with self.lock:
                    self.alarm_counter.labels(detector_type=detector_type, metric_name=metric_name, source = 'ingress-gateway', destination = prom.service).inc()
            if not self.shut_down_initiated:
                self.detector_scheduler.enter(prom.duration, 1, self.execute_detector, kwargs={'index': index})
        else:
            logger.error(f"Service {prom.service} returned None. Will not schedule this query again.")

    def fire(self):
        if not self.set_configurations:
            logger.info("Configurations not set yet")
        else:
            logger.info("Starting Time Series Analysis")
            #checking if connection to prometheus is running
            connected_to_prometheus(self.config["prometheus_url"], self.config["test_connection_query"])
            self.detector_scheduler.run()

    def create_detector_config(self):
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
        # some of the initialization / extraction from all_configurations will now be shifted to __init
        if "*" in self.metric_defaults["services"]:
            services = list(filter(lambda x: x != "ingress", self.topology["nodes"]))
        else:
            services = self.metric_defaults["services"]

        index = 0

        detector_config = self.create_detector_config()
        #this function will use the logic from lines 87 to 96
        for detector_type in self.detector_defaults.keys():
            # detector_config[detector_type] = {}
            if "metrics_subset" in self.metric_defaults.keys():
                metrics = self.metric_defaults["metrics_subset"]
            else:
                metrics = list(self.metric_defaults.keys())
                metrics.remove("services")
            for metric_name in metrics:
                if (metric_name in detector_config[detector_type].keys()):
                    for service in services:
                        if self.metric_defaults[metric_name]["post_process"]["type"] == "identity":
                            query = IdentityQuery(self.config["prometheus_url"],
                            detector_config[detector_type][metric_name]["query_duration"],
                            self.metric_defaults[metric_name],
                            service)
                        elif self.metric_defaults[metric_name]["post_process"]["type"] == "rate":
                            query = RateQuery(self.config["prometheus_url"],
                            detector_config[detector_type][metric_name]["query_duration"],
                            self.metric_defaults[metric_name],
                            service)
                        else:
                            raise ValueError("Unsupported post_process type in metrics definition")

                        if detector_type == "changedetection":
                            detector = ChangeDetection(detector_config[detector_type][metric_name])
                        elif detector_type == "thresholdpolicy":
                            detector = ThresholdPolicy(detector_config[detector_type][metric_name])
                        elif detector_type == "peakdetection":
                            detector = PeakDetection(detector_config[detector_type][metric_name])
                        elif detector_type == "predictivethresholds":
                            detector = PredictiveThresholdDetection(detector_config[detector_type][metric_name])
                        else:
                            raise ValueError("Unsupported detector_type in detector definition")

                        self.detectors.append([query, detector, detector_type, metric_name])
                        self.detector_scheduler.enter(query.duration, 1, self.execute_detector, kwargs={'index': index})
                        index += 1
                        logger.info(f"Created {detector_type} object for Service: {service} and metric: {metric_name}")
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
