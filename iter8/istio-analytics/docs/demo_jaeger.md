# Instructions for demonstrating Istio Analytics

## 1. Setting up Jaeger on Armada
With Istio 1.0.0 and bookinfo deployed, Jaeger is running as the backend for istio-tracing in the istio-system namespace. A zipkin client is still injected within each app pod, while the collected spans are now sent to the jaeger server, who opens a port 9411 digesting all upcoming data. 

## 2. Generate Traces
Traces have been collected in situations with/without delay and stored in the jaeger server.

## 3. Setting up Istio Analytics Server
In this demo, the server is set up on the docker platform. Please remember to forward the access to jaeger UI port to localhost before moving forward. Otherwise the istio analytics server will not be able to fetch data from the jaeger server.

## 4. Check the demo scenarios

### 1. Normal behaviour(to reviews v1 w/o delays)
Here shows the statistical aggregation of traces collected from the bookinfo application running in normal situations. 

[link](http://localhost:5555/uml5/sequence/flow/0/trace/0?start=2018-11-12T19:03:20.0Z&end=2018-11-12T19:03:25.0Z&max=500&auto=true)

Since all traffic is directing to version 1 of service `reviews`, so service `ratings` is absent.

### 2. Normal behaviour(to reviews v2 w/o delay)
This time all traffic to service `reviews` will be routed to pods of version 2, which will reach service `ratings`. So now you can see that one more service is showing up in the UI.

[link](http://localhost:5555/uml5/sequence/flow/0/trace/0?start=2018-11-12T19:04:30.0Z&end=2018-11-12T19:04:34.0Z&max=500&auto=true)

### 3. Mismatched Timeout-policy with Retries(to reviews v2 with 7s delay)
Based on the same setup as it's in case 2, now a 7s delay is injected to each call to `ratings`. As a result, after receiving calls from `productpage`, `reviews`'s delay to `ratings` causes timeout to its caller and a receiver-lacking response from its callee as well.

Noted that timeout is represented as blue dashed-line arrows in the figure.

[link](http://localhost:5555/uml5/sequence/flow/0/trace/0?start=2018-11-12T18:44:57.0Z&end=2018-11-12T18:47:00.0Z&max=500&auto=true)   

### 4. Matched Timeout-policy with Retries and Errors
Unlike the previous scenario, now version 3 of `reviews` is used, whose timeout parameter is matched with the one of `productpage`. So the timeout response from `ratings` to `reviews` can be reflected back to `productpage`. 
After receiving the first timeout response code(500) from `reviews`, `productpage` will make a retry call. With the 500 code being sent back again, `productpage` will return 200 to ingress gateway.

Since `reviews` returns earlier than the end of delay to `ratings`, so `ratings` has not been reached out. The timeout from `reviews` to `productpage` is indicated by red signs in the diagram.

 [link](http://localhost:5555/uml5/sequence/flow/0/trace/0?start=2018-11-12T18:56:01.0Z&end=2018-11-12T18:57:45.0Z&max=500&auto=true)   

### 5. Canary Comparison between Situations with Different Versions of Service
This case illustrates the canary comparison between two time intervals: baseline with traffic to `reviews` v2 and canary with traffic to `reviews` v3. No delays are injected in both cases. The purpose is to see how the responsive behaviors vary after rollout of new version. 

The variance of response time is represented by needles in the sequence diagram. 

[link](http://localhost:5555/canary/sequence/flow/0/trace/0?start=2018-11-12T19:04:30.0Z&end=2018-11-12T19:04:34.0Z&max=50&canaryStart=2018-11-12T19:05:22.0Z&canaryEnd=2018-11-12T19:05:26.0Z&canaryMax=500&auto=true)