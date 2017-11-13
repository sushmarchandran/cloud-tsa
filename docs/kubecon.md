# Instructions to run Istio Analytics demos for KubeCon

## Start the Istio Analytics server locally

The first thing to do is to start the Istio Analytics server and Zipkin locally. We provide a Docker Compose manifest file to deploy both our server and Zipkin as Docker containers.

### Instructions for environments with native Docker installed

Make sure you have [Docker](https://www.docker.com/) installed on your laptop.

Then, follow these steps:

1. If you do not have Docker Compose installed, follow the 
[Docker Compose installation instructions for your OS](https://docs.docker.com/compose/install/).

2.  Clone the GitHub repository `git@github.ibm.com:istio-analytics/restapi_server.git`

3. Go into the top directory of the GitHub repo cloned above and run the following commands:

```bash
cd scripts
docker-compose up -d
``` 

4. Verify that Zipkin is ready by pointing your browser to Zipkin's UI at 
[http://localhost:9411](http://localhost:9411). If may take a few seconds for Zipkin to get started.

5. Clone the GitHub repository containing Zipkin traces we will use to populate Zipkin.
This repository is `git@github.ibm.com:istio-analytics/dev_env.git`.

6. Go into the top directory of the repo cloned above and run the following command:

```bash
scripts/zipkinPopulate.sh
```

7. At this point, you should have both Istio Analytics and Zipkin ready. Confirm that by running `docker ps`.
The `docker ps` output should show a container named `istio-analytics` and one named `zipkin`.

### Instructions for Windows with no native Docker 

If you have a Windows laptop with no Docker installed, the best approach is probably to use our Vagrantfile 
to instantiate a VirtualBox VM with Docker and Docker Compose. In this case, follow these steps:


  