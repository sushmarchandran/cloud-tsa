# Instructions to run Istio Analytics demos for KubeCon

## Start the Istio Analytics server locally

The first thing to do is to start the Istio Analytics server and Zipkin locally. We provide a Docker Compose manifest file to deploy both our server and Zipkin as Docker containers.

### Instructions for MacOS (with native Docker installed)

Make sure you have [Docker](https://www.docker.com/docker-mac) installed on your laptop.

Then, follow these steps:

1. If you do not have Docker Compose installed, follow the 
[Docker Compose installation instructions for MacOS](https://docs.docker.com/docker-for-mac/install/).

2.  Clone the GitHub repository `git@github.ibm.com:istio-analytics/restapi_server.git`

3. Go into the top directory of the GitHub repo cloned in step 2 and run the following commands:

```bash
cd scripts
docker-compose up -d
``` 

4. Verify that Zipkin is ready by pointing your browser to Zipkin's UI at 
[localhost:9411](localhost:9411). If may take a few seconds for Zipkin to get started.

5. Once you confirm that Zipkin is up and running, you need to populate it with 
traces we have previously collected. To do so, run the following commands:

```bash
```

If you have a Windows laptop with no Docker installed, the best approach is probably to use our Vagrantfile 
to instantiate a VirtualBox VM with Docker and Docker Compose. In this case, follow these steps:
  