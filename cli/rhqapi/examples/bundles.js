/*
 * bundles.js
 *
 * This example shows how bundle subsystem can be used using rhqapi.js.
 * We'll also show how to use resource groups, for more info about groups see groups.js
 * Since RHQ 4.9.0 you can assign bundles to bundleGroups, see bundleGroups.js
 * for more examples.
 */
var rhqapi = require("modules:/rhqapi.js");

// get all bundles on server and print versions and destinations
var bundles = rhqapi.bundles.find()
bundles.forEach(function(bundle) {
  println(bundle.versions());
  println(bundle.destinations());
  } 
);

// we can also add filters (similar from resources.js)
var bundles = rhqapi.bundles.find({name:"my"})
bundles.forEach(function(bundle) {
  println(bundle.versions({version:"1.0"}));
  println(bundle.destinations({name:"my dest"}));
  } 
);

// create bundle on server
var bundle = rhqapi.bundles.create({dist:"/path/to/bundle/distribution/file.zip"});

// to be able to create a destination, we need compatible resource group, let's create a group of all platforms
var group = rhqapi.groups.create("all platforms",rhqapi.resources.platforms());

// creating destination
var dest = bundle.createDestination(group,"my destination","/tmp");

// finally we deploy a bundle to our destination
var deployment = bundle.deploy(dest);
