# Istio Analytics and Istio

The instructions below will guide you in: setting up Istio with tracing enabled; running _Istio Analytics_ locally and pointing it to your Istio's tracing backend; running the _Bookinfo_ sample application; generating _Bookinfo_ traces; and analyzing the generated traces in the _Istio Analytics_ UI.

 *1).* Make sure your Istio installation has tracing enabled. To set up Istio with tracing, follow [these Istio instructions](https://istio.io/docs/tasks/telemetry/distributed-tracing/#before-you-begin); the easiest way is to install Istio from the `istio-demo.yaml` file.

 *2).* Check that Istio is properly installed. In Kubernetes, you should see the following pods (if you installed Istio using `istio-demo.yaml`):

 ```bash
$ kubectl get pods -n istio-system
NAME                                      READY     STATUS    RESTARTS   AGE
grafana-774bf8cb47-8mllj                  1/1       Running   0          5d
istio-citadel-cb5b884db-lhrbz             1/1       Running   0          5d
istio-egressgateway-dc49b5b47-ffd9d       1/1       Running   0          5d
istio-galley-5b494c7f5-kfttk              1/1       Running   0          5d
istio-ingressgateway-64cb7d5f6d-hwr5r     1/1       Running   0          5d
istio-pilot-549755bccb-28wmh              2/2       Running   0          5d
istio-policy-858884d9c-ptrd9              2/2       Running   0          5d
istio-sidecar-injector-7f4c7db98c-vmttr   1/1       Running   0          5d
istio-telemetry-748d58f6c5-7xt86          2/2       Running   0          2d
istio-telemetry-748d58f6c5-swfjg          2/2       Running   0          5d
istio-tracing-ff94688bb-lzmhs             1/1       Running   0          5d
prometheus-f556886b8-g5b7c                1/1       Running   0          5d
servicegraph-b5cb7dcdd-f25gb              1/1       Running   0          5d
 ```

Note above the `istio-tracing-*` pod. Let us now make sure you have the Jaeger-related services:

 ```bash
 $ kubectl get services -n istio-system | grep jaeger
jaeger-agent             ClusterIP      None             <none>        5775/UDP,6831/UDP,6832/UDP                                                                                                5d
jaeger-collector         ClusterIP      172.21.149.137   <none>        14267/TCP,14268/TCP                                                                                                       5d
jaeger-query             ClusterIP      172.21.90.95     <none>        16686/TCP
 ```

Note above the `jaeger-query` service. That is the Jaeger API server to which we will point _Istio Analytics_.

*3).* The next step is to make the `jaeger-query` service accessible. In Kubernetes, one way to do so is to expose it as a `NodePort` service. Note that just port-forwarding `jaeger-query` to your localhost does not suffice. Even though you can do this to access Jaeger's UI in your browser, it will not work for _Istio Analytics_ running as a Docker container in your host. Thus, we suggest the following command on Kubernetes:

```bash
kubectl -n istio-system expose service jaeger-query --type=NodePort --name=jaeger-np
```

As a result, you should see a new service named `jaeger-np`:

```bash
$ kubectl get services -n istio-system | grep jaeger
jaeger-agent             ClusterIP      None             <none>        5775/UDP,6831/UDP,6832/UDP                                                                                                5d
jaeger-collector         ClusterIP      172.21.149.137   <none>        14267/TCP,14268/TCP                                                                                                       5d
jaeger-np                NodePort       172.21.237.241   <none>        16686:31955/TCP                                                                                                           1m
jaeger-query             ClusterIP      172.21.90.95     <none>        16686/TCP
```

*4).* We need to get the URL to your newly exposed `jaeger-np` service. The first step towards it is to determine your Kubernetes ingress host.

