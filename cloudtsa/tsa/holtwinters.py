import logging
import numpy as np
import math
logger = logging.getLogger()
from statsmodels.tsa.api import ExponentialSmoothing
from cloudtsa.tsa.timeseries import TimeSeries

class HoltWinters():
    def __init__(self, parameters):
        self.initialization_complete = False
        self.parameters = parameters
        self.actualtimeseries = TimeSeries()
        self.cycle_length = self.parameters["cycle_length"]
        self.forecast_length = self.parameters["forecast_length"]
        self.alpha = self.parameters["alpha"]
        self.beta = self.parameters["beta"]
        self.gamma = self.parameters["gamma"]
        self.phi = self.parameters["phi"]
        self.level = []
        self.slope = []
        self.season = []
        self.predictions = []

    def update(self, timestamp, new_value):
        self.actualtimeseries.append(timestamp, new_value)
        if not self.initialization_complete:
            logger.info(f"Length: {len(self.actualtimeseries.timeseries['value'])}")
            if len(self.actualtimeseries.timeseries["value"]) <= self.parameters["initialization_length"]:
                logger.info("Initialization not Complete. Collecting data values")
                return None
            else:
                logger.info("Collected enough data. Fitting model...")
                self.fit()
                self.initialization_complete = True
                logger.info("Fitting Complete. Forecasting..")
        else:
            self.smoothing()
        self.forecast()
        return self.predictions



    def fit(self):
        logger.info(f"Fitting with the following values:")
        logger.info(f"Value: {self.actualtimeseries.timeseries['value']}, Cycle length: {self.cycle_length}")
        logger.info(f"Alpha: {self.alpha} Beta: {self.beta} Gamma: {self.gamma} Phi: {self.phi}")
        self.fit = ExponentialSmoothing(self.actualtimeseries.timeseries["value"], seasonal_periods=self.cycle_length, trend='add', seasonal='add', damped=True).fit(
    smoothing_level = self.alpha, smoothing_slope = self.beta, smoothing_seasonal = self.gamma, damping_slope = self.phi, optimized = False, use_boxcox = False)
        self.level = list(self.fit.level)
        self.slope = list(self.fit.slope)
        self.season = list(self.fit.season)

    def smoothing(self):
        self.iteration = len(self.actualtimeseries.timeseries["value"])
        t = self.iteration - 1
        yt = self.actualtimeseries.timeseries["value"][t]
        self.level.append((self.alpha * (yt - self.season[t - self.cycle_length])) + ((1 - self.alpha) * (self.level[t - 1] + (self.phi * self.slope[t - 1]))))
        self.slope.append((self.beta * (self.level[t] - self.level[t - 1])) + ((1 - self.beta) * self.phi * self.slope[t - 1]))
        self.season.append((self.gamma * (yt - self.level[t-1] - (self.phi * self.slope[t-1]))) + ((1 - self.gamma) * self.season[t - self.cycle_length]))


    def forecast(self):
        self.iteration = len(self.actualtimeseries.timeseries["value"])
        t = self.iteration - 1
        self.predictions = []
        for i in range(1, self.forecast_length+1):
            phi_h = np.sum(np.power(self.phi, np.arange(i+1))) - 1
            k = math.floor((i-1)/self.cycle_length)
            s_index = t + i - (self.cycle_length * (k + 1))
            self.predictions.append(self.level[t] + (phi_h * self.slope[t]) + self.season[s_index])
