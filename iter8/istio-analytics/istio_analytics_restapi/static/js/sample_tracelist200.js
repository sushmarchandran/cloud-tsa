/*
 * Retrieved with
 * curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ "start_time": "2017-07-01T20:23:13.667Z", "end_time": "2017-07-30T20:23:13.667Z", "max": 200 }' 'http://localhost:5555/api/v1/distributed_tracing/traces' > sample_tracelist.js
 */
var raw_tracelist = {
    "zipkin_url": "http://localhost:9411",
    "trace_list": [
        {
            "trace_id": "00007761db8f5d39",
            "spans": [
                {
                    "span_id": "00007761db8f5d39",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013688546471,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013688551256
                }
            ]
        },
        {
            "trace_id": "0000308feb0bf116",
            "spans": [
                {
                    "span_id": "0000308feb0bf116",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013685253832,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013685258107
                }
            ]
        },
        {
            "trace_id": "00002a13f3cd0895",
            "spans": [
                {
                    "span_id": "00002a13f3cd0895",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013678546610,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013678551908
                }
            ]
        },
        {
            "trace_id": "000086c6ff7c216c",
            "spans": [
                {
                    "span_id": "000086c6ff7c216c",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013675253777,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013675258011
                }
            ]
        },
        {
            "trace_id": "0000bd96994905fa",
            "spans": [
                {
                    "span_id": "0000bd96994905fa",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013668546343,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013668550458
                }
            ]
        },
        {
            "trace_id": "000037374fd8e205",
            "spans": [
                {
                    "span_id": "000037374fd8e205",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013665253886,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013665261214
                }
            ]
        },
        {
            "trace_id": "00000fa8e1e0eef1",
            "spans": [
                {
                    "span_id": "00000fa8e1e0eef1",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013658546492,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013658551030
                }
            ]
        },
        {
            "trace_id": "0000097ba9824245",
            "spans": [
                {
                    "span_id": "0000097ba9824245",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013655253957,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013655258013
                }
            ]
        },
        {
            "trace_id": "0000e0d6c9fb1dca",
            "spans": [
                {
                    "span_id": "0000e0d6c9fb1dca",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013648546500,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013648551186
                }
            ]
        },
        {
            "trace_id": "00007905cf270d1d",
            "spans": [
                {
                    "span_id": "00007905cf270d1d",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013645253781,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013645257965
                }
            ]
        },
        {
            "trace_id": "0000bff13d37c08a",
            "spans": [
                {
                    "span_id": "0000bff13d37c08a",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013638546326,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013638550677
                }
            ]
        },
        {
            "trace_id": "00002736d1a03796",
            "spans": [
                {
                    "span_id": "00002736d1a03796",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013635254040,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013635258416
                }
            ]
        },
        {
            "trace_id": "0000f25ccb38e349",
            "spans": [
                {
                    "span_id": "0000f25ccb38e349",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013628546562,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013628550532
                }
            ]
        },
        {
            "trace_id": "0000a246c6d88b50",
            "spans": [
                {
                    "span_id": "0000a246c6d88b50",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013625254006,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013625258209
                }
            ]
        },
        {
            "trace_id": "00007e70f9bd4a1a",
            "spans": [
                {
                    "span_id": "00007e70f9bd4a1a",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013618546556,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013618550660
                }
            ]
        },
        {
            "trace_id": "00009d0988d5a29a",
            "spans": [
                {
                    "span_id": "00009d0988d5a29a",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013615253793,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013615258610
                }
            ]
        },
        {
            "trace_id": "0000f786a5e03732",
            "spans": [
                {
                    "span_id": "0000f786a5e03732",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013608546581,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013608551038
                }
            ]
        },
        {
            "trace_id": "00003608a6ff869e",
            "spans": [
                {
                    "span_id": "00003608a6ff869e",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013605254047,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013605258640
                }
            ]
        },
        {
            "trace_id": "0000b787d6ff4fd7",
            "spans": [
                {
                    "span_id": "0000b787d6ff4fd7",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013598546374,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013598550882
                }
            ]
        },
        {
            "trace_id": "0000c2013928e4c8",
            "spans": [
                {
                    "span_id": "0000c2013928e4c8",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013595254037,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013595258972
                }
            ]
        },
        {
            "trace_id": "00006a8f7b972aff",
            "spans": [
                {
                    "span_id": "00006a8f7b972aff",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013588546641,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013588554310
                }
            ]
        },
        {
            "trace_id": "0000405ba8a15c29",
            "spans": [
                {
                    "span_id": "0000405ba8a15c29",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013585253784,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013585257844
                }
            ]
        },
        {
            "trace_id": "0000e97226ea7d76",
            "spans": [
                {
                    "span_id": "0000e97226ea7d76",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013578546489,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013578550968
                }
            ]
        },
        {
            "trace_id": "00008d4dbba72512",
            "spans": [
                {
                    "span_id": "00008d4dbba72512",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013575253851,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013575258095
                }
            ]
        },
        {
            "trace_id": "0000a3f0c917eb45",
            "spans": [
                {
                    "span_id": "0000a3f0c917eb45",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013568548187,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013568553104
                }
            ]
        },
        {
            "trace_id": "0000bbcd2152f7c2",
            "spans": [
                {
                    "span_id": "0000bbcd2152f7c2",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013565253966,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013565258977
                }
            ]
        },
        {
            "trace_id": "0000befc219ba023",
            "spans": [
                {
                    "span_id": "0000befc219ba023",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013558546581,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013558553553
                }
            ]
        },
        {
            "trace_id": "000098eae338555f",
            "spans": [
                {
                    "span_id": "000098eae338555f",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013555253792,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013555258216
                }
            ]
        },
        {
            "trace_id": "00002f1c589a42aa",
            "spans": [
                {
                    "span_id": "00002f1c589a42aa",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013548546715,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013548552178
                }
            ]
        },
        {
            "trace_id": "0000ab089e59dd19",
            "spans": [
                {
                    "span_id": "0000ab089e59dd19",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013545253857,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013545257988
                }
            ]
        },
        {
            "trace_id": "00003f80e6860107",
            "spans": [
                {
                    "span_id": "00003f80e6860107",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013538546523,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013538554737
                }
            ]
        },
        {
            "trace_id": "000050e1ef43f94e",
            "spans": [
                {
                    "span_id": "000050e1ef43f94e",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013535253946,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013535258247
                }
            ]
        },
        {
            "trace_id": "0000ad6675a106df",
            "spans": [
                {
                    "span_id": "0000ad6675a106df",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013528546416,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013528550694
                }
            ]
        },
        {
            "trace_id": "0000cf82bd1b6e98",
            "spans": [
                {
                    "span_id": "0000cf82bd1b6e98",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013525254028,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013525258059
                }
            ]
        },
        {
            "trace_id": "0000a7b51e8b761d",
            "spans": [
                {
                    "span_id": "0000a7b51e8b761d",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013518546644,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013518551661
                }
            ]
        },
        {
            "trace_id": "0000f2c43c629c56",
            "spans": [
                {
                    "span_id": "0000f2c43c629c56",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013515254027,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013515258387
                }
            ]
        },
        {
            "trace_id": "00007eb79b4423c4",
            "spans": [
                {
                    "span_id": "00007eb79b4423c4",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013508548240,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013508552665
                }
            ]
        },
        {
            "trace_id": "00008e2839b50b98",
            "spans": [
                {
                    "span_id": "00008e2839b50b98",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013505253952,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013505258138
                }
            ]
        },
        {
            "trace_id": "000057a20f33ac6f",
            "spans": [
                {
                    "span_id": "000057a20f33ac6f",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013498546729,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013498554739
                }
            ]
        },
        {
            "trace_id": "00001f8e4c1bb2f9",
            "spans": [
                {
                    "span_id": "00001f8e4c1bb2f9",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013495254043,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013495260976
                }
            ]
        },
        {
            "trace_id": "00009753e1c1d28b",
            "spans": [
                {
                    "span_id": "00009753e1c1d28b",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013488546480,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013488554720
                }
            ]
        },
        {
            "trace_id": "0000dfd4ef06271a",
            "spans": [
                {
                    "span_id": "0000dfd4ef06271a",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013485253950,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013485258397
                }
            ]
        },
        {
            "trace_id": "00001965daed3ddd",
            "spans": [
                {
                    "span_id": "00001965daed3ddd",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013478546535,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013478551368
                }
            ]
        },
        {
            "trace_id": "0000e1a7418a4823",
            "spans": [
                {
                    "span_id": "0000e1a7418a4823",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013475254036,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013475261984
                }
            ]
        },
        {
            "trace_id": "0000dd4806615b6d",
            "spans": [
                {
                    "span_id": "0000dd4806615b6d",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013468546614,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013468555148
                }
            ]
        },
        {
            "trace_id": "0000c28efe3f4890",
            "spans": [
                {
                    "span_id": "0000c28efe3f4890",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013465253990,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013465258204
                }
            ]
        },
        {
            "trace_id": "000034199af4b0dc",
            "spans": [
                {
                    "span_id": "000034199af4b0dc",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013458546239,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013458550078
                }
            ]
        },
        {
            "trace_id": "00001e7760731109",
            "spans": [
                {
                    "span_id": "00001e7760731109",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "DELETE /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 34,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013458515453,
                    "sr": 1501013458515693,
                    "ss": 1501013458604895,
                    "cr": 1501013458605135
                },
                {
                    "span_id": "000000fc0d67a0e5",
                    "parent_span_id": "00001e7760731109",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/DeleteTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 43,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013458522975,
                    "sr": 1501013458523182,
                    "ss": 1501013458603952,
                    "cr": 1501013458604160
                },
                {
                    "span_id": "0000be4ed42073d9",
                    "parent_span_id": "000000fc0d67a0e5",
                    "source_ip": "172.30.174.235",
                    "source_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "target_ip": "172.30.85.187",
                    "target_name": "dlaas-lcm.user-kalantar.svc.cluster.local",
                    "request": "POST /service.LifecycleManager/KillTrainingJob",
                    "request_size": 78,
                    "protocol": "HTTP/2",
                    "response_size": 5,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013458548383,
                    "sr": 1501013458549159,
                    "ss": 1501013458601237,
                    "cr": 1501013458602013
                }
            ]
        },
        {
            "trace_id": "00009581c75f8bd3",
            "spans": [
                {
                    "span_id": "00009581c75f8bd3",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 943,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013458444514,
                    "sr": 1501013458444743,
                    "ss": 1501013458460324,
                    "cr": 1501013458460553
                },
                {
                    "span_id": "0000e57be80acbf2",
                    "parent_span_id": "00009581c75f8bd3",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3312,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013458452719,
                    "sr": 1501013458452838,
                    "ss": 1501013458459443,
                    "cr": 1501013458459563
                }
            ]
        },
        {
            "trace_id": "00003d30f5ff7ab6",
            "spans": [
                {
                    "span_id": "00003d30f5ff7ab6",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013455254048,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013455258954
                }
            ]
        },
        {
            "trace_id": "0000a0e7df4beb53",
            "spans": [
                {
                    "span_id": "0000a0e7df4beb53",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013448551806,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013448556908
                }
            ]
        },
        {
            "trace_id": "00001c3018825b63",
            "spans": [
                {
                    "span_id": "00001c3018825b63",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013445276801,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013445284799
                }
            ]
        },
        {
            "trace_id": "000085356352d9a4",
            "spans": [
                {
                    "span_id": "000085356352d9a4",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013438546433,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013438554075
                }
            ]
        },
        {
            "trace_id": "000041f402f77e05",
            "spans": [
                {
                    "span_id": "000041f402f77e05",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013435253937,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013435258520
                }
            ]
        },
        {
            "trace_id": "00005684cdfee7bf",
            "spans": [
                {
                    "span_id": "00005684cdfee7bf",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013428546499,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013428551790
                }
            ]
        },
        {
            "trace_id": "000099a6338231bc",
            "spans": [
                {
                    "span_id": "000099a6338231bc",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013425255046,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013425262248
                }
            ]
        },
        {
            "trace_id": "00001a6fdf0267c9",
            "spans": [
                {
                    "span_id": "00001a6fdf0267c9",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR/trained_model?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 13203229,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013421341395,
                    "sr": 1501013421341812,
                    "ss": 1501013427384273,
                    "cr": 1501013427384691
                },
                {
                    "span_id": "000060f9360fc118",
                    "parent_span_id": "00001a6fdf0267c9",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainedModel",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 13229021,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013421353611,
                    "sr": 1501013421366945,
                    "ss": 1501013427369491,
                    "cr": 1501013427382826
                }
            ]
        },
        {
            "trace_id": "00000e2dfb3918b2",
            "spans": [
                {
                    "span_id": "00000e2dfb3918b2",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013418546724,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013418555793
                }
            ]
        },
        {
            "trace_id": "000036e2b49ee0e5",
            "spans": [
                {
                    "span_id": "000036e2b49ee0e5",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 943,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013416255591,
                    "sr": 1501013416255804,
                    "ss": 1501013416278907,
                    "cr": 1501013416279121
                },
                {
                    "span_id": "000016a31ac0ac62",
                    "parent_span_id": "000036e2b49ee0e5",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3312,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013416263596,
                    "sr": 1501013416264537,
                    "ss": 1501013416275931,
                    "cr": 1501013416276873
                }
            ]
        },
        {
            "trace_id": "0000a6da5061208f",
            "spans": [
                {
                    "span_id": "0000a6da5061208f",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013415253820,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013415260497
                }
            ]
        },
        {
            "trace_id": "0000d9bf08f60c5b",
            "spans": [
                {
                    "span_id": "0000d9bf08f60c5b",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.187",
                    "source_name": "172.30.85.187",
                    "target_ip": null,
                    "target_name": "dlaas-lcm.user-kalantar.svc.cluster.local",
                    "request": "POST /service.LifecycleManager/KillTrainingJob",
                    "request_size": 78,
                    "protocol": "HTTP/2",
                    "response_size": 0,
                    "response_code": 0,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013414452793,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013414636184
                }
            ]
        },
        {
            "trace_id": "0000d70ba480098e",
            "spans": [
                {
                    "span_id": "0000d70ba480098e",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 891,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013411176971,
                    "sr": 1501013411177228,
                    "ss": 1501013411197991,
                    "cr": 1501013411198249
                },
                {
                    "span_id": "00002f350938d70d",
                    "parent_span_id": "0000d70ba480098e",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3272,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013411185526,
                    "sr": 1501013411185794,
                    "ss": 1501013411196843,
                    "cr": 1501013411197111
                }
            ]
        },
        {
            "trace_id": "00009bce18e4e148",
            "spans": [
                {
                    "span_id": "00009bce18e4e148",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013408546571,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013408554351
                }
            ]
        },
        {
            "trace_id": "00009555ab43bf09",
            "spans": [
                {
                    "span_id": "00009555ab43bf09",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 891,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013406105270,
                    "sr": 1501013406105542,
                    "ss": 1501013406121302,
                    "cr": 1501013406121575
                },
                {
                    "span_id": "00006f250824af52",
                    "parent_span_id": "00009555ab43bf09",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3272,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013406113877,
                    "sr": 1501013406114011,
                    "ss": 1501013406120448,
                    "cr": 1501013406120583
                }
            ]
        },
        {
            "trace_id": "0000ab86f5388f9e",
            "spans": [
                {
                    "span_id": "0000ab86f5388f9e",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013405253915,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013405257956
                }
            ]
        },
        {
            "trace_id": "000047b263485e93",
            "spans": [
                {
                    "span_id": "000047b263485e93",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 891,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013401026307,
                    "sr": 1501013401026620,
                    "ss": 1501013401045888,
                    "cr": 1501013401046201
                },
                {
                    "span_id": "00008d0523838896",
                    "parent_span_id": "000047b263485e93",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3272,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013401036153,
                    "sr": 1501013401036353,
                    "ss": 1501013401044700,
                    "cr": 1501013401044900
                }
            ]
        },
        {
            "trace_id": "00004c43a79428d2",
            "spans": [
                {
                    "span_id": "00004c43a79428d2",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013398546516,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013398551280
                }
            ]
        },
        {
            "trace_id": "0000c4ccb6c1529c",
            "spans": [
                {
                    "span_id": "0000c4ccb6c1529c",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 891,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013395789150,
                    "sr": 1501013395789443,
                    "ss": 1501013395863652,
                    "cr": 1501013395863946
                },
                {
                    "span_id": "0000f389e7eecc08",
                    "parent_span_id": "0000c4ccb6c1529c",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3272,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013395856628,
                    "sr": 1501013395856856,
                    "ss": 1501013395862440,
                    "cr": 1501013395862669
                }
            ]
        },
        {
            "trace_id": "00003081d95a7842",
            "spans": [
                {
                    "span_id": "00003081d95a7842",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013395253950,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013395260912
                }
            ]
        },
        {
            "trace_id": "000070ca7ca0fb4f",
            "spans": [
                {
                    "span_id": "000070ca7ca0fb4f",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 891,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013390722305,
                    "sr": 1501013390722558,
                    "ss": 1501013390738812,
                    "cr": 1501013390739065
                },
                {
                    "span_id": "0000ba5b020fcfc7",
                    "parent_span_id": "000070ca7ca0fb4f",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3272,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013390731233,
                    "sr": 1501013390731396,
                    "ss": 1501013390737815,
                    "cr": 1501013390737978
                }
            ]
        },
        {
            "trace_id": "000073d7ce2debd4",
            "spans": [
                {
                    "span_id": "000073d7ce2debd4",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013388547625,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013388552554
                }
            ]
        },
        {
            "trace_id": "0000fa80a846f34a",
            "spans": [
                {
                    "span_id": "0000fa80a846f34a",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.235",
                    "source_name": "172.30.174.235",
                    "target_ip": null,
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/UpdateTrainingJob",
                    "request_size": 65,
                    "protocol": "HTTP/2",
                    "response_size": 25,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013386098456,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013386104933
                }
            ]
        },
        {
            "trace_id": "00007ad741aa4632",
            "spans": [
                {
                    "span_id": "00007ad741aa4632",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013385253822,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013385257777
                }
            ]
        },
        {
            "trace_id": "00001e858b87623d",
            "spans": [
                {
                    "span_id": "00001e858b87623d",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 891,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013380050369,
                    "sr": 1501013380050615,
                    "ss": 1501013380065435,
                    "cr": 1501013380065681
                },
                {
                    "span_id": "00008677af8d6d7d",
                    "parent_span_id": "00001e858b87623d",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3272,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013380058234,
                    "sr": 1501013380058412,
                    "ss": 1501013380064594,
                    "cr": 1501013380064773
                }
            ]
        },
        {
            "trace_id": "0000f29d9985a88e",
            "spans": [
                {
                    "span_id": "0000f29d9985a88e",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013378546527,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013378553331
                }
            ]
        },
        {
            "trace_id": "0000745f5c40c59a",
            "spans": [
                {
                    "span_id": "0000745f5c40c59a",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013375253838,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013375261117
                }
            ]
        },
        {
            "trace_id": "0000255bee4932ac",
            "spans": [
                {
                    "span_id": "0000255bee4932ac",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 891,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013374920204,
                    "sr": 1501013374920447,
                    "ss": 1501013374934962,
                    "cr": 1501013374935205
                },
                {
                    "span_id": "000007252eeb3cc8",
                    "parent_span_id": "0000255bee4932ac",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3272,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013374928123,
                    "sr": 1501013374928280,
                    "ss": 1501013374934083,
                    "cr": 1501013374934240
                }
            ]
        },
        {
            "trace_id": "00002fe981df121a",
            "spans": [
                {
                    "span_id": "00002fe981df121a",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 891,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013369479979,
                    "sr": 1501013369480280,
                    "ss": 1501013369496992,
                    "cr": 1501013369497294
                },
                {
                    "span_id": "0000279985454297",
                    "parent_span_id": "00002fe981df121a",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3272,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013369489383,
                    "sr": 1501013369489627,
                    "ss": 1501013369495863,
                    "cr": 1501013369496107
                }
            ]
        },
        {
            "trace_id": "0000a4c12b456a39",
            "spans": [
                {
                    "span_id": "0000a4c12b456a39",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013368546615,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013368554383
                }
            ]
        },
        {
            "trace_id": "0000a920e19be0b6",
            "spans": [
                {
                    "span_id": "0000a920e19be0b6",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013365254006,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013365257965
                }
            ]
        },
        {
            "trace_id": "0000df3687641546",
            "spans": [
                {
                    "span_id": "0000df3687641546",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 891,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013364406640,
                    "sr": 1501013364406903,
                    "ss": 1501013364424577,
                    "cr": 1501013364424840
                },
                {
                    "span_id": "00007c79918c7b4a",
                    "parent_span_id": "0000df3687641546",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3272,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013364415032,
                    "sr": 1501013364415097,
                    "ss": 1501013364423817,
                    "cr": 1501013364423883
                }
            ]
        },
        {
            "trace_id": "00005741526d0832",
            "spans": [
                {
                    "span_id": "00005741526d0832",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 891,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013359336720,
                    "sr": 1501013359336949,
                    "ss": 1501013359351602,
                    "cr": 1501013359351831
                },
                {
                    "span_id": "00000f331866052a",
                    "parent_span_id": "00005741526d0832",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3272,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013359344584,
                    "sr": 1501013359344684,
                    "ss": 1501013359350738,
                    "cr": 1501013359350838
                }
            ]
        },
        {
            "trace_id": "0000f461b00e6057",
            "spans": [
                {
                    "span_id": "0000f461b00e6057",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013358546518,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013358553782
                }
            ]
        },
        {
            "trace_id": "0000a07ab594d483",
            "spans": [
                {
                    "span_id": "0000a07ab594d483",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.187",
                    "source_name": "172.30.85.187",
                    "target_ip": null,
                    "target_name": "dlaas-lcm.user-kalantar.svc.cluster.local",
                    "request": "POST /service.LifecycleManager/GetMetrics",
                    "request_size": 25,
                    "protocol": "HTTP/2",
                    "response_size": 5,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013357910985,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013357917877
                }
            ]
        },
        {
            "trace_id": "0000342e3eaddc21",
            "spans": [
                {
                    "span_id": "0000342e3eaddc21",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.187",
                    "source_name": "172.30.85.187",
                    "target_ip": null,
                    "target_name": "dlaas-lcm.user-kalantar.svc.cluster.local",
                    "request": "POST /service.LifecycleManager/GetMetrics",
                    "request_size": 25,
                    "protocol": "HTTP/2",
                    "response_size": 5,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013356901483,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013356908551
                }
            ]
        },
        {
            "trace_id": "000090c6a35b8571",
            "spans": [
                {
                    "span_id": "000090c6a35b8571",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.187",
                    "source_name": "172.30.85.187",
                    "target_ip": null,
                    "target_name": "dlaas-lcm.user-kalantar.svc.cluster.local",
                    "request": "POST /service.LifecycleManager/GetMetrics",
                    "request_size": 25,
                    "protocol": "HTTP/2",
                    "response_size": 5,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013355891608,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013355898597
                }
            ]
        },
        {
            "trace_id": "000001520ebf4a8c",
            "spans": [
                {
                    "span_id": "000001520ebf4a8c",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013355253844,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013355261408
                }
            ]
        },
        {
            "trace_id": "00001756155eb039",
            "spans": [
                {
                    "span_id": "00001756155eb039",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.187",
                    "source_name": "172.30.85.187",
                    "target_ip": null,
                    "target_name": "dlaas-lcm.user-kalantar.svc.cluster.local",
                    "request": "POST /service.LifecycleManager/GetMetrics",
                    "request_size": 25,
                    "protocol": "HTTP/2",
                    "response_size": 5,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013354881792,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013354888876
                }
            ]
        },
        {
            "trace_id": "0000b6ff9dff5123",
            "spans": [
                {
                    "span_id": "0000b6ff9dff5123",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013354266825,
                    "sr": 1501013354267087,
                    "ss": 1501013354282939,
                    "cr": 1501013354283201
                },
                {
                    "span_id": "0000d391e5fb0f97",
                    "parent_span_id": "0000b6ff9dff5123",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3231,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013354275191,
                    "sr": 1501013354275555,
                    "ss": 1501013354281705,
                    "cr": 1501013354282069
                }
            ]
        },
        {
            "trace_id": "000044afd1c644b2",
            "spans": [
                {
                    "span_id": "000044afd1c644b2",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.187",
                    "source_name": "172.30.85.187",
                    "target_ip": null,
                    "target_name": "dlaas-lcm.user-kalantar.svc.cluster.local",
                    "request": "POST /service.LifecycleManager/GetMetrics",
                    "request_size": 25,
                    "protocol": "HTTP/2",
                    "response_size": 5,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013353872301,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013353879225
                }
            ]
        },
        {
            "trace_id": "0000dda10b6fd899",
            "spans": [
                {
                    "span_id": "0000dda10b6fd899",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.187",
                    "source_name": "172.30.85.187",
                    "target_ip": null,
                    "target_name": "dlaas-lcm.user-kalantar.svc.cluster.local",
                    "request": "POST /service.LifecycleManager/GetMetrics",
                    "request_size": 25,
                    "protocol": "HTTP/2",
                    "response_size": 5,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013352858089,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013352868941
                }
            ]
        },
        {
            "trace_id": "00003ef8b2e2f63c",
            "spans": [
                {
                    "span_id": "00003ef8b2e2f63c",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013349166159,
                    "sr": 1501013349166578,
                    "ss": 1501013349215477,
                    "cr": 1501013349215896
                },
                {
                    "span_id": "0000969504d07910",
                    "parent_span_id": "00003ef8b2e2f63c",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013349207507,
                    "sr": 1501013349207742,
                    "ss": 1501013349213775,
                    "cr": 1501013349214011
                }
            ]
        },
        {
            "trace_id": "0000b4a038a5c0ae",
            "spans": [
                {
                    "span_id": "0000b4a038a5c0ae",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013348546603,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013348556910
                }
            ]
        },
        {
            "trace_id": "00006826ab682844",
            "spans": [
                {
                    "span_id": "00006826ab682844",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013345253799,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013345260257
                }
            ]
        },
        {
            "trace_id": "00000df0ccb3ae22",
            "spans": [
                {
                    "span_id": "00000df0ccb3ae22",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": null,
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013344084540,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013344112261
                },
                {
                    "span_id": "0000fc2cd6eb3a36",
                    "parent_span_id": "00000df0ccb3ae22",
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013344092985,
                    "sr": 1501013344094079,
                    "ss": 1501013344108893,
                    "cr": 1501013344109987
                }
            ]
        },
        {
            "trace_id": "00001a36fd9423f8",
            "spans": [
                {
                    "span_id": "00001a36fd9423f8",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.187",
                    "source_name": "172.30.85.187",
                    "target_ip": null,
                    "target_name": "dlaas-lcm.user-kalantar.svc.cluster.local",
                    "request": "POST /service.LifecycleManager/KillTrainingJob",
                    "request_size": 78,
                    "protocol": "HTTP/2",
                    "response_size": 0,
                    "response_code": 0,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013342152887,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013342296135
                }
            ]
        },
        {
            "trace_id": "0000450f83b05de4",
            "spans": [
                {
                    "span_id": "0000450f83b05de4",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013338866460,
                    "sr": 1501013338866679,
                    "ss": 1501013338881914,
                    "cr": 1501013338882133
                },
                {
                    "span_id": "00003a16f341bf1b",
                    "parent_span_id": "0000450f83b05de4",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013338874713,
                    "sr": 1501013338874819,
                    "ss": 1501013338881108,
                    "cr": 1501013338881215
                }
            ]
        },
        {
            "trace_id": "0000f55ad8410979",
            "spans": [
                {
                    "span_id": "0000f55ad8410979",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013338546673,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013338551529
                }
            ]
        },
        {
            "trace_id": "000074080710756c",
            "spans": [
                {
                    "span_id": "000074080710756c",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013335253864,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013335257632
                }
            ]
        },
        {
            "trace_id": "0000af1500da7470",
            "spans": [
                {
                    "span_id": "0000af1500da7470",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.235",
                    "source_name": "172.30.174.235",
                    "target_ip": null,
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/UpdateTrainingJob",
                    "request_size": 65,
                    "protocol": "HTTP/2",
                    "response_size": 25,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013329583879,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013329590625
                }
            ]
        },
        {
            "trace_id": "000012c92850d2d2",
            "spans": [
                {
                    "span_id": "000012c92850d2d2",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013328546650,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013328550679
                }
            ]
        },
        {
            "trace_id": "0000366f1a843b1a",
            "spans": [
                {
                    "span_id": "0000366f1a843b1a",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.235",
                    "source_name": "172.30.174.235",
                    "target_ip": null,
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/UpdateTrainingJob",
                    "request_size": 65,
                    "protocol": "HTTP/2",
                    "response_size": 25,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013325583496,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013325589699
                }
            ]
        },
        {
            "trace_id": "0000437c35c2a339",
            "spans": [
                {
                    "span_id": "0000437c35c2a339",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013325253815,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013325261459
                }
            ]
        },
        {
            "trace_id": "000030333d0a90a4",
            "spans": [
                {
                    "span_id": "000030333d0a90a4",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013322987036,
                    "sr": 1501013322987246,
                    "ss": 1501013323001363,
                    "cr": 1501013323001573
                },
                {
                    "span_id": "00002189d65fcd96",
                    "parent_span_id": "000030333d0a90a4",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013322994508,
                    "sr": 1501013322994644,
                    "ss": 1501013323000514,
                    "cr": 1501013323000651
                }
            ]
        },
        {
            "trace_id": "00005ddd4a009e94",
            "spans": [
                {
                    "span_id": "00005ddd4a009e94",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013318546418,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013318550286
                }
            ]
        },
        {
            "trace_id": "0000017a6043ef66",
            "spans": [
                {
                    "span_id": "0000017a6043ef66",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013317917222,
                    "sr": 1501013317917441,
                    "ss": 1501013317937222,
                    "cr": 1501013317937441
                },
                {
                    "span_id": "0000e30bfccb3388",
                    "parent_span_id": "0000017a6043ef66",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013317924901,
                    "sr": 1501013317925098,
                    "ss": 1501013317936238,
                    "cr": 1501013317936435
                }
            ]
        },
        {
            "trace_id": "0000054218a35275",
            "spans": [
                {
                    "span_id": "0000054218a35275",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013315254105,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013315258697
                }
            ]
        },
        {
            "trace_id": "00008a08d196777b",
            "spans": [
                {
                    "span_id": "00008a08d196777b",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.235",
                    "source_name": "172.30.174.235",
                    "target_ip": null,
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/UpdateTrainingJob",
                    "request_size": 65,
                    "protocol": "HTTP/2",
                    "response_size": 25,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013313883817,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013313895593
                }
            ]
        },
        {
            "trace_id": "0000d8644ae28373",
            "spans": [
                {
                    "span_id": "0000d8644ae28373",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013312851558,
                    "sr": 1501013312851770,
                    "ss": 1501013312867095,
                    "cr": 1501013312867308
                },
                {
                    "span_id": "0000e865c17e5ad1",
                    "parent_span_id": "0000d8644ae28373",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013312859878,
                    "sr": 1501013312859997,
                    "ss": 1501013312866285,
                    "cr": 1501013312866404
                }
            ]
        },
        {
            "trace_id": "00006b678b2edf77",
            "spans": [
                {
                    "span_id": "00006b678b2edf77",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013308546447,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013308551092
                }
            ]
        },
        {
            "trace_id": "00006c246a852f66",
            "spans": [
                {
                    "span_id": "00006c246a852f66",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013307776199,
                    "sr": 1501013307776427,
                    "ss": 1501013307795230,
                    "cr": 1501013307795458
                },
                {
                    "span_id": "0000b215367e9cb1",
                    "parent_span_id": "00006c246a852f66",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013307786615,
                    "sr": 1501013307786757,
                    "ss": 1501013307794314,
                    "cr": 1501013307794456
                }
            ]
        },
        {
            "trace_id": "000033bff01b62bc",
            "spans": [
                {
                    "span_id": "000033bff01b62bc",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013305254083,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013305261850
                }
            ]
        },
        {
            "trace_id": "00001987336b9498",
            "spans": [
                {
                    "span_id": "00001987336b9498",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013302590466,
                    "sr": 1501013302590724,
                    "ss": 1501013302720581,
                    "cr": 1501013302720840
                },
                {
                    "span_id": "00003db9070cd192",
                    "parent_span_id": "00001987336b9498",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013302655291,
                    "sr": 1501013302655466,
                    "ss": 1501013302719639,
                    "cr": 1501013302719815
                }
            ]
        },
        {
            "trace_id": "000048968a7f2970",
            "spans": [
                {
                    "span_id": "000048968a7f2970",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013298546447,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013298550398
                }
            ]
        },
        {
            "trace_id": "00003ebdfb047d84",
            "spans": [
                {
                    "span_id": "00003ebdfb047d84",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013297512263,
                    "sr": 1501013297512505,
                    "ss": 1501013297527106,
                    "cr": 1501013297527349
                },
                {
                    "span_id": "00000017c9a8f0f0",
                    "parent_span_id": "00003ebdfb047d84",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013297520430,
                    "sr": 1501013297520563,
                    "ss": 1501013297526332,
                    "cr": 1501013297526465
                }
            ]
        },
        {
            "trace_id": "00005c18932f5ec0",
            "spans": [
                {
                    "span_id": "00005c18932f5ec0",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013295253947,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013295258208
                }
            ]
        },
        {
            "trace_id": "000045ab96e565eb",
            "spans": [
                {
                    "span_id": "000045ab96e565eb",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013292435106,
                    "sr": 1501013292435333,
                    "ss": 1501013292450638,
                    "cr": 1501013292450866
                },
                {
                    "span_id": "00008c1df76db5ea",
                    "parent_span_id": "000045ab96e565eb",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013292443496,
                    "sr": 1501013292443761,
                    "ss": 1501013292449637,
                    "cr": 1501013292449902
                }
            ]
        },
        {
            "trace_id": "0000d656bc0a4e05",
            "spans": [
                {
                    "span_id": "0000d656bc0a4e05",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013288546507,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013288551091
                }
            ]
        },
        {
            "trace_id": "000017eb7e42a81b",
            "spans": [
                {
                    "span_id": "000017eb7e42a81b",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013287362098,
                    "sr": 1501013287362323,
                    "ss": 1501013287377674,
                    "cr": 1501013287377900
                },
                {
                    "span_id": "0000111ac6b308fb",
                    "parent_span_id": "000017eb7e42a81b",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013287370448,
                    "sr": 1501013287370572,
                    "ss": 1501013287376837,
                    "cr": 1501013287376961
                }
            ]
        },
        {
            "trace_id": "0000156cdfeff611",
            "spans": [
                {
                    "span_id": "0000156cdfeff611",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013285253862,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013285257741
                }
            ]
        },
        {
            "trace_id": "0000ea2d951a1b29",
            "spans": [
                {
                    "span_id": "0000ea2d951a1b29",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013282217845,
                    "sr": 1501013282218118,
                    "ss": 1501013282234348,
                    "cr": 1501013282234621
                },
                {
                    "span_id": "00005e3753767756",
                    "parent_span_id": "0000ea2d951a1b29",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013282226722,
                    "sr": 1501013282226931,
                    "ss": 1501013282233226,
                    "cr": 1501013282233435
                }
            ]
        },
        {
            "trace_id": "000066cae73cf416",
            "spans": [
                {
                    "span_id": "000066cae73cf416",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013278546559,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013278550578
                }
            ]
        },
        {
            "trace_id": "0000f20fb2b974da",
            "spans": [
                {
                    "span_id": "0000f20fb2b974da",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013275542610,
                    "sr": 1501013275542844,
                    "ss": 1501013275558340,
                    "cr": 1501013275558574
                },
                {
                    "span_id": "000061ca3f5e5fab",
                    "parent_span_id": "0000f20fb2b974da",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013275551224,
                    "sr": 1501013275551384,
                    "ss": 1501013275557404,
                    "cr": 1501013275557564
                }
            ]
        },
        {
            "trace_id": "00007becf33a693e",
            "spans": [
                {
                    "span_id": "00007becf33a693e",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013275253961,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013275258053
                }
            ]
        },
        {
            "trace_id": "0000de4f0a76dfb2",
            "spans": [
                {
                    "span_id": "0000de4f0a76dfb2",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013268546591,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013268550651
                }
            ]
        },
        {
            "trace_id": "0000fedd5b8de6a8",
            "spans": [
                {
                    "span_id": "0000fedd5b8de6a8",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013265253904,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013265257639
                }
            ]
        },
        {
            "trace_id": "0000c44ba60bfb6a",
            "spans": [
                {
                    "span_id": "0000c44ba60bfb6a",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013264887463,
                    "sr": 1501013264887725,
                    "ss": 1501013264906989,
                    "cr": 1501013264907252
                },
                {
                    "span_id": "0000dd53ac4be10b",
                    "parent_span_id": "0000c44ba60bfb6a",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013264896966,
                    "sr": 1501013264897115,
                    "ss": 1501013264905982,
                    "cr": 1501013264906131
                }
            ]
        },
        {
            "trace_id": "00003ee2a2f37482",
            "spans": [
                {
                    "span_id": "00003ee2a2f37482",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013259640294,
                    "sr": 1501013259640569,
                    "ss": 1501013259661390,
                    "cr": 1501013259661665
                },
                {
                    "span_id": "0000a41918da674a",
                    "parent_span_id": "00003ee2a2f37482",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013259649758,
                    "sr": 1501013259650090,
                    "ss": 1501013259659987,
                    "cr": 1501013259660320
                }
            ]
        },
        {
            "trace_id": "0000ed051c5e75d8",
            "spans": [
                {
                    "span_id": "0000ed051c5e75d8",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013258546718,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013258551118
                }
            ]
        },
        {
            "trace_id": "0000a20bd732d764",
            "spans": [
                {
                    "span_id": "0000a20bd732d764",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013255253989,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013255258622
                }
            ]
        },
        {
            "trace_id": "00004fd7c1601fd4",
            "spans": [
                {
                    "span_id": "00004fd7c1601fd4",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013254559586,
                    "sr": 1501013254559835,
                    "ss": 1501013254575902,
                    "cr": 1501013254576151
                },
                {
                    "span_id": "00002615a59f4797",
                    "parent_span_id": "00004fd7c1601fd4",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013254568719,
                    "sr": 1501013254568875,
                    "ss": 1501013254574914,
                    "cr": 1501013254575071
                }
            ]
        },
        {
            "trace_id": "00005df92bddbcfa",
            "spans": [
                {
                    "span_id": "00005df92bddbcfa",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013249494157,
                    "sr": 1501013249494427,
                    "ss": 1501013249510930,
                    "cr": 1501013249511201
                },
                {
                    "span_id": "00004ae018f0b822",
                    "parent_span_id": "00005df92bddbcfa",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013249504166,
                    "sr": 1501013249504321,
                    "ss": 1501013249509962,
                    "cr": 1501013249510117
                }
            ]
        },
        {
            "trace_id": "00008167f0c10cf9",
            "spans": [
                {
                    "span_id": "00008167f0c10cf9",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013248546513,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013248554744
                }
            ]
        },
        {
            "trace_id": "00005f151dee680d",
            "spans": [
                {
                    "span_id": "00005f151dee680d",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013245253980,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013245257928
                }
            ]
        },
        {
            "trace_id": "00002edb03f79c2f",
            "spans": [
                {
                    "span_id": "00002edb03f79c2f",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013244426693,
                    "sr": 1501013244426900,
                    "ss": 1501013244442126,
                    "cr": 1501013244442333
                },
                {
                    "span_id": "0000bae951fa6fd5",
                    "parent_span_id": "00002edb03f79c2f",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013244435249,
                    "sr": 1501013244435379,
                    "ss": 1501013244441253,
                    "cr": 1501013244441383
                }
            ]
        },
        {
            "trace_id": "000064c1a4d6508c",
            "spans": [
                {
                    "span_id": "000064c1a4d6508c",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013239279466,
                    "sr": 1501013239279745,
                    "ss": 1501013239296099,
                    "cr": 1501013239296379
                },
                {
                    "span_id": "0000bea84a299a86",
                    "parent_span_id": "000064c1a4d6508c",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013239288417,
                    "sr": 1501013239288610,
                    "ss": 1501013239295157,
                    "cr": 1501013239295350
                }
            ]
        },
        {
            "trace_id": "0000748343432045",
            "spans": [
                {
                    "span_id": "0000748343432045",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013238546524,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013238551493
                }
            ]
        },
        {
            "trace_id": "00009d2609fda027",
            "spans": [
                {
                    "span_id": "00009d2609fda027",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013235253874,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013235263946
                }
            ]
        },
        {
            "trace_id": "00004d388368a0cb",
            "spans": [
                {
                    "span_id": "00004d388368a0cb",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013234205957,
                    "sr": 1501013234206220,
                    "ss": 1501013234222270,
                    "cr": 1501013234222533
                },
                {
                    "span_id": "00008f130f27621b",
                    "parent_span_id": "00004d388368a0cb",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013234215253,
                    "sr": 1501013234215437,
                    "ss": 1501013234221330,
                    "cr": 1501013234221514
                }
            ]
        },
        {
            "trace_id": "00002e88301fc9cb",
            "spans": [
                {
                    "span_id": "00002e88301fc9cb",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013229134202,
                    "sr": 1501013229134424,
                    "ss": 1501013229152625,
                    "cr": 1501013229152848
                },
                {
                    "span_id": "0000e06fc8e12e28",
                    "parent_span_id": "00002e88301fc9cb",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013229142710,
                    "sr": 1501013229142974,
                    "ss": 1501013229151584,
                    "cr": 1501013229151848
                }
            ]
        },
        {
            "trace_id": "0000dc17c4758df5",
            "spans": [
                {
                    "span_id": "0000dc17c4758df5",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013228546365,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013228550751
                }
            ]
        },
        {
            "trace_id": "0000a0b19f4dd5dc",
            "spans": [
                {
                    "span_id": "0000a0b19f4dd5dc",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013225253951,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013225257914
                }
            ]
        },
        {
            "trace_id": "0000a8e3149a4dcb",
            "spans": [
                {
                    "span_id": "0000a8e3149a4dcb",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013224065250,
                    "sr": 1501013224065493,
                    "ss": 1501013224082304,
                    "cr": 1501013224082547
                },
                {
                    "span_id": "0000df3cf71069cc",
                    "parent_span_id": "0000a8e3149a4dcb",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013224073966,
                    "sr": 1501013224074101,
                    "ss": 1501013224081314,
                    "cr": 1501013224081450
                }
            ]
        },
        {
            "trace_id": "0000d0a67f3e1723",
            "spans": [
                {
                    "span_id": "0000d0a67f3e1723",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013218993989,
                    "sr": 1501013218994217,
                    "ss": 1501013219012116,
                    "cr": 1501013219012345
                },
                {
                    "span_id": "00000bdc5ae5c8d6",
                    "parent_span_id": "0000d0a67f3e1723",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013219004364,
                    "sr": 1501013219004654,
                    "ss": 1501013219011031,
                    "cr": 1501013219011321
                }
            ]
        },
        {
            "trace_id": "000055a292d115df",
            "spans": [
                {
                    "span_id": "000055a292d115df",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013218546441,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013218551092
                }
            ]
        },
        {
            "trace_id": "0000ccd6ef45f7dc",
            "spans": [
                {
                    "span_id": "0000ccd6ef45f7dc",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013215253959,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013215258447
                }
            ]
        },
        {
            "trace_id": "0000c074f47500ea",
            "spans": [
                {
                    "span_id": "0000c074f47500ea",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013213921168,
                    "sr": 1501013213921394,
                    "ss": 1501013213940028,
                    "cr": 1501013213940255
                },
                {
                    "span_id": "0000da54015e9684",
                    "parent_span_id": "0000c074f47500ea",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013213929720,
                    "sr": 1501013213929890,
                    "ss": 1501013213939035,
                    "cr": 1501013213939205
                }
            ]
        },
        {
            "trace_id": "0000f934793b2a41",
            "spans": [
                {
                    "span_id": "0000f934793b2a41",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013208854705,
                    "sr": 1501013208854911,
                    "ss": 1501013208869711,
                    "cr": 1501013208869918
                },
                {
                    "span_id": "0000383255783e80",
                    "parent_span_id": "0000f934793b2a41",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013208862488,
                    "sr": 1501013208862772,
                    "ss": 1501013208868665,
                    "cr": 1501013208868950
                }
            ]
        },
        {
            "trace_id": "000090ce2ec9bcee",
            "spans": [
                {
                    "span_id": "000090ce2ec9bcee",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013208546845,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013208553959
                }
            ]
        },
        {
            "trace_id": "0000cb9f377089a7",
            "spans": [
                {
                    "span_id": "0000cb9f377089a7",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013205253919,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013205258513
                }
            ]
        },
        {
            "trace_id": "0000cccf197a875d",
            "spans": [
                {
                    "span_id": "0000cccf197a875d",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013203791390,
                    "sr": 1501013203791610,
                    "ss": 1501013203806505,
                    "cr": 1501013203806725
                },
                {
                    "span_id": "00003acf6d830aa7",
                    "parent_span_id": "0000cccf197a875d",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013203799983,
                    "sr": 1501013203800106,
                    "ss": 1501013203805692,
                    "cr": 1501013203805816
                }
            ]
        },
        {
            "trace_id": "00003b85a347a051",
            "spans": [
                {
                    "span_id": "00003b85a347a051",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013198712099,
                    "sr": 1501013198712393,
                    "ss": 1501013198728870,
                    "cr": 1501013198729165
                },
                {
                    "span_id": "0000f98caa4a51ed",
                    "parent_span_id": "00003b85a347a051",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013198721486,
                    "sr": 1501013198721689,
                    "ss": 1501013198727753,
                    "cr": 1501013198727957
                }
            ]
        },
        {
            "trace_id": "00007e44464d038b",
            "spans": [
                {
                    "span_id": "00007e44464d038b",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013198546810,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013198558803
                }
            ]
        },
        {
            "trace_id": "00004269e03498c1",
            "spans": [
                {
                    "span_id": "00004269e03498c1",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013195254051,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013195258499
                }
            ]
        },
        {
            "trace_id": "00005d23d297e8de",
            "spans": [
                {
                    "span_id": "00005d23d297e8de",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013193640629,
                    "sr": 1501013193640872,
                    "ss": 1501013193656423,
                    "cr": 1501013193656667
                },
                {
                    "span_id": "000066ba404f2e8e",
                    "parent_span_id": "00005d23d297e8de",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013193648591,
                    "sr": 1501013193648722,
                    "ss": 1501013193655561,
                    "cr": 1501013193655693
                }
            ]
        },
        {
            "trace_id": "000083d8780dab90",
            "spans": [
                {
                    "span_id": "000083d8780dab90",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013188546482,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013188550469
                }
            ]
        },
        {
            "trace_id": "0000833a57c6b60b",
            "spans": [
                {
                    "span_id": "0000833a57c6b60b",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013188354798,
                    "sr": 1501013188355056,
                    "ss": 1501013188370857,
                    "cr": 1501013188371115
                },
                {
                    "span_id": "00001138da185a4b",
                    "parent_span_id": "0000833a57c6b60b",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013188363747,
                    "sr": 1501013188363888,
                    "ss": 1501013188369959,
                    "cr": 1501013188370101
                }
            ]
        },
        {
            "trace_id": "00003bd83c17f701",
            "spans": [
                {
                    "span_id": "00003bd83c17f701",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013185254116,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013185261804
                }
            ]
        },
        {
            "trace_id": "0000d36a1208b2e8",
            "spans": [
                {
                    "span_id": "0000d36a1208b2e8",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013183276368,
                    "sr": 1501013183276649,
                    "ss": 1501013183297275,
                    "cr": 1501013183297556
                },
                {
                    "span_id": "0000b0af1b928f6b",
                    "parent_span_id": "0000d36a1208b2e8",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013183285065,
                    "sr": 1501013183285395,
                    "ss": 1501013183295914,
                    "cr": 1501013183296245
                }
            ]
        },
        {
            "trace_id": "0000ac69d24121cd",
            "spans": [
                {
                    "span_id": "0000ac69d24121cd",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013178546432,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013178550678
                }
            ]
        },
        {
            "trace_id": "0000e2f1dd6855a7",
            "spans": [
                {
                    "span_id": "0000e2f1dd6855a7",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013178175189,
                    "sr": 1501013178175417,
                    "ss": 1501013178220746,
                    "cr": 1501013178220975
                },
                {
                    "span_id": "0000e1e0e12ed45c",
                    "parent_span_id": "0000e2f1dd6855a7",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013178184068,
                    "sr": 1501013178184419,
                    "ss": 1501013178219500,
                    "cr": 1501013178219851
                }
            ]
        },
        {
            "trace_id": "00009bf10012a400",
            "spans": [
                {
                    "span_id": "00009bf10012a400",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013175254153,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013175258442
                }
            ]
        },
        {
            "trace_id": "0000e7446f373254",
            "spans": [
                {
                    "span_id": "0000e7446f373254",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013173104508,
                    "sr": 1501013173104789,
                    "ss": 1501013173122264,
                    "cr": 1501013173122546
                },
                {
                    "span_id": "00003898b91fd5c2",
                    "parent_span_id": "0000e7446f373254",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013173114030,
                    "sr": 1501013173114337,
                    "ss": 1501013173120988,
                    "cr": 1501013173121295
                }
            ]
        },
        {
            "trace_id": "00008810297ed7f6",
            "spans": [
                {
                    "span_id": "00008810297ed7f6",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013168546520,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013168564617
                }
            ]
        },
        {
            "trace_id": "0000162b8245a276",
            "spans": [
                {
                    "span_id": "0000162b8245a276",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013168026161,
                    "sr": 1501013168026544,
                    "ss": 1501013168045288,
                    "cr": 1501013168045672
                },
                {
                    "span_id": "00007f08c1cdbf43",
                    "parent_span_id": "0000162b8245a276",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013168037307,
                    "sr": 1501013168037613,
                    "ss": 1501013168043302,
                    "cr": 1501013168043609
                }
            ]
        },
        {
            "trace_id": "00007dc0d39a2c2e",
            "spans": [
                {
                    "span_id": "00007dc0d39a2c2e",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013165253928,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013165260695
                }
            ]
        },
        {
            "trace_id": "000060332aee6596",
            "spans": [
                {
                    "span_id": "000060332aee6596",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013162951377,
                    "sr": 1501013162951959,
                    "ss": 1501013162974051,
                    "cr": 1501013162974633
                },
                {
                    "span_id": "0000f6daf69540c5",
                    "parent_span_id": "000060332aee6596",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013162958804,
                    "sr": 1501013162959784,
                    "ss": 1501013162971070,
                    "cr": 1501013162972050
                }
            ]
        },
        {
            "trace_id": "0000469961383e7f",
            "spans": [
                {
                    "span_id": "0000469961383e7f",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 893,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013162879137,
                    "sr": 1501013162879376,
                    "ss": 1501013162897218,
                    "cr": 1501013162897457
                },
                {
                    "span_id": "00004126f24cdfc5",
                    "parent_span_id": "0000469961383e7f",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetTrainingJob",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 3165,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013162887384,
                    "sr": 1501013162887542,
                    "ss": 1501013162896233,
                    "cr": 1501013162896391
                }
            ]
        },
        {
            "trace_id": "0000e5c3bf466f7c",
            "spans": [
                {
                    "span_id": "0000e5c3bf466f7c",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "GET /v1/models/training-OtCjpRhzR/definition?version=2017-02-13",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2516,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013162726711,
                    "sr": 1501013162726957,
                    "ss": 1501013162778813,
                    "cr": 1501013162779059
                },
                {
                    "span_id": "00003b65adec2764",
                    "parent_span_id": "0000e5c3bf466f7c",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/GetModelDefinition",
                    "request_size": 40,
                    "protocol": "HTTP/2",
                    "response_size": 2524,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013162734919,
                    "sr": 1501013162734999,
                    "ss": 1501013162777980,
                    "cr": 1501013162778061
                }
            ]
        },
        {
            "trace_id": "0000d27eff14d412",
            "spans": [
                {
                    "span_id": "0000d27eff14d412",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.139",
                    "source_name": "ingress",
                    "target_ip": "172.30.85.185",
                    "target_name": "10.177.1.186",
                    "request": "POST /v1/models?version=2017-02-13",
                    "request_size": 3648,
                    "protocol": "HTTP/1.1",
                    "response_size": 77,
                    "response_code": 201,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013161944776,
                    "sr": 1501013161945180,
                    "ss": 1501013162606495,
                    "cr": 1501013162606900
                },
                {
                    "span_id": "0000f5551ca7942e",
                    "parent_span_id": "0000d27eff14d412",
                    "source_ip": "172.30.85.185",
                    "source_name": "10.177.1.186",
                    "target_ip": "172.30.174.235",
                    "target_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "request": "POST /grpc.trainer.v2.Trainer/CreateTrainingJob",
                    "request_size": 3011,
                    "protocol": "HTTP/2",
                    "response_size": 25,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013162049583,
                    "sr": 1501013162049946,
                    "ss": 1501013162604740,
                    "cr": 1501013162605103
                },
                {
                    "span_id": "000067f9305742d8",
                    "parent_span_id": "0000f5551ca7942e",
                    "source_ip": "172.30.174.235",
                    "source_name": "dlaas-trainer-v2.user-kalantar.svc.cluster.local",
                    "target_ip": "172.30.85.187",
                    "target_name": "dlaas-lcm.user-kalantar.svc.cluster.local",
                    "request": "POST /service.LifecycleManager/DeployTrainingJob",
                    "request_size": 1385,
                    "protocol": "HTTP/2",
                    "response_size": 43,
                    "response_code": 200,
                    "user_agent": "grpc-go/1.3.0",
                    "cs": 1501013162590849,
                    "sr": 1501013162591640,
                    "ss": 1501013162603013,
                    "cr": 1501013162603804
                }
            ]
        },
        {
            "trace_id": "00007764c7acafe8",
            "spans": [
                {
                    "span_id": "00007764c7acafe8",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013158546443,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013158550888
                }
            ]
        },
        {
            "trace_id": "0000174cd2dfe88e",
            "spans": [
                {
                    "span_id": "0000174cd2dfe88e",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013155253911,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013155260529
                }
            ]
        },
        {
            "trace_id": "0000c833fff46e6d",
            "spans": [
                {
                    "span_id": "0000c833fff46e6d",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013148547044,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013148551803
                }
            ]
        },
        {
            "trace_id": "0000486dba5c06a0",
            "spans": [
                {
                    "span_id": "0000486dba5c06a0",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013145253896,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013145261957
                }
            ]
        },
        {
            "trace_id": "00008913248cef21",
            "spans": [
                {
                    "span_id": "00008913248cef21",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013138546363,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013138550992
                }
            ]
        },
        {
            "trace_id": "0000c61cc5ed84e6",
            "spans": [
                {
                    "span_id": "0000c61cc5ed84e6",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013135253801,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013135257953
                }
            ]
        },
        {
            "trace_id": "00009a9fc7f905b9",
            "spans": [
                {
                    "span_id": "00009a9fc7f905b9",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013128546457,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013128551338
                }
            ]
        },
        {
            "trace_id": "0000c288503a1fa6",
            "spans": [
                {
                    "span_id": "0000c288503a1fa6",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013125253995,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013125257919
                }
            ]
        },
        {
            "trace_id": "00005b336cf533bd",
            "spans": [
                {
                    "span_id": "00005b336cf533bd",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013118546573,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013118551060
                }
            ]
        },
        {
            "trace_id": "0000b28911c0fa1b",
            "spans": [
                {
                    "span_id": "0000b28911c0fa1b",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013115254033,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013115258629
                }
            ]
        },
        {
            "trace_id": "000023126cdde314",
            "spans": [
                {
                    "span_id": "000023126cdde314",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013108546262,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013108550591
                }
            ]
        },
        {
            "trace_id": "00002a12e74a988b",
            "spans": [
                {
                    "span_id": "00002a12e74a988b",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013105253832,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013105257980
                }
            ]
        },
        {
            "trace_id": "00009424a469f6a8",
            "spans": [
                {
                    "span_id": "00009424a469f6a8",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013098546286,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013098550582
                }
            ]
        },
        {
            "trace_id": "00001e6c3ef227d2",
            "spans": [
                {
                    "span_id": "00001e6c3ef227d2",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013095253909,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013095258150
                }
            ]
        },
        {
            "trace_id": "0000a0573de5575d",
            "spans": [
                {
                    "span_id": "0000a0573de5575d",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013088546758,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013088550908
                }
            ]
        },
        {
            "trace_id": "0000dbcc93a7d238",
            "spans": [
                {
                    "span_id": "0000dbcc93a7d238",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013085254121,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013085259920
                }
            ]
        },
        {
            "trace_id": "0000b0cb3b542f27",
            "spans": [
                {
                    "span_id": "0000b0cb3b542f27",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013078546399,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013078551029
                }
            ]
        },
        {
            "trace_id": "0000c1b3537f78e5",
            "spans": [
                {
                    "span_id": "0000c1b3537f78e5",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013075253794,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013075258102
                }
            ]
        },
        {
            "trace_id": "0000306ed1cb44b5",
            "spans": [
                {
                    "span_id": "0000306ed1cb44b5",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013068546395,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013068550799
                }
            ]
        },
        {
            "trace_id": "0000a7543a9aa6ee",
            "spans": [
                {
                    "span_id": "0000a7543a9aa6ee",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013065253999,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013065261274
                }
            ]
        },
        {
            "trace_id": "0000b4b827393ddc",
            "spans": [
                {
                    "span_id": "0000b4b827393ddc",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013058546471,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013058551197
                }
            ]
        },
        {
            "trace_id": "00007c011c6281a9",
            "spans": [
                {
                    "span_id": "00007c011c6281a9",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013055253958,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013055258301
                }
            ]
        },
        {
            "trace_id": "0000274f4ce82eaf",
            "spans": [
                {
                    "span_id": "0000274f4ce82eaf",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013048546539,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013048550998
                }
            ]
        },
        {
            "trace_id": "0000094461aded16",
            "spans": [
                {
                    "span_id": "0000094461aded16",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013045253808,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013045257738
                }
            ]
        },
        {
            "trace_id": "0000a92c46bde4c7",
            "spans": [
                {
                    "span_id": "0000a92c46bde4c7",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013038546583,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013038550925
                }
            ]
        },
        {
            "trace_id": "000055bc90e3b805",
            "spans": [
                {
                    "span_id": "000055bc90e3b805",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013035253885,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013035258090
                }
            ]
        },
        {
            "trace_id": "0000dea3cd534ece",
            "spans": [
                {
                    "span_id": "0000dea3cd534ece",
                    "parent_span_id": null,
                    "source_ip": "172.30.85.185",
                    "source_name": "172.30.85.185",
                    "target_ip": null,
                    "target_name": "172.30.85.185",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013028548540,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013028553795
                }
            ]
        },
        {
            "trace_id": "000051f434476a95",
            "spans": [
                {
                    "span_id": "000051f434476a95",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013025253816,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013025258530
                }
            ]
        },
        {
            "trace_id": "0000663d5eaec954",
            "spans": [
                {
                    "span_id": "0000663d5eaec954",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013015253885,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013015258621
                }
            ]
        },
        {
            "trace_id": "00009977b090a063",
            "spans": [
                {
                    "span_id": "00009977b090a063",
                    "parent_span_id": null,
                    "source_ip": "172.30.174.216",
                    "source_name": "172.30.174.216",
                    "target_ip": null,
                    "target_name": "172.30.174.216",
                    "request": "GET /health",
                    "request_size": 0,
                    "protocol": "HTTP/1.1",
                    "response_size": 2,
                    "response_code": 200,
                    "user_agent": "Go-http-client/1.1",
                    "cs": 1501013005253964,
                    "sr": null,
                    "ss": null,
                    "cr": 1501013005258005
                }
            ]
        }
    ]
}
