package org.rhq.enterprise.server.plugins.xmpp.receiver.strategy;

public class HelpHandler implements CommandHandlerStrategy{

	@Override
	public String handle(String parameter) {
		StringBuilder responseBuilder = new StringBuilder();
		responseBuilder.append("Commands avaliable:\n");
		responseBuilder.append("list platform|server|service\n");
		responseBuilder.append("status <resourceId>");
		return responseBuilder.toString();
	}
	
}
