import logging
import numpy as np

logger = logging.getLogger()

class TimeSeries():
    #config should only point to parameters for this particular object
    def __init__(self):
        """ Initializes config and cumulative series data structures """
        ##We may want to retain only the latest window instead of all the timeseries values
        self.timeseries = {
            "timestamp": [],
            "value": []
        }

    def append(self, timestamp, new_value):
        """updates the cumulative series for this obj with new values"""
        self.timeseries["timestamp"].append(timestamp)
        self.timeseries["value"].append(new_value)
        logger.debug("Value and Timestamp updated")

    def extract(self):
        if self.timeseries["timestamp"]:
            return self.timeseries["timestamp"][-1], self.timeseries["value"][-1]
        else:
            return None