Follow [these Istio instructions](https://istio.io/docs/tasks/traffic-management/ingress/#determining-the-ingress-ip-and-ports) to set the environment variable `INGRESS_HOST` based on your environment.

Next, you need to get the port of your newly exposed `jaeger-np` service. You can do so by running the following command:

```bash
export JAEGER_PORT=$(kubectl get svc jaeger-np -n istio-system -o jsonpath='{.spec.ports[0].nodePort}')
```

Now, you can form the URL to `jaeger-np`. Check if you can see Jaeger's UI by pasting the output of the following command to your browser:

```bash
echo "http://$INGRESS_HOST:$JAEGER_PORT"
```

If you can access Jaeger's UI, you can proceed to the next step.

*5).* Run _Istio Analytics_ and point it to Jaeger from the `iter8/istio-analytics` directory:

```bash
export JAEGER_URL=http://$INGRESS_HOST:$JAEGER_PORT
export ISTIO_ANALYTICS_TRACE_BACKEND=jaeger
export ISTIO_ANALYTICS_TRACE_SERVER_URL=$JAEGER_URL

docker-compose -f scripts/docker-compose.server-only.yaml up -d --build
```

At this point, _Istio Analytics_ should be running as a Docker container and pointing to your Istio's Jaeger. Check if you can access the _Istio Analytics_' "Canary Analytics" UI at the following URL:

```url
http://localhost:5555/canary/categories
```

If that works, we can move to the next step.

*6).* Let us run Istio's _Bookinfo_ sample application. You can deploy it by following [these instructions](https://istio.io/docs/examples/bookinfo). The _Bookinfo_ application's microservices have been written to propagate all HTTP headers needed for Istio to properly collect distributed traces.

*7).* Once you have determined that _Bookinfo_ is working (in step 6), the next step is to make Istio split the traffic evenly between versions 2 and 3 of the _reviews_ microservice.

First, in case you have not done so as part of step 6, create `DestinationRules` for _Bookinfo_ as described [here](https://istio.io/docs/examples/bookinfo/#apply-default-destination-rules).

Next, let us create an Istio VirtualService to split the traffic evenly between `reviews v2` and `reviews v3`, by running the following command from the `iter8/istio-analytics` directory:

```bash
kubectl apply -f docs/virtual-service-reviews-v2_50-v3_50.yaml
```

*8).* Refresh the web page with the _Istio_Analytics_' "Canary Analytics" UI at `http://localhost:5555/canary/categories`. This will set the baseline and canary start and end times to the current time in UTC.

*9).* Generate load by making requests to _Bookinfo_. As part of step 6, you must have created an Istio `Gateway` for _Bookinfo_ and determined the ingress IP address and port to access the application as described [here](https://istio.io/docs/examples/bookinfo/#determining-the-ingress-ip-and-port). The environment variable `GATEWAY_URL` should capture the correct IP address and port, if you followed those instructions. At this point, to generate load you can run the following command:

```bash
for i in `seq 1 300`; do curl -o /dev/null -s -w "%{http_code}\n" "http://${GATEWAY_URL}/productpage"; sleep 1; done
```

The above command will generate 300 requests, waiting for 1 second between requests.

*10).* While the load generator runs, let us play with the _Istio Analytics_ UI.

*10.1).* Now, we need to tell _Istio_Analytics_ that the baseline version is `reviews-v2` by filling out the "Baseline tags" field with the value `node_id:reviews-v2`. Similarly, let us specify that the canary version is `reviews-v3` by filling out the field "Canary tags" with the value `node_id:reviews-v3`.

*10.2).* Next, click on the two "NOW" buttons on the UI so that the time interval considered by _Istio Analytics_ is extended up to now.

*10.3).* Click on the "QUERY" button so that _Istio Analytics_ retrieves traces involving the baseline and canary versions of reviews. When it is done, it should tell you that it found one cluster.

*10.4).* Switch to the "Sequence" view by clicking on "Sequence". You should now see a comparative, statistical summary of traces. The colored "needles" represent how faster or slower each element of the traces containing the canary version is in comparison with the corresponding baseline elements.

*10.5).* From this point on, while the load generator keeps sending requests to _Bookinfo_, you can continue updating the _Istio Analytics_ UI by clicking on the two "NOW" buttons and then on "QUERY". This will incorporate into the trace analysis the latest traces up to the current time.