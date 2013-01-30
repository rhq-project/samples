
/*
* resourceMetrics.js
* 
* This example shows how to work with resource metrics using rhqapi.js
* 
* @author Libor Zoubek <lzoubek@redhat.com>
*/

var rhqapi = require("modules:/rhqapi");


// get 1st platform resource
var resource = rhqapi.resources.platforms()[0]


// we can enumerate all metrics
for (key in resource.metrics) {
    println("Metric key: " +key+ " name: "+resource.metrics[key].name)
}

// or get metric by it's display name
var metric = resource.getMetric("Free Memory");

// retrieve live value
var value = metric.getLiveValue();

// disable it (so it is no longer scheduled)
metric.set(false);

// enable
metric.set(true);

// set interval (in seconds)
metric.set(true,60)
