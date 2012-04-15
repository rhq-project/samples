package org.rhq.enterprise.server.plugins.xmpp.receiver;

import java.util.HashMap;
import java.util.Map;

import org.rhq.enterprise.server.plugins.xmpp.receiver.strategy.CommandHandlerStrategy;
import org.rhq.enterprise.server.plugins.xmpp.receiver.strategy.FindMeasurementsHandlerStrategy;
import org.rhq.enterprise.server.plugins.xmpp.receiver.strategy.FindResourceHandlerStrategy;
import org.rhq.enterprise.server.plugins.xmpp.receiver.strategy.HelpHandler;
import org.rhq.enterprise.server.plugins.xmpp.receiver.strategy.UnknownCommandException;

public class CommandHandlerStrategyFactory {
	
	private static Map<String, Class<? extends CommandHandlerStrategy>> map = new HashMap<String, Class<? extends CommandHandlerStrategy>>();
	
	static {
		map.put("help", HelpHandler.class);
		map.put("list", FindResourceHandlerStrategy.class);
		map.put("status", FindMeasurementsHandlerStrategy.class);
	}
	
	public static CommandHandlerStrategy getStrategy(String command) throws UnknownCommandException, InstantiationException, IllegalAccessException {
		Class<? extends CommandHandlerStrategy> strategyClass = map.get(command);
		if (strategyClass == null) {
			throw new UnknownCommandException();
		}
		return strategyClass.newInstance();
	}

}
