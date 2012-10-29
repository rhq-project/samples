/*
* resourceOperations.js
* 
* This example shows how to invoke operations on resource. Operations cannot be scheduled at this time (by specifying future date o f execution),
* but once invokeOperation finishes you can be almost sure that it actually finished (or timed out)
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

