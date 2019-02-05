import logging
import numpy as np

logger = logging.getLogger()
from cloudtsa.tsa.basedetector import BaseDetector

class PeakDetection(BaseDetector):
    #config should only point to parameters for this particular object
    def __init__(self, parameters):
        """ Initializes config and cumulative series data structures """
        super().__init__(parameters)
        self.min_peak_height = self.parameters["min_peak_height"]
        self.min_peak_distance = self.parameters["min_peak_distance"]
        self.threshold = self.parameters["threshold"]
        self.edge = self.parameters["edge"]
        self.moving_window = 0
        self.all_peaks = []

    def detect(self):
        x = self.timeseries.timeseries["value"][self.moving_window:]
        if len(x) < 3:
            self.alarm_set = False
            logger.info("Only accumulating data for the first three iterations")
            return
        x = np.atleast_1d(x).astype('float64')
        # find indices of all peaks
        dx = x[1:] - x[:-1]
        # handle NaN's
        indnan = np.where(np.isnan(x))[0]
        if indnan.size:
            #x[indnan] = np.inf
            #dx[np.where(np.isnan(dx))[0]] = np.inf
            logger.error("NaN values are being recorded. Exiting from Peak Detection")
        ine, ire, ife = np.array([[], [], []], dtype=int)
        if not self.edge:
            ine = np.where((np.hstack((dx, 0)) < 0) & (np.hstack((0, dx)) > 0))[0]
        else:
            if self.edge in ['rising', 'both']:
                ire = np.where((np.hstack((dx, 0)) <= 0) & (np.hstack((0, dx)) > 0))[0]
            if self.edge in ['falling', 'both']:
                ife = np.where((np.hstack((dx, 0)) < 0) & (np.hstack((0, dx)) >= 0))[0]
        ind = np.unique(np.hstack((ine, ire, ife)))
        #if ind.size and indnan.size:
            # NaN's and values close to NaN's cannot be peaks
            #ind = ind[np.in1d(ind, np.unique(np.hstack((indnan, indnan-1, indnan+1))), invert=True)]
        # first and last values of x cannot be peaks
        if ind.size and ind[0] == 0:
            ind = ind[1:]
        if ind.size and ind[-1] == x.size-1:
            ind = ind[:-1]
        # remove peaks < minimum peak height
        if ind.size and self.min_peak_height is not None:
            ind = ind[x[ind] >= self.min_peak_height]
        # remove peaks - neighbors < threshold
        if ind.size and self.threshold > 0:
            dx = np.min(np.vstack([x[ind]-x[ind-1], x[ind]-x[ind+1]]), axis=0)
            ind = np.delete(ind, np.where(dx < self.threshold)[0])
        if ind.size:
            logger.warning(f"Peak Detected")
            logger.info(f"Peak detected at Index: {ind[-1] + self.moving_window}")
            logger.info(f"Data around the peak: {x[ind[0]-1:ind[0]+2]}")
            self.moving_window = self.moving_window + ind[-1] + 1
            self.all_peaks.append(self.moving_window)
            self.alarm_set = True
        else:
            logger.info("No Peak Detected")
            logger.info(f"Current value: {self.timeseries.timeseries['value'][-1]}")
            self.alarm_set = False
        logger.info("##############################\n\n")
