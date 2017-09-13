'''
Analytics on distributed-tracing data
'''
import logging
log = logging.getLogger(__name__)

import re
import json
import statistics

import istio_analytics_restapi.api.distributed_tracing.responses as responses

import istio_analytics_restapi.analytics.distribution_stats as distribution_stats

####
# Local constants
####
ISTIO_INGRESS_SERVICE_STR = 'ingress'
EVENTS_PER_SERVICE_STR = 'events_per_service'
GROUPED_TRACE_IDS_STR = 'grouped_trace_ids'
COALESCED_RETRIES_STR = 'coalesced_retries'
EVENT_LIST = 'event_list'
SIZE = 'size'
TRACE_ID = 'trace_id'
RETRY = 'retry'

def get_root_service_name(trace_timelines):
    if len(trace_timelines[responses.TIMELINES_STR]) == 1:
        # There is only one timeline for this trace
        if (trace_timelines[responses.TIMELINES_STR][0][responses.SERVICE_STR] !=
            ISTIO_INGRESS_SERVICE_STR):
            # This is probably a self-call
            # Let's use "interlocutor" as the service name, since it will
            # have been correctly named
            return trace_timelines[responses.TIMELINES_STR][0][responses.EVENTS_STR][0]\
                                                             [responses.INTERLOCUTOR_STR]

    return trace_timelines[responses.TIMELINES_STR][0][responses.SERVICE_STR]

def get_next_reference_list_index(current_event_indices, event_list_and_sizes):
    assert len(current_event_indices) == len(event_list_and_sizes)
    for i in range(len(current_event_indices)):
        if current_event_indices[i] != event_list_and_sizes[i][SIZE]:
            return i
    # All events of all lists have been processed
    return None

def can_be_aggregated(event_1, event_2):    
    if (event_1[responses.EVENT_TYPE_STR]   == event_2[responses.EVENT_TYPE_STR] and
        event_1[responses.INTERLOCUTOR_STR] == event_2[responses.INTERLOCUTOR_STR] and
        event_1[responses.REQUEST_URL_STR]  == event_2[responses.REQUEST_URL_STR] and
        event_1[responses.PROTOCOL_STR]     == event_2[responses.PROTOCOL_STR] and
        event_1[responses.USER_AGENT_STR]   == event_2[responses.USER_AGENT_STR]):
        return True
    return False

def select_events_to_aggregate(current_event_indices, next_reference_list_index,
                               event_list_and_sizes):
    reference_event = event_list_and_sizes[next_reference_list_index]\
                                          [EVENT_LIST]\
                                          [current_event_indices[next_reference_list_index]]
    reference_event[TRACE_ID] = event_list_and_sizes[next_reference_list_index][TRACE_ID]
    events_to_aggregate = [reference_event]
    for i in range(len(current_event_indices)):
        if (i != next_reference_list_index and 
            current_event_indices[i] != event_list_and_sizes[i][SIZE]):
            candidate_event = event_list_and_sizes[i]\
                                                  [EVENT_LIST]\
                                                  [current_event_indices[i]]
            if can_be_aggregated(reference_event, candidate_event):
                candidate_event[TRACE_ID] = event_list_and_sizes[i][TRACE_ID]
                events_to_aggregate.append(candidate_event)
                current_event_indices[i] += 1

    log.debug('Reference event: {0}'.format(json.dumps(reference_event, indent=2)))
    log.debug('Events to aggregate: {0}'.format(json.dumps(events_to_aggregate, indent=2)))
    return events_to_aggregate

# def aggregate_coalesced_retries(event):
#     event_type = event[0][responses.EVENT_TYPE_STR]
# 
#     error_count = 0
#     timeout_count = 0
#     duration_distribution = []
#     timeout_distribution = []
# 
#     for retry in event[COALESCED_RETRIES_STR]:
#         if responses.DURATION_STR in retry:
#             duration_distribution.append(retry[responses.DURATION_STR])
#         if event_type == responses.EVENT_SEND_REQUEST:
#             if responses.TIMEOUT_STR in retry:
#                 timeout_count += 1
#                 timeout_distribution.append(retry[responses.TIMEOUT_STR])
# 
#             if responses.RESPONSE_CODE_STR in retry:
#                 error_code = int(retry[responses.RESPONSE_CODE_STR])
#                 if error_code >= 500:
#                     error_count += 1
#     return (duration_distribution, timeout_distribution, error_count, timeout_count)

