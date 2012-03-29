package org.rhq.enterprise.server.plugins.xmpp.receiver.strategy;

import org.rhq.core.domain.auth.Subject;
import org.rhq.core.domain.resource.InventoryStatus;
import org.rhq.core.domain.resource.Resource;
import org.rhq.core.domain.resource.ResourceCategory;
import org.rhq.core.domain.util.PageControl;
import org.rhq.core.domain.util.PageList;
import org.rhq.enterprise.server.resource.ResourceManagerLocal;
import org.rhq.enterprise.server.util.LookupUtil;

public class FindResourceHandlerStrategy implements CommandHandlerStrategy {

	@Override
	public String handle(String resourceType) {
		ResourceCategory resourceCategory = ResourceCategory.valueOf(resourceType.toUpperCase());
		StringBuilder resultBuilder = new StringBuilder();
		ResourceManagerLocal resourceManager = LookupUtil.getResourceManager();
		Subject overlord = LookupUtil.getSubjectManager().getOverlord();
		PageList<Resource> resources = resourceManager.findResourcesByCategory(overlord, resourceCategory, InventoryStatus.COMMITTED, new PageControl());
		for (Resource resource : resources) {
			resultBuilder.append(resource.getName());
			resultBuilder.append(" - ");
			resultBuilder.append(resource.getId());
			resultBuilder.append("\n");
		}
		return resultBuilder.toString();
	}

}
