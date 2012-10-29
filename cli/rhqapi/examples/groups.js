/*
 * This example shows what you can do with resource groups using rhqapi.js
 *
 */

var rhqapi = require("modules:/rhqapi");

// list all groups
rhqapi.groups.find();

// also add filtering
rhqapi.groups.find({name:"my group"});

// creating a group
rhqapi.groups.create("my group",[new Resource(12345),new Resource(54321)]);

// or we can create a group by passsing output of resources.find function
rhqapi.groups.create("My agents",rhqapi.resources.find({name:"RHQ Agent"}));

// group operations - TODO
