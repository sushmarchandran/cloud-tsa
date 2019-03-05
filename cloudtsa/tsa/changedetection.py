import logging
import numpy as np

logger = logging.getLogger()
from cloudtsa.tsa.basedetector import BaseDetector

class ChangeDetection(BaseDetector):
    #config should only point to parameters for this particular object
    def __init__(self, parameters):
        """ Initializes config and cumulative series data structures """
        super().__init__(parameters)
        self.cumulative_positive = [0]
        self.cumulative_negative = [0]
        self.threshold = self.parameters["threshold"]
        self.drift = self.parameters["drift"]
        self.temp_positive = 0
        self.temp_negative = 0
        self.alarm, self.start_index = np.array([[], []], dtype=int)

    def detect(self):
        """ Detects any changes and logs response """
        logger.debug("Running changedetection")
        alarm = False
        iteration = len(self.timeseries.timeseries["value"])
        if iteration < 2:
            return
        logger.info(f"Iteration: {iteration}")
        difference = self.timeseries.timeseries["value"][-1] - self.timeseries.timeseries["value"][-2]
        self.cumulative_positive.append(self.cumulative_positive[-1] + difference - self.drift)
        self.cumulative_negative.append(self.cumulative_negative[-1] - difference - self.drift)
        if self.cumulative_positive[-1] < 0:
            self.cumulative_positive[-1] = 0
            self.temp_positive = iteration
        if self.cumulative_negative[-1] < 0:
            self.cumulative_negative[-1] = 0
            self.temp_negative = iteration
        ## Given timeseries = [0,2,4,6....20], drift = 1 and threshold = very high, cumulative positive after 10 iterations becomes 10
        ## If timeseries continues to be = 20 for the next 10 iterations, cumulative positive becomes 0 because drift > difference
        ## This is okay because the timeseries value of 20 is the new normal for the algorithm
        ## any change detected above 20 is what will be recorded by cumulative positive
        if np.isnan(self.cumulative_positive[-1]):
            self.cumulative_negative[-1] = self.cumulative_positive[-1] = 0
        if ((self.cumulative_positive[-1] > self.threshold) or (self.cumulative_negative[-1] > self.threshold)):
            self.alarm = np.append(self.alarm, iteration)
            alarm = True
            self.alarm_set = True
            if self.cumulative_positive[-1] > self.threshold:
                self.start_index = np.append(self.start_index, self.temp_positive)
            else:
                self.start_index = np.append(self.start_index, self.temp_negative)

        logger.info(f"G+: {self.cumulative_positive[-1]} G-: {self.cumulative_negative[-1]} Threshold: {self.threshold} Drift {self.drift}")
        if alarm:
            self.cumulative_positive = [0]
            self.cumulative_negative = [0]
            logger.warning(f"Alarm: {self.alarm} Start Index: {self.start_index}")
            logger.info(f"Data from start index - 3: {self.timeseries.timeseries['value'][max(0,self.start_index[-1]-3):]}")
            self.alarm_set = True
        else:
            logger.info("No Change Detected")
            self.alarm_set = False
        logger.info("##############################\n\n")
