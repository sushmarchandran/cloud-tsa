'''
Utility functions to construct Skydive queries
'''

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
    query_string = (u"/topology?pinBaseAngle=45&theme=light&link_label_type=latency&expand=true&"
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