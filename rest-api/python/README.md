# Python examples

These require the [httplib2][1] and [requests][2]  which is not included by default in 
many python installations and needs to be installed separately.

Also required is the JSON module that is standard since Python 2.6

* create_alert_definition.py -- creates example alert definition with various
  condition types
* create_as7_deployment.py -- deploys sample WAR to AS7 via REST api  
* get_status.py -- obtain the system status via REST api
* handle_alert.py -- acknowledge all alerts on given resource
* import.py -- imports everything found in discovery queue to inventory
* schedule_resource_operation.py -- schedules operation on resource REST api
* submit_metric_value.py -- sends random metric values for given schedule via REST api


[1]: http://bitworking.org/projects/httplib2/ref/module-httplib2.html
[2]: http://docs.python-requests.org/
