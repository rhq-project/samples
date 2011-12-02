import httplib2
import json

http = httplib2.Http()
http.add_credentials('rhqadmin','rhqadmin')
http.debuglevel=1

response,content = http.request("http://localhost:7080/rest/1/status",method="GET",
	headers = {'Accept':'application/json'})

if (response.status == 200)  :
	data = json.JSONDecoder().decode(content)
	values = data['values']
	for key in values:
		print key , "\t\t" , values[key]
else:
	print "Status was " , response.status
