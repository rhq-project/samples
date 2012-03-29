package org.rhq.enterprise.server.plugins.xmpp.receiver.strategy;

import java.util.Date;
import java.util.List;

import org.rhq.core.domain.auth.Subject;
import org.rhq.core.domain.criteria.MeasurementDefinitionCriteria;
import org.rhq.core.domain.measurement.DataType;
import org.rhq.core.domain.measurement.MeasurementDefinition;
import org.rhq.core.domain.measurement.composite.MeasurementDataNumericHighLowComposite;
import org.rhq.core.domain.resource.Resource;
import org.rhq.core.domain.util.PageList;
import org.rhq.core.server.MeasurementConverter;
import org.rhq.enterprise.server.measurement.MeasurementDataManagerLocal;
import org.rhq.enterprise.server.util.LookupUtil;

public class FindMeasurementsHandlerStrategy implements CommandHandlerStrategy {

	@Override
	public String handle(String resourceId) {
		Subject overlord = LookupUtil.getSubjectManager().getOverlord();
		Resource resource = LookupUtil.getResourceManager().getResource(overlord, Integer.parseInt(resourceId));
		PageList<MeasurementDefinition> measurementDefinitions = findMeasurementDefinitions(overlord, resource);
		int[] definitionIdArray = getDefinitionIdArray(measurementDefinitions);
		return getMeasurements(overlord, resource, measurementDefinitions, definitionIdArray);
	}

	private String getMeasurements(Subject overlord, Resource resource, PageList<MeasurementDefinition> measurementDefinitions, int[] definitionIdArray) {
		StringBuilder responseBuilder = new StringBuilder();
		long start = (new Date().getTime()) - (1* 3600 * 1000);
		long end = new Date().getTime();
		MeasurementDataManagerLocal measurementDataManager = LookupUtil.getMeasurementDataManager();
		List<List<MeasurementDataNumericHighLowComposite>> resourceMeasurement = measurementDataManager.findDataForResource(overlord, resource.getId(), definitionIdArray, start, end, 1);
		for (int i = 0; i < measurementDefinitions.size(); i++) {
			responseBuilder.append(measurementDefinitions.get(i).getDisplayName());
			responseBuilder.append(" - ");
			responseBuilder.append(MeasurementConverter.format(resourceMeasurement.get(i).get(0).getValue(), measurementDefinitions.get(i).getUnits(), true));
			responseBuilder.append('\n');
		}
		return responseBuilder.toString();
	}

	private int[] getDefinitionIdArray(PageList<MeasurementDefinition> measurementDefinitions) {
		int[] definitionsId = new int[measurementDefinitions.size()];
		for (int i = 0; i < measurementDefinitions.size(); i++) {
			definitionsId[i] = measurementDefinitions.get(i).getId();
		}
		return definitionsId;
	}

	private PageList<MeasurementDefinition> findMeasurementDefinitions(Subject overlord, Resource resource) {
		MeasurementDefinitionCriteria measurementDefinitionCriteria = new MeasurementDefinitionCriteria();
		measurementDefinitionCriteria.addFilterDataType(DataType.MEASUREMENT);
		measurementDefinitionCriteria.addFilterResourceTypeId(resource.getResourceType().getId());
		PageList<MeasurementDefinition> measurementDefinitions = LookupUtil.getMeasurementDefinitionManager().findMeasurementDefinitionsByCriteria(overlord, measurementDefinitionCriteria);
		return measurementDefinitions;
	}


}
