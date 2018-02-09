import istio_analytics_restapi.api.distributed_tracing.responses as responses

def canary_simple_comparison(baseline_agg_event, canary_agg_event):
    delta = {}
    if (not responses.DURATION_STR in baseline_agg_event or
        not responses.DURATION_STR in canary_agg_event):
        return {}
    duration_delta_mean = (baseline_agg_event[responses.DURATION_STR][responses.MEAN_STR] - 
                           canary_agg_event[responses.DURATION_STR][responses.MEAN_STR])
    duration_delta_mean_pct = (float(duration_delta_mean) / 
                               baseline_agg_event[responses.DURATION_STR]
                                                 [responses.MEAN_STR])
    duration_delta_stddev = (baseline_agg_event[responses.DURATION_STR][responses.STD_DEV_STR] - 
                             canary_agg_event[responses.DURATION_STR][responses.STD_DEV_STR])
    duration_delta_stddev_pct = (float(duration_delta_stddev) / 
                                  baseline_agg_event[responses.DURATION_STR]
                                                    [responses.MEAN_STR])
    delta[responses.DURATION_STR] = {
        responses.DELTA_MEAN_STR: duration_delta_mean,
        responses.DELTA_MEAN_PCT_STR: duration_delta_mean_pct,
        responses.DELTA_STDDEV_STR: duration_delta_stddev,
        responses.DELTA_STDDEV_PCT_STR: duration_delta_stddev_pct,
        responses.BASELINE_DATA_POINTS_STR: baseline_agg_event[responses.EVENT_COUNT_STR],
        responses.CANARY_DATA_POINTS_STR: canary_agg_event[responses.EVENT_COUNT_STR]
    }

    if baseline_agg_event[responses.EVENT_TYPE_STR] == responses.EVENT_SEND_REQUEST:
        error_count_baseline_mean = (baseline_agg_event[responses.ERROR_COUNT_STR] / 
                                     baseline_agg_event[responses.EVENT_COUNT_STR])
        error_count_canary_mean = (canary_agg_event[responses.ERROR_COUNT_STR] / 
                                   canary_agg_event[responses.EVENT_COUNT_STR]) 
         
        error_count_delta_mean = error_count_canary_mean - error_count_baseline_mean
        if error_count_baseline_mean == 0:
            error_count_delta_mean_pct = 0
        else:
            error_count_delta_mean_pct = float(error_count_delta_mean) / error_count_baseline_mean
#         error_count_delta_stddev = (baseline_agg_event[responses.ERROR_COUNT_STR][responses.STD_DEV_STR] - 
#                                  canary_agg_event[responses.ERROR_COUNT_STR][responses.STD_DEV_STR])
#         error_count_delta_stddev_pct = (float(error_count_delta_stddev) / 
#                                       baseline_agg_event[responses.ERROR_COUNT_STR]
#                                                         [responses.MEAN_STR])
        delta[responses.ERROR_COUNT_STR] = {
            responses.DELTA_MEAN_STR: error_count_delta_mean,
            responses.DELTA_MEAN_PCT_STR: error_count_delta_mean_pct,
            responses.BASELINE_DATA_POINTS_STR: baseline_agg_event[responses.EVENT_COUNT_STR],
            responses.CANARY_DATA_POINTS_STR: canary_agg_event[responses.EVENT_COUNT_STR]
#             responses.DELTA_STDDEV_STR: error_count_delta_stddev,
#             responses.DELTA_STDDEV_PCT_STR: error_count_delta_stddev_pct
        }

    return delta