/*
 * statusGroup.js
 * --------------
 * The purpose of this script is to show the status of all EAP instances of a  group 
 * with RHQ 4.2 scripting 
 * 
 * This script was not tested very well and should not be used in productive 
 * environments without further testing. 
 *
 * Version 1.0: Initial version.
 *  
 * As always: No warrenties and use it on your own risk
 *
 * @author: Wanja Pernath
 */

// name of the group
var groupName = "GroupName";

if( args.length == 1 ) groupName = args[0];


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
}
else {
	var resourcesArray = group.explicitResources.toArray();

	for( i in resourcesArray ) {
		var res = resourcesArray[i];
		var resType = res.resourceType.name;
	
		if( resType != "JBossAS Server") {
			println("    ---> Resource not of required type. Exiting!");
			usage();
		}
	
		// get server resource to start/stop it and to 
		// redeploy application
		var server = ProxyFactory.getResource(res.id);
		var avail  = AvailabilityManager.
			getCurrentAvailabilityForResource(server.id);
	
		// get the jvm
		var rc = new ResourceCriteria();
		rc.addFilterResourceTypeName("JBoss AS JVM");
		rc.addFilterParentResourceId(server.id);
		var jvm = ResourceManager.
			findResourcesByCriteria(rc).get(0);
		
		
		println("  " + server.name );
		println("    - Availability: " + avail.availabilityType.getName());
		println("    - Started     : " + avail.startTime.toGMTString());
		println("    - JVM Version : " + jvm.version );
		println("");
	}
}
println("Done!");
