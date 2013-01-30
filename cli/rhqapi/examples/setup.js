/*
 * this example describes how to setup rhqapi.js. You can do the setup by calling 'initialize' function which sets
 * up module's global variables
 */

var rhqapi = require("modules:/rhqapi");

// rhqapi.js can produce some output so you can actually see, what is happening behind the scenes
// you can adjust verbosity of api
// there are 5 levels (default 0), -2=error, -1=warn, info=0, debug=1, trace=2
var verbose = 2 // will start producing trace messages

// as rhqapi tries to be synchronous and RHQ Java remote API itself is asynchronous, you can adjust timeouts
// a delay(seconds) setting is used as a polling period whenever API is waiting for some event that should happen on server
var delay = 3;
// a timeout(seconds) is total timeout for each asynchronous operation. For example Bundle.deploy Resource.invokeOperation, Resource.waitForAvailable, and also Resource.createChild, Resource.updateConfiuguration and  Resource.remove
var timeout = 300

// to setup rhq api simply call initialize function that sets it all up
rhqapi.initialize(verbose,delay,timeout);
