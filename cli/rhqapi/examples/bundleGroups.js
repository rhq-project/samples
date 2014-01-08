/*
 * bundleGroups.js
 *
 * This example shows usage of bundle groups using rhqapi.js.
 */
var rhqapi = require("modules:/rhqapi.js");

// lookup bundle groups based on criteria query
rhqapi.bundlesGroups.find({name:"my group"})

// create an empty bundleGroup
var group = rhqapi.bundleGroups.create("emptygroup");

// assign or all bundles to this group
group.assignBundles(rhqapi.bundles.find())

// we can get bundles assigned to this group
var bundles = group.bundles()

// we can unassing bundles with this group
group.unassignBundles(bundles)

// or we can create a group and initially assign its bundles
var group = rhqapi.bundleGroups.create("fullgroup",rhqapi.bundles.find())

// create bundle on server and assign it to bundle group(s)
var bundle = rhqapi.bundles.create({dist:"/path/to/bundle/distribution/file.zip",groups:[group]});
