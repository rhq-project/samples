/*
 * createGroup.js
 * --------------
 * The purpose of this script is to show how to create a new compatible group within RHQ
 * with the CLI.
 *
 * This script was not tested very well and should not be used in productive 
 * environments without further testing. 
 *
 * Version 1.0: Initial version.
 * 
 *  
 * As always: No warrenties and use it on your own risk
 *
 * @author: Wanja Pernath
 */

// name of the group
var groupName = "GroupName";

// Name of the plugin which should handle this compatible group (JBossAS or JBossAS5)
var pluginName = "JBossAS";

if( args.length <= 2 ) groupName = args[0];
if( args.length == 2) pluginName = args[1];

if( pluginName != "JBossAS" && pluginName != "JBossAS5" ) {
	throw("Error: resourceType name must be either JBossAS or JBossAS5");
}

println("About to create a new Compatible Group with name " + groupName + " and resource type " + pluginName + "...");

// First find resourceType specified by pluginName
var resType = ResourceTypeManager.getResourceTypeByNameAndPlugin("JBossAS Server", pluginName);

// Secondly, test to see if the specified group name already exists
var criteria = ResourceGroupCriteria();
criteria.addFilterName(groupName);
criteria.fetchExplicitResources(false);
var resourceGroups = ResourceGroupManager.findResourceGroupsByCriteria(criteria);

if( resourceGroups != null && resourceGroups.size() > 0 ) {
	throw("A group with name " + groupName + " already exists: ID = " + resourceGroups.get(0).getId());
}


// Now just create the group
var rg = new ResourceGroup(groupName, resType);
rg.setRecursive(true);
rg.setDescription("Created via groupcontrol scripts on " + new java.util.Date().toString());

ResourceGroupManager.createResourceGroup(rg);
println("Group created");


