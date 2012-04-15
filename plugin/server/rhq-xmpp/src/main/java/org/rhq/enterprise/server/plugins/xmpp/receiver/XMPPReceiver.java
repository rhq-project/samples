package org.rhq.enterprise.server.plugins.xmpp.receiver;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.jivesoftware.smack.Chat;
import org.jivesoftware.smack.ChatManagerListener;
import org.jivesoftware.smack.MessageListener;
import org.jivesoftware.smack.XMPPException;
import org.jivesoftware.smack.packet.Message;
import org.rhq.enterprise.server.plugins.xmpp.receiver.strategy.CommandHandlerStrategy;
import org.rhq.enterprise.server.plugins.xmpp.receiver.strategy.UnknownCommandException;

public class XMPPReceiver implements MessageListener, ChatManagerListener {

	private final Log log = LogFactory.getLog(XMPPReceiver.class);

	@Override
	public void processMessage(Chat chat, Message message) {
		try {
			String[] bodySplitted = message.getBody().split(" ");
			String command = bodySplitted[0];
			String parameter = getParameterIfExist(bodySplitted);
			CommandHandlerStrategy strategy = CommandHandlerStrategyFactory.getStrategy(command);
			String response = strategy.handle(parameter);
			chat.sendMessage(response);
		} catch (UnknownCommandException e) {
			log.warn("Invalid command: " + message.getBody(), e);
			sendResponse(chat, "Unknown command. Type 'help' to list the options.");
		} catch (XMPPException e) {
			log.error("Error while sending response to: " + chat.getParticipant(), e);
		} catch (Exception e) {
			log.error("Error While processing message: " + message.getBody(), e);
			sendResponse(chat, "RHQ internal error");
		}
	}

	@Override
	public void chatCreated(Chat chat, boolean arg1) {
		chat.addMessageListener(this);
	}

	private void sendResponse(Chat chat, String response) {
		try {
			chat.sendMessage(response);
		} catch (XMPPException e) {
			log.error("Error While sending response to: " + chat.getParticipant(), e);
		}
	}
	
	private String getParameterIfExist(String[] bodySplitted) {
		return (bodySplitted.length > 1) ? bodySplitted[1] : null;
	}

}
