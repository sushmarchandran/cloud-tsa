import logging
import argparse
import json
import numpy as np
import requests
import threading
import time
import logging


def pinger(democonfig, topology, pingspec = {"mean_query_frequency": 20.0, "num_queries": 20000}):
    logger = logging.getLogger()
    services = []
    for service in topology['nodes']:
        if service != 'ingress':
            services.append(service)


    lock = threading.RLock() # for thread safety of response_summary
    time_to_exit = False

    def http_get(num, service):
        try:
            host = service + ".default.svc.cluster.local"
            requests.get(democonfig["gateway_url"], headers = {"Host": host})
            logger.debug(f"Finished Query {num} with {service}")
            if num%100 == 0:
                logger.info(f"Finished Query {num} with {service}")
        except requests.RequestException as e:
            logger.error("Request exception encountered")
            logger.error(str(e))

    def worker(num, service):
        """thread worker function"""
        logger.debug("request id: %s", num)
        http_get(num, service)

    num_queries = int(pingspec["num_queries"])

    logger.debug("mean_query_frequency: %s num_queries: %s", \
                pingspec["mean_query_frequency"], pingspec["num_queries"])

    threads = []

    mean_interarrival_time = 1/float(pingspec["mean_query_frequency"])
    for j in range(0, num_queries):
        interval = np.random.exponential(scale = mean_interarrival_time)
        # first select a random service
        service = np.random.choice(services)
        t = threading.Thread(target=worker, args=[j, service])
        threads.append(t)
        t.start()
        time.sleep(interval)

    for t in threads: t.join()
    with lock: time_to_exit = True

if __name__ == "__main__":
    #Logger configuration
    logging.basicConfig(level=logging.INFO, format='%(asctime)s %(name)-12s %(levelname)-8s %(message)s')
    logging.getLogger("requests").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)


    parser = argparse.ArgumentParser(description='Autotune Istio App')
    parser.add_argument('-dc', '--democonfig', metavar = "<path/to/democonfig.json>", help='the project configuration file', required=True)
    parser.add_argument('-t', '--topology', metavar = "<path/to/topology.json>", help='the topology file', required=True)
    parser.add_argument('-p', '--ping_frequency', metavar = "<ping_frequency>", help='number of pings per second', required=True)

    args = parser.parse_args()

    democonfig = json.load(open(args.democonfig))
    topology = json.load(open(args.topology))
    #Calling ping
    pinger(democonfig, topology, pingspec = {"mean_query_frequency": float(args.ping_frequency), "num_queries": 9000000})
