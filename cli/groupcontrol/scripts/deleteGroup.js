/*
 * deployToGroup.js
 * ----------------
 * The purpose of this script is to show how to delete a compatible group within RHQ with
 * the new RHQ CLI.
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

if( args.length == 1 ) groupName = args[0];


println("About to delete a Compatible Group with name " + groupName + "...");


// Secondly, test to see if the specified group name already exists
var criteria = ResourceGroupCriteria();
criteria.addFilterName(groupName);
criteria.fetchExplicitResources(false);
var resourceGroups = ResourceGroupManager.findResourceGroupsByCriteria(criteria);

if( resourceGroups == null || resourceGroups.size() == 0 ) {
	throw("A group with name " + groupName + " does not exists");
}

for( i = 0; i<resourceGroups.size(); ++i ) {
	var group = resourceGroups.get(i);
	// Now just create the group
	println("Deleting group " + group.id + "..." );
	ResourceGroupManager.deleteResourceGroup(group.id);

}

println("Groups deleted");


