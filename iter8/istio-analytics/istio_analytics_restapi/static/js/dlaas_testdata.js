/*
 * Retrieved with
 * curl 'http://localhost:5555/api/v1/distributed_tracing/traces/timelines/clusters' -H 'Origin: http://localhost:5555' -H 'Accept-Encoding: gzip, deflate, br' -H 'Accept-Language: en-US,en;q=0.8' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36' -H 'Content-Type: application/json;charset=UTF-8' -H 'Accept: application/json, text/plain' -H 'Referer: http://localhost:5555/uml5/categories?start=2017-07-06T00:00:00.0Z&end=2017-07-31T00:00:00.0Z' -H 'Connection: keep-alive' --data-binary '{"start_time":"2017-07-06T00:00:00.0Z","end_time":"2017-07-31T00:00:00.0Z"}'
 */
dummy_testdata = 
{
    "zipkin_url": "http://localhost:9411",
    "clusters": [
        {
            "root_request": "GET 172.30.85.185/health",
            "trace_ids": [
                "00007761db8f5d39",
                "00002a13f3cd0895",
                "0000bd96994905fa",
                "00000fa8e1e0eef1",
                "0000e0d6c9fb1dca",
                "0000bff13d37c08a",
                "0000f25ccb38e349",
                "00007e70f9bd4a1a",
                "0000f786a5e03732",
                "0000b787d6ff4fd7",
                "00006a8f7b972aff",
                "0000e97226ea7d76",
                "0000a3f0c917eb45",
                "0000befc219ba023",
                "00002f1c589a42aa",
                "00003f80e6860107",
                "0000ad6675a106df",
                "0000a7b51e8b761d",
                "00007eb79b4423c4",
                "000057a20f33ac6f",
                "00009753e1c1d28b",
                "00001965daed3ddd",
                "0000dd4806615b6d",
                "000034199af4b0dc",
                "0000a0e7df4beb53",
                "000085356352d9a4",
                "00005684cdfee7bf",
                "00000e2dfb3918b2",
                "00009bce18e4e148",
                "00004c43a79428d2",
                "000073d7ce2debd4",
                "0000f29d9985a88e",
                "0000a4c12b456a39",
                "0000f461b00e6057",
                "0000b4a038a5c0ae",
                "0000f55ad8410979"
            ],
            "cluster_stats": [
                {
                    "service": "172.30.85.185",
                    "events": [
                        {
                            "type": "send_request",
                            "interlocutor": "172.30.85.185",
                            "request": "GET /health",
                            "trace_ids": [
                                "00007761db8f5d39",
                                "00002a13f3cd0895",
                                "0000bd96994905fa",
                                "00000fa8e1e0eef1",
                                "0000e0d6c9fb1dca",
                                "0000bff13d37c08a",
                                "0000f25ccb38e349",
                                "00007e70f9bd4a1a",
                                "0000f786a5e03732",
                                "0000b787d6ff4fd7",
                                "00006a8f7b972aff",
                                "0000e97226ea7d76",
                                "0000a3f0c917eb45",
                                "0000befc219ba023",
                                "00002f1c589a42aa",
                                "00003f80e6860107",
                                "0000ad6675a106df",
                                "0000a7b51e8b761d",
                                "00007eb79b4423c4",
                                "000057a20f33ac6f",
                                "00009753e1c1d28b",
                                "00001965daed3ddd",
                                "0000dd4806615b6d",
                                "000034199af4b0dc",
                                "0000a0e7df4beb53",
                                "000085356352d9a4",
                                "00005684cdfee7bf",
                                "00000e2dfb3918b2",
                                "00009bce18e4e148",
                                "00004c43a79428d2",
                                "000073d7ce2debd4",
                                "0000f29d9985a88e",
                                "0000a4c12b456a39",
                                "0000f461b00e6057",
                                "0000b4a038a5c0ae",
                                "0000f55ad8410979"
                            ],
                            "global_event_sequence_number": 0,
                            "duration": {
                                "min": 3839.0,
                                "max": 10307.0,
                                "mean": 5868.833333333333,
                                "stddev": 1761.7728652046576,
                                "first_quartile": 4500.75,
                                "median": 4973.0,
                                "third_quartile": 7648.75,
                                "95th_percentile": 8667.75,
                                "99th_percentile": 9873.699999999999
                            },
                            "request_size": {
                                "min": 0.0,
                                "max": 0.0,
                                "mean": 0.0,
                                "stddev": 0.0,
                                "first_quartile": 0.0,
                                "median": 0.0,
                                "third_quartile": 0.0,
                                "95th_percentile": 0.0,
                                "99th_percentile": 0.0
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
                            "event_count": 36,
                            "error_count": 0,
                            "timeout_count": 0,
                            "avg_timeout_seconds": null,
                            "retry_count": 0
                        }
                    ]
                }
            ]
        },
        {
            "root_request": "GET 172.30.174.216/health",
            "trace_ids": [
                "0000308feb0bf116",
                "000086c6ff7c216c",
                "000037374fd8e205",
                "0000097ba9824245",
                "00007905cf270d1d",
                "00002736d1a03796",
                "0000a246c6d88b50",
                "00009d0988d5a29a",
                "00003608a6ff869e",
                "0000c2013928e4c8",
                "0000405ba8a15c29",
                "00008d4dbba72512",
                "0000bbcd2152f7c2",
                "000098eae338555f",
                "0000ab089e59dd19",
                "000050e1ef43f94e",
                "0000cf82bd1b6e98",
                "0000f2c43c629c56",
                "00008e2839b50b98",
                "00001f8e4c1bb2f9",
                "0000dfd4ef06271a",
                "0000e1a7418a4823",
                "0000c28efe3f4890",
                "00003d30f5ff7ab6",
                "00001c3018825b63",
                "000041f402f77e05",
                "000099a6338231bc",
                "0000a6da5061208f",
                "0000ab86f5388f9e",
                "00003081d95a7842",
                "00007ad741aa4632",
                "0000745f5c40c59a",
                "0000a920e19be0b6",
                "000001520ebf4a8c",
                "00006826ab682844",
                "000074080710756c"
            ],
            "cluster_stats": [
                {
                    "service": "172.30.174.216",
                    "events": [
                        {
                            "type": "send_request",
                            "interlocutor": "172.30.174.216",
                            "request": "GET /health",
                            "trace_ids": [
                                "0000308feb0bf116",
                                "000086c6ff7c216c",
                                "000037374fd8e205",
                                "0000097ba9824245",
                                "00007905cf270d1d",
                                "00002736d1a03796",
                                "0000a246c6d88b50",
                                "00009d0988d5a29a",
                                "00003608a6ff869e",
                                "0000c2013928e4c8",
                                "0000405ba8a15c29",
                                "00008d4dbba72512",
                                "0000bbcd2152f7c2",
                                "000098eae338555f",
                                "0000ab089e59dd19",
                                "000050e1ef43f94e",
                                "0000cf82bd1b6e98",
                                "0000f2c43c629c56",
                                "00008e2839b50b98",
                                "00001f8e4c1bb2f9",
                                "0000dfd4ef06271a",
                                "0000e1a7418a4823",
                                "0000c28efe3f4890",
                                "00003d30f5ff7ab6",
                                "00001c3018825b63",
                                "000041f402f77e05",
                                "000099a6338231bc",
                                "0000a6da5061208f",
                                "0000ab86f5388f9e",
                                "00003081d95a7842",
                                "00007ad741aa4632",
                                "0000745f5c40c59a",
                                "0000a920e19be0b6",
                                "000001520ebf4a8c",
                                "00006826ab682844",
                                "000074080710756c"
                            ],
                            "global_event_sequence_number": 0,
                            "duration": {
                                "min": 3768.0,
                                "max": 7998.0,
                                "mean": 5128.972222222223,
                                "stddev": 1376.3207160731336,
                                "first_quartile": 4185.5,
                                "median": 4400.0,
                                "third_quartile": 6512.75,
                                "95th_percentile": 7660.0,
                                "99th_percentile": 7980.5
                            },
                            "request_size": {
                                "min": 0.0,
                                "max": 0.0,
                                "mean": 0.0,
                                "stddev": 0.0,
                                "first_quartile": 0.0,
                                "median": 0.0,
                                "third_quartile": 0.0,
                                "95th_percentile": 0.0,
                                "99th_percentile": 0.0
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
                            "event_count": 36,
                            "error_count": 0,
                            "timeout_count": 0,
                            "avg_timeout_seconds": null,
                            "retry_count": 0
                        }
                    ]
                }
            ]
        },
        {
            "root_request": "DELETE ingress/v1/models/training-OtCjpRhzR",
            "trace_ids": [
                "00001e7760731109"
            ],
            "cluster_stats": [
                {
                    "service": "ingress",
                    "events": [
                        {
                            "type": "send_request",
                            "interlocutor": "10.177.1.186",
                            "request": "DELETE /v1/models/training-OtCjpRhzR?version=2017-02-13",
                            "trace_ids": [
                                "00001e7760731109"
                            ],
                            "global_event_sequence_number": 0,
                            "duration": {
                                "min": 240.0,
                                "max": 240.0,
                                "mean": 240.0,
                                "stddev": null,
                                "first_quartile": 240.0,
                                "median": 240.0,
                                "third_quartile": 240.0,
                                "95th_percentile": 240.0,
                                "99th_percentile": 240.0
                            },
                            "request_size": {
                                "min": 0.0,
                                "max": 0.0,
                                "mean": 0.0,
                                "stddev": null,
                                "first_quartile": 0.0,
                                "median": 0.0,
                                "third_quartile": 0.0,
                                "95th_percentile": 0.0,
                                "99th_percentile": 0.0
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
                        }
                    ]
                },
                {
                    "service": "10.177.1.186",
                    "events": [
                        {
                            "type": "process_request",
                            "interlocutor": "ingress",
                            "request": "DELETE /v1/models/training-OtCjpRhzR?version=2017-02-13",
                            "trace_ids": [
                                "00001e7760731109"
                            ],
                            "global_event_sequence_number": 1,
                            "duration": {
                                "min": 7282.0,
                                "max": 7282.0,
                                "mean": 7282.0,
                                "stddev": null,
                                "first_quartile": 7282.0,
                                "median": 7282.0,
                                "third_quartile": 7282.0,
                                "95th_percentile": 7282.0,
                                "99th_percentile": 7282.0
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
                            "type": "send_request",
                            "interlocutor": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                            "request": "POST /grpc.trainer.v2.Trainer/DeleteTrainingJob",
                            "trace_ids": [
                                "00001e7760731109"
                            ],
                            "global_event_sequence_number": 2,
                            "duration": {
                                "min": 207.0,
                                "max": 207.0,
                                "mean": 207.0,
                                "stddev": null,
                                "first_quartile": 207.0,
                                "median": 207.0,
                                "third_quartile": 207.0,
                                "95th_percentile": 207.0,
                                "99th_percentile": 207.0
                            },
                            "request_size": {
                                "min": 40.0,
                                "max": 40.0,
                                "mean": 40.0,
                                "stddev": null,
                                "first_quartile": 40.0,
                                "median": 40.0,
                                "third_quartile": 40.0,
                                "95th_percentile": 40.0,
                                "99th_percentile": 40.0
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
                            "type": "process_response",
                            "interlocutor": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                            "request": "POST /grpc.trainer.v2.Trainer/DeleteTrainingJob",
                            "trace_ids": [
                                "00001e7760731109"
                            ],
                            "global_event_sequence_number": 9,
                            "duration": {
                                "min": 735.0,
                                "max": 735.0,
                                "mean": 735.0,
                                "stddev": null,
                                "first_quartile": 735.0,
                                "median": 735.0,
                                "third_quartile": 735.0,
                                "95th_percentile": 735.0,
                                "99th_percentile": 735.0
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
                            "interlocutor": "ingress",
                            "request": "DELETE /v1/models/training-OtCjpRhzR?version=2017-02-13",
                            "trace_ids": [
                                "00001e7760731109"
                            ],
                            "global_event_sequence_number": 10,
                            "duration": {
                                "min": 240.0,
                                "max": 240.0,
                                "mean": 240.0,
                                "stddev": null,
                                "first_quartile": 240.0,
                                "median": 240.0,
                                "third_quartile": 240.0,
                                "95th_percentile": 240.0,
                                "99th_percentile": 240.0
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
                                "min": 34.0,
                                "max": 34.0,
                                "mean": 34.0,
                                "stddev": null,
                                "first_quartile": 34.0,
                                "median": 34.0,
                                "third_quartile": 34.0,
                                "95th_percentile": 34.0,
                                "99th_percentile": 34.0
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
                    "service": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "events": [
                        {
                            "type": "process_request",
                            "interlocutor": "10.177.1.186",
                            "request": "POST /grpc.trainer.v2.Trainer/DeleteTrainingJob",
                            "trace_ids": [
                                "00001e7760731109"
                            ],
                            "global_event_sequence_number": 3,
                            "duration": {
                                "min": 25201.0,
                                "max": 25201.0,
                                "mean": 25201.0,
                                "stddev": null,
                                "first_quartile": 25201.0,
                                "median": 25201.0,
                                "third_quartile": 25201.0,
                                "95th_percentile": 25201.0,
                                "99th_percentile": 25201.0
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
                            "type": "send_request",
                            "interlocutor": "dlaas-lcm.user-kalantar.svc.cluster.local",
                            "request": "POST /service.LifecycleManager/KillTrainingJob",
                            "trace_ids": [
                                "00001e7760731109"
                            ],
                            "global_event_sequence_number": 4,
                            "duration": {
                                "min": 776.0,
                                "max": 776.0,
                                "mean": 776.0,
                                "stddev": null,
                                "first_quartile": 776.0,
                                "median": 776.0,
                                "third_quartile": 776.0,
                                "95th_percentile": 776.0,
                                "99th_percentile": 776.0
                            },
                            "request_size": {
                                "min": 78.0,
                                "max": 78.0,
                                "mean": 78.0,
                                "stddev": null,
                                "first_quartile": 78.0,
                                "median": 78.0,
                                "third_quartile": 78.0,
                                "95th_percentile": 78.0,
                                "99th_percentile": 78.0
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
                            "type": "process_response",
                            "interlocutor": "dlaas-lcm.user-kalantar.svc.cluster.local",
                            "request": "POST /service.LifecycleManager/KillTrainingJob",
                            "trace_ids": [
                                "00001e7760731109"
                            ],
                            "global_event_sequence_number": 7,
                            "duration": {
                                "min": 1939.0,
                                "max": 1939.0,
                                "mean": 1939.0,
                                "stddev": null,
                                "first_quartile": 1939.0,
                                "median": 1939.0,
                                "third_quartile": 1939.0,
                                "95th_percentile": 1939.0,
                                "99th_percentile": 1939.0
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
                            "interlocutor": "10.177.1.186",
                            "request": "POST /grpc.trainer.v2.Trainer/DeleteTrainingJob",
                            "trace_ids": [
                                "00001e7760731109"
                            ],
                            "global_event_sequence_number": 8,
                            "duration": {
                                "min": 208.0,
                                "max": 208.0,
                                "mean": 208.0,
                                "stddev": null,
                                "first_quartile": 208.0,
                                "median": 208.0,
                                "third_quartile": 208.0,
                                "95th_percentile": 208.0,
                                "99th_percentile": 208.0
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
                                "min": 43.0,
                                "max": 43.0,
                                "mean": 43.0,
                                "stddev": null,
                                "first_quartile": 43.0,
                                "median": 43.0,
                                "third_quartile": 43.0,
                                "95th_percentile": 43.0,
                                "99th_percentile": 43.0
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
                    "service": "dlaas-lcm.user-kalantar.svc.cluster.local",
                    "events": [
                        {
                            "type": "process_request",
                            "interlocutor": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                            "request": "POST /service.LifecycleManager/KillTrainingJob",
                            "trace_ids": [
                                "00001e7760731109"
                            ],
                            "global_event_sequence_number": 5,
                            "duration": {
                                "min": 52078.0,
                                "max": 52078.0,
                                "mean": 52078.0,
                                "stddev": null,
                                "first_quartile": 52078.0,
                                "median": 52078.0,
                                "third_quartile": 52078.0,
                                "95th_percentile": 52078.0,
                                "99th_percentile": 52078.0
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
                            "interlocutor": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                            "request": "POST /service.LifecycleManager/KillTrainingJob",
                            "trace_ids": [
                                "00001e7760731109"
                            ],
                            "global_event_sequence_number": 6,
                            "duration": {
                                "min": 776.0,
                                "max": 776.0,
                                "mean": 776.0,
                                "stddev": null,
                                "first_quartile": 776.0,
                                "median": 776.0,
                                "third_quartile": 776.0,
                                "95th_percentile": 776.0,
                                "99th_percentile": 776.0
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
                                "min": 5.0,
                                "max": 5.0,
                                "mean": 5.0,
                                "stddev": null,
                                "first_quartile": 5.0,
                                "median": 5.0,
                                "third_quartile": 5.0,
                                "95th_percentile": 5.0,
                                "99th_percentile": 5.0
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
        },
        {
            "root_request": "GET ingress/v1/models/training-OtCjpRhzR",
            "trace_ids": [
                "00009581c75f8bd3",
                "000036e2b49ee0e5",
                "0000d70ba480098e",
                "00009555ab43bf09",
                "000047b263485e93",
                "0000c4ccb6c1529c",
                "000070ca7ca0fb4f",
                "00001e858b87623d",
                "0000255bee4932ac",
                "00002fe981df121a",
                "0000df3687641546",
                "00005741526d0832",
                "0000b6ff9dff5123",
                "00003ef8b2e2f63c",
                "00000df0ccb3ae22",
                "0000450f83b05de4"
            ],
            "cluster_stats": [
                {
                    "service": "ingress",
                    "events": [
                        {
                            "type": "send_request",
                            "interlocutor": "10.177.1.186",
                            "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                            "trace_ids": [
                                "00009581c75f8bd3",
                                "000036e2b49ee0e5",
                                "0000d70ba480098e",
                                "00009555ab43bf09",
                                "000047b263485e93",
                                "0000c4ccb6c1529c",
                                "000070ca7ca0fb4f",
                                "00001e858b87623d",
                                "0000255bee4932ac",
                                "00002fe981df121a",
                                "0000df3687641546",
                                "00005741526d0832",
                                "0000b6ff9dff5123",
                                "00003ef8b2e2f63c",
                                "00000df0ccb3ae22",
                                "0000450f83b05de4"
                            ],
                            "global_event_sequence_number": 0,
                            "duration": {
                                "min": 213.0,
                                "max": 419.0,
                                "mean": 267.46666666666664,
                                "stddev": 51.0851763048268,
                                "first_quartile": 236.0,
                                "median": 257.0,
                                "third_quartile": 282.5,
                                "95th_percentile": 344.7999999999999,
                                "99th_percentile": 404.1599999999999
                            },
                            "request_size": {
                                "min": 0.0,
                                "max": 0.0,
                                "mean": 0.0,
                                "stddev": 0.0,
                                "first_quartile": 0.0,
                                "median": 0.0,
                                "third_quartile": 0.0,
                                "95th_percentile": 0.0,
                                "99th_percentile": 0.0
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
                            "event_count": 16,
                            "error_count": 0,
                            "timeout_count": 0,
                            "avg_timeout_seconds": null,
                            "retry_count": 0
                        }
                    ]
                },
                {
                    "service": "10.177.1.186",
                    "events": [
                        {
                            "type": "process_request",
                            "interlocutor": "ingress",
                            "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                            "trace_ids": [
                                "00009581c75f8bd3",
                                "000036e2b49ee0e5",
                                "0000d70ba480098e",
                                "00009555ab43bf09",
                                "000047b263485e93",
                                "0000c4ccb6c1529c",
                                "000070ca7ca0fb4f",
                                "00001e858b87623d",
                                "0000255bee4932ac",
                                "00002fe981df121a",
                                "0000df3687641546",
                                "00005741526d0832",
                                "0000b6ff9dff5123",
                                "00003ef8b2e2f63c",
                                "00000df0ccb3ae22"
                            ],
                            "global_event_sequence_number": 1,
                            "duration": {
                                "min": 7619.0,
                                "max": 67185.0,
                                "mean": 14334.866666666667,
                                "stddev": 16881.740765296294,
                                "first_quartile": 7884.0,
                                "median": 8129.0,
                                "third_quartile": 8889.0,
                                "95th_percentile": 48805.799999999974,
                                "99th_percentile": 63509.15999999999
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
                            "event_count": 15,
                            "error_count": 0,
                            "timeout_count": 0,
                            "avg_timeout_seconds": null,
                            "retry_count": 0
                        },
                        {
                            "type": "send_request",
                            "interlocutor": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                            "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                            "trace_ids": [
                                "00009581c75f8bd3",
                                "000036e2b49ee0e5",
                                "0000d70ba480098e",
                                "00009555ab43bf09",
                                "000047b263485e93",
                                "0000c4ccb6c1529c",
                                "000070ca7ca0fb4f",
                                "00001e858b87623d",
                                "0000255bee4932ac",
                                "00002fe981df121a",
                                "0000df3687641546",
                                "00005741526d0832",
                                "0000b6ff9dff5123",
                                "00003ef8b2e2f63c",
                                "00000df0ccb3ae22"
                            ],
                            "global_event_sequence_number": 2,
                            "duration": {
                                "min": 65.0,
                                "max": 941.0,
                                "mean": 233.46666666666667,
                                "stddev": 210.3442303418262,
                                "first_quartile": 126.5,
                                "median": 178.0,
                                "third_quartile": 239.5,
                                "95th_percentile": 537.0999999999993,
                                "99th_percentile": 860.2199999999996
                            },
                            "request_size": {
                                "min": 40.0,
                                "max": 40.0,
                                "mean": 40.0,
                                "stddev": 0.0,
                                "first_quartile": 40.0,
                                "median": 40.0,
                                "third_quartile": 40.0,
                                "95th_percentile": 40.0,
                                "99th_percentile": 40.0
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
                            "event_count": 15,
                            "error_count": 0,
                            "timeout_count": 0,
                            "avg_timeout_seconds": null,
                            "retry_count": 0
                        },
                        {
                            "type": "process_response",
                            "interlocutor": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                            "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                            "trace_ids": [
                                "00009581c75f8bd3",
                                "000036e2b49ee0e5",
                                "0000d70ba480098e",
                                "00009555ab43bf09",
                                "000047b263485e93",
                                "0000c4ccb6c1529c",
                                "000070ca7ca0fb4f",
                                "00001e858b87623d",
                                "0000255bee4932ac",
                                "00002fe981df121a",
                                "0000df3687641546",
                                "00005741526d0832",
                                "0000b6ff9dff5123",
                                "00003ef8b2e2f63c",
                                "00000df0ccb3ae22"
                            ],
                            "global_event_sequence_number": 5,
                            "duration": {
                                "min": 662.0,
                                "max": 2034.0,
                                "mean": 930.7333333333333,
                                "stddev": 363.94671247836476,
                                "first_quartile": 720.5,
                                "median": 834.0,
                                "third_quartile": 934.0,
                                "95th_percentile": 1636.3999999999996,
                                "99th_percentile": 1954.4799999999998
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
                            "event_count": 15,
                            "error_count": 0,
                            "timeout_count": 0,
                            "avg_timeout_seconds": null,
                            "retry_count": 0
                        },
                        {
                            "type": "send_response",
                            "interlocutor": "ingress",
                            "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                            "trace_ids": [
                                "00009581c75f8bd3",
                                "000036e2b49ee0e5",
                                "0000d70ba480098e",
                                "00009555ab43bf09",
                                "000047b263485e93",
                                "0000c4ccb6c1529c",
                                "000070ca7ca0fb4f",
                                "00001e858b87623d",
                                "0000255bee4932ac",
                                "00002fe981df121a",
                                "0000df3687641546",
                                "00005741526d0832",
                                "0000b6ff9dff5123",
                                "00003ef8b2e2f63c",
                                "00000df0ccb3ae22"
                            ],
                            "global_event_sequence_number": 6,
                            "duration": {
                                "min": 214.0,
                                "max": 419.0,
                                "mean": 267.8,
                                "stddev": 51.08564237770587,
                                "first_quartile": 236.0,
                                "median": 258.0,
                                "third_quartile": 283.5,
                                "95th_percentile": 344.7999999999999,
                                "99th_percentile": 404.1599999999999
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
                                "min": 891.0,
                                "max": 943.0,
                                "mean": 898.3333333333334,
                                "stddev": 18.152790681429934,
                                "first_quartile": 891.0,
                                "median": 891.0,
                                "third_quartile": 893.0,
                                "95th_percentile": 943.0,
                                "99th_percentile": 943.0
                            },
                            "event_count": 15,
                            "error_count": 0,
                            "timeout_count": 0,
                            "avg_timeout_seconds": null,
                            "retry_count": 0
                        }
                    ]
                },
                {
                    "service": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "events": [
                        {
                            "type": "process_request",
                            "interlocutor": "10.177.1.186",
                            "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                            "trace_ids": [
                                "00009581c75f8bd3",
                                "000036e2b49ee0e5",
                                "0000d70ba480098e",
                                "00009555ab43bf09",
                                "000047b263485e93",
                                "0000c4ccb6c1529c",
                                "000070ca7ca0fb4f",
                                "00001e858b87623d",
                                "0000255bee4932ac",
                                "00002fe981df121a",
                                "0000df3687641546",
                                "00005741526d0832",
                                "0000b6ff9dff5123",
                                "00003ef8b2e2f63c",
                                "0000450f83b05de4"
                            ],
                            "global_event_sequence_number": 3,
                            "duration": {
                                "min": 5584.0,
                                "max": 11394.0,
                                "mean": 7153.466666666666,
                                "stddev": 1864.718127556574,
                                "first_quartile": 6102.0,
                                "median": 6289.0,
                                "third_quartile": 7476.0,
                                "95th_percentile": 11152.5,
                                "99th_percentile": 11345.699999999999
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
                            "event_count": 15,
                            "error_count": 0,
                            "timeout_count": 0,
                            "avg_timeout_seconds": null,
                            "retry_count": 0
                        },
                        {
                            "type": "send_response",
                            "interlocutor": "10.177.1.186",
                            "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                            "trace_ids": [
                                "00009581c75f8bd3",
                                "000036e2b49ee0e5",
                                "0000d70ba480098e",
                                "00009555ab43bf09",
                                "000047b263485e93",
                                "0000c4ccb6c1529c",
                                "000070ca7ca0fb4f",
                                "00001e858b87623d",
                                "0000255bee4932ac",
                                "00002fe981df121a",
                                "0000df3687641546",
                                "00005741526d0832",
                                "0000b6ff9dff5123",
                                "00003ef8b2e2f63c",
                                "0000450f83b05de4"
                            ],
                            "global_event_sequence_number": 4,
                            "duration": {
                                "min": 66.0,
                                "max": 942.0,
                                "mean": 234.0,
                                "stddev": 210.3918113561321,
                                "first_quartile": 127.5,
                                "median": 179.0,
                                "third_quartile": 240.0,
                                "95th_percentile": 537.3999999999994,
                                "99th_percentile": 861.0799999999997
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
                                "min": 3165.0,
                                "max": 3312.0,
                                "mean": 3260.3333333333335,
                                "stddev": 42.87634490463188,
                                "first_quartile": 3272.0,
                                "median": 3272.0,
                                "third_quartile": 3272.0,
                                "95th_percentile": 3312.0,
                                "99th_percentile": 3312.0
                            },
                            "event_count": 15,
                            "error_count": 0,
                            "timeout_count": 0,
                            "avg_timeout_seconds": null,
                            "retry_count": 0
                        },
                        {
                            "type": "process_request",
                            "interlocutor": "172.30.85.185",
                            "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                            "trace_ids": [
                                "00000df0ccb3ae22"
                            ],
                            "global_event_sequence_number": 2,
                            "duration": {
                                "min": 14814.0,
                                "max": 14814.0,
                                "mean": 14814.0,
                                "stddev": null,
                                "first_quartile": 14814.0,
                                "median": 14814.0,
                                "third_quartile": 14814.0,
                                "95th_percentile": 14814.0,
                                "99th_percentile": 14814.0
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
                            "interlocutor": "172.30.85.185",
                            "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                            "trace_ids": [
                                "00000df0ccb3ae22"
                            ],
                            "global_event_sequence_number": 3,
                            "duration": {
                                "min": 1094.0,
                                "max": 1094.0,
                                "mean": 1094.0,
                                "stddev": null,
                                "first_quartile": 1094.0,
                                "median": 1094.0,
                                "third_quartile": 1094.0,
                                "95th_percentile": 1094.0,
                                "99th_percentile": 1094.0
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
                                "min": 3165.0,
                                "max": 3165.0,
                                "mean": 3165.0,
                                "stddev": null,
                                "first_quartile": 3165.0,
                                "median": 3165.0,
                                "third_quartile": 3165.0,
                                "95th_percentile": 3165.0,
                                "99th_percentile": 3165.0
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
                    "service": "172.30.85.185",
                    "events": [
                        {
                            "type": "send_request",
                            "interlocutor": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                            "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                            "trace_ids": [
                                "00009581c75f8bd3"
                            ],
                            "global_event_sequence_number": 1,
                            "duration": {
                                "min": 1094.0,
                                "max": 1094.0,
                                "mean": 1094.0,
                                "stddev": null,
                                "first_quartile": 1094.0,
                                "median": 1094.0,
                                "third_quartile": 1094.0,
                                "95th_percentile": 1094.0,
                                "99th_percentile": 1094.0
                            },
                            "request_size": {
                                "min": 40.0,
                                "max": 40.0,
                                "mean": 40.0,
                                "stddev": null,
                                "first_quartile": 40.0,
                                "median": 40.0,
                                "third_quartile": 40.0,
                                "95th_percentile": 40.0,
                                "99th_percentile": 40.0
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
                        }
                    ]
                }
            ]
        },
        {
            "root_request": "GET ingress/v1/models/training-OtCjpRhzR/trained_model",
            "trace_ids": [
                "00001a6fdf0267c9"
            ],
            "cluster_stats": [
                {
                    "service": "ingress",
                    "events": [
                        {
                            "type": "send_request",
                            "interlocutor": "10.177.1.186",
                            "request": "GET /v1/models/training-OtCjpRhzR/trained_model?version=2017-02-13",
                            "trace_ids": [
                                "00001a6fdf0267c9"
                            ],
                            "global_event_sequence_number": 0,
                            "duration": {
                                "min": 417.0,
                                "max": 417.0,
                                "mean": 417.0,
                                "stddev": null,
                                "first_quartile": 417.0,
                                "median": 417.0,
                                "third_quartile": 417.0,
                                "95th_percentile": 417.0,
                                "99th_percentile": 417.0
                            },
                            "request_size": {
                                "min": 0.0,
                                "max": 0.0,
                                "mean": 0.0,
                                "stddev": null,
                                "first_quartile": 0.0,
                                "median": 0.0,
                                "third_quartile": 0.0,
                                "95th_percentile": 0.0,
                                "99th_percentile": 0.0
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
                        }
                    ]
                },
                {
                    "service": "10.177.1.186",
                    "events": [
                        {
                            "type": "process_request",
                            "interlocutor": "ingress",
                            "request": "GET /v1/models/training-OtCjpRhzR/trained_model?version=2017-02-13",
                            "trace_ids": [
                                "00001a6fdf0267c9"
                            ],
                            "global_event_sequence_number": 1,
                            "duration": {
                                "min": 11799.0,
                                "max": 11799.0,
                                "mean": 11799.0,
                                "stddev": null,
                                "first_quartile": 11799.0,
                                "median": 11799.0,
                                "third_quartile": 11799.0,
                                "95th_percentile": 11799.0,
                                "99th_percentile": 11799.0
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
                            "type": "send_request",
                            "interlocutor": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                            "request": "POST /grpc.trainer.v2.Trainer/GetTrainedModel",
                            "trace_ids": [
                                "00001a6fdf0267c9"
                            ],
                            "global_event_sequence_number": 2,
                            "duration": {
                                "min": 13334.0,
                                "max": 13334.0,
                                "mean": 13334.0,
                                "stddev": null,
                                "first_quartile": 13334.0,
                                "median": 13334.0,
                                "third_quartile": 13334.0,
                                "95th_percentile": 13334.0,
                                "99th_percentile": 13334.0
                            },
                            "request_size": {
                                "min": 40.0,
                                "max": 40.0,
                                "mean": 40.0,
                                "stddev": null,
                                "first_quartile": 40.0,
                                "median": 40.0,
                                "third_quartile": 40.0,
                                "95th_percentile": 40.0,
                                "99th_percentile": 40.0
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
                            "type": "process_response",
                            "interlocutor": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                            "request": "POST /grpc.trainer.v2.Trainer/GetTrainedModel",
                            "trace_ids": [
                                "00001a6fdf0267c9"
                            ],
                            "global_event_sequence_number": 5,
                            "duration": {
                                "min": 1447.0,
                                "max": 1447.0,
                                "mean": 1447.0,
                                "stddev": null,
                                "first_quartile": 1447.0,
                                "median": 1447.0,
                                "third_quartile": 1447.0,
                                "95th_percentile": 1447.0,
                                "99th_percentile": 1447.0
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
                            "interlocutor": "ingress",
                            "request": "GET /v1/models/training-OtCjpRhzR/trained_model?version=2017-02-13",
                            "trace_ids": [
                                "00001a6fdf0267c9"
                            ],
                            "global_event_sequence_number": 6,
                            "duration": {
                                "min": 418.0,
                                "max": 418.0,
                                "mean": 418.0,
                                "stddev": null,
                                "first_quartile": 418.0,
                                "median": 418.0,
                                "third_quartile": 418.0,
                                "95th_percentile": 418.0,
                                "99th_percentile": 418.0
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
                                "min": 13203229.0,
                                "max": 13203229.0,
                                "mean": 13203229.0,
                                "stddev": null,
                                "first_quartile": 13203229.0,
                                "median": 13203229.0,
                                "third_quartile": 13203229.0,
                                "95th_percentile": 13203229.0,
                                "99th_percentile": 13203229.0
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
                    "service": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "events": [
                        {
                            "type": "process_request",
                            "interlocutor": "10.177.1.186",
                            "request": "POST /grpc.trainer.v2.Trainer/GetTrainedModel",
                            "trace_ids": [
                                "00001a6fdf0267c9"
                            ],
                            "global_event_sequence_number": 3,
                            "duration": {
                                "min": 6002546.0,
                                "max": 6002546.0,
                                "mean": 6002546.0,
                                "stddev": null,
                                "first_quartile": 6002546.0,
                                "median": 6002546.0,
                                "third_quartile": 6002546.0,
                                "95th_percentile": 6002546.0,
                                "99th_percentile": 6002546.0
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
                            "interlocutor": "10.177.1.186",
                            "request": "POST /grpc.trainer.v2.Trainer/GetTrainedModel",
                            "trace_ids": [
                                "00001a6fdf0267c9"
                            ],
                            "global_event_sequence_number": 4,
                            "duration": {
                                "min": 13335.0,
                                "max": 13335.0,
                                "mean": 13335.0,
                                "stddev": null,
                                "first_quartile": 13335.0,
                                "median": 13335.0,
                                "third_quartile": 13335.0,
                                "95th_percentile": 13335.0,
                                "99th_percentile": 13335.0
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
                                "min": 13229021.0,
                                "max": 13229021.0,
                                "mean": 13229021.0,
                                "stddev": null,
                                "first_quartile": 13229021.0,
                                "median": 13229021.0,
                                "third_quartile": 13229021.0,
                                "95th_percentile": 13229021.0,
                                "99th_percentile": 13229021.0
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
        },
        {
            "root_request": "POST dlaas-lcm.user-kalantar.svc.cluster.local/service.LifecycleManager/KillTrainingJob",
            "trace_ids": [
                "0000d9bf08f60c5b",
                "00001a36fd9423f8"
            ],
            "cluster_stats": [
                {
                    "service": "172.30.85.187",
                    "events": [
                        {
                            "type": "send_request",
                            "interlocutor": "dlaas-lcm.user-kalantar.svc.cluster.local",
                            "request": "POST /service.LifecycleManager/KillTrainingJob",
                            "trace_ids": [
                                "0000d9bf08f60c5b",
                                "00001a36fd9423f8"
                            ],
                            "global_event_sequence_number": 0,
                            "duration": {
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
                            "request_size": {
                                "min": 78.0,
                                "max": 78.0,
                                "mean": 78.0,
                                "stddev": 0.0,
                                "first_quartile": 78.0,
                                "median": 78.0,
                                "third_quartile": 78.0,
                                "95th_percentile": 78.0,
                                "99th_percentile": 78.0
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
                            "event_count": 2,
                            "error_count": 0,
                            "timeout_count": 2,
                            "avg_timeout_seconds": 0.16,
                            "retry_count": 0
                        }
                    ]
                }
            ]
        },
        {
            "root_request": "POST dlaas-trainer-v2.user-kalantar.svc.cluster.local/grpc.trainer.v2.Trainer/UpdateTrainingJob",
            "trace_ids": [
                "0000fa80a846f34a",
                "0000af1500da7470"
            ],
            "cluster_stats": [
                {
                    "service": "172.30.174.235",
                    "events": [
                        {
                            "type": "send_request",
                            "interlocutor": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                            "request": "POST /grpc.trainer.v2.Trainer/UpdateTrainingJob",
                            "trace_ids": [
                                "0000fa80a846f34a",
                                "0000af1500da7470"
                            ],
                            "global_event_sequence_number": 0,
                            "duration": {
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
                            "request_size": {
                                "min": 65.0,
                                "max": 65.0,
                                "mean": 65.0,
                                "stddev": 0.0,
                                "first_quartile": 65.0,
                                "median": 65.0,
                                "third_quartile": 65.0,
                                "95th_percentile": 65.0,
                                "99th_percentile": 65.0
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
                            "event_count": 2,
                            "error_count": 0,
                            "timeout_count": 0,
                            "avg_timeout_seconds": null,
                            "retry_count": 0
                        }
                    ]
                }
            ]
        },
        {
            "root_request": "POST dlaas-lcm.user-kalantar.svc.cluster.local/service.LifecycleManager/GetMetrics",
            "trace_ids": [
                "0000a07ab594d483",
                "0000342e3eaddc21",
                "000090c6a35b8571",
                "00001756155eb039",
                "000044afd1c644b2",
                "0000dda10b6fd899"
            ],
            "cluster_stats": [
                {
                    "service": "172.30.85.187",
                    "events": [
                        {
                            "type": "send_request",
                            "interlocutor": "dlaas-lcm.user-kalantar.svc.cluster.local",
                            "request": "POST /service.LifecycleManager/GetMetrics",
                            "trace_ids": [
                                "0000a07ab594d483",
                                "0000342e3eaddc21",
                                "000090c6a35b8571",
                                "00001756155eb039",
                                "000044afd1c644b2",
                                "0000dda10b6fd899"
                            ],
                            "global_event_sequence_number": 0,
                            "duration": {
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
                            "request_size": {
                                "min": 25.0,
                                "max": 25.0,
                                "mean": 25.0,
                                "stddev": 0.0,
                                "first_quartile": 25.0,
                                "median": 25.0,
                                "third_quartile": 25.0,
                                "95th_percentile": 25.0,
                                "99th_percentile": 25.0
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
                            "event_count": 6,
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
