/*
 * This example shows how to run or schedule group operations using rhqapi.js
 *
 */

var rhqapi = require("modules:/rhqapi");

// create a group of all agents
var agents = rhqapi.groups.create("My agents",rhqapi.resources.find({name:"RHQ Agent"}));

// run operation on group (schedules operation and returns result)
var result = agents.runOperation({name:"executePromptCommand",config:{command:"discovery -f"});
println(result["status"])
println(result["error"])

// schedule operation to run 3times every 10 seconds on group (does not care about result)
agents.scheduleOperation({name:"executePromptCommand",repeatCount:3,repeatInterval:10,config:{command:"discovery -f"}});

// schedule operation using cron expression (run every hour)
agents.scheduleOperationUsingCron("executePromptCommand","0 * * * *",{command:"discovery -f"});