def aggregate_events(events_to_aggregate):
    event_type = events_to_aggregate[0][responses.EVENT_TYPE_STR]

    event_stats = {
        responses.EVENT_TYPE_STR: event_type,
        responses.INTERLOCUTOR_STR: events_to_aggregate[0][responses.INTERLOCUTOR_STR],
        responses.TRACE_IDS_STR: []
    }

    event_count = 0
    error_count = 0
    timeout_count = 0
    retry_count = 0
    duration_distribution = []
    request_size_distribution = []
    response_size_distribution = []
    timeout_distribution = []

    for event in events_to_aggregate:
        if responses.DURATION_STR in event:
            # We compute statistics on duration for all event types
            duration_distribution.append(event[responses.DURATION_STR])
        if event_type == responses.EVENT_SEND_REQUEST:
            # We compute statistics on request size only for send_request events
            if responses.REQUEST_SIZE_STR in event:
                request_size_distribution.append(int(event[responses.REQUEST_SIZE_STR]))

            # We compute statistics on timeout only for send_request events
            if responses.TIMEOUT_STR in event:
                timeout_count += 1
                timeout_distribution.append(event[responses.TIMEOUT_STR])

            # We compute statistics on errors only for send_request events
            if responses.RESPONSE_CODE_STR in event:
                error_code = int(event[responses.RESPONSE_CODE_STR])
                if error_code >= 500:
                    error_count += 1

            # We compute statistics on retries only for send_request events
            if RETRY in event:
                retry_count += 1
#             if COALESCED_RETRIES_STR in event:
#                 retry_count += len(event[COALESCED_RETRIES_STR])
# 
#                 (ret_dur_dist, ret_timeout_dist, ret_error_count, ret_timeout_count) = \
#                     aggregate_coalesced_retries(event)
# 
#                 error_count += ret_error_count
#                 timeout_count += ret_timeout_count
#                 duration_distribution.extend(ret_dur_dist)
#                 timeout_distribution.extend(ret_timeout_dist)
        elif (event_type == responses.EVENT_SEND_RESPONSE and
              responses.RESPONSE_SIZE_STR in event):
            # We compute statistics on response size only for send_response events
            response_size_distribution.append(int(event[responses.RESPONSE_SIZE_STR]))

        event_count += 1
        event_stats[responses.TRACE_IDS_STR].append(event[TRACE_ID])

    # Compute statistics on the data distributions
    if len(duration_distribution) > 0:
        event_stats[responses.DURATION_STR] = \
            distribution_stats.compute_stats(duration_distribution)
    if event_type == responses.EVENT_SEND_REQUEST:
        if len(request_size_distribution) > 0:
            event_stats[responses.REQUEST_SIZE_STR] = \
                distribution_stats.compute_stats(request_size_distribution)
    elif event_type == responses.EVENT_SEND_RESPONSE:
        if len(response_size_distribution) > 0:
            event_stats[responses.RESPONSE_SIZE_STR] = \
                distribution_stats.compute_stats(response_size_distribution)

    event_stats[responses.ERROR_COUNT_STR] = error_count
    event_stats[responses.TIMEOUT_COUNT_STR] = timeout_count
    event_stats[responses.EVENT_COUNT_STR] = event_count
    event_stats[responses.RETRY_COUNT_STR] = retry_count
    
    if timeout_distribution:
        avg_microseconds = statistics.mean(timeout_distribution)
        event_stats[responses.AVG_TIMEOUT_SEC_STR] = \
            round(avg_microseconds/1000000.0, 2) 

    log.debug('Event stats: {0}'.format(json.dumps(event_stats, indent=2)))
    return event_stats

