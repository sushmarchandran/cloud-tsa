import logging
log = logging.getLogger(__name__)

import istio_analytics_restapi.api.distributed_tracing.responses as responses
import istio_analytics_restapi.api.distributed_tracing.request_parameters as request_parameters

DELTA_MEAN_STR = 'delta_mean'
DELTA_MEAN_PERCENTAGE_STR = 'delta_mean_percentage'
DELTA_STDDEV_STR = 'delta_stddev'
DELTA_STDDEV_PERCENTAGE_STR = 'delta_stddev_percentage'
BASELINE_COUNT_STR = 'baseline_count'
CANARY_COUNT_STR = 'canary_count'
DELTA_MEAN_THRESHOLD_STR = 'delta_mean_threshold'
DELTA_STDDEV_THRESHOLD_STR = 'delta_stddev_threshold'
METRIC_REQUIREMENTS_STR = 'metric_requirements'

def canary_simple_comparison(baseline_agg_event, canary_agg_event, metric_requirements=[]):
    log.debug(u'canary_simple_comparison() called')
    
    delta = {}
    
    for metric_req in metric_requirements:
        if (metric_req[request_parameters.METRIC_TYPE_PARAM_STR] == request_parameters.METRIC_TYPE_MEAN):
            delta[responses.DURATION_STR] = compare_aggregated_metric_with_mean(baseline_agg_event, canary_agg_event, metric_req)
        if (metric_req[request_parameters.METRIC_TYPE_PARAM_STR] == request_parameters.METRIC_TYPE_COUNT):
            delta[responses.ERROR_COUNT_STR] = compare_aggregated_metric_with_count (baseline_agg_event, canary_agg_event, metric_req)

    return delta
    
def compare_aggregated_metric_with_mean (baseline_agg_event, canary_agg_event, metric_req):
    log.debug(u'compare_aggregated_metrics_with_means() called')
    
    metric_name = metric_req[request_parameters.NAME_PARAM_STR]

    # check that metric is present    
    if (not metric_name in baseline_agg_event):
        log.debug(u"key '{name}' not in baseline data".format(name=metric_name))
        return {}
    if (not metric_req[request_parameters.NAME_PARAM_STR] in canary_agg_event):
        log.debug(u"key '{name}' not in canary data".format(name=metric_name))
        return {}
    
    # check that mean is present
    if (not responses.MEAN_STR in baseline_agg_event[metric_name]):
        log.debug(u"key '{name}.{statistic}' not in baseline data".format(name=metric_name, statistic=responses.MEAN_STR))
        return {}
    if (not responses.MEAN_STR in canary_agg_event[metric_name]):
        log.debug(u"key '{name}.{statistic}' not in canary data".format(name=metric_name, statistic=responses.MEAN_STR))
        return {}
    
    # check that standard deviation is present
    if (not responses.STD_DEV_STR in baseline_agg_event[metric_name]):
        log.debug(u"key '{name}.{statistic}' not in baseline data".format(name=metric_name, statistic=responses.STD_DEV_STR))
        return {}
    if (not responses.STD_DEV_STR in canary_agg_event[metric_name]):
        log.debug(u"key '{name}.{statistic}' not in canary data".format(name=metric_name, statistic=responses.STD_DEV_STR))
        return {}

    # compute mean, standard deviation
    delta_mean = (baseline_agg_event[metric_name][responses.MEAN_STR] - 
                  canary_agg_event[metric_name][responses.MEAN_STR])
    delta_mean_pct = (float(delta_mean) / 
                      baseline_agg_event[metric_name][responses.MEAN_STR])
    delta_stddev = (baseline_agg_event[metric_name][responses.STD_DEV_STR] - 
                    canary_agg_event[metric_name][responses.STD_DEV_STR])
    delta_stddev_pct = (float(delta_stddev) / 
                        baseline_agg_event[metric_name][responses.STD_DEV_STR])
    
    # compute decision and explanation (for conditional or failure)
    decision, explanations = decide(metric_name, {DELTA_MEAN_STR: delta_mean, 
                        DELTA_MEAN_PERCENTAGE_STR: delta_mean_pct,
                        DELTA_STDDEV_STR: delta_stddev,
                        DELTA_STDDEV_PERCENTAGE_STR: delta_stddev_pct,
                        BASELINE_COUNT_STR: baseline_agg_event[responses.EVENT_COUNT_STR],
                        CANARY_COUNT_STR: canary_agg_event[responses.EVENT_COUNT_STR],
                        METRIC_REQUIREMENTS_STR: metric_req,
           })

    return {
        responses.DELTA_MEAN_STR: delta_mean,
        responses.DELTA_MEAN_PCT_STR: delta_mean_pct,
        responses.DELTA_STDDEV_STR: delta_stddev,
        responses.DELTA_STDDEV_PCT_STR: delta_stddev_pct,
        responses.BASELINE_DATA_POINTS_STR: baseline_agg_event[responses.EVENT_COUNT_STR],
        responses.CANARY_DATA_POINTS_STR: canary_agg_event[responses.EVENT_COUNT_STR],
        responses.DECISION_STR: decision,
        responses.DECISION_REASON_STR: '\n'.join(explanations),
    }
    
