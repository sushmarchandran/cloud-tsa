import logging
log = logging.getLogger(__name__)

import statistics
import numpy as np

import istio_analytics_restapi.api.distributed_tracing.responses as responses

def compute_stats(distribution):
    stats = {}

    stats[responses.MIN_STR] = min(distribution)
    stats[responses.MAX_STR] = max(distribution)

    stats[responses.MEAN_STR] = statistics.mean(distribution)
    try:
        stats[responses.STD_DEV_STR] = statistics.stdev(distribution)
    except statistics.StatisticsError as e:
        log.debug('Could not compute standard deviation: {0}'.format(e))
    stats[responses.MEDIAN_STR] = statistics.median(distribution)

    data = np.array(distribution)
    stats[responses.FIRST_QUARTILE_STR] = np.percentile(data, 25)
    stats[responses.THIRD_QUARTILE_STR] = np.percentile(data, 75)
    stats[responses.PERCETILE_95_STR] = np.percentile(data, 95)
    stats[responses.PERCETILE_99_STR] = np.percentile(data, 99)

    return stats