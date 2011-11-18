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
var resources = [];
var agents = [];

// if we have a group name as argument, just scan all nodes from within this group
if( args.length == 1 ) {
	groupName = args[0];
	println("Scanning JBoss AS server instances for group " + groupName);
	var criteria = ResourceGroupCriteria();
	criteria.addFilterName(groupName);
	criteria.addFilterResourceTypeName("JBossAS Server");
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
	}
}
else { // no group name, so scan all RHQ Agents
	println("Scanning all RHQ Agent instances");
	var rc = ResourceCriteria();
	var resType = ResourceTypeManager.getResourceTypeByNameAndPlugin("RHQ Agent", "RHQAgent");
	rc.addFilterResourceTypeName(resType.name);		
	resources = ResourceManager.findResourcesByCriteria(rc).toArray();
	
	var idx=0;
	for( i in resources ) {
		if( resources[i].resourceType.id == resType.id ) {
			agents[idx] = resources[i];
			idx = idx + 1;
		}
	}
}


// for each agent, issue executeAvailabilityScan command  
if( agents != null && agents.length != 0) {
	println("Executing on " + agents.length + " agents ");

	for( a in agents ) {
		var agent = agents[a];

		println("  executing availability scan on agent" );
		println("    -> " + agent.name + " / " + agent.id);
		var config = new Configuration();
		config.put(new PropertySimple("changesOnly", "true") );

		var ros = OperationManager.scheduleResourceOperation(
			agent.id, 
			"executeAvailabilityScan", 
			0,   // delay
			1,   // repeatInterval
			0,   // repeat Count
			10000000,  // timeOut
			config,    // config
			"test from cli" // description
		);

		println(ros);
		println("");
	}
}
println("Done!");
