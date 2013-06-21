"""
Imports everything from discovery queue

Requires RHQ 4.8
"""
import sys,os,time
import requests,json

endpoint = 'http://' + os.getenv('RHQ_HOST','localhost') + ':7080/rest/'
auth = (os.getenv('RHQ_USER','rhqadmin'),os.getenv('RHQ_PASSWORD','rhqadmin'))
headers = {'accept':'application/json','content-type': 'application/json'}

print 'Lookup NEW resources'
resources = requests.get(endpoint+'resource?status=NEW',auth=auth,headers=headers).json()
print 'Got %d resources' % len(resources)

for res in resources:
    print 'Importing %d:%s'  % (res['resourceId'],res['resourceName'])
    res['status'] = 'committed'
    del res['links']
    req = requests.put(endpoint+'resource/%d' % res['resourceId'],data=json.dumps(res),auth=auth,headers=headers)
    print req
    print req.text


