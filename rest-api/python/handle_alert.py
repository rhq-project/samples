"""
Hanldes alert for given resource

Looks up platform in inventory, ACKs all alerts

Requires RHQ 4.8
"""
import sys,os,time
import requests,json

endpoint = 'http://' + os.getenv('RHQ_HOST','localhost') + ':7080/rest/'
auth = (os.getenv('RHQ_USER','rhqadmin'),os.getenv('RHQ_PASSWORD','rhqadmin'))
headers = {'accept':'application/json','content-type': 'application/json'}

def find_resource():
    """
    Finds a platform resource in inventory and returns it
    """
    req = requests.get(endpoint+'resource?category=PLATFORM&ps=1',headers=headers,auth=auth)
    data = req.json()
    if len(data) == 0:
        raise Exception("Could not lookup platform in inventory")
    return data[0]


print 'Lookup resource'
resource = find_resource()

alerts = requests.get(endpoint+'alert/?resourceId=%d' % (resource['resourceId']),headers=headers,auth=auth).json()
for alert in alerts:
    if alert['ackTime'] == 0:
        print 'Acknowledge alert:\n %s' % alert['description']
        req = requests.put(endpoint+'alert/%d' % alert['id'],{},headers=headers,auth=auth)

