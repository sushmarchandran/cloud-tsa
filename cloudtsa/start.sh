#!/bin/bash

export PYTHONPATH=/

. /python3.6-venv/bin/activate
chmod a+x /iter8/cloudtsa/orchestration/main.py
/python3.6-venv/bin/python /iter8/cloudtsa/orchestration/main.py
