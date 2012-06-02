/*
*    	JON import script for JBoss-instances and JON-agent
*	based on https://github.com/stormgrind/cirras-rpm/blob/master/src/import-servers.js	
*
*    	author: Sascha Moellering <sascha.moellering@zanox.com>
*
*/

/*
* 	Declaring variables
* 	if the strings are blank, the default-values don't get overwritten
*/

var jboss_principal 		    = "" 
var jboss_credentials 		    = "" 
var jboss_shutdownMethod 	    = "" 
var jboss_javaHome 		        = "" 
var jboss_shutdownScript	    = ""
var jboss_startScript		    = ""
var jboss_log_enabled		    = ""
var jboss_log_minimumSeverity	= ""

/*
* 	Importing JON-agent
*/

var discovered_rhq_agents = findResources("RHQ Agent", false);
printServers(discovered_rhq_agents);

if (discovered_rhq_agents != null && discovered_rhq_agents.size() > 0) {
    var agentResourceIds = [];

    for (i = 0; i < discovered_rhq_agents.size(); i++) {
        addDependencyIds(discovered_rhq_agents.get(i), agentResourceIds);
    }

    DiscoveryBoss.importResources(agentResourceIds);
}

/*
* 	Importing JBossAS/JBoss EAP
*/

var imported_jboss_servers = findResources("JBossAS Server");

println("Imported JBoss AS 5/6 servers:");
printServers(imported_jboss_servers);

println("Discovering new JBoss AS 5/6 servers...");
var discovered_jboss_servers = findResources("JBossAS Server", false);
printServers(discovered_jboss_servers);

if (discovered_jboss_servers != null && discovered_jboss_servers.size() > 0) {
    var jbossResourceIds = [];

    for (i = 0; i < discovered_jboss_servers.size(); i++) {
        addDependencyIds(discovered_jboss_servers.get(i), jbossResourceIds);
    }

    println("Importing " + discovered_jboss_servers.size() + " JBoss AS 5/6 servers...");
    DiscoveryBoss.importResources(jbossResourceIds);
    println("Imported.");

    for (i = 0; i < jbossResourceIds.length; i++) {
        println("Updating JBoss Config for " + discovered_jboss_servers.get(i));
        var config = ConfigurationManager.getPluginConfiguration(jbossResourceIds[i]);
	
	if (!isBlank(jboss_principal)) { config.getSimple("principal").setStringValue(jboss_principal); }
        if (!isBlank(jboss_credentials)) { config.getSimple("credentials").setStringValue(jboss_credentials); }
	if (!isBlank(jboss_shutdownMethod)) { config.getSimple("shutdownMethod").setStringValue(jboss_shutdownMethod); }
	if (!isBlank(jboss_javaHome)) { config.getSimple("javaHome").setStringValue(jboss_javaHome); }
	if (!isBlank(jboss_shutdownScript)) { config.getSimple("shutdownScript").setStringValue(jboss_shutdownScript); }
	if (!isBlank(jboss_startScript)) { config.getSimple("startScript").setStringValue(jboss_startScript); }
        var list = config.getList("logEventSources").getList();

        for (a = 0; a < list.size(); a++) {
		if (list.get(i).getName() == "logEventSource") {
			if (!isBlank(jboss_log_enabled)) { list.get(i).getSimple("enabled").setStringValue(jboss_log_enabled); }
			if (!isBlank(jboss_log_minimumSeverity)) { list.get(i).getSimple("minimumSeverity").setStringValue(jboss_log_minimumSeverity); }
		}
	}

        ConfigurationManager.updatePluginConfiguration(jbossResourceIds[i], config);
    }
}


/*
*
* 	Finds resources of a specific name
*
*/
function findResources(name, imported) {
    imported = typeof(imported) != 'undefined' ? imported : true;

    var resCriteria = new ResourceCriteria();

    resCriteria.addFilterResourceTypeName(name);

    if (!imported) {
        resCriteria.addFilterInventoryStatus(InventoryStatus.NEW);
    }

    return ResourceManager.findResourcesByCriteria(resCriteria);
}

/*
*
* 	Finds recursively the ids of the parent-resources and adds them if they are 
* 	"NEW" in the inventory
*
*/

function addDependencyIds(resource, array) {
    var parentResource = ResourceManager.getResource(resource.id).getParentResource();

    if (parentResource != null) {
        parentResource = ResourceManager.getResource(parentResource.id);

        if (parentResource.getInventoryStatus().equals(InventoryStatus.NEW))
            addDependencyIds(parentResource, array);
    }

    array.push(resource.id);
}

/*
* 	Prints a list of servers
*
*/

function printServers(resources) {
    if (resources != null && resources.size() > 0) {
        for (var i = 0; i < resources.size(); i++) {
            var resource = resources.get(i);
            println(" - " + resource.name);
        }
    } else {
        println("No servers found.")
    }
}

/*
* 	Checks if string is blank
*
*/

function isBlank(pString){
    if (!pString || pString.length == 0) {
        return true;
    }
    // checks for a non-white space character 
    // which I think [citation needed] is faster 
    // than removing all the whitespace and checking 
    // against an empty string
    return !/[^\s]+/.test(pString);
}
