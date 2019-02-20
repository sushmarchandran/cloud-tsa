# Running Istio Analytics in Kubernetes with Istio

The instructions below will guide you in: setting up Istio with tracing enabled; and running _Istio Analytics_ in the same Kubernetes environment where Istio is installed and using Jaeger as the tracing backend.

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

*3).* Make sure Jaeger is working. To do so, you can port-forward the `jaeger-query` service to your localhost and check if you can access Jaeger's UI from your browser:

```bash
kubectl port-forward -n istio-system $(kubectl get pod -n istio-system -l app=jaeger -o jsonpath='{.items[0].metadata.name}') 16686:16686 &
```

After running the command above, try to access Jaeger at `http://localhost:16686`.

*4).* The next step is to run _Istio Analytics_ on Kubernetes, pointing it to the `jaeger-query` service. Assuming you have Istio running in the `istio-system` namespace, run the following command from the `iter8/istio-analytics` directory:

```bash
kubectl apply -f scripts/kube-istio-analytics-jaeger.yaml -n istio-system
```

The command above should create the `istio-analytics` pod and service in the `istio-system` namespace. You can confirm it as follows:

```bash
$ kubectl get pods -l name=istio-analytics -n istio-system
NAME                               READY     STATUS    RESTARTS   AGE
istio-analytics-794c85b4c6-5lg2s   1/1       Running   0          13s
```

 Furthermore, at this point, _Istio Analytics_ is configured to use the `jaeger-query` service as the tracing backend.

*5)*. Make sure _Istio Analytics_ is accessible from your browser. One way of doing so is by port-forwarding the `istio-analytics` Kubernetes service to your localhost as follows:

```bash
kubectl port-forward -n istio-system $(kubectl get pod -n istio-system -l name=istio-analytics -o jsonpath='{.items[0].metadata.name}') 5555:5555 &
```
*6)*. Check if you can access the _Istio Analytics_' "Canary Analytics" UI at the following URL:

```url
http://localhost:5555/canary/categories
```

Given that all above steps succeeded, you are ready to play with Istio's _Bookinfo_ sample application and use _Istio Analytics_ to analyze it. To do so, follow [these instructions](bookinfo-traces.md).

## Uninstall Istio Analytics

To uninstall _Istio Analytics_ from your Kubernetes environment and stop the port-forwarding, just run the following command from the `iter8/istio-analytics` directory:

```bash
kubectl delete -f scripts/kube-istio-analytics-jaeger.yaml  
-n istio-system

pkill -f port-forward
```
