import logging
import datetime, time
import requests
#make this a function
logger = logging.getLogger()


def connected_to_prometheus(prometheus_url, test_connection_query):
    params = {
        "query": test_connection_query
    }
    #Checking Prometheus for connection:
    logger.info("Checking if Prometheus is running..")
    start_time = datetime.datetime.now()
    time.sleep(10) # sleep for 2 sec
    data =  {'start_time': start_time.isoformat() + "Z", 'max': 100}

    attempts = 0
    connected = True
    while attempts < 3:
        try:
            connect = requests.get(prometheus_url, params = params)
            break # was able to connect successfully
        except requests.exceptions.RequestException as e:
            attempts += 1
    if attempts == 3:
        connected = False # could not connect successfully

    if connected: # prometheus connection looks good
        logger.info("Prometheus is running")
    else: # prometheus connection looks bad. Cannot create the prometheus metrics object.
        logger.error("Could not connect to Prometheus. Check if Prometheus is running. Also make sure your load generator is running.")
        exit(0)
