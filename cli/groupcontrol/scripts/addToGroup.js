/*
 * addToGroup.js
 * ----------------
 * The purpose of this script is to show how to add new EAP instances to a compatible group
 * with RHQ 4.2 scripting engine. 
 
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
var searchPattern;

if( args.length != 2 ) {
	println("Call this script with <groupName> and <searchPattern>");
	throw("Invalid args!");
}

groupName = args[0];
searchPattern = args[1];


// Secondly, test to see if the specified group name already exists
var criteria = ResourceGroupCriteria();
criteria.addFilterName(groupName);
criteria.fetchExplicitResources(false);
var resourceGroups = ResourceGroupManager.findResourceGroupsByCriteria(criteria);

if( resourceGroups == null || resourceGroups.size() == 0 ) {
	throw("A group with name " + groupName + " does not exists");
}
var group = resourceGroups.get(0);

// now, search for EAP resources based on criteria
criteria = new ResourceCriteria();
criteria.addFilterName(searchPattern);
criteria.addFilterResourceTypeName("JBossAS Server");

var resources = ResourceManager.findResourcesByCriteria(criteria);

if( resources != null ) {
	if( resources.size() > 1 ) {
		println("Found more than one JBossAS Server instance. Try to specialize.");
		for( i =0; i < resources.size(); ++i) {
			var resource = resources.get(i);
			println("  found " + resource.name );
		}
	}
	else if( resources.size() == 1 ) {
		resource = resources.get(0);
		println("Found one JBossAS Server instance. Trying to add it.");
		println("  " + resource.name );
	    ResourceGroupManager.addResourcesToGroup(group.id, [resource.id]);
		println("  Added to Group!");
	}
	else {
		println("Did not find any JBossAS Server instance matching your pattern. Try again.");
	}
}

println("Done!");


