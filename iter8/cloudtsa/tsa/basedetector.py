import logging
import numpy as np
from iter8.cloudtsa.tsa.timeseries import TimeSeries

logger = logging.getLogger()

class BaseDetector():
    #config should only point to parameters for this particular object
    def __init__(self, parameters):
        """ Initializes config and cumulative series data structures """
        self.parameters = parameters
        self.timeseries = TimeSeries()
        self.alarm_set = False

    def update(self, timestamp, new_value):
        """updates the cumulative series for this obj with new values"""
        self.timeseries.append(timestamp, new_value)
        logger.debug("Value and Timestamp updated")
        self.detect() # has there been an alarm or not in this iteration

    def is_alarm_set(self):
        return self.alarm_set

    def detect(self):
        raise NotImplementedError()
