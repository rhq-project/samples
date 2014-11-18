/*
* resourceCreateChild.js
* 
* This example shows how to create a new child resources using rhqapi.js.
* There are 2 examples
*  1. create child resource with content
*  2. create child resource without content 
* @author Libor Zoubek <lzoubek@redhat.com>
*/

var rhqapi = require("modules:/rhqapi");

// let's say we have a JBoss AS7 Standalone server
// we use 1st AS7 instance found in inventory
var jboss = rhqapi.resources.find({type:"JBossAS7 Standalone Server"})[0];


// 1st example shows how to create a child resource with content (mostly Deployments)

// and we have a deployment file 
var deployment = "/tmp/hello.war";

// we'd like to deploy it
// type:"Deployment" applies only for AS7 Standalone server, other servers might require different name
var child = jboss.createChild({name:"hello.war",type:"Deployment",content:"/tmp/hello.war"});

// let's say we got new version of this deployment 
// and we need to deploy it
// we expect hello.war deployment is already present
var deployment = "/tmp/hellov2.war";

// let's find it
var hello = jboss.child({type:"Deployment",name:"hello.war"});

// let's backup the old content 
hello.retrieveContent("/tmp/hellov1.war");

// let's update it's content
hello.updateContent(deployment,"2.0");


// 2nd example shows how to create child resource without content

// we'll create a Network Interface resource on AS7
// 'config' parameter can for sure be used for resources with content if some configuration is required
var iface = jboss.createChild({name:"testinterface",type:"Network Interface",config:{"inet-address":"127.0.0.1","any-address":false}});


