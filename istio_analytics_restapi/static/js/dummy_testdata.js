dummy_testdata = {
  "zipkin_url": "http://localhost:9411",
  "clusters": [
    {
      "root_request": "GET ingress/productpage",
      "trace_ids": [
        "000096b5c1a86cd4",
        "0000570f8c6284a9",
        "00008f3647e9739e",
        "0000820a44d42d65",
        "000064c42af8a393"
      ],
      "cluster_stats": [
        {
          "service": "ingress",
          "events": [
            {
              "type": "send_request",
              "interlocutor": "169.51.9.146",
              "trace_ids": [
                "000096b5c1a86cd4",
                "0000570f8c6284a9",
                "00008f3647e9739e",
                "0000820a44d42d65",
                "000064c42af8a393"
              ],
              "global_event_sequence_number": 0,
              "duration": {
                "min": 356,
                "max": 2423,
                "mean": 892.6,
                "stddev": 868.3687580745867,
                "first_quartile": 375,
                "median": 605,
                "third_quartile": 704,
                "95th_percentile": 2079.2,
                "99th_percentile": 2354.24
              },
              "request_size": {
                "min": 0,
                "max": 0,
                "mean": 0,
                "stddev": 0,
                "first_quartile": 0,
                "median": 0,
                "third_quartile": 0,
                "95th_percentile": 0,
                "99th_percentile": 0
              },
              "response_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "event_count": 5,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            }
          ]
        },
        {
          "service": "169.51.9.146",
          "events": [
            {
              "type": "process_request",
              "interlocutor": "ingress",
              "trace_ids": [
                "000096b5c1a86cd4",
                "0000570f8c6284a9",
                "00008f3647e9739e",
                "0000820a44d42d65",
                "000064c42af8a393"
              ],
              "global_event_sequence_number": 1,
              "duration": {
                "min": 9475,
                "max": 36557,
                "mean": 17352.8,
                "stddev": 11948.694058347968,
                "first_quartile": 9538,
                "median": 9556,
                "third_quartile": 21638,
                "95th_percentile": 33573.2,
                "99th_percentile": 35960.240000000005
              },
              "request_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "response_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "event_count": 5,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            },
            {
              "type": "send_request",
              "interlocutor": "details",
              "trace_ids": [
                "000096b5c1a86cd4",
                "0000570f8c6284a9",
                "00008f3647e9739e",
                "0000820a44d42d65",
                "000064c42af8a393"
              ],
              "global_event_sequence_number": 2,
              "duration": {
                "min": 50436,
                "max": 56890,
                "mean": 52454.8,
                "stddev": 2616.7983682355048,
                "first_quartile": 50623,
                "median": 51920,
                "third_quartile": 52405,
                "95th_percentile": 55993,
                "99th_percentile": 56710.600000000006
              },
              "request_size": {
                "min": 0,
                "max": 0,
                "mean": 0,
                "stddev": 0,
                "first_quartile": 0,
                "median": 0,
                "third_quartile": 0,
                "95th_percentile": 0,
                "99th_percentile": 0
              },
              "response_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "event_count": 5,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            },
            {
              "type": "process_response",
              "interlocutor": "details",
              "trace_ids": [
                "000096b5c1a86cd4",
                "0000570f8c6284a9",
                "00008f3647e9739e",
                "0000820a44d42d65",
                "000064c42af8a393"
              ],
              "global_event_sequence_number": 5,
              "duration": {
                "min": 3924,
                "max": 14982,
                "mean": 7889.4,
                "stddev": 4186.329573743567,
                "first_quartile": 6123,
                "median": 7095,
                "third_quartile": 7323,
                "95th_percentile": 13450.199999999997,
                "99th_percentile": 14675.64
              },
              "request_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "response_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "event_count": 5,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            },
            {
              "type": "send_request",
              "interlocutor": "reviews",
              "trace_ids": [
                "000096b5c1a86cd4",
                "0000570f8c6284a9",
                "00008f3647e9739e",
                "0000820a44d42d65",
                "000064c42af8a393"
              ],
              "global_event_sequence_number": 6,
              "duration": {
                "min": 500,
                "max": 3217,
                "mean": 1599.8,
                "stddev": 1266.446880054588,
                "first_quartile": 606,
                "median": 975,
                "third_quartile": 2701,
                "95th_percentile": 3113.8,
                "99th_percentile": 3196.3599999999997
              },
              "request_size": {
                "min": 0,
                "max": 0,
                "mean": 0,
                "stddev": 0,
                "first_quartile": 0,
                "median": 0,
                "third_quartile": 0,
                "95th_percentile": 0,
                "99th_percentile": 0
              },
              "response_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "event_count": 5,
              "error_count": 1,
              "timeout_count": 2,
              "avg_timeout_seconds": 3,
              "retry_count": 3
            },
            {
              "type": "process_response",
              "interlocutor": "reviews",
              "trace_ids": [
                "000096b5c1a86cd4",
                "0000570f8c6284a9",
                "00008f3647e9739e",
                "0000820a44d42d65",
                "000064c42af8a393"
              ],
              "global_event_sequence_number": 13,
              "duration": {
                "min": 699,
                "max": 20257,
                "mean": 9002.8,
                "stddev": 8018.0395172386125,
                "first_quartile": 4880,
                "median": 4906,
                "third_quartile": 14272,
                "95th_percentile": 19060,
                "99th_percentile": 20017.6
              },
              "request_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "response_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "event_count": 5,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            },
            {
              "type": "send_request",
              "interlocutor": "reviews",
              "trace_ids": [
                "000096b5c1a86cd4",
                "0000570f8c6284a9",
                "00008f3647e9739e"
              ],
              "global_event_sequence_number": 12,
              "duration": {
                "min": 726,
                "max": 9721,
                "mean": 5503,
                "stddev": 4523.479523552638,
                "first_quartile": 3394,
                "median": 6062,
                "third_quartile": 7891.5,
                "95th_percentile": 9355.1,
                "99th_percentile": 9647.82
              },
              "request_size": {
                "min": 0,
                "max": 0,
                "mean": 0,
                "stddev": 0,
                "first_quartile": 0,
                "median": 0,
                "third_quartile": 0,
                "95th_percentile": 0,
                "99th_percentile": 0
              },
              "response_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "event_count": 3,
              "error_count": 1,
              "timeout_count": 2,
              "avg_timeout_seconds": 3,
              "retry_count": 0
            },
            {
              "type": "process_response",
              "interlocutor": "reviews",
              "trace_ids": [
                "000096b5c1a86cd4",
                "0000570f8c6284a9",
                "00008f3647e9739e"
              ],
              "global_event_sequence_number": 17,
              "duration": {
                "min": 3003,
                "max": 3092,
                "mean": 3044.6666666666665,
                "stddev": 44.76978147515725,
                "first_quartile": 3021,
                "median": 3039,
                "third_quartile": 3065.5,
                "95th_percentile": 3086.7,
                "99th_percentile": 3090.94
              },
              "request_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "response_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "event_count": 3,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            },
            {
              "type": "send_response",
              "interlocutor": "ingress",
              "trace_ids": [
                "000096b5c1a86cd4",
                "0000570f8c6284a9",
                "00008f3647e9739e",
                "0000820a44d42d65",
                "000064c42af8a393"
              ],
              "global_event_sequence_number": 14,
              "duration": {
                "min": 356,
                "max": 2424,
                "mean": 893.2,
                "stddev": 868.6061823404206,
                "first_quartile": 376,
                "median": 605,
                "third_quartile": 705,
                "95th_percentile": 2080.2,
                "99th_percentile": 2355.24
              },
              "request_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "response_size": {
                "min": 3815,
                "max": 4618,
                "mean": 4135.4,
                "stddev": 438.72804788387987,
                "first_quartile": 3815,
                "median": 3815,
                "third_quartile": 4614,
                "95th_percentile": 4617.2,
                "99th_percentile": 4617.84
              },
              "event_count": 5,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            }
          ]
        },
        {
          "service": "details",
          "events": [
            {
              "type": "process_request",
              "interlocutor": "169.51.9.146",
              "trace_ids": [
                "000096b5c1a86cd4",
                "0000570f8c6284a9",
                "00008f3647e9739e",
                "0000820a44d42d65",
                "000064c42af8a393"
              ],
              "global_event_sequence_number": 3,
              "duration": {
                "min": 7036,
                "max": 58935,
                "mean": 18127.4,
                "stddev": 22823.663012321227,
                "first_quartile": 7745,
                "median": 7866,
                "third_quartile": 9055,
                "95th_percentile": 48958.99999999999,
                "99th_percentile": 56939.799999999996
              },
              "request_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "response_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "event_count": 5,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            },
            {
              "type": "send_response",
              "interlocutor": "169.51.9.146",
              "trace_ids": [
                "000096b5c1a86cd4",
                "0000570f8c6284a9",
                "00008f3647e9739e",
                "0000820a44d42d65",
                "000064c42af8a393"
              ],
              "global_event_sequence_number": 4,
              "duration": {
                "min": 50436,
                "max": 56890,
                "mean": 52455.2,
                "stddev": 2616.7425742705377,
                "first_quartile": 50623,
                "median": 51921,
                "third_quartile": 52406,
                "95th_percentile": 55993.200000000004,
                "99th_percentile": 56710.64000000001
              },
              "request_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "response_size": {
                "min": 213,
                "max": 213,
                "mean": 213,
                "stddev": 0,
                "first_quartile": 213,
                "median": 213,
                "third_quartile": 213,
                "95th_percentile": 213,
                "99th_percentile": 213
              },
              "event_count": 5,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            }
          ]
        },
        {
          "service": "reviews",
          "events": [
            {
              "type": "process_request",
              "interlocutor": "169.51.9.146",
              "trace_ids": [
                "00008f3647e9739e",
                "000096b5c1a86cd4",
                "0000570f8c6284a9",
                "0000820a44d42d65",
                "000064c42af8a393"
              ],
              "global_event_sequence_number": 7,
              "duration": {
                "min": 9589,
                "max": 46528,
                "mean": 17625.6,
                "stddev": 16189.819572805622,
                "first_quartile": 9911,
                "median": 9929,
                "third_quartile": 12171,
                "95th_percentile": 39656.6,
                "99th_percentile": 45153.72
              },
              "request_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "response_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "event_count": 5,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            },
            {
              "type": "send_request",
              "interlocutor": "ratings",
              "trace_ids": [
                "00008f3647e9739e",
                "000096b5c1a86cd4",
                "0000570f8c6284a9",
                "0000820a44d42d65",
                "000064c42af8a393"
              ],
              "global_event_sequence_number": 8,
              "duration": {
                "min": 48499,
                "max": 3557590,
                "mean": 1218919.6666666667,
                "stddev": 2025348.2106344907,
                "first_quartile": 49584.5,
                "median": 50670,
                "third_quartile": 1804130,
                "95th_percentile": 3206897.9999999995,
                "99th_percentile": 3487451.5999999996
              },
              "request_size": {
                "min": 0,
                "max": 0,
                "mean": 0,
                "stddev": 0,
                "first_quartile": 0,
                "median": 0,
                "third_quartile": 0,
                "95th_percentile": 0,
                "99th_percentile": 0
              },
              "response_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "event_count": 5,
              "error_count": 0,
              "timeout_count": 2,
              "avg_timeout_seconds": 6.26,
              "retry_count": 0
            },
            {
              "type": "process_response",
              "interlocutor": "ratings",
              "trace_ids": [
                "00008f3647e9739e",
                "0000820a44d42d65",
                "000064c42af8a393"
              ],
              "global_event_sequence_number": 11,
              "duration": {
                "min": 3840,
                "max": 17314,
                "mean": 8409.333333333334,
                "stddev": 7712.555045724687,
                "first_quartile": 3957,
                "median": 4074,
                "third_quartile": 10694,
                "95th_percentile": 15989.999999999998,
                "99th_percentile": 17049.2
              },
              "request_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "response_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "event_count": 3,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            },
            {
              "type": "send_response",
              "interlocutor": "169.51.9.146",
              "trace_ids": [
                "00008f3647e9739e",
                "0000820a44d42d65",
                "000064c42af8a393"
              ],
              "global_event_sequence_number": 12,
              "duration": {
                "min": 501,
                "max": 976,
                "mean": 694.3333333333334,
                "stddev": 249.51619853895926,
                "first_quartile": 553.5,
                "median": 606,
                "third_quartile": 791,
                "95th_percentile": 938.9999999999999,
                "99th_percentile": 968.6
              },
              "request_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "response_size": {
                "min": 871,
                "max": 4540,
                "mean": 2095.3333333333335,
                "stddev": 2117.1443817872537,
                "first_quartile": 873,
                "median": 875,
                "third_quartile": 2707.5,
                "95th_percentile": 4173.5,
                "99th_percentile": 4466.7
              },
              "event_count": 3,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            },
            {
              "type": "process_request",
              "interlocutor": "169.51.9.146",
              "trace_ids": [
                "00008f3647e9739e",
                "000096b5c1a86cd4",
                "0000570f8c6284a9"
              ],
              "global_event_sequence_number": 11,
              "duration": {
                "min": 19725,
                "max": 51903,
                "mean": 33291.666666666664,
                "stddev": 16671.605121683195,
                "first_quartile": 23986,
                "median": 28247,
                "third_quartile": 40075,
                "95th_percentile": 49537.4,
                "99th_percentile": 51429.880000000005
              },
              "request_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "response_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "event_count": 3,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            },
            {
              "type": "send_request",
              "interlocutor": "ratings",
              "trace_ids": [
                "00008f3647e9739e",
                "000096b5c1a86cd4",
                "0000570f8c6284a9"
              ],
              "global_event_sequence_number": 12,
              "duration": {
                "min": 3555322,
                "max": 3555322,
                "mean": 3555322,
                "stddev": null,
                "first_quartile": 3555322,
                "median": 3555322,
                "third_quartile": 3555322,
                "95th_percentile": 3555322,
                "99th_percentile": 3555322
              },
              "request_size": {
                "min": 0,
                "max": 0,
                "mean": 0,
                "stddev": 0,
                "first_quartile": 0,
                "median": 0,
                "third_quartile": 0,
                "95th_percentile": 0,
                "99th_percentile": 0
              },
              "response_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "event_count": 3,
              "error_count": 0,
              "timeout_count": 2,
              "avg_timeout_seconds": 6.26,
              "retry_count": 0
            },
            {
              "type": "process_response",
              "interlocutor": "ratings",
              "trace_ids": [
                "00008f3647e9739e"
              ],
              "global_event_sequence_number": 15,
              "duration": {
                "min": 20807,
                "max": 20807,
                "mean": 20807,
                "stddev": null,
                "first_quartile": 20807,
                "median": 20807,
                "third_quartile": 20807,
                "95th_percentile": 20807,
                "99th_percentile": 20807
              },
              "request_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "response_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "event_count": 1,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            },
            {
              "type": "send_response",
              "interlocutor": "169.51.9.146",
              "trace_ids": [
                "00008f3647e9739e"
              ],
              "global_event_sequence_number": 16,
              "duration": {
                "min": 9722,
                "max": 9722,
                "mean": 9722,
                "stddev": null,
                "first_quartile": 9722,
                "median": 9722,
                "third_quartile": 9722,
                "95th_percentile": 9722,
                "99th_percentile": 9722
              },
              "request_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "response_size": {
                "min": 4540,
                "max": 4540,
                "mean": 4540,
                "stddev": null,
                "first_quartile": 4540,
                "median": 4540,
                "third_quartile": 4540,
                "95th_percentile": 4540,
                "99th_percentile": 4540
              },
              "event_count": 1,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            }
          ]
        },
        {
          "service": "ratings",
          "events": [
            {
              "type": "process_request",
              "interlocutor": "reviews",
              "trace_ids": [
                "000096b5c1a86cd4",
                "0000570f8c6284a9",
                "00008f3647e9739e"
              ],
              "global_event_sequence_number": 9,
              "duration": {
                "min": 6426,
                "max": 23628,
                "mean": 12268.333333333334,
                "stddev": 9839.101906847663,
                "first_quartile": 6588.5,
                "median": 6751,
                "third_quartile": 15189.5,
                "95th_percentile": 21940.3,
                "99th_percentile": 23290.46
              },
              "request_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "response_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "event_count": 3,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            },
            {
              "type": "send_response",
              "interlocutor": "reviews",
              "trace_ids": [
                "000096b5c1a86cd4",
                "0000570f8c6284a9",
                "00008f3647e9739e"
              ],
              "global_event_sequence_number": 10,
              "duration": {
                "min": 48499,
                "max": 3557590,
                "mean": 1218920,
                "stddev": 2025347.9222274378,
                "first_quartile": 49585,
                "median": 50671,
                "third_quartile": 1804130.5,
                "95th_percentile": 3206898.0999999996,
                "99th_percentile": 3487451.6199999996
              },
              "request_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "response_size": {
                "min": 29,
                "max": 29,
                "mean": 29,
                "stddev": 0,
                "first_quartile": 29,
                "median": 29,
                "third_quartile": 29,
                "95th_percentile": 29,
                "99th_percentile": 29
              },
              "event_count": 3,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            },
            {
              "type": "process_request",
              "interlocutor": "reviews",
              "trace_ids": [
                "000096b5c1a86cd4"
              ],
              "global_event_sequence_number": 18,
              "duration": {
                "min": 11477,
                "max": 11477,
                "mean": 11477,
                "stddev": null,
                "first_quartile": 11477,
                "median": 11477,
                "third_quartile": 11477,
                "95th_percentile": 11477,
                "99th_percentile": 11477
              },
              "request_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "response_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "event_count": 1,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            },
            {
              "type": "send_response",
              "interlocutor": "reviews",
              "trace_ids": [
                "000096b5c1a86cd4"
              ],
              "global_event_sequence_number": 19,
              "duration": {
                "min": 3555323,
                "max": 3555323,
                "mean": 3555323,
                "stddev": null,
                "first_quartile": 3555323,
                "median": 3555323,
                "third_quartile": 3555323,
                "95th_percentile": 3555323,
                "99th_percentile": 3555323
              },
              "request_size": {
                "min": null,
                "max": null,
                "mean": null,
                "stddev": null,
                "first_quartile": null,
                "median": null,
                "third_quartile": null,
                "95th_percentile": null,
                "99th_percentile": null
              },
              "response_size": {
                "min": 29,
                "max": 29,
                "mean": 29,
                "stddev": null,
                "first_quartile": 29,
                "median": 29,
                "third_quartile": 29,
                "95th_percentile": 29,
                "99th_percentile": 29
              },
              "event_count": 1,
              "error_count": 0,
              "timeout_count": 0,
              "avg_timeout_seconds": null,
              "retry_count": 0
            }
          ]
        }
      ]
    }
  ]
}