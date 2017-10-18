dummy_testdata = 
{
  "zipkin_url": "http://localhost:9411",
  "clusters_diffs": [
    {
      "root_request": "GET /orders",
      "baseline_trace_ids": [
        "string"
      ],
      "canary_trace_ids": [
        "string"
      ],
      "cluster_stats_diff": [
        {
          "service": "orders",
          "events": [
            {
              "type": "send_request",
              "interlocutor": "catalog",
              "request": "GET /catalog",
              "baseline_stats": {
                "trace_ids": [
                  "string"
                ],
                "global_event_sequence_number": 8,
                "duration": {
                  "min": 3.5,
                  "max": 768,
                  "mean": 56.8,
                  "stddev": 14.78,
                  "first_quartile": 200,
                  "median": 70,
                  "third_quartile": 200,
                  "95th_percentile": 600,
                  "99th_percentile": 750
                },
                "request_size": {
                  "min": 3.5,
                  "max": 768,
                  "mean": 56.8,
                  "stddev": 14.78,
                  "first_quartile": 200,
                  "median": 70,
                  "third_quartile": 200,
                  "95th_percentile": 600,
                  "99th_percentile": 750
                },
                "response_size": {
                  "min": 3.5,
                  "max": 768,
                  "mean": 56.8,
                  "stddev": 14.78,
                  "first_quartile": 200,
                  "median": 70,
                  "third_quartile": 200,
                  "95th_percentile": 600,
                  "99th_percentile": 750
                },
                "event_count": 10,
                "error_count": 5,
                "timeout_count": 3,
                "avg_timeout_seconds": 3.3,
                "retry_count": 3,
                "durations_and_codes": [
                  {
                    "duration": 3478,
                    "response_code": 200
                  }
                ]
              },
              "canary_stats": {
                "trace_ids": [
                  "string"
                ],
                "global_event_sequence_number": 8,
                "duration": {
                  "min": 3.5,
                  "max": 768,
                  "mean": 56.8,
                  "stddev": 14.78,
                  "first_quartile": 200,
                  "median": 70,
                  "third_quartile": 200,
                  "95th_percentile": 600,
                  "99th_percentile": 750
                },
                "request_size": {
                  "min": 3.5,
                  "max": 768,
                  "mean": 56.8,
                  "stddev": 14.78,
                  "first_quartile": 200,
                  "median": 70,
                  "third_quartile": 200,
                  "95th_percentile": 600,
                  "99th_percentile": 750
                },
                "response_size": {
                  "min": 3.5,
                  "max": 768,
                  "mean": 56.8,
                  "stddev": 14.78,
                  "first_quartile": 200,
                  "median": 70,
                  "third_quartile": 200,
                  "95th_percentile": 600,
                  "99th_percentile": 750
                },
                "event_count": 10,
                "error_count": 5,
                "timeout_count": 3,
                "avg_timeout_seconds": 3.3,
                "retry_count": 3,
                "durations_and_codes": [
                  {
                    "duration": 3478,
                    "response_code": 200
                  }
                ]
              },
              "delta": {
                "overall_decision": "needs_more_data",
                "reason": "Not enough data points",
                "duration": {
                  "delta_mean": 19.3,
                  "delta_mean_percentage": 1.3,
                  "delta_stddev": 0.5,
                  "delta_stddev_percentage": 0.8,
                  "baseline_data_points": 100,
                  "canary_data_points": 100,
                  "decision": "needs_more_data"
                },
                "error_count": {
                  "delta_mean": 19.3,
                  "delta_mean_percentage": 1.3,
                  "delta_stddev": 0.5,
                  "delta_stddev_percentage": 0.8,
                  "baseline_data_points": 100,
                  "canary_data_points": 100,
                  "decision": "needs_more_data"
                }
              }
            }
          ]
        }
      ]
    }
  ]
}