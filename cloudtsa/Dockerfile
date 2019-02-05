#Creating Ubuntu 16.04 Base Image
FROM ubuntu:16.04
EXPOSE 9080

#Install Python 3.6 on the image
RUN apt-get update && apt-get install -y software-properties-common
RUN add-apt-repository ppa:jonathonf/python-3.6
RUN apt-get update
RUN apt-get update && apt-get install -y curl
RUN apt-get install -y build-essential python3.6 python3.6-venv

RUN mkdir cloudtsa
RUN mkdir cloudtsa/config
ADD config /cloudtsa/config

RUN mkdir cloudtsa/demo
ADD demo /cloudtsa/demo

RUN mkdir cloudtsa/docs
ADD docs /cloudtsa/docs

RUN mkdir cloudtsa/orchestration
ADD orchestration /cloudtsa/orchestration

RUN mkdir cloudtsa/prometheus
ADD prometheus /cloudtsa/prometheus

RUN mkdir cloudtsa/tests
ADD tests /cloudtsa/tests

RUN mkdir cloudtsa/tsa
ADD tsa /cloudtsa/tsa

RUN mkdir cloudtsa/utils
ADD utils /cloudtsa/utils

ADD requirements.txt /cloudtsa/requirements.txt
ADD start.sh /cloudtsa/start.sh

#Set up Python virtual environment
RUN python3.6 -m venv /python3.6-venv
RUN bash -c "source /python3.6-venv/bin/activate && \
       /python3.6-venv/bin/pip3.6 install setuptools nose coverage prometheus_client && \
       /python3.6-venv/bin/pip3.6 install -r /cloudtsa/requirements.txt"

CMD ["sh", "/cloudtsa/start.sh" ]
