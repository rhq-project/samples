/*
* resources.js
*  
* This example shows how to use rhqapi.js to query RHQ Inventory
* the rhqapi.js query API has been simplified. If you take look at ResourceCriteria class and its methods addFilter<key>, 
* you can use all these <key>s in this query API and even more - there are shortcuts for long key names and 
* also for Enum keys and values (like ResourceCategory or AvailabilityType)
* 
* Unlike ResourceManager, rhqapi.js returns Arrays of Resource instances (also come from rhqapi.js)
* see resource.js example to see what you can do with resources 
*
* @author Libor Zoubek <lzoubek@redhat.com>
*/

var rhqapi = require("modules:/rhqapi");

var resources = rhqapi.resources;

// list all resources
resources.find();

// list all platforms
resources.platforms()
// or (either capital or noncapital ResourceCategory value can be used)
resources.find({category:"platform"})
// which is equivalent to
resources.find({ResourceCategory:ResourceCategory.PLATFORM})

// list all AS7 Servers that are down
resources.find({type:"JBossAS7 Standalone Server",availability:"down"});
// which is equivalent to
resources.find({resourceTypeName:"JBossAS7 Standalone Server",currentAvailability:AvailabilityType.DOWN})

// list resources having given ids
resources.find({ids:[1,2,3,4,5]})

// iterate over an array of returned resources
resources.find().forEach(function (x) {
  println("Found resource "+x);
});
