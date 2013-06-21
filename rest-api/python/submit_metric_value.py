"""
   Send random data values as metrics to the server for a schedule with id 10022
"""

scheduleId = 10022

import httplib2
import json
import random
from time import time

http = httplib2.Http()
http.add_credentials('rhqadmin','rhqadmin')
http.debuglevel=1

print "Time: " , time()

ts = long(time()*1000)  # TODO how to get ms resolution?

val = random.randint(1,100)

pointdata = {'value':val}
point = json.dumps(pointdata)

print "Point = " , point

i = 10022
uri = "http://localhost:7080/rest/metric/data/" + str(scheduleId) + "/raw/" + str(ts)

print "Posting to " , uri , "\n\n"

response,content = http.request(uri,method="PUT",
	headers = {'Accept':'application/json', 'Content-type':'application/json'},body = point)

if response.status != 200:
	print "Status was " , response.status , response

