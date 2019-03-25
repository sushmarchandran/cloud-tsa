#!/bin/bash

export PYTHONPATH=/serviceunit

. /python3.6-venv/bin/activate
chmod a+x /serviceunit/serviceunit.py
/python3.6-venv/bin/python /serviceunit/serviceunit.py
