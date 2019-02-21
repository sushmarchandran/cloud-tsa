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

from cloudtsa.prometheus.prometheusquery import PrometheusQuery
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
        self.alarm_counter = Counter(name = 'cloudtsa_alarm_count', documentation = 'Cloud TSA Alarms', labelnames = ['detector_type', 'metric_name', 'entity'], registry = self.reg)
        self.lock = threading.RLock()
        self.shut_down_initiated = False
        self.metric_detector_reverse_dict = {}

    def initialize(self, all_configurations):
        self.config = all_configurations["config"]
        self.metric_defaults = self.create_metric_config(all_configurations["metrics"])
        self.detector_defaults = all_configurations["detectors"]
        self.create_detector_config()

    def create_metric_config(self, metrics):
        metric_defaults = metrics["metrics"]
        for each_metric in metric_defaults.keys():
            if "duration" not in metric_defaults[each_metric].keys():
                metric_defaults[each_metric]["duration"] = metrics["duration"]
            self.metric_detector_reverse_dict[each_metric] = {
                "detectors": [],
                "entity_keys": [],
                "entity_details": {}
            }
        return metric_defaults


    def create_detector_config(self):
        for each_detector in self.detector_defaults.keys():
            for each_metric in self.detector_defaults[each_detector].keys():
                self.metric_detector_reverse_dict[each_metric]["detectors"].append(each_detector)
        logger.info(f"Reverse dictionary created: {self.metric_detector_reverse_dict}")

    def initialize_and_start(self, all_configurations):
        self.initialize(all_configurations)
        self.start()

    def execute_query(self, index):
        query_object = self.queries[index][0]
        metric_name = self.queries[index][1]
        logger.info(f"Executing query for Metric: {metric_name}")
        tsm = query_object.query() # get time series metric
        logger.info(f"Response from Prometheus: {tsm}")
        if tsm is not None:
            if not len(self.metric_detector_reverse_dict[metric_name]["entity_keys"]):
                self.metric_detector_reverse_dict[metric_name]["entity_keys"] = tsm["entity_keys"]
                logger.info(f"Updated Reverse Dict with a new entity key for metric {metric_name}: {tsm['entity_keys']}")
            for each_entity in tsm["data"]:
                if each_entity["entity"] not in self.metric_detector_reverse_dict[metric_name]["entity_details"].keys():
                    self.metric_detector_reverse_dict[metric_name]["entity_details"][each_entity["entity"]] = {}
                    logger.info(f"Created empty dictionary for entity {each_entity['entity'] Metric {metric_name}}")
                    logger.info(f"Reverse Dictionary: {self.metric_detector_reverse_dict[metric_name]['entity_details']}")
                for each_detector in self.metric_detector_reverse_dict[metric_name]["detectors"]:
                    if each_detector not in self.metric_detector_reverse_dict[metric_name]["entity_details"][each_entity["entity"]].keys():
                        logger.info(f"Created {each_detector} object for {metric_name}")
                        self.metric_detector_reverse_dict[metric_name]["entity_details"][each_entity["entity"]] = {each_detector: self.get_detector_object(each_detector, metric_name)}
                    detector_obj = self.metric_detector_reverse_dict[metric_name]["entity_details"][each_entity["entity"]][each_detector]
                    detector_obj.update(tsm["timestamp"], each_entity["value"])
                    if detector_obj.is_alarm_set(): # after each update, alarm will be set or unset
                        with self.lock:
                            self.alarm_counter.labels(detector_type=each_detector, metric_name=metric_name, entity=each_entity["entity"]).inc()
            if not self.shut_down_initiated:
                self.query_scheduler.enter(self.metric_defaults[metric_name]["duration"], 1, self.execute_query, kwargs={'index': index})
        else:
            logger.error(f"TSM Returned None. Will not schedule this query again.")
        logger.info(f"Updated Reverse Dictionary: {self.metric_detector_reverse_dict}")

    def get_detector_object(self, detector_type, metric_name):
        if detector_type == "changedetection":
            detector_object = ChangeDetection(self.detector_defaults[detector_type][metric_name])
        elif detector_type == "thresholdpolicy":
            detector_object = ThresholdPolicy(self.detector_defaults[detector_type][metric_name])
        elif detector_type == "peakdetection":
            detector_object = PeakDetection(self.detector_defaults[detector_type][metric_name])
        elif detector_type == "predictivethresholds":
            detector_object = PredictiveThresholdDetection(self.detector_defaults[detector_type][metric_name])
        else:
            raise ValueError("Unsupported detector_type in detector definition")
        return detector_object


    def fire(self):
        if not self.set_configurations:
            logger.info("Configurations not set yet")
        else:
            logger.info("Starting Time Series Analysis")
            #checking if connection to prometheus is running
            connected_to_prometheus(self.config["prometheus_url"], self.config["test_connection_query"])
            self.query_scheduler.run()

    def start(self):
        prom_url = self.config["prometheus_url"]
        index = 0
        for each_metric in self.metric_defaults.keys():
            q = PrometheusQuery(prom_url, self.metric_defaults[each_metric])
            self.queries.append([q, each_metric])
            #duration is 0.01s
            self.query_scheduler.enter(0.01, 1, self.execute_query, kwargs={'index': index})
            index += 1
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
        list(map(self.query_scheduler.cancel, self.query_scheduler.queue))
        while not self.query_scheduler.empty():
            time.sleep(10)
