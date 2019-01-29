import pytest
import json
from iter8.cloudtsa.tsa.holtwinters import HoltWinters
from iter8.cloudtsa.tsa.predictivethresholddetection import PredictiveThresholdDetection
from iter8.cloudtsa.tsa.changedetection import ChangeDetection
from iter8.cloudtsa.tsa.thresholdpolicy import ThresholdPolicy
from iter8.cloudtsa.tsa.peakdetection import PeakDetection
from iter8.cloudtsa.orchestration.orchestrator import TimeSeriesAnalysis

detectors = json.load(open("iter8/cloudtsa/config/detectors.json"))
config = json.load(open("iter8/cloudtsa/config/config.json"))
metric = json.load(open("iter8/cloudtsa/config/metrics.json"))
topology = json.load(open("iter8/cloudtsa/config/topology.json"))

def test_overrides():
    all_configurations = {
        "detectors": detectors,
        "config": config,
        "metrics": metric,
        "topology": topology
        }
    tsa = TimeSeriesAnalysis()
    tsa.initialize(all_configurations)
    detector_config = tsa.create_detector_config()

def test_holtwinters():
    params = detectors["predictivethresholds"]["latency"]["forecast_parameters"]
    hw = HoltWinters(parameters = params)
    assert hw.update(1, 0.1) is None
    assert hw.update(2, 0.2) is None
    assert hw.update(3, 0.3) is None
    assert hw.update(4, 0.4)[3] >= 0.5

