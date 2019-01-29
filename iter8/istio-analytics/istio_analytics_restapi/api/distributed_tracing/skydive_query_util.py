'''
Utility functions to construct Skydive queries
'''
import logging
log = logging.getLogger(__name__)

import os

from istio_analytics_restapi.api import constants
from istio_analytics_restapi.skydive.skydive_client import SkydiveClient

skydive_client = SkydiveClient(os.getenv(constants.ISTIO_ANALYTICS_SKYDIVE_HOST_ENV))

skydive_query_cache = {}

def shortest_path_query(source_container_name, source_pod_name, 
                        target_container_name, target_pod_name):
    '''Returns a Skydive URL for analyzing the latency in the shortest path between two endpoints.
    Each endpoint is defined in terms of substrings matching a container name and a pod name.

    @param source_container_name: Substring to be matched against the name of the Docker container
    making the request
    @param source_pod_name: Substring to be matched against the name of the pod where Docker container
    making the request resides
    @param target_container_name: Substring to be matched against the name of the Docker container
    receiving the request
    @param target_pod_name: Substring to be matched against the name of the pod where Docker container
    receiving the request resides

    The parameters provided to this function will be used to match against data collected 
    by Skydive.

    When the values of the above parameters originate from distributed-tracing data collected by 
    Istio (e.g., Zipkin), one way to map them is as follows: the container name strings may be extracted 
    from the 'serviceName' attributes found in traces, whereas the pod name strings may be extracted 
    from the 'node_id' tag associated with spans.

    @rtype: string
    @return: A Skydive topology URL for analyzing the latency in the shortest path between two endpoints
    '''
    # ATTENTION: In query_string below, the filter MUST be the last parameter in the URL.
    # Our UI will look for the substring starting at "G.V()" to extract the Gremlin query.
    query_string = (u"/topology?topology_legend_hide=true&pinBaseAngle=90&theme=light&"
                    "link_label_type=latency&"
                    "filter=G.V().Has('Manager',NE('k8s'),"
                    "'Docker.Labels.io.kubernetes.container.name', "
                        "Regex('{source_container}.*|{target_container}.*'),"
                    "'Docker.Labels.io.kubernetes.pod.name', "
                        "Regex('{target_pod}.*|{source_pod}.*'))"
                    ".Both().Out().Has('Name', "
                        "Regex('eth0|k8s_{target_container}.*|k8s_{source_container}.*'))."
                    "ShortestPathTo(Metadata('Name','TOR1'))").format(
                           source_container=source_container_name,
                           source_pod=source_pod_name,
                           target_container=target_container_name,
                           target_pod=target_pod_name)
    return query_string

def get_id_from_path(topo_path):
    IDs = []
    for item in topo_path:
        if 'ID' in item:
            ID = item['ID']
            IDs.append(ID)
    return IDs

def get_filter_ids(gremlin_filter_query):
    ids = []
    response_or_msg, http_code = skydive_client.get_topology(gremlin_filter_query)
    if http_code == 200:
        path = response_or_msg[0]
        if isinstance(path, (list,)):
            for path in response_or_msg:
                pathids = get_id_from_path(path)
                ids = ids + pathids
        else:
            ids = get_id_from_path(response_or_msg)
        return (ids)
    else:
        log.error(response_or_msg)
        return []

def get_joint_list_of_ids_from_topology_queries(query1, query2):
    ids_from_first_filter = get_filter_ids(query1)
    ids_from_second_filter = get_filter_ids(query2)
    ids_of_both_filters = \
        ids_from_first_filter + list(set(ids_from_second_filter) - set(ids_from_first_filter))

    return ids_of_both_filters

def create_gremlin_query_from_ids(ids):
    ids_as_string = "|".join(ids)
    gremlin_query = "G.V().Has('ID',Regex('"+ids_as_string+"'))"
    return gremlin_query

def ids_from_shortest_path_query(source_container_name, source_pod_name,
                                  target_container_name, target_pod_name):
    cache_key = source_container_name + source_pod_name + target_container_name + target_pod_name
    if cache_key in skydive_query_cache:
        return skydive_query_cache[cache_key]

    gremlin_query1 = (u"G.V().Has('Manager',NE('k8s'),"
                     "'Docker.Labels.io.kubernetes.container.name', "
                        "Regex('{source_container}.*|{target_container}.*'),"
                     "'Docker.Labels.io.kubernetes.pod.name', "
                        "Regex('{target_pod}.*|{source_pod}.*'))."
                     "ShortestPathTo(Metadata('Name','TOR1'))").format(
                           source_container=source_container_name,
                           source_pod=source_pod_name,
                           target_container=target_container_name,
                           target_pod=target_pod_name)

    gremlin_query2 = (u"G.V().Has('Manager',NE('k8s'),"
                     "'Docker.Labels.io.kubernetes.container.name', "
                        "Regex('{source_container}.*|{target_container}.*'),"
                     "'Docker.Labels.io.kubernetes.pod.name', "
                        "Regex('{target_pod}.*|{source_pod}.*'))."
                     "Both().Out().Both().Has('Name',Regex('cal.*'))").format(
                           source_container=source_container_name,
                           source_pod=source_pod_name,
                           target_container=target_container_name,
                           target_pod=target_pod_name)

    gremlin_query3 = (u"G.V().Has('Manager',NE('k8s'),"
                     "'Docker.Labels.io.kubernetes.container.name', "
                        "Regex('{source_container}.*|{target_container}.*'),"
                    "'Docker.Labels.io.kubernetes.pod.name', "
                        "Regex('{target_pod}.*|{source_pod}.*'))"
                    ".Both().Out().Has('Name',Regex('eth0'))").format(
                           source_container=source_container_name,
                           source_pod=source_pod_name,
                           target_container=target_container_name,
                           target_pod=target_pod_name)

    ids = get_joint_list_of_ids_from_topology_queries(gremlin_query1, gremlin_query2)
    new_gemlin_query = create_gremlin_query_from_ids(ids)

    ids = get_joint_list_of_ids_from_topology_queries(new_gemlin_query, gremlin_query3)
    new_gemlin_query = create_gremlin_query_from_ids(ids)

    full_query = (u"/topology?topology_legend_hide=true&pinBaseAngle=90&theme=light&"
                              "link_label_type=latency&expand=true&filter={0}").format(new_gemlin_query)
    skydive_query_cache[cache_key] = full_query

    return full_query