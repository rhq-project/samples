This is a simple tool and byteman rule file that can be used to track leaks
of Augeas references in any java program.

To start your program with the tracking turned on, you need to:

a) modify the byteman script to suite your program:
edit the first rule in the augeas-leaks.btm so that the CLASS names the main class of your program

and b) modify the java command that starts your program to add:

-javaagent:byteman.jar=script:augeas-leaks.btm,sys:target/augeas-leak-detector-<VERSION>.jar

where byteman.jar is the full path to the byteman.jar, augeas-leaks.btm is the full path
to the augeas-leaks.btm file located in this directory and 
target/augeas-leak-detector-<VERSION>.jar is the full path to the jar built by this
maven project.

After your program exits (but no sooner) a new file called "augeas-leak-detection-results.txt"
will be placed in the working directory of the program. This file will detail the call stacks
where all the augeas instances there weren't properly closed for the lifetime of the JVM were
created.

The default version of the augeas-leak.btm is tailored for testing the RHQ agent. To invoke 
the agent with augeas leak monitoring turned on, do the following (on a Linux commandline):

RHQ_AGENT_ADDITIONAL_JAVA_OPTS="-javaagent:`pwd`/target/lib/byteman-<VERSION>.jar=script:`pwd`/augeas-leaks.btm,sys:`pwd`/target/augeas-leak-detector-<VERSION>.jar" "$RHQ_AGENT_HOME"/bin/rhq-agent.sh

Notes:
- after building this maven project, the byteman-<VERSION>.jar is placed in target/lib directory
- the <VERSION> in the above names is a placeholder that should be replaced with an actual version string.