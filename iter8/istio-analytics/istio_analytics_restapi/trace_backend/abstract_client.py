from abc import ABC, abstractmethod

class AbstractClient(ABC):
    def __init__(self, host_url):
        super().__init__()
    
    @abstractmethod
    def get_traces(self, start_time, end_time, max_traces, tags):
        '''
        Retrieves a list of traces from trace server

        @param start_time (integer): start time (epoch in milliseconds)
        @param end_time (integer): end time (epoch in milliseconds)
        @param max_traces (integer): Maximum number of traces to retrieve
        @param tags (list): List of strings containing key-value pairs
        
        @return On success, a tuple with an array of traces and the HTTP code 200
                On error, an error message and an appropriate HTTP code
        @rtype tuple(list or string, integer)
        '''
        pass

    @abstractmethod  
    def trace_list_to_timelines(self, traces, filter_list):
        '''Converts a list of traces as returned by backend trace server into the format 
        specified by the REST API POST /distributed_tracing/traces/.

        @param zipkin_trace_list (list): List of traces as returned by backend trace server

        @rtype: list
        @return Trace list as specified by POST /distributed_tracing/traces
        '''
        pass

    @abstractmethod 
    def trace_list_to_istio_analytics_trace_list(self, traces, filter_list):
        '''Converts a list of traces as returned by backend trace server into the format 
        specified by the REST API POST /distributed_tracing/traces/.

        @param zipkin_trace_list (list): List of traces as returned by backend trace server

        @rtype: list
        @return Trace list as specified by POST /distributed_tracing/traces
        '''
        pass
