'''
Utility functions to manipulate time and datetime
'''
from dateutil import parser
import time
import datetime
import pytz

def iso8601_to_milliseconds_epoch(timestamp_str):
    '''Converts a timestamp string from ISO8601 format into epoch time (milliseconds)
    @param timestamp_str (string): String representing time in ISO8601 format
    
    @return Time in milliseconds (epoch)
    @rtype integer
    '''
    dt = parser.parse(timestamp_str)
    try:
        time_secs_float = (dt - datetime.datetime(1970, 1, 1, tzinfo=pytz.timezone('UTC'))).total_seconds()
        time_milli = int(round(time_secs_float * 1000))
    except TypeError:
        assert False, "Error parsing time string: '{}'. Expected ISO8601 format!".format(timestamp_str)
    return time_milli

def current_milliseconds_epoch_time():
    '''Returns the current epoch time in milliseconds
    
    @rtype: integer
    '''
    return int(round(time.time() * 1000))

def current_iso8601_utc_time():
    '''Returns the current UTC time in the ISO8601 format
    
    @return String representing the current UTC time in the ISO8601 format
    @rtype string
    '''
    aux_dt = datetime.datetime.utcfromtimestamp(time.time())
    final_dt = aux_dt.replace(tzinfo=pytz.timezone('UTC'))
    return final_dt.isoformat()