def detect_retries(event_list, coalesce=False):
    '''
    Coalesces "send_request" events and "process_response" events for the same URL and 
    destination that might suggest one or more retries after a timeout or HTTP error code
    
    @param event_list (list): List of events corresponding to the timeline of one service
        The event_list object will be updated if there are events to be coalesced
    '''
    cur_index = 0
    while cur_index < len(event_list):
        event = event_list[cur_index]
        current_event_type = event[responses.EVENT_TYPE_STR]
        current_interlocutor = event[responses.INTERLOCUTOR_STR]
        response_code = int(event[responses.RESPONSE_CODE_STR])
        if ((current_event_type == responses.EVENT_SEND_REQUEST) and
            (responses.TIMEOUT_STR in event or response_code >= 500)):
            # This is a send_request event that timed out or got a 5xx HTTP code
            # Let's check if this event was retried

            coalesced_events = False
            flagged = False
            while cur_index < (len(event_list) - 3):
                # Look for a pattern of retry
                if (not ((event_list[cur_index + 1][responses.EVENT_TYPE_STR] == responses.EVENT_PROCESS_RESPONSE) and
                         (event_list[cur_index + 1][responses.INTERLOCUTOR_STR] == current_interlocutor) and
                         (event_list[cur_index + 2][responses.EVENT_TYPE_STR] == current_event_type) and
                         (event_list[cur_index + 2][responses.INTERLOCUTOR_STR] == current_interlocutor) and
                         (event_list[cur_index + 3][responses.EVENT_TYPE_STR] == responses.EVENT_PROCESS_RESPONSE) and
                         (event_list[cur_index + 3][responses.INTERLOCUTOR_STR] == current_interlocutor))):
                    # No retries left. Abort inner loop. 
                    break
                # If we get here, we found the following sequence of events (suggesting a retry)
                # for the same source and interlocutor:
                #   << send_request, process_response, send_request, process_response >>

                if coalesce:
                    # Coalesce a pair of send_request events
                    event_list[cur_index][COALESCED_RETRIES_STR] = []
                    event_list[cur_index][COALESCED_RETRIES_STR].append(event_list[cur_index + 2])

                    # Coalesce a pair of process_response events
                    event_list[cur_index + 1][COALESCED_RETRIES_STR] = []
                    event_list[cur_index + 1][COALESCED_RETRIES_STR].append(event_list[cur_index + 3])

                    # Remove duplicates from original list
                    # Note that we use cur_index + 2 in both cases deletions because after the first
                    # one the event_list has one fewer element
                    del event_list[cur_index + 2]
                    del event_list[cur_index + 2]
                    
                    coalesced_events = True
                else:
                    # Flag the requests that were retried
                    event_list[cur_index][RETRY] = True
                    event_list[cur_index + 1][RETRY] = True
                    flagged = True
                    cur_index +=2 

            if coalesce:
                # Make sure we jump to the next event after the sequence of retries
                cur_index = cur_index + 2 if coalesced_events else cur_index + 1
            elif not flagged:
                cur_index += 1
        else:  
            cur_index += 1

def compute_cluster_stats(grouped_traces_timelines):
    cluster_stats_list = []
    for service, events_lists in grouped_traces_timelines[EVENTS_PER_SERVICE_STR].items():
        cluster_stats = {
            responses.SERVICE_STR: service,
            responses.EVENTS_STR: []
        }

        # Number of event lists associated with the service
        n_event_lists = len(events_lists)

        # This list keeps indices for each event list
        # The value of each index points to the event that might be considered
        # for aggregation from each list
        current_event_indices = [0] * n_event_lists

        for event_list in events_lists:
            log.debug('Trying to coalesce retries for timeline of service "{0}"'.format(service))
            log.debug('Timeline of service "{0}" before coalescing: {1}'.
                      format(service, json.dumps(event_list, indent=2)))
            detect_retries(event_list)
            log.debug('Timeline of service "{0}" after coalescing: {1}'.
                      format(service, json.dumps(event_list, indent=2)))

        # Dictionary with all event lists
        # The dictionary is reversely sorted by size
        event_list_and_sizes = sorted([{SIZE:len(l), EVENT_LIST:l, TRACE_ID: id}
                                        for l,id in zip(events_lists,
                                                        grouped_traces_timelines[GROUPED_TRACE_IDS_STR])
                                      ],
                                      reverse=True,
                                      key=lambda d: d[SIZE])

        next_reference_list_index = \
            get_next_reference_list_index(current_event_indices, event_list_and_sizes)
        while next_reference_list_index != None:
            events_to_aggregate = select_events_to_aggregate(current_event_indices, 
                                                             next_reference_list_index,
                                                             event_list_and_sizes)
            cluster_stats[responses.EVENTS_STR].append(aggregate_events(events_to_aggregate))
            current_event_indices[next_reference_list_index] += 1
            next_reference_list_index = \
                get_next_reference_list_index(current_event_indices, event_list_and_sizes)

        cluster_stats_list.append(cluster_stats)
    return cluster_stats_list

