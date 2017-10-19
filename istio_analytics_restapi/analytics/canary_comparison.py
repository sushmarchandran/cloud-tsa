import istio_analytics_restapi.api.distributed_tracing.responses as responses

def canary_simple_comparison(baseline_agg_event, canary_agg_event):
    delta = {}
    duration_delta_mean = (baseline_agg_event[responses.DURATION_STR][responses.MEAN_STR] - 
                           canary_agg_event[responses.DURATION_STR][responses.MEAN_STR])
    duration_delta_mean_pct = (float(duration_delta_mean) / 
                               baseline_agg_event[responses.DURATION_STR]
                                                 [responses.MEAN_STR])
    duration_delta_stddev = (baseline_agg_event[responses.DURATION_STR][responses.STD_DEV_STR] - 
                             canary_agg_event[responses.DURATION_STR][responses.STD_DEV_STR])
    durataion_delta_stddev_pct = (float(duration_delta_stddev) / 
                                  baseline_agg_event[responses.DURATION_STR]
                                                    [responses.MEAN_STR])
    delta[responses.DURATION_STR] = {
        responses.DELTA_MEAN_STR: duration_delta_mean,
        responses.DELTA_MEAN_PCT_STR: duration_delta_mean_pct,
        responses.DELTA_STDDEV_STR: duration_delta_stddev,
        responses.DELTA_STDDEV_PCT_STR: durataion_delta_stddev_pct
    }

    if baseline_agg_event[responses.EVENT_TYPE_STR] == responses.EVENT_SEND_REQUEST:
        pass
    
    return delta