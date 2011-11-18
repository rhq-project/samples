/*
 * listServers.js
 * --------------
 * The purpose of this script is to show all JBossAS Server instances in your repository 
 * by using the CLI
 * 
 * This script was not tested very well and should not be used in productive 
 * environments without further testing. 
 *
 * Version 2.0: Fixes for RHQ 3.0 (new resource naming scheme)
 * Version 1.0: Initial version.
 *  
 * As always: No warrenties and use it on your own risk
 *
 * @author: Wanja Pernath
 */

// Build criteria to search for JBoss AS Server instances
var serverMetrics = new java.util.HashMap();

var criteria = new ResourceCriteria();
criteria.addFilterResourceTypeName("JBossAS Server");
criteria.addSortVersion(PageOrdering.ASC);
criteria.fetchParentResource(true);
criteria.fetchAgent(true);
criteria.fetchCurrentAvailability(true);
criteria.fetchResourceErrors(true);
criteria.fetchProductVersion(true);
criteria.fetchImplicitGroups(true);
var resources = ResourceManager.findResourcesByCriteria(criteria);

if( resources != null ) {
	var formatString = "%-40.40s %-15.15s %-20.20s %7.7s %20.20s %1s %tD %tT %7.0f %7.2f %7.2f %6.2f";
	var formatStringHdr = "%-40.40s %-15.15s %-20.20s %-7.7s %-20.20s %1s %-17.17s %-7.7s %-7.7s %-7.7s %-6.6s";
	var f = new java.util.Formatter();	

	f.format(formatStringHdr, ["Name", "Version", "HostName", "UsrLoad", "Listen Addr", "A", "Last UP-Time", "Act.Thrds", "Tot. MB", "Used MB", "% Free"]);
	println(f.toString());
	println("-------------------------------------------------------------------------------------------------------------------------------------------------------------");
	resources = resources.toArray();
	for( i in resources ) {
		f = new java.util.Formatter();
		var res = resources[i];
		var parent = ProxyFactory.getResource(res.parentResource.id);
		var avail = AvailabilityManager.getCurrentAvailabilityForResource(res.id);
		var percent = 0;
		var totalMem = 0;
		var freeMem = 0;
		var usedMem = 0;
		var activeThreads = 0;
		var userLoad = "0%";
		var hostName;
		var resName;
		var hostAddress;


		
		
		hostName = parent.name;
		resName  = res.name;
		hostAddress = parent.hostaddress;
			  
		// use real value
		hostName = parent.hostname.displayValue;


		if( res.agent.status == 0 ) {
			activeThreads = getLongMetric(res.id, "Active Thread Count");
			freeMem = getLongMetric(res.id, "JVM Free Memory");
			totalMem = getLongMetric(res.id, "JVM Total Memory");
 			percent = freeMem/totalMem * 100;
 			totalMem = totalMem / (1024*1024);
 			freeMem = freeMem / (1024*1024); 			
 			usedMem = totalMem - freeMem; 			
 			
			userLoad = parent.userLoad.displayValue;
		}		
		
		f.format(formatString, [
			resName, 
			res.version, 
			hostName, 
			userLoad,
			hostAddress, 
			((avail.availabilityType == "UP" ) ? "U" : "D"),
			new java.util.Date(avail.startTime.time),
			new java.util.Date(avail.startTime.time),
			activeThreads,
			totalMem,
			usedMem,
			percent			
		]);
		println(f.toString());		
	}
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

