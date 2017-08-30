#Creating Ubuntu 16.04 Base Image
FROM ubuntu:16.04

RUN apt-get update

#Install Python 3.6 on the image
#RUN apt-get install python:3.6
RUN apt-get install -y software-properties-common vim
RUN add-apt-repository ppa:jonathonf/python-3.6
RUN apt-get update
RUN apt-get install -y build-essential python3.6


#Copy code inside Docker Image
RUN mkdir istio_analytics
ADD istio_analytics_restapi /istio_analytics/istio_analytics_restapi
ADD requirements.txt /istio_analytics/requirements.txt
ADD startServer.sh /istio_analytics/startServer.sh

#CREATING PYTHON VIRTUAL ENVIRONMENT
RUN python3.6 -m venv /python3.6-venv
RUN source /python3.6-venv/bin/activate

#Running the requirements.txt file
RUN /python3.6-venv/bin/pip3.6 install -r requirements.txt

CMD ["sh", "/istio_analytics/startServer.sh"]