def compare_aggregated_metric_with_count (baseline_agg_event, canary_agg_event, metric_req):
    log.debug(u'compare_aggregated_error_count() called')
    log.debug(u'metric_req is {}'.format(metric_req))
    
    metric_name = metric_req[request_parameters.NAME_PARAM_STR]

    # check that metric is present    
    if (not metric_name in baseline_agg_event):
        log.debug(u"key '{name}' not in baseline data".format(name=metric_name))
        return {}
    if (not metric_name in canary_agg_event):
        log.debug(u"key '{name}' not in canary data".format(name=metric_name))
        return {}

    # check that total event count is present
    if (not responses.EVENT_COUNT_STR in baseline_agg_event):
        log.debug(u"key '{key}' not in baseline data".format(key=responses.EVENT_COUNT_STR))
        return {}
    if (not responses.EVENT_COUNT_STR in canary_agg_event):
        log.debug(u"key '{key}' not in canary data".format(key=responses.EVENT_COUNT_STR))
        return {}
    
    # compute ratio
    baseline_ratio = (baseline_agg_event[metric_name] / 
                                 baseline_agg_event[responses.EVENT_COUNT_STR])
    canary_ratio = (canary_agg_event[metric_name] / 
                               canary_agg_event[responses.EVENT_COUNT_STR]) 
    delta_ratio = baseline_ratio - canary_ratio
    if baseline_ratio == 0:
        if canary_ratio == 0:
            delta_ratio_pct = 0
        else:
            # It is infinite in reality
            delta_ratio_pct = -1000000
    else:
        delta_ratio_pct = float(delta_ratio) / baseline_ratio

    # compute decision and explanation (for conditional or failure)
    decision, explanations = decide(metric_name, {DELTA_MEAN_STR: delta_ratio, 
                        DELTA_MEAN_PERCENTAGE_STR: delta_ratio_pct,
                        BASELINE_COUNT_STR: baseline_agg_event[responses.EVENT_COUNT_STR],
                        CANARY_COUNT_STR: canary_agg_event[responses.EVENT_COUNT_STR],
                        METRIC_REQUIREMENTS_STR: metric_req,
           })

    return {
        responses.DELTA_MEAN_STR: delta_ratio,
        responses.DELTA_MEAN_PCT_STR: delta_ratio_pct,
        responses.BASELINE_DATA_POINTS_STR: baseline_agg_event[responses.EVENT_COUNT_STR],
        responses.CANARY_DATA_POINTS_STR: canary_agg_event[responses.EVENT_COUNT_STR],
        responses.DECISION_STR: decision,
        responses.DECISION_REASON_STR: '\n'.join(explanations),
    }

