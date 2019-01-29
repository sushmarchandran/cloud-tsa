'''
Utilities used for tests for the distributed-tracing analytics REST API
'''

zipkin_trace_test_files = [
    # Bookinfo; 1 trace; normal trace; reviews version 2; istio 0.1.6
    'zipkin-trace-reviews_v2-normal.json',
            
    # Bookinfo; 1 trace; normal trace; reviews version 3; istio 0.1.6
    'zipkin-trace-reviews_v3-normal.json',
            
    # Bookinfo; 1 trace; reviews version 3; reviews times out and returns a 500 to 
    # productpage as a result; istio 0.1.6
    'zipkin-trace-reviews_v3-delay.json',
            
    # Bookinfo; 1 trace; reviews version 2; productpage times out and reviews keeps
    # going regardless; istio 0.1.6
    'zipkin-trace-reviews_v2-delay_7s.json',
            
    # Bookinfo; 1 trace; reviews version 2; productpage times out and then reviews times out; istio 0.1.6
    'zipkin-trace-reviews_v2-delay_13s.json',

    # DLaaS; 1 trace and 1 span; a service calling itself; istio 0.1.6
    'zipkin-trace-self-call.json',
            
    # Bookinfo; 1 trace; normal trace; reviews version 2; istio 0.2.9
    'zipkin-trace-reviews_V2-normal-029.json',
            
    # Bookinfo; 1 trace; normal trace; reviews version 3; istio 0.2.9
    'zipkin-trace-reviews_V3-normal-029.json',
            
    # Bookinfo; 1 trace; reviews version 2; productpage times out and reviews keeps
    # going regardless; istio 0.2.9
    'zipkin-trace-reviews_V2-delay7s-029.json',
            
    # Bookinfo; 1 trace; reviews version 2; productpage times out and then reviews times out; istio 0.2.9
    'zipkin-trace-reviews_V2-delay13s-029.json',
            
    # Bookinfo; 1 trace; reviews version 3; reviews times out and returns a 500 to 
    # productpage as a result; istio 0.2.9
    'zipkin-trace-reviews_V3-delay7s-029.json',
    'zipkin-trace-reviews_V3-delay13s-029.json',
]

# Files with traces returned by Jaeger
jaeger_trace_test_files = [
    # Bookinfo; 1 trace; normal trace; reviews version 2; istio 1.0.0
    'jaeger-trace-reviews_v2-normal.json',
            
    # Bookinfo; 1 trace; normal trace; reviews version 3; istio 1.0.0
    'jaeger-trace-reviews_v3-normal.json',
            
    # Bookinfo; 1 trace; reviews version 2; productpage times out and reviews keeps
    # going regardless; istio 1.0.0
    'jaeger-trace-reviews_v2-delay_7s.json',
            
    # Bookinfo; 1 trace; reviews version 2; productpage times out and then reviews times out; istio 1.0.0
    'jaeger-trace-reviews_v2-delay_13s.json',

    # Bookinfo; 1 trace; reviews version 3; reviews times out and returns a 500 to 
    # productpage as a result; istio 1.0.0
    'jaeger-trace-reviews_v3-delay_7s.json',

    # Bookinfo; 1 trace; reviews version 3; reviews times out and returns a 500 to 
    # productpage as a result; istio 1.0.0
    'jaeger-trace-reviews_v3-delay_13s.json',
]

# The order here needs to match the order in the array
# cls.trace_test_files
zipkin_traces_response_files = [
    'zipkin_traces_response-reviews_v2-normal.json',
    'zipkin_traces_response-reviews_v3-normal.json',
    'zipkin_traces_response-reviews_v3-delay.json',
    'zipkin_traces_response-reviews_v2-delay_7s.json',
    'zipkin_traces_response-reviews_v2-delay_13s.json',
    'zipkin_traces_self-trace.json',
    'zipkin_traces_response-reviews_V2-normal_029.json',
    'zipkin_traces_response-reviews_V3-normal_029.json',
    'zipkin_traces_response-reviews_V2-delay_7s-029.json',
    'zipkin_traces_response-reviews_V2-delay_13s-029.json',
    'zipkin_traces_response-reviews_V3-delay_7s-029.json',
    'zipkin_traces_response-reviews_V3-delay_13s-029.json'
]

jaeger_traces_response_files = [
    'jaeger_traces_v2_normal.json',
    'jaeger_traces_v3_normal.json',
    'jaeger_traces_v2_delay_7s.json',
    'jaeger_traces_v2_delay_13s.json',
    'jaeger_traces_v3_delay_7s.json',
    'jaeger_traces_v3_delay_13s.json'
]

zipkin_timelines_response_files = [
    'zipkin_timelines_v2_normal.json',
    'zipkin_timelines_v3_normal.json',
    'zipkin_timelines_v3_delay_reviews-timeout_and-return-500.json',
    'zipkin_timelines_v2_delay_7s_pp-timeout_reviews-keeps_going.json',
    'zipkin_timelines_v2_delay_13s_pp-timeout_reviews-timeout_mismatch.json',
    'zipkin_timelines_self-trace.json',
    'zipkin_timelines_V2_normal_029.json',
    'zipkin_timelines_V3_normal_029.json',
    'zipkin_timelines_V2_delay_7s_pp-timeout_reviews-keeps_going-029.json',
    'zipkin_timelines_V2_delay_13s_pp-timeout_reviews-timeout_mismatch-029.json',
    'zipkin_timelines_V3_delay_7s_reviews-timeout_and_return_500-029.json',
    'zipkin_timelines_V3_delay_13s_reviews-timeout_and_return_500-029.json'
]

jaeger_timelines_response_files = [
    'jaeger_timelines_v2_normal.json',
    'jaeger_timelines_v3_normal.json',
    'jaeger_timelines_v2_delay_7s.json',
    'jaeger_timelines_v2_delay_13s.json',
    'jaeger_timelines_v3_delay_7s.json',
    'jaeger_timelines_v3_delay_13s.json'
]