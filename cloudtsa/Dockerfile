#Creating Ubuntu 16.04 Base Image
FROM ubuntu:16.04
EXPOSE 9080

#Install Python 3.6 on the image
RUN apt-get update && apt-get install -y software-properties-common
RUN add-apt-repository ppa:jonathonf/python-3.6
RUN apt-get update
RUN apt-get update && apt-get install -y curl
RUN apt-get install -y build-essential python3.6 python3.6-venv

RUN mkdir iter8/
RUN mkdir iter8/cloudtsa
RUN mkdir iter8/cloudtsa/config
ADD config /iter8/cloudtsa/config

RUN mkdir iter8/cloudtsa/demo
ADD demo /iter8/cloudtsa/demo

RUN mkdir iter8/cloudtsa/docs
ADD docs /iter8/cloudtsa/docs

RUN mkdir iter8/cloudtsa/orchestration
ADD orchestration /iter8/cloudtsa/orchestration

RUN mkdir iter8/cloudtsa/prometheus
ADD prometheus /iter8/cloudtsa/prometheus

RUN mkdir iter8/cloudtsa/tests
ADD tests /iter8/cloudtsa/tests

RUN mkdir iter8/cloudtsa/tsa
ADD tsa /iter8/cloudtsa/tsa

RUN mkdir iter8/cloudtsa/utils
ADD utils /iter8/cloudtsa/utils

ADD requirements.txt /iter8/cloudtsa/requirements.txt
ADD start.sh /iter8/cloudtsa/start.sh

#Set up Python virtual environment
RUN python3.6 -m venv /python3.6-venv
RUN bash -c "source /python3.6-venv/bin/activate && \
       /python3.6-venv/bin/pip3.6 install setuptools nose coverage prometheus_client && \
       /python3.6-venv/bin/pip3.6 install -r /iter8/cloudtsa/requirements.txt"

CMD ["sh", "/iter8/cloudtsa/start.sh" ]
