package org.rhq.enterprise.server.plugins.xmpp;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jivesoftware.smack.XMPPException;
import org.rhq.core.domain.configuration.Configuration;
import org.rhq.enterprise.server.plugin.pc.ServerPluginComponent;
import org.rhq.enterprise.server.plugin.pc.ServerPluginContext;

public class XMPPComponent implements ServerPluginComponent {

	private final Log log = LogFactory.getLog(XMPPComponent.class);
	
	private String port;
	private String server;
	private String username;
	private String password;
	private String serviceName;

	@Override
	public void initialize(ServerPluginContext context) throws Exception {
		Configuration preferences = context.getPluginConfiguration();
		this.port = preferences.getSimpleValue("port", null);
		this.server = preferences.getSimpleValue("server", null);
		this.username = preferences.getSimpleValue("username", null);
		this.password = preferences.getSimpleValue("password", null);
		this.serviceName = preferences.getSimpleValue("serviceName", null);
	}

	@Override
	public void start() {
		try {
			XMPPConnectionManager connectionManager = XMPPConnectionManager.getInstance();
			connectionManager.connect(server, port, username, password, serviceName);
		} catch (XMPPException e) {
			log.error("Error while starting XMPP components", e);
		}
	}

	@Override
	public void shutdown() {
		disconnect();
	}

	@Override
	public void stop() {
		disconnect();
	}

	private void disconnect() {
		try {
			XMPPConnectionManager connectionManager = XMPPConnectionManager.getInstance();
			connectionManager.disconnect();
		} catch (XMPPException e) {

		}
	}


}
