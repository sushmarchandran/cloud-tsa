import logging
import numpy as np

logger = logging.getLogger()
from iter8.cloudtsa.tsa.basedetector import BaseDetector

class ThresholdPolicy(BaseDetector):
    #config should only point to parameters for this particular object
    def __init__(self, parameters):
        """ Initializes config and cumulative series data structures """
        super().__init__(parameters)
        self.min_value = self.parameters["min_value"]
        self.max_value = self.parameters["max_value"]

    def detect(self):
        value = float(self.timeseries.timeseries["value"][-1])
        logger.info(f"Threshold Policy: Value: {value} Max_Value : {self.max_value}")
        if value > self.max_value or value < self.min_value:
            logger.warning(f"Value went beyond Threshold policy")
            self.alarm_set = True
        else:
            logger.info("Values within Threshold Policy")
            self.alarm_set = False
        logger.info(f"Value: {value} Min: {self.min_value} Max: {self.max_value}")
        logger.info("##############################\n\n")
