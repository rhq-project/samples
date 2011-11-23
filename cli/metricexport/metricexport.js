#
# This sample snippet shows how to export the metric data of one metric of a resource into a file
# in csv format
#
# Here 10003 is the resource id and 10473 is the metric definition id.

exporter.file = 'somewhere/over/the/rainbow'
exporter.format = 'csv'
var start = new Date() - 8* 3600 * 1000;                                   
var end = new Date()
var data = MeasurementDataManager.findDataForResource(10003,[10473],start,end,60)
exporter.write(data.get(0))

