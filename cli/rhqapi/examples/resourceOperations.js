/*
* resourceOperations.js
* 
* This example shows how to invoke operations on resource. Operations can also be scheduled using scheduleOperation.
* Once invokeOperation finishes you can be almost sure that it actually finished (or timed out)
* 
* @author Libor Zoubek <lzoubek@redhat.com>
*/

var rhqapi = require("modules:/rhqapi");


// you can create a resource just by passing and ID
var resource = rhqapi.resources.platforms()[0]

// run discovery operation on platform resource - no need to pass any parameters, defaults are taken
resource.invokeOperation("discovery");

// run discovery operation with passing parameters
resource.invokeOperation("discovery",{"detailedDiscovery":True});

// if we are interested in operation result or status
var result = resource.invokeOperation("viewProcessList")
println(result["status"])
println(result["result"])
println(result["error"])

// schedule operation that will run 10 times each 600 seconds and is going to start right now
// scheduling operation does not return nothing
//
resource.scheduleOperation("discovery",0,600,10,{detailedDiscovery:false})
