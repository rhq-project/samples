package org.rhq.enterprise.server.plugins.xmpp;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.util.Collections;

import javax.script.ScriptEngine;
import javax.script.ScriptException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.rhq.bindings.SandboxedScriptEngine;
import org.rhq.bindings.ScriptEngineFactory;
import org.rhq.bindings.StandardBindings;
import org.rhq.bindings.StandardScriptPermissions;
import org.rhq.bindings.util.PackageFinder;
import org.rhq.core.domain.auth.Subject;
import org.rhq.enterprise.client.LocalClient;

public class CLIScriptsManager {

	private final Log log = LogFactory.getLog(CLIScriptsManager.class);

	private SandboxedScriptEngine sandboxedEngine;
	private PrintWriter outputWriter;
	private ByteArrayOutputStream scriptOutput;
	
	private static CLIScriptsManager singleton;
	
	
	public static CLIScriptsManager getInstance() {
		if (singleton == null) {
			singleton = new CLIScriptsManager();
		}
		return singleton;
	}
	
	private CLIScriptsManager() {}

	public void start() {
		try {
			scriptOutput = new ByteArrayOutputStream();
			outputWriter = new PrintWriter(scriptOutput);
			ScriptEngine scriptEngine = getScriptEngine(outputWriter);
			sandboxedEngine = new SandboxedScriptEngine(scriptEngine, new StandardScriptPermissions());
		} catch (Exception e) {
			log.error("Error while starting CLI Script Engine", e);
		}
	}

	public String executeScript(final String scriptName) {
		final BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(getClass().getResourceAsStream("/scripts/platformStatus.js")));
		try {
			Thread scriptRunner = new Thread(new Runnable() {
				public void run() {
					try {
						sandboxedEngine.eval(bufferedReader);
					} catch (ScriptException e) {
						log.error("Error while evaluating script: " + scriptName, e);
					}
				}
			}, "Script Runner: " + scriptName);
			scriptRunner.setDaemon(true);
			scriptRunner.start();
			scriptRunner.join();
			scriptRunner.interrupt();
			outputWriter.flush();
			return scriptOutput.toString(Charset.defaultCharset().name());
		} catch (Exception e) {
			log.error("Error while evaluating script: " + scriptName, e);
			return "Script error";
		}
	}

	private static ScriptEngine getScriptEngine(PrintWriter output) throws Exception {
		Subject subject = new Subject();
		LocalClient client = new LocalClient(subject);
		StandardBindings bindings = new StandardBindings(output, client);
		return ScriptEngineFactory.getScriptEngine("JavaScript", new PackageFinder(Collections.<File> emptyList()), bindings);
	}


}
