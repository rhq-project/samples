"""
Schedules operation on resource and prints it's result.

Looks up platform in inventory, schedules 'discovery' operation and prints it's result.

Requires RHQ 4.8
"""
import sys,os,time
import requests,json

endpoint = 'http://' + os.getenv('RHQ_HOST','localhost') + ':7080/rest/'
auth = (os.getenv('RHQ_USER','rhqadmin'),os.getenv('RHQ_PASSWORD','rhqadmin'))
headers = {'accept':'application/json','content-type': 'application/json'}

# lookup a resource
req = requests.get(endpoint+'resource?category=PLATFORM&ps=1',headers=headers,auth=auth)
data = req.json()
if len(data) == 0:
    raise Exception("Could not lookup platform in inventory")
resource = data[0]

# lookup operation
req = requests.get(endpoint+'operation/definitions?resourceId=%d' % resource['resourceId'],headers=headers,auth=auth)
for opdef in req.json():
    if opdef['name'] == 'discovery':
        # now we'll create draft operation
        print 'Creating draft operation'
        req = requests.post(endpoint+'operation/definition/%d?resourceId=%d' %
                (opdef['id'],resource['resourceId']),{},headers=headers,auth=auth)
        op = req.json()
        # fix operation body and set operation parameters
        op['readyToSubmit'] = True
        op['params'] = {'detailedDiscovery':False}
        # finally we can schedule our operation
        print 'Scheduling..'
        req = requests.put(endpoint+'operation/%d' % op['id'],json.dumps(op),headers=headers,auth=auth)
        history_url = [x for x in req.json()['links'] if x.has_key('history')][0]['history']['href']
        result = requests.get(history_url,headers=headers,auth=auth)
        data = result.json()
        # wait for it
        while data['status'] == 'In Progress':
            print 'Waiting for operation..'
            result = requests.get(history_url,headers=headers,auth=auth)
            data = result.json()
            time.sleep(0.3)
        print 'Operation finished'
        print 'Status: %s ' % data['status']
        print 'Result: %s ' % data['result']

