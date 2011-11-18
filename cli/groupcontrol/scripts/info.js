/*
 * info.js
 * --------------
 * The purpose of this script is to show all JBossAS Server instances in your repository 
 * by using the CLI together with # of CPUs. At the end you'll see the total number of
 * distinct CPUs of this repository
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

// Build criteria to search for JBoss AS Server instances
var serverMetrics = new java.util.HashMap();
var cpuSet = new java.util.HashSet();
var hostSet = new java.util.HashSet();

var criteria = new ResourceCriteria();
criteria.addFilterResourceTypeName("JBossAS Server");
criteria.addSortVersion(PageOrdering.ASC);
criteria.fetchParentResource(true);
criteria.fetchAgent(true);
criteria.fetchCurrentAvailability(true);
criteria.fetchResourceErrors(true);
criteria.fetchProductVersion(true);
var resources = ResourceManager.findResourcesByCriteria(criteria);

if( resources != null ) {
	var formatString = "%-40.40s %-15.15s %-20.20s %7.7s %1s %5.0f ";
	var formatStringHdr = "%-40.40s %-15.15s %-20.20s %-7.7s %1s %-8.8s ";
	var f = new java.util.Formatter();	

	f.format(formatStringHdr, ["Name", "Version", "HostName", "UsrLoad", "A", "#Cores"]);
	println(f.toString());
	println("-----------------------------------------------------------------------------------------------");
	resources = resources.toArray();
	for( i in resources ) {
		f = new java.util.Formatter();
		var res = resources[i];
		var parent = ProxyFactory.getResource(res.parentResource.id);
		var avail = AvailabilityManager.getCurrentAvailabilityForResource(res.id);
		
	  var resName = res.name;
	  var hostName = parent.hostname.displayValue;
	  
	  var cpuCount = 1;		
		var userLoad = "0%";
		
		// now take the parent resource (which is the OS) and count the CPUs of it
		var rc = ResourceCriteria();
		rc.addFilterParentResourceId(parent.id);
		rc.addFilterResourceTypeName("CPU");
		var cpus = ResourceManager.findResourcesByCriteria(rc);
		
	  cpuCount = cpus.size();

    // now count the distinct number of CPUs
		var cpuArray = cpus.toArray();
		for( c in cpuArray ) {
			var cpu = cpuArray[c];
			cpuSet.add(cpu.id);
		}
				
		// put parent into hostSet to calculate distinct hosts
		hostSet.add(parent.id);
		
		// check some real values if agent is running
		if( res.agent.status == 0 ) { 			
 			// use real value
 			hostName = parent.hostname.displayValue;
 			userLoad = parent.userLoad.displayValue;
		}		
				
		f.format(formatString, [
			resName, 
			res.version, 
			hostName, 
			userLoad,
			((avail.availabilityType == "UP" ) ? "U" : "D"),
			cpuCount
		]);
		println(f.toString());		
	}
	println("-----------------------------------------------------------------------------------------------");
	println("Total Number of distinct hosts: " + hostSet.size());
	println("Total Number of distinct Cores: " + cpuSet.size());
}

println("");



function getLongMetric( resId, metricName ) {
	var metricDefId;
	if( serverMetrics.get(metricName) == null ) {
		var mdc = MeasurementDefinitionCriteria();
		mdc.addFilterResourceTypeName("JBossAS Server"); 
		mdc.addFilterDisplayName(metricName);
		var mdefs = MeasurementDefinitionManager.
							findMeasurementDefinitionsByCriteria(mdc); 
		
		if( mdefs == null || mdefs.size() == 0 ) {
			println("  --> could not find metric " + metricName );
			return 0;
		}
		else {
			var mdef = mdefs.get(0);
			metricDefId = mdef.id;
			serverMetrics.put(metricName, metricDefId);
		}
	}
	else {
		metricDefId = serverMetrics.get(metricName);
	}
	
	if( metricDefId != null ) {				
		var metrics = MeasurementDataManager.findLiveData(
			resId, [metricDefId]
		); 
		if( metrics == null || metrics.size() == 0 ) {
			return 0;
		}
		else {
			var metric = metrics.toArray()[0];
			if( metric != null && metric.value != null ) {
				return metric.value.longValue();
			}
			else {
				return 0;
			}
		}
	}
}

