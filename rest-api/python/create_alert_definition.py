"""
Creates alert definition on platform resource with all possible condition types

Looks up platform in inventory, looks up schedules and creates alert definition with all supported condition types.

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

def find_schedule(resource,name):
    """
    Finds metric schedule by name for given resource 
    """
    req = requests.get(endpoint+'resource/%d/schedules' % resource['resourceId'],headers=headers,auth=auth)
    for sch in req.json():
        if name == sch['scheduleName']:
            return sch
    raise Exception('Requested schedule %s not found for resource %s' % (name,str(resource)))

print 'Lookup resource'
resource = find_resource()
print 'Lookup numeric metric schedule'
numeric = find_schedule(resource,'Native.MemoryInfo.actualFree')
print 'Lookup trait metric schedule'
trait = find_schedule(resource,'Trait.hostname')

# let's construct alert body
alert_body = {'name':'example-alert','conditions':[],'enabled':True,'dampeningCategory':'NONE','conditionMode':'ANY'}

# fire alert when discovery operation succeeds
alert_body['conditions'].append({'name':'discovery','option':'SUCCESS','category':'CONTROL'})

# fire alert when resource goes DOWN
alert_body['conditions'].append({'name':'AVAIL_GOES_DOWN','category':'AVAILABILITY'})

# fire alert when resource goes UP
alert_body['conditions'].append({'name':'AVAIL_GOES_UP','category':'AVAILABILITY'})

# fire alert when resource stays DOWN for 10 minutes
alert_body['conditions'].append({'name':'AVAIL_DURATION_DOWN','category':'AVAIL_DURATION','option':'600'})

# fire alert when file matching '.*' drifts within drift definition matchint 'drift.*'
alert_body['conditions'].append({'name':'drift.*','category':'DRIFT','option':'.*'})

# fire alert when INFO event with message matching '.*' occurs
alert_body['conditions'].append({'name':'INFO','category':'EVENT','option':'.*'})

# fire alert when actual free memory gets under 512B
alert_body['conditions'].append({'category':'THRESHOLD','comparator':'<','threshold':'512','measurementDefinition':numeric['definitionId']})

# fire alert when resource condiguration has changed
# currently not supported for platform since it does not support configuration
#alert_body['conditions'].append({'category':'RESOURCE_CONFIG'})

# fire alert when trait value matches 'foo.*'
alert_body['conditions'].append({'category':'TRAIT','option':'foo.*','measurementDefinition':trait['definitionId']})

# fire alert when actual free memory metric changes in any way
alert_body['conditions'].append({'category':'CHANGE','measurementDefinition':numeric['definitionId']})

# fire alert when value of free memory is inside range from 1B to 2B excluding
# using comparator 
## '>' means 'outside range' excluding
## '<=' means 'inside range' including
alert_body['conditions'].append({'category':'RANGE','option':'1','threshold':'2','comparator':'<','measurementDefinition':numeric['definitionId']})

# fire alert when actual free memory gets by 40% lower than max calculated baseline
alert_body['conditions'].append({'category':'BASELINE','option':'max','threshold':'0.4','comparator':'<','measurementDefinition':numeric['definitionId']})

# create alert definition
print 'Submitting alert definition'
req = requests.post(endpoint+'alert/definitions?resourceId=%d' % resource['resourceId'],json.dumps(alert_body),headers=headers,auth=auth)
print req.json()


