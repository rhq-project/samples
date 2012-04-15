var result;
var start = new Date() - 1* 3600 * 1000;
var end = new Date();
var resource = org.rhq.enterprise.server.resource.ResourceManager.getResource(10131);
var criteria = new MeasurementDefinitionCriteria();
criteria.addFilterResourceTypeId(resource.resourceType.id);
criteria.addFilterDataType(DataType.MEASUREMENT);
var definitions = MeasurementDefinitionManager.findMeasurementDefinitionsByCriteria(criteria);

var definitionIdArray = new Array(definitions.size());
for (i = 0; i < definitions.size(); i++) {
        definitionIdArray[i] = definitions.get(i).id;
}

var data = MeasurementDataManager.findDataForResource(resource.id, definitionIdArray, start, end, 1);
for (i = 0; i < definitions.size(); i++) {
        result = result + definitions.get(i).displayName + " - " + data.get(i).get(0).value + definitions.get(i).units + '\n';
}
//pretty.print(result);