def decide(statistic, delta):
    log.debug(u'decide() called')
    min_count = delta[METRIC_REQUIREMENTS_STR][request_parameters.MIN_COUNT_PARAM_STR]
    higher_is_better = delta[METRIC_REQUIREMENTS_STR][request_parameters.HIGHER_IS_BETTER_PARAM_STR]
    
    if (request_parameters.DELTA_MEAN_THRESHOLD_PARAM_STR in delta[METRIC_REQUIREMENTS_STR]):
        delta_mean_threshold = abs(delta[METRIC_REQUIREMENTS_STR][request_parameters.DELTA_MEAN_THRESHOLD_PARAM_STR])
        delta_stddev_threshold = abs(delta[METRIC_REQUIREMENTS_STR][request_parameters.DELTA_STDDEV_THRESHOLD_PARAM_STR])
    if (request_parameters.DELTA_RATIO_THRESHOLD_PARAM_STR in delta[METRIC_REQUIREMENTS_STR]):
        delta_mean_threshold = abs(delta[METRIC_REQUIREMENTS_STR][request_parameters.DELTA_RATIO_THRESHOLD_PARAM_STR])

    decision = responses.DECISION_CONDITIONALLY_BETTER_STR
    explanations = []
    baseline_certainty = 100.0 * float(delta[BASELINE_COUNT_STR]) / min_count
    canary_certainty = 100.0 * float(delta[CANARY_COUNT_STR]) / min_count
    
    if higher_is_better:
        if (delta[DELTA_MEAN_PERCENTAGE_STR] <= 0 or
            abs(delta[DELTA_MEAN_PERCENTAGE_STR]) <= delta_mean_threshold):
            if (DELTA_STDDEV_PERCENTAGE_STR in delta):
                if (abs(delta[DELTA_STDDEV_PERCENTAGE_STR]) <= delta_stddev_threshold):
                    if (delta[BASELINE_COUNT_STR] >= min_count) and (delta[CANARY_COUNT_STR] >= min_count):
                        decision = responses.DECISION_BETTER_STR
                    # else:
                        # no op (keep response.DECISION_CONDITIONAL_BETTER_STR
                else:
                    if (delta[BASELINE_COUNT_STR] >= min_count) and (delta[CANARY_COUNT_STR] >= min_count):
                        decision = responses.DECISION_WORSE_STR
                    else:
                        decision = responses.DECISION_CONDITIONALLY_WORSE_STR
                    explanations.append(failure_explanation(statistic, 'standard deviation'))
            else: # no stdev
                if (delta[BASELINE_COUNT_STR] >= min_count) and (delta[CANARY_COUNT_STR] >= min_count):
                    decision = responses.DECISION_BETTER_STR
        else:
            if (delta[BASELINE_COUNT_STR] >= min_count) and (delta[CANARY_COUNT_STR] >= min_count):
                decision = responses.DECISION_WORSE_STR
            else:
                decision = responses.DECISION_CONDITIONALLY_WORSE_STR
            explanations.append(failure_explanation(statistic, 'mean'))
    else:
        if (delta[DELTA_MEAN_PERCENTAGE_STR] >= 0 or
            abs(delta[DELTA_MEAN_PERCENTAGE_STR]) <= delta_mean_threshold):
            if (DELTA_STDDEV_PERCENTAGE_STR in delta):
                log.info('testing abs(delta[DELTA_STDDEV_PERCENTAGE_STR]) <= delta_stddev_threshold: {} <= {}'.format(abs(delta[DELTA_STDDEV_PERCENTAGE_STR]),delta_stddev_threshold))
                if (abs(delta[DELTA_STDDEV_PERCENTAGE_STR]) <= delta_stddev_threshold):
                    log.info ('passed')
                    if (delta[BASELINE_COUNT_STR] >= min_count) and (delta[CANARY_COUNT_STR] >= min_count):
                        decision = responses.DECISION_BETTER_STR
                    # else:
                        # no op (keep responses.DECISION_CONDITIONAL_BETTER_STR
                else:
                    log.info('failed')
                    if (delta[BASELINE_COUNT_STR] >= min_count) and (delta[CANARY_COUNT_STR] >= min_count):
                        decision = responses.DECISION_WORSE_STR
                    else:
                        decision = responses.DECISION_CONDITIONALLY_WORSE_STR
                    explanations.append(failure_explanation(statistic, 'standard deviation'))
            else:
                if (delta[BASELINE_COUNT_STR] >= min_count) and (delta[CANARY_COUNT_STR] >= min_count):
                    decision = responses.DECISION_BETTER_STR
        else:
            if (delta[BASELINE_COUNT_STR] >= min_count) and (delta[CANARY_COUNT_STR] >= min_count):
                decision = responses.DECISION_WORSE_STR
            else:
                decision = responses.DECISION_CONDITIONALLY_WORSE_STR
            explanations.append(failure_explanation(statistic, 'mean'))
            
    if (baseline_certainty < 100.0):
        explanations.append(conditional_explanation(baseline_certainty, 'baseline', min_count))
    if (canary_certainty < 100.0):
        explanations.append(conditional_explanation(canary_certainty, 'canary', min_count))

    log.info(u'decision() returning ' + decision + '\n' + '\n'.join(explanations))
    return decision, explanations

def failure_explanation (statistic, measure):
    return "Change in " + measure + " for " + statistic + " is too great."

def conditional_explanation(certainty, type_of_data, n):
    if (certainty < 100.0):
        return "Only " + str(certainty) + "% of the recommended number of the " + type_of_data + " data points (" + str(n) + ") are available."
    return ''
