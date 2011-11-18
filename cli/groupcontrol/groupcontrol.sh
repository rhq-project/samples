#!/bin/bash
#
# groupcontrol
# ------------
# This is a simple wrapper script for all the java script scripts in this folder.
# Start this script with some parameters to automate group handling from within the
# command line.
# 
# With groupcontrol you can do the following:
#   deploy: Deploys an application to all AS instances specified by group name
#   create: Create a new group
#   delete: Delete an existing group
#   start : start all EAP instances specified by group name
#   stop  : stop all EAP instances specified by group name
#   add   : Add a new EAP instance to the specified group
#   remove: Remove an existing EAP instance from the specified group
#   status: Print the status of all resources of a group
#
#  Author: Wanja Pernath <wpernath @ github >

## Should not be run as root.
if [ "$EUID" = "0" ]; then
   echo " Please use a normal user account and not the root account"
   exit 1
fi

## Figure out script home
MY_HOME=$(cd `dirname $0` && pwd)
SCRIPT_HOME=$MY_HOME/scripts

## Source some defaults
. $MY_HOME/groupcontrol.conf

## Check to see if we have a valid CLI home
if [ ! -d ${RHQ_CLI_HOME} ]; then
	echo "RHQ_CLI_HOME not correctly set. Please do so in the file"
	echo $MY_HOME/groupcontrol.conf
	exit 1
fi

RHQ_OPTS="-s $RHQ_HOST -u $RHQ_USER -t $RHQ_PORT"
if [ "x$RHQ_PWD" == "x" ]; then
	RHQ_OPTS="$RHQ_OPTS -P"
else
	RHQ_OPTS="$RHQ_OPTS -p $RHQ_PWD"
fi

#echo "Calling groupcontrol with $RHQ_OPTS"

usage() {
	echo "  Usage $0:"
	echo "  Use this tool to control most group related tasks with a simple script."
	echo "  ------------------------------------------------------------------------- "	
	echo "    deploy <path-to-app> <groupName> to deploy an app to group"
	echo "    create <groupName> to create a new group"
	echo "    delete <groupName> to delete an existing group"
	echo "    status <groupName> to list all resources in a group and their availability"
	echo "    start  <groupName> to start all instances in a group"
	echo "    stop   <groupName> to stop all instances in a group"
	echo "    add    <eap-name> <groupName> to add an instance to a group"
	echo "    remove <eap-name> <groupName> to remove an instance from a group"
	echo "    avail [groupName] Issue the AVAIL command on all agents to send the availability report to RHQ"
	echo
	echo
	echo "  Commands used for whole environment:"
	echo "    list    Just print all JBossAS Server instances available in repository with version and availability"
	echo "    list-groups Like list command but list all compatible groups "
	echo "    info    Print a list of JBossAS Server instances available in repository with host name and #CPUs"

	echo
}

doDeploy() {
	$RHQ_CLI_HOME/bin/rhq-cli.sh $RHQ_OPTS -f $SCRIPT_HOME/deployToGroup.js $2 $3
}

doCreate() {
	$RHQ_CLI_HOME/bin/rhq-cli.sh $RHQ_OPTS -f $SCRIPT_HOME/createGroup.js $2 $3
}

doDelete() {
	$RHQ_CLI_HOME/bin/rhq-cli.sh $RHQ_OPTS -f $SCRIPT_HOME/deleteGroup.js $2
}

doStart() {
	$RHQ_CLI_HOME/bin/rhq-cli.sh $RHQ_OPTS -f $SCRIPT_HOME/startGroup.js $2
}

doStop() {
	$RHQ_CLI_HOME/bin/rhq-cli.sh $RHQ_OPTS -f $SCRIPT_HOME/stopGroup.js $2
}

doStatus() {
	$RHQ_CLI_HOME/bin/rhq-cli.sh $RHQ_OPTS -f $SCRIPT_HOME/statusGroup.js $2
}

doAdd() {
	$RHQ_CLI_HOME/bin/rhq-cli.sh $RHQ_OPTS -f $SCRIPT_HOME/addToGroup.js $2 $3
}

doRemove() {
	$RHQ_CLI_HOME/bin/rhq-cli.sh $RHQ_OPTS -f $SCRIPT_HOME/removeFromGroup.js $2 $3
}

doList() {
	$RHQ_CLI_HOME/bin/rhq-cli.sh $RHQ_OPTS -f $SCRIPT_HOME/listServers.js $2 $3
}

doListGroups() {
	$RHQ_CLI_HOME/bin/rhq-cli.sh $RHQ_OPTS -f $SCRIPT_HOME/listGroups.js $2 $3
}

doVersions() {
	$RHQ_CLI_HOME/bin/rhq-cli.sh $RHQ_OPTS -f $SCRIPT_HOME/listServersByVersion.js $2 $3
}

doAvail() {
	$RHQ_CLI_HOME/bin/rhq-cli.sh $RHQ_OPTS -f $SCRIPT_HOME/availAgents.js $2
}

doInfo() {
	$RHQ_CLI_HOME/bin/rhq-cli.sh $RHQ_OPTS -f $SCRIPT_HOME/info.js $2
}


case "$1" in
'deploy')
        doDeploy $*
        ;;
'create')
	doCreate $*
	;;
'delete')
	doDelete $*
	;;
'start')
	doStart $*
	;;
'stop')
	doStop $*
	;;
'status')
	doStatus $*
	;;
'add')
	doAdd $*
	;;
'remove')
	doRemove $*
	;;
'list')
	doList $*
	;;
'list-groups')
	doListGroups $*
	;;
'avail')
	doAvail $*
	;;
'info')
	doInfo $*
	;;

*)
        usage $*
        ;;
esac



