#!/bin/bash

export PYTHONPATH=/

. /python3.6-venv/bin/activate
chmod a+x /cloudtsa/orchestration/main.py
/python3.6-venv/bin/python /cloudtsa/orchestration/main.py
