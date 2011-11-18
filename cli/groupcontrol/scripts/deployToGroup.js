/*
 * deployToGroup.js
 * ----------------
 * The purpose of this script is to show how group deployment with RHQ 4.2 scripting 
 * works. This script was not tested very well and should not be used in productive 
 * environments without further testing. 
 *
 * Version 1.0: Initial version, just to update existing WAR/EAR files
 * Version 1.1: Extract packageName, type and version from fileName
 * Version 1.2: Upload given file also if it does not yet exist
 * Version 1.3: This script is now part of the groupcontrol scripts. Automatic starting
 *              and stopping of the EAP instances is removed. There is now an Availability
 *              check done before actually deploying this.
 *              Instead of reading the whole file bytes in, I am now using getFileBytes().
 * 
 *  
 * As always: No warrenties and use it on your own risk
 *
 * @author: Wanja Pernath
 */

// set some defaults
var groupName = "ProductiveCluster"
var fileName;

// The following 3 vars are extracted from the given fileName
var packageName = "test.ear"
var packageType = "ear";
var packageVersion = "1.0";

// check and parse parameters
if( args.length < 2) {
	usage();
}

fileName = args[0];
groupName = args[1];

// check to see if the file exists and is readable by us.
var file = new java.io.File(fileName);

if( !file.exists() ) {
	println(fileName + " does not exist!");
	usage();
}

if( !file.canRead() ) {
	println(fileName + " can't be read!");
	usage();
}

// parse pathName to generate packageName
var packageParser = new PackageParser(fileName);
var packageName = packageParser.packageName;
var packageType = packageParser.packageType;
var packageVersion = packageParser.version;


println("About to deploy " + packageName + " of type " + packageType + " with version " + packageVersion + " to group " + groupName );

// find resource group
var rgc = new ResourceGroupCriteria();
rgc.addFilterName(groupName);
rgc.fetchExplicitResources(true);
var groupList = ResourceGroupManager.findResourceGroupsByCriteria(rgc);

if( groupList == null || groupList.size() != 1 ) {
	println("Can't find a resource group named " + groupName);
	usage();
}

var group = groupList.get(0);	

println("  Found group: " + group.name );
println("  Group ID   : " + group.id );
println("  Description: " + group.description);

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
	
	// we need check to see if the given server is up and running
	var avail = AvailabilityManager.getCurrentAvailabilityForResource(server.id);
	
	// infortunately, we can only proceed with deployment if the server is running. Why?
	if( avail.availabilityType.toString() == "DOWN" ) {
		println("  Server is DOWN. Please first start the server and run this script again!");
		println("");
		continue;
	}
	
	var children = server.children;	
	for( c in children ) {
		var child = children[c];
		var childFound = false;
			
		if( child.name == packageName ) {
			println("    found child: " + child.name + " of ID " + child.id);
			
			println("    download old app to /tmp");
			child.retrieveBackingContent("/tmp/" + packageName + "_" + res.name + "_old");
			
			println("    uploading new application code");
			child.updateBackingContent(fileName);
			
			println("    done!");
			
			childFound = true;
			break;
		}		
	}

	// If the specified package does not exist, create a new one and upload it to the server
	if( childFound == false ) {
		// first we need the resourceType of the app
		var appTypeName = "Web Application (WAR)";
		if( packageType == "war" ) {
			appTypeName = "Web Application (WAR)";
		}
		else if( packageType == "ear" ) {
			appTypeName = "Enterprise Application (EAR)";
		}
		else {
			println("  Unknown package type: " + packageType);
			usage();
		}
		
		// find it
		var appType = ResourceTypeManager.getResourceTypeByNameAndPlugin( appTypeName, "JBossAS" );

		if( appType == null ) {
			println("  Could not find application type. Exit.");
			usage();
		}
		
		println("AppTypeName: "+ appTypeName);
		println("AppType: "+ appType);
		
		// now get the jon package type
		var realPackageType = ContentManager.findPackageTypes( appTypeName, "JBossAS" );
		
		if( realPackageType == null ) {
			println("  Could not find RHQ's packageType. Exit.");
			usage();
		}
				
		// create deployConfig 
		var deployConfig = new Configuration();
		deployConfig.put( new PropertySimple("deployDirectory", "deploy"));
		deployConfig.put( new PropertySimple("deployZipped", "true"));
		deployConfig.put( new PropertySimple("createBackup", "false"));
				
		// create & upload resource
		// NOTE: The JBossAS server must be up and running 
		ResourceFactoryManager.createPackageBackedResource(
			server.id,
			appType.id,
			packageName,
			null,  // pluginConfiguration
			packageName,
			packageVersion,
			null, // architectureId		
			deployConfig,
			getFileBytes(fileName)
		);
	}
}


function usage() {
	println("Usage: deployToGroup <fileName> <groupName>");
	throw "Illegal arguments";
}


/** 
 * This function acts as a class. Call it with a fully qualified path name. 
 * It will take the path, extract the file name and extracts version and 
 * packageType (WAR | EAR).
 * 
 * fullPathName should be something like this
 *   /path/to/file-1.0.war
 *
 * realName   : test
 * packageType: war
 * packageName: file.war
 * version    : 1.0
 */
function PackageParser(fullPathName) {
	var file = new java.io.File(fullPathName);
		
	var fileName = file.getName();
	var packageType = fileName.substring(fileName.lastIndexOf('.')+1);
	var tmp = fileName.substring(0, fileName.lastIndexOf('.'));
	var realName = tmp.substring(0, tmp.lastIndexOf('-'));
	var version = tmp.substring(tmp.lastIndexOf('-') + 1);			
	var packageName = realName + "." + packageType;
	
	/*
	println(packageType);
	println(version);	
	println(realName);
	println(packageName);
	*/
	this.packageType = packageType.toLowerCase();
	this.packageName = packageName;
	this.version     = version;
	this.realName    = realName;
}