def test_gradual_latency_scenario():
    cd_params = detectors["changedetection"]["latency"]
    td_params = detectors["thresholdpolicy"]["latency"]
    ptd_params = detectors["predictivethresholds"]["latency"]

    cd = ChangeDetection(cd_params)
    td = ThresholdPolicy(td_params)
    ptd = PredictiveThresholdDetection(ptd_params)
    # update all of them one by one according to your latency increase
    ptd.update(1, 0.0)
    cd.update(1, 0.0)
    td.update(1, 0.0)

    ptd.update(2, 0.125)
    cd.update(2, 0.125)
    td.update(2, 0.125)


    ptd.update(3, 0.250)
    cd.update(3, 0.250)
    td.update(3, 0.250)

    ptd.update(4, 0.375)
    cd.update(4, 0.375)
    td.update(4, 0.375)

    ptd.update(5, 0.5)
    cd.update(5, 0.5)
    td.update(5, 0.5)

    ptd.update(1, 0.625)
    cd.update(1, 0.625)
    td.update(1, 0.625)

    ptd.update(2, 0.750)
    cd.update(2, 0.750)
    td.update(2, 0.750)


    ptd.update(3, 0.875)
    cd.update(3, 0.875)
    td.update(3, 0.875)

    ptd.update(4, 1.0)
    cd.update(4, 1.0)
    td.update(4, 1.0)

    ptd.update(2, 1.125)
    cd.update(2, 1.125)
    td.update(2, 1.125)


    ptd.update(3, 1.250)
    cd.update(3, 1.250)
    td.update(3, 1.250)

    ptd.update(4, 1.375)
    cd.update(4, 1.375)
    td.update(4, 1.375)

    ptd.update(5, 1.5)
    cd.update(5, 1.5)
    td.update(5, 1.5)

    ptd.update(1, 1.625)
    cd.update(1, 1.625)
    td.update(1, 1.625)

    ptd.update(2, 1.750)
    cd.update(2, 1.750)
    td.update(2, 1.750)


    ptd.update(3, 1.875)
    cd.update(3, 1.875)
    td.update(3, 1.875)

    ptd.update(4, 2.0)
    cd.update(4, 2.0)
    td.update(4, 2.0)

    ptd.update(2, 2.125)
    cd.update(2, 2.125)
    td.update(2, 2.125)

    ptd.update(3, 2.250)
    cd.update(3, 2.250)
    td.update(3, 2.250)

    ptd.update(4, 2.375)
    cd.update(4, 2.375)
    td.update(4, 2.375)

    ptd.update(5, 2.5)
    cd.update(5, 2.5)
    td.update(5, 2.5)

    ptd.update(1, 2.625)
    cd.update(1, 2.625)
    td.update(1, 2.625)

    ptd.update(2, 2.750)
    cd.update(2, 2.750)
    td.update(2, 2.750)


    ptd.update(3, 2.875)
    cd.update(3, 2.875)
    td.update(3, 2.875)

    ptd.update(4, 3.0)
    cd.update(4, 3.0)
    td.update(4, 3.0)

    ptd.update(6, 3.125)
    cd.update(6, 3.125)
    td.update(6, 3.125)

    ptd.update(6, 3.250)
    cd.update(6, 3.250)
    td.update(6, 3.250)

    assert ptd.alarm_set #Predictive Threshold should have alarm set = true at this stage
    assert not cd.alarm_set
    assert not td.alarm_set

    ptd.update(7, 3.375)
    cd.update(7, 3.375)
    td.update(7, 3.375)

    assert ptd.alarm_set #Predictive Threshold should have alarm set = true at this stage
    assert not cd.alarm_set
    assert not td.alarm_set

    ptd.update(5, 3.5)
    cd.update(5, 3.5)
    td.update(5, 3.5)

    ptd.update(1, 3.625)
    cd.update(1, 3.625)
    td.update(1, 3.625)

    ptd.update(2, 3.750)
    cd.update(2, 3.750)
    td.update(2, 3.750)

    ptd.update(3, 3.875)
    cd.update(3, 3.875)
    td.update(3, 3.875)

    ptd.update(4, 4.0)
    cd.update(4, 4.0)
    td.update(4, 4.0)

    ptd.update(2, 4.125)
    cd.update(2, 4.125)
    td.update(2, 4.125)

    ptd.update(3, 4.250)
    cd.update(3, 4.250)
    td.update(3, 4.250)

    ptd.update(4, 4.375)
    cd.update(4, 4.375)
    td.update(4, 4.375)

    ptd.update(5, 4.5)
    cd.update(5, 4.5)
    td.update(5, 4.5)

    ptd.update(1, 4.625)
    cd.update(1, 4.625)
    td.update(1, 4.625)

    ptd.update(2, 4.750)
    cd.update(2, 4.750)
    td.update(2, 4.750)

    ptd.update(3, 4.875)
    cd.update(3, 4.875)
    td.update(3, 4.875)

    ptd.update(4, 5.0)
    cd.update(4, 5.0)
    td.update(4, 5.0)

    ptd.update(2, 5.125)
    cd.update(2, 5.125)
    td.update(2, 5.125)

    ptd.update(3, 5.250)
    cd.update(3, 5.250)
    td.update(3, 5.250)

    ptd.update(4, 5.375)
    cd.update(4, 5.375)
    td.update(4, 5.375)

    ptd.update(5, 5.5)
    cd.update(5, 5.5)
    td.update(5, 5.5)

    ptd.update(1, 5.625)
    cd.update(1, 5.625)
    td.update(1, 5.625)

    ptd.update(2, 5.750)
    cd.update(2, 5.750)
    td.update(2, 5.750)

    ptd.update(3, 5.875)
    cd.update(3, 5.875)
    td.update(3, 5.875)

    ptd.update(4, 6.0)
    cd.update(4, 6.0)
    td.update(4, 6.0)

    ptd.update(2, 6.125)
    cd.update(2, 6.125)
    td.update(2, 6.125)

    ptd.update(3, 6.250)
    cd.update(3, 6.250)
    td.update(3, 6.250)

    ptd.update(4, 6.375)
    cd.update(4, 6.375)
    td.update(4, 6.375)

    ptd.update(5, 6.5)
    cd.update(5, 6.5)
    td.update(5, 6.5)

    ptd.update(1, 6.625)
    cd.update(1, 6.625)
    td.update(1, 6.625)

    ptd.update(2, 6.750)
    cd.update(2, 6.750)
    td.update(2, 6.750)

    ptd.update(3, 6.875)
    cd.update(3, 6.875)
    td.update(3, 6.875)

    ptd.update(4, 7.0)
    cd.update(4, 7.0)
    td.update(4, 7.0)


    assert ptd.alarm_set #Predictive Threshold should have alarm set = true at this stage
    assert not cd.alarm_set
    assert not td.alarm_set

    ptd.update(10, 7.125)
    cd.update(10, 7.125)
    td.update(10, 7.125)

    assert ptd.alarm_set #Predictive Threshold should have alarm set = true at this stage
    assert not cd.alarm_set
    assert td.alarm_set

    ptd.update(11, 7.250)
    cd.update(11, 7.250)
    td.update(11, 7.250)

    assert ptd.alarm_set #Predictive Threshold sets alarm set = true at this stage
    assert not cd.alarm_set
    assert td.alarm_set #Threshold is also breached at this stage

    cd.update(12, 7.375)
    cd.update(13, 7.5)
    cd.update(14, 7.625)
    cd.update(15, 7.850)
    cd.update(16, 8)
    assert not cd.alarm_set #Change Detention never sets an alarm to True in this scenario

