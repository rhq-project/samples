"""
Creates WAR deployment on AS7 resource

Looks up AS7 Standalone Server in inventory, deploys 'hello.war', ensures new resource was created.

Requires RHQ 4.8
"""
import sys,os,time
import requests,json

endpoint = 'http://' + os.getenv('RHQ_HOST','localhost') + ':7080/rest/'
auth = (os.getenv('RHQ_USER','rhqadmin'),os.getenv('RHQ_PASSWORD','rhqadmin'))
headers = {'accept':'application/json','content-type': 'application/json'}

def find_resource():
    """
    Finds JBoss AS7 Standalone Server resource in inventory and returns it
    """
    # currently we cannot query REST API for particular resource type name
    req = requests.get(endpoint+'resource?category=SERVER&q=EAP',headers=headers,auth=auth)
    data = req.json()
    for res in data:
        if res['typeName'] == 'JBossAS7 Standalone Server':
            if res['resourceName'].find(':6990') > 0:
                # skip RHQ Server itself - it does not support deployments
                continue
            return res

    raise Exception("Could not lookup JBoss AS7 Standalone Server in inventory")


print 'Lookup resource'
resource = find_resource()
print 'Uploading deployment'
req = requests.post(endpoint+'content/fresh',
        data=open('hello.war','rb').read(),
        auth=auth,
        headers={'Content-Type':'application/octet-stream','accept':headers['accept']}
        )
# get a handle of uploaded file
handle = req.json()['value']

data = {'resourceName':'hello.war','parentId':resource['resourceId'],'typeName':'Deployment','pluginName':'JBossAS7','resourceConfig':{'runtimeName':'hello.war'}}
print 'Creating resource'
# we should get new resource as a response 
req = requests.post(endpoint+'resource?handle=%s' % handle, json.dumps(data),auth=auth,headers=headers)
if req.status_code == 200:
    print req.json()
else:
    print 'Error during creating resource, server returned %d : %s' % (req.status_code,req.text)


