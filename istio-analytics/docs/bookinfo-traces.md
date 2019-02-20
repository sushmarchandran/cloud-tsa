# Canary Analytics with the _Bookinfo_ sample application

The instructions below guide you in: running the _Bookinfo_ sample application; generating _Bookinfo_ traces live; and analyzing the generated traces in the _Istio Analytics_ UI. In particular, we will explore _Istio Analytics'_ canary analytics functionality.

*1).* Let us run Istio's _Bookinfo_ sample application. You can deploy it by following [these instructions](https://istio.io/docs/examples/bookinfo). The _Bookinfo_ application's microservices have been written to propagate all HTTP headers needed for Istio to properly collect distributed traces.

*2).* Once you have determined that _Bookinfo_ is working (in step 1), the next step is to make Istio split the traffic evenly between versions 2 and 3 of the _reviews_ microservice.

First, in case you have not done so as part of step 1, create `DestinationRules` for _Bookinfo_ as described [here](https://istio.io/docs/examples/bookinfo/#apply-default-destination-rules).

Next, let us create an Istio VirtualService to split the traffic evenly between `reviews v2` and `reviews v3`, by running the following command from the `iter8/istio-analytics` directory:

```bash
kubectl apply -f docs/virtual-service-reviews-v2_50-v3_50.yaml
```

*3).* Refresh the web page with the _Istio_Analytics_' "Canary Analytics" UI at `http://localhost:5555/canary/categories`. This will set the baseline and canary start and end times to the current time in UTC.

*4).* Generate load by making requests to _Bookinfo_. As part of step 1, you must have created an Istio `Gateway` for _Bookinfo_ and determined the ingress IP address and port to access the application as described [here](https://istio.io/docs/examples/bookinfo/#determining-the-ingress-ip-and-port). The environment variable `GATEWAY_URL` should capture the correct IP address and port, if you followed those instructions. At this point, to generate load you can run the following command:

```bash
for i in `seq 1 300`; do curl -o /dev/null -s -w "%{http_code}\n" "http://${GATEWAY_URL}/productpage"; sleep 1; done
```

The above command will generate 300 requests, waiting for 1 second between requests.

*5).* While the load generator runs, let us play with the _Istio Analytics_ UI.

*5.1).* Now, we need to tell _Istio_Analytics_ that the baseline version is `reviews-v2` by filling out the "Baseline tags" field with the value `node_id:reviews-v2`. Similarly, let us specify that the canary version is `reviews-v3` by filling out the field "Canary tags" with the value `node_id:reviews-v3`.

*5.2).* Next, click on the two "NOW" buttons on the UI so that the time interval considered by _Istio Analytics_ is extended up to now.

*5.3).* Click on the "QUERY" button so that _Istio Analytics_ retrieves traces involving the baseline and canary versions of reviews. When it is done, it should tell you that it found one cluster.

*5.4).* Switch to the "Sequence" view by clicking on "Sequence". You should now see a comparative, statistical summary of traces. The colored "needles" represent how faster or slower each element of the traces containing the canary version is in comparison with the corresponding baseline elements.

*5.5).* From this point on, while the load generator keeps sending requests to _Bookinfo_, you can continue updating the _Istio Analytics_ UI by clicking on the two "NOW" buttons and then on "QUERY". This will incorporate into the trace analysis the latest traces up to the current time.