/*
 * This example shows what you can do with resourceTypes using rhqapi.js
 * there is not much to show (do) with resource types .. just nice way to find
 * them
 */

var rhqapi = require("modules:/rhqapi");
// find JBos AS7 Standalone resource type
var as7type = rhqapi.resourceTypes.find({name:"JBoss AS7 Standalone Server"})[0];

// find all child resource types
rhqapi.resourceTypes.find({parentId:as7Type.id})

// find all resource types from Platforms plugin
rhqapi.resourceTypes.find({plugin:"Platforms"})