def test_abrupt_latency_scenario():
    cd_params = detectors["changedetection"]["latency"]
    td_params = detectors["thresholdpolicy"]["latency"]
    ptd_params = detectors["predictivethresholds"]["latency"]

    cd = ChangeDetection(cd_params)
    td = ThresholdPolicy(td_params)
    ptd = PredictiveThresholdDetection(ptd_params)
    ptd.update(1, 0)
    cd.update(1, 0)
    td.update(1, 0)

    ptd.update(2, 0)
    cd.update(2, 0)
    td.update(2, 0)

    ptd.update(3, 0)
    cd.update(3, 0)
    td.update(3, 0)

    ##Abrupt Latency Part 1 scenario

    assert not ptd.alarm_set
    assert not cd.alarm_set
    assert not td.alarm_set

    ptd.update(4, 5)
    cd.update(4, 5)
    td.update(4, 5)

    assert ptd.alarm_set #Predictive Detecter sets alarm = True
    assert cd.alarm_set #Change Detecter sets alarm = True
    assert not td.alarm_set

    ##Abrupt Latency Part 2 scenario

    ptd.update(5, 10)
    cd.update(5, 10)
    td.update(5, 10)

    assert ptd.alarm_set #Predictive Detecter sets alarm = True
    assert cd.alarm_set #Change Detecter sets alarm = True
    assert td.alarm_set #Threshold Detector also fires


def test_abrupt_error_scenario():
    cd_count_params = detectors["changedetection"]["error_counts"]
    td_count_params = detectors["thresholdpolicy"]["error_counts"]

    cd_rate_params = detectors["changedetection"]["error_rates"]
    td_rate_params = detectors["thresholdpolicy"]["error_rates"]

    cd_count = ChangeDetection(cd_count_params)
    td_count = ThresholdPolicy(td_count_params)


    cd_rate = ChangeDetection(cd_rate_params)
    td_rate = ThresholdPolicy(td_rate_params)
    # update all of them one by one according to your latency increase
    cd_count.update(1, 0)
    td_count.update(1, 0)
    cd_rate.update(1, 0)
    td_rate.update(1, 0)

    cd_count.update(2, 0)
    td_count.update(2, 0)
    cd_rate.update(2, 0)
    td_rate.update(2, 0)

    assert not cd_count.alarm_set
    assert not td_count.alarm_set
    assert not cd_rate.alarm_set
    assert not td_rate.alarm_set

    cd_count.update(3, 48)
    td_count.update(3, 48)
    cd_rate.update(3, 0.2)
    td_rate.update(3, 0.2)

    assert cd_count.alarm_set
    assert td_count.alarm_set
    assert cd_rate.alarm_set
    assert td_rate.alarm_set

def test_peak_scenario():
    params = detectors["peakdetection"]["load"]
    pd = PeakDetection(params)

    pd.update(1,110)
    pd.update(2,110)
    assert not pd.alarm_set

    pd.update(3,160)
    assert not pd.alarm_set

    pd.update(4,110)
    assert pd.alarm_set

    pd.update(5,160)
    assert not pd.alarm_set

    pd.update(6,110)
    assert pd.alarm_set
