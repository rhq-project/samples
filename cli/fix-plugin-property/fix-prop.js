
// Script to fix an incorrect deployDir plugin config setting for as7/eap6 kind of servers
// that were taken into inventory and where the deployDir plugin config is set to
// $as/standalone/deployment instead of ...deployments (see the trailing 's').
//
// The script loops over the as7 standalone servers in inventory and
// updates the connection property where needed


// Find the servers
var criteria = new ResourceCriteria();
criteria.addFilterResourceTypeName("JBossAS7 Standalone Server");
var servers = ResourceManager.findResourcesByCriteria(criteria); // returns a PageList

// Loop over them
for (i = 0 ; i < servers.size(); i++ )  {
   var server = servers.get(i);
   fix(server);
}


//
// Fix one server at a time
function fix (server) {

    println("Looking at server " + server.getName() + " with id " + server.getId());

    var id = server.getId();

    // Find the resource by id
    var res = ProxyFactory.getResource(id);

    // Get the plugin configuration and the connection properties for baseDir and deployDir
    var config = res.getPluginConfiguration();
    var baseDir = config.getSimpleValue("baseDir");
    var deployDir = config.getSimpleValue("deployDir");

    println("  Deploy dir found is " + deployDir);

    if ((deployDir.slice(-"deployment".length) == "deployment")) {
        // we have the bogus value, lets correct it
        var tmp = deployDir + "s";
        // create a new property and put it into the configuration, overwriting the old value
        var newProp = new PropertySimple("deployDir",tmp);
        config.put(newProp);
        // write the updated configuration down to the server
        res.updatePluginConfiguration(config);
        println("  Set deploy dir to " + tmp);
    }
    else{
        println("  Directory " + deployDir + " looks already correct, so doing nothing");
    }
}
