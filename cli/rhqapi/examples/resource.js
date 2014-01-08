/*
* resource.js
* 
* This example shows basics about Resource object from rhqapi.js and also a way to configure a resource.
* For more see resourceOperations.js and resourceCreateChild.js 
* @author Libor Zoubek <lzoubek@redhat.com>
*/

var rhqapi = require("modules:/rhqapi");


// you can create a resource just by passing and ID
var resource = rhqapi.Resource(12345);

// or you get Resource instances directly when querying inventory
var resources = rhqapi.resources.find();
var resource = resources[0];


// you can get a resource proxy (same as you do using ProxyFactory)
var proxy = resource.getProxy();

// get a parent resource (returns nothing for platforms not having parent)
resource.parent()

// list all children
resource.children()

// list some chidren - you can use any query keys/values same as resources.js example
resource.children({availability:"up"})

// this returns true if current availability for current resource is UP
resource.isAvailable();

// this returns true if current availability for current resource is UP, but polls 
resource.waitForAvailable();

// this returns true if a resource still exists in inventory
resource.exists()

// retrieve resource LIVE configuration - returns javascipt object (hashmap)
var config = resource.getCofiguration();

// we can update some values and then update configuration for resource
resource.updateConfiguration(config);

// or we can update configuration only by passing values that we want to update
var result = resource.updateConfiguration({"propertyName":"value"})
// result is True on success

// removing a resource - this returns True on success, which means : resource has been removed and is no longer in inventory
resource.remove();

// uninventory a resource
resource.uninventory();

