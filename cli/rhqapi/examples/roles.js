/*
* roles.js
* 
* This example shows basics about users, roles and permissions from rhqapi.js
*  
* @author Filip Brychta <fbrychta@redhat.com>
*/

var rhqapi = require("modules:/rhqapi");

var users = rhqapi.users;
var roles = rhqapi.roles;
var permissions = rhqapi.permissions

// define role names
var guestRoleName = "Guest";
var bossRoleName = "Boss";

// define user name
var jramboName = "jrambo";


// roles

// create a role with default permissions
var guestRole = roles.createRole({name: guestRoleName,description:guestRoleName+" role with default permissions."});
// create a role with all permissions
var bossRole = roles.createRole({name: bossRoleName,description:bossRoleName+" role with all permissions.",permissions:permissions.all });

// searching for roles
guestRole = roles.getRole(guestRoleName);
bossRole = roles.getRole(bossRoleName);
var foundRoles = roles.findRoles({name:bossRoleName,description:"description"});


// users

// get all available users
var allUsers = users.getAllUsers();

// create a new user
var jrambo = users.addUser({firstName:"John",lastName:"Rambo",name:jramboName,
	department:"Green berets",emailAddress:"hell@hell.com",factive:true,roles:[bossRoleName]},"password");

// searching for users
jrambo = users.getUser(jramboName);
var foundUsers = users.findUsers({firstName:"John",department:"Green berets"});

// get all jrambo's roles
var allJramboRoles = jrambo.getAllAssignedRoles();


// cleaning
roles.deleteRoles([guestRoleName,bossRoleName]);
users.deleteUsers(jramboName);

