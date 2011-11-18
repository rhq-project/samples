/*
 * listGroups.js
 * -------------
 * The purpose of this script is to show all compatible groups in your repository 
 * by using the CLI
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

var criteria = new ResourceGroupCriteria();
criteria.addFilterResourceTypeName("JBossAS Server");
criteria.fetchExplicitResources(true);
criteria.fetchImplicitResources(true);
criteria.addSortName(PageOrdering.ASC);
var groups = ResourceGroupManager.findResourceGroupsByCriteria(criteria);

if( groups != null ) {
	var formatString = "%-32.32s %-15.15s %-10.10s %7.0f %7.0f %7.0f %7.2f %7.2f %7.2f %7.2f";
	var formatStringHdr = "%-32.32s %-15.15s %-10.10s %-7.7s %-7.7s %-7.7s %-7.7s %-7.7s %-7.7s %-7.7s";
	var f = new java.util.Formatter();	

	f.format(formatStringHdr, ["Name", "Location", "Category", "ExplRes", "ImplRes", "Act.Thrds", "Max MB", "Tot.MB", "Used MB", "% Free"]);
	println(f.toString());
	println("-------------------------------------------------------------------------------------------------------------------");
	
	groups = groups.toArray();
	for( i in groups ) {
		f = new java.util.Formatter();
		var group = groups[i];

		var percent = 0;
		var totalMem = 0;
		var freeMem = 0;
		var usedMem = 0;
		var maxMem = 0;
		var activeThreads = 0;
		
		if( group.explicitResources.size() != 0 ) {
			activeThreads = getLongMetric(group.id, "Active Thread Count");
			freeMem = getLongMetric(group.id, "JVM Free Memory");
			totalMem = getLongMetric(group.id, "JVM Total Memory");
			maxMem = getLongMetric(group.id, "JVM Max Memory");
			percent = freeMem/totalMem * 100;
			totalMem = totalMem / (1024*1024);
			freeMem = freeMem / (1024*1024); 			
			usedMem = totalMem - freeMem;
			maxMem = maxMem / (1024*1024);
		}
		
		f.format(formatString, [
			group.name, 
			((group.location == null ) ? "" : group.location), 
			group.groupCategory,
			group.explicitResources.size(),
			group.implicitResources.size(),
			activeThreads,
			maxMem,
			totalMem,
			usedMem,
			percent
		
		]);
		println(f.toString());		
	}
}

println("");


function getLongMetric( groupId, metricName ) {
	var metricDefId;
	if( serverMetrics.get(metricName) == null ) {
		var mdc = MeasurementDefinitionCriteria();
		mdc.addFilterResourceTypeName("JBossAS Server"); 
		mdc.addFilterDisplayName(metricName);
		var mdefs = MeasurementDefinitionManager.findMeasurementDefinitionsByCriteria(mdc); 
		
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
		var now = java.util.Calendar.getInstance();
		var later = java.util.Calendar.getInstance();
		now.add(java.util.Calendar.MINUTE, -10);
//		println("group: " + groupId + " / metric: " + metricDefId );
		var metrics = MeasurementDataManager.findDataForCompatibleGroup(groupId, metricDefId, now.getTimeInMillis(), later.getTimeInMillis(), 1, true); 
		if( metrics == null || metrics.size() == 0 ) {
			return 0;
		}
		else {
			// here we get a List of a List of MeasurementDataNumericHighLowComposite
			// we're currently just interested in the first entry of the backing list
			metrics = metrics.toArray();
			if( metrics.length == 1 ) {
			
				// metrics will now contain a List of MeasurementDataNumericHighLowComposite
				// sorted ASC by timestamp
				metrics = metrics[0].toArray();
				
				// iterate the list BOTTOM-UP as we are interested in the latest value
				var entries = metrics.length;
				for( i = entries-1; i >= 0; i-- ) {
				
					var metric = metrics[i];
					
					if( metric.value != java.lang.Double.NaN && metric.value > 0 ) {
						var time = new java.util.Date(metric.timestamp).toGMTString();
//						println( time + ": " + metric.value + " - " + metric.lowValue + " - " + metric.highValue );
						return metric.value;
					}				
				}
				return 0;
			}
		}
	}
	return 0;
}

