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

*3).* The next step is to make the `jaeger-query` service accessible, in case (as shown above) it has `<none>` as the value for the external IP. In Kubernetes, one way to do so is to expose it as a `NodePort` service. Note that just port-forwarding `jaeger-query` to your localhost does not suffice. Even though you can do this to access Jaeger's UI in your browser, it will not work for _Istio Analytics_ running as a Docker container in your host. Thus, we suggest the following command on Kubernetes:

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

*3.1).* We need to get the URL to your newly exposed `jaeger-np` service. The first step towards it is to determine your Kubernetes ingress host.

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

*4).* Run _Istio Analytics_ and point it to Jaeger from the `iter8/istio-analytics` directory:

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

If that works, follow [these instructions](bookinfo-traces.md) to play with Istio's _Bookinfo_ sample application and use _Istio Analytics_ to analyze it.