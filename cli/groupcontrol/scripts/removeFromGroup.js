/*
 * removeFromGroup.js
 * ------------------
 * The purpose of this script is to show how to remove a resource from a compatible group 
 * with RHQ 4.2 scripting 
 *
 * This script was not tested very well and should not be used in productive 
 * environments without further testing. 
 *
 * Version 1.0: Initial version
 * 
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
criteria.fetchExplicitResources(true);
var resourceGroups = ResourceGroupManager.findResourceGroupsByCriteria(criteria);

if( resourceGroups == null || resourceGroups.size() == 0 ) {
	throw("A group with name " + groupName + " does not exists");
}
var group = resourceGroups.get(0);

if( group.explicitResources == null ) {
	throw( "This group does not contain any explicit resources to remove!");
}

// now, search for EAP resources based on criteria
var resources = group.explicitResources.toArray();

var matchingResources = [];
var idx = 0;

for( i in resources ) {
	var res = resources[i];	
	var resType = res.resourceType.name;
	
	if( resType != "JBossAS Server") {
		println("    ---> Resource not of required type. Exiting!");
		usage();
	}

	var name = res.name;

	// use String.matches(regexp) here
	if( name.matches(".*" + searchPattern + ".*")) {
		matchingResources[idx] = res;
		idx = idx + 1;
		println(name + " matches your pattern");		
	}
	else {
	    println(name + " does not match pattern ");
	}
}

if( matchingResources.length == 0 ) {
	println("Could not find any matching resources!)");
}
else if( matchingResources.length == 1 ) {
	var res = matchingResources[0];
	ResourceGroupManager.removeResourcesFromGroup(group.id, [res.id]);
	println("Removed " + res.name + " from group");
}
else {
	println("Found too many matching resources. Please be more explicit!");
}

println("Done!");


