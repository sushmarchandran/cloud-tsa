import logging
import numpy as np

logger = logging.getLogger()
from iter8.cloudtsa.tsa.basedetector import BaseDetector
from iter8.cloudtsa.tsa.holtwinters import HoltWinters

class PredictiveThresholdDetection(BaseDetector):
    #config should only point to parameters for this particular object
    def __init__(self, parameters):
        """ Initializes config and forecast data structures """
        super().__init__(parameters)
        if self.parameters["forecast_type"] == "holtwinters":
            self.forecast = HoltWinters(self.parameters["forecast_parameters"])
        else:
            logger.error("Unsupported detector_type in detector definition")
            raise ValueError("Unsupported detector_type in detector definition")
        self.predictions = []

        if self.parameters["forecast_parameters"]["cycle_length"] > self.parameters["forecast_parameters"]["initialization_length"]:
            logger.warning("Cycle length longer than Initialization length")
            logger.warning("Increasing Initialization length to Cycle length")
            self.parameters["forecast_parameters"]["initialization_length"] = self.parameters["forecast_parameters"]["cycle_length"]

    def update(self, timestamp, new_value):
        self.predictions = self.forecast.update(timestamp, new_value)
        if self.predictions == None:
            logger.info("No forecast available. Nothing to detect at this timestep")
            return
        self.detect()

    def detect(self):
        for predicted_value in self.predictions:
            if (predicted_value < self.parameters["threshold_parameters"]["min_value"]) or (predicted_value > self.parameters["threshold_parameters"]["max_value"]):
                logger.warning(f"Prediction went beyond Threshold policy")
                #Log more information
                logger.info(f"Predictions: {self.predictions} Min: {self.parameters['threshold_parameters']['min_value']} Max: {self.parameters['threshold_parameters']['max_value']}")
                self.alarm_set = True
                logger.info("##############################\n\n")
                return
        logger.info("Predictions within Threshold Policy")
        logger.info(f"Predictions: {self.predictions} Min: {self.parameters['threshold_parameters']['min_value']} Max: {self.parameters['threshold_parameters']['max_value']}")
        self.alarm_set = False
        logger.info("##############################\n\n")
