/*
 * startGroup.js
 * -------------
 * The purpose of this script is to show how to start all EAP instances of a compatible group
 * with RHQ 4.2 scripting.
 * 
 * This script was not tested very well and should not be used in productive 
 * environments without further testing. 
 *
 * Version 1.0: Initial version
 *  
 * As always: No warrenties and use it on your own risk
 *
 * @author: Wanja Pernath
 */

// name of the group
var groupName = "GroupName";

if( args.length == 1 ) groupName = args[0];


println("About to start all EAP instances of the group with name " + groupName + "...");


// Secondly, test to see if the specified group name already exists
var criteria = ResourceGroupCriteria();
criteria.addFilterName(groupName);
criteria.fetchExplicitResources(true);
var resourceGroups = ResourceGroupManager.findResourceGroupsByCriteria(criteria);

if( resourceGroups == null || resourceGroups.size() == 0 ) {
	throw("A group with name " + groupName + " does not exists");
}

var group = resourceGroups.get(0);

if( group.explicitResources == null || group.explicitResources.size() == 0 ) {
	println("  Group does not contain explicit resources --> exiting!" );
	usage();
}

var resourcesArray = group.explicitResources.toArray();

for( i in resourcesArray ) {
	var res = resourcesArray[i];
	var resType = res.resourceType.name;
	println("  Found resource " + res.name + " of type " + resType + " and ID " + res.id);
	
	if( resType != "JBossAS Server") {
		println("    ---> Resource not of required type. Exiting!");
		usage();
	}
	
	// get server resource to start/stop it and to redeploy application
	var server = ProxyFactory.getResource(res.id);
	var avail = AvailabilityManager.getCurrentAvailabilityForResource(server.id);
	
	if( avail.availabilityType.name() == "UP" ) {
		println("    Skipping " + server.name + ". It's up and running.");
		continue;
	}
	else {
		println("    Starting " + server.name + "....");	
		try {
			server.start();
		}
		catch( ex ) {
			println("   --> Caught " + ex );
		}		
	}	
}

println("Done!");