def cluster_traces(traces_timelines):
    '''Given a list of timelines for multiple traces, groups the traces into clusters

    @param traces_timelines (list): List of traces' timelines as returned by
    istio_analytics_restapi.api.distributed_tracing.zipkin_util.zipkin_trace_list_to_timelines()
    '''
    # Matches the substring up to the first occurrence of '?', if any. 
    # This is used to assign identical requests (method and path) with
    # different request-URL parameters to the same root-request bucket. 
    request_type_regex = '^[^?]+'

    # Dictionary where keys are unique URLs for the root requests of traces
    #     
    # { 
    #    "GET /ingress/productpage": {
    #        "grouped_trace_ids": ["id1", "id2", ..., "idn"],
    #        "events_per_service": {
    #             "productpage": [
    #                  [<e11>, <e21>, ... <em1>], 
    #                  [<e12>, <e22>, ... <em2>], ...
    #                  [<e1n>, <e2n>, ... <emn>]
    #              ],
    #             ...
    #         }
    #     },
    #     ...
    # }
    #
    # Above, "grouped_trace_ids" is a list of all trace ids grouped under the
    # root request, and "events_per_service" is a dictionary where each key is a 
    # service name and the associated value is a list where each element is a list
    # of events for the corresponding service. Each inner list came from each trace
    # grouped under the root request.
    # 
    # Statistics will be computed on corresponding events of each inner event list.
    # For example, e11, e12, ..., e1n  will be aggregated.
    # The aggregation algorithm will reconcile event mismatches, e.g.,
    # when not all "n" inner lists have exactly "m" events.
    # This can happen, for example, when there is a missing send_request_event, or when
    # there are multiple retries, after timeouts, for a send_request event.
    #
    root_requests = {}

    # Iterate over each trace
    for trace_timelines in traces_timelines:
        root_service = get_root_service_name(trace_timelines)
        request_info = trace_timelines[responses.REQUEST_URL_STR].split(' ')
        root_url = u'{0} {1}{2}'.format(request_info[0], root_service,
                                        request_info[1])

        # Identical requests (method and path) with different request-URL parameters 
        # will be part of the same list
        root_url_match = re.match(request_type_regex, root_url)
        if not root_url_match[0] in root_requests:
            root_requests[root_url_match[0]] = {
                GROUPED_TRACE_IDS_STR: [],
                EVENTS_PER_SERVICE_STR: {}
            }

        # Iterate over each service to get its events
        for timeline in trace_timelines[responses.TIMELINES_STR]:
            if not (timeline[responses.SERVICE_STR] in 
                   root_requests[root_url_match[0]][EVENTS_PER_SERVICE_STR]):
                root_requests[root_url_match[0]]\
                             [EVENTS_PER_SERVICE_STR]\
                             [timeline[responses.SERVICE_STR]] = []
            # Add the list of events of this service from this trace
            root_requests[root_url_match[0]]\
                         [EVENTS_PER_SERVICE_STR]\
                         [timeline[responses.SERVICE_STR]].append(timeline[responses.EVENTS_STR])
            log.debug(u'Added list of events to trace group: trace_id = {0}; request = {1}; '
                      'root_request = {2}; service = {3}; '
                      'events = {4}'.format(trace_timelines[responses.TRACE_ID_STR],
                                            trace_timelines[responses.REQUEST_URL_STR],
                                            root_url_match[0],
                                            timeline[responses.SERVICE_STR],
                                            timeline[responses.EVENTS_STR]))

        # Add trace id to the list of ids of this group
        root_requests[root_url_match[0]][GROUPED_TRACE_IDS_STR].append(
            trace_timelines[responses.TRACE_ID_STR])
        log.debug(u'Added trace id to trace group: root_request = {0}; '
                  'trace_id = {1}'.format(root_url_match[0], 
                                          trace_timelines[responses.TRACE_ID_STR]))

    log.debug(u'Groups of traces: {0}'.format(json.dumps(root_requests, indent=2)))

    # List of clusters to return
    ret_val = []

    # Process each group of traces to compute statistics
    for root_request, grouped_traces_timelines in root_requests.items():
        # Dictionary where all timelines (for all services) associated with a
        # root request are summarized/aggregated
        cluster = {
            responses.ROOT_REQUEST_STR: root_request,
            responses.TRACE_IDS_STR: grouped_traces_timelines[GROUPED_TRACE_IDS_STR]
        }

        log.debug('Computing statistics for traces mapping to root request: {0}'.
                  format(root_request))
        cluster[responses.CLUSTER_STATS_STR] = compute_cluster_stats(grouped_traces_timelines)
        ret_val.append(cluster)

    return ret_val