#Creating Ubuntu 16.04 Base Image
FROM ubuntu:16.04

#Install Python 3.6 on the image
RUN apt-get update && apt-get install -y software-properties-common
RUN add-apt-repository ppa:jonathonf/python-3.6
RUN apt-get update 
RUN apt-get install -y build-essential python3.6 python3.6-venv

#Copy code inside Docker Image
RUN mkdir istio_analytics
ADD istio_analytics_restapi /istio_analytics/istio_analytics_restapi
ADD requirements.txt /istio_analytics/requirements.txt
ADD startServer.sh /istio_analytics/startServer.sh

#Set up Python virtual environment
RUN python3.6 -m venv /python3.6-venv
RUN bash -c "source /python3.6-venv/bin/activate && \
       /python3.6-venv/bin/pip3.6 install wheel setuptools nose coverage && \
       /python3.6-venv/bin/pip3.6 install -r /istio_analytics/requirements.txt"

#Starting the server using the startServer script
CMD ["sh", "/istio_analytics/startServer.sh"]
