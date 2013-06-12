#!/bin/sh

function usage {
  echo "Imports everything from discovery queue"
  echo "Usage: RHQ_HOST=<host> RHQ_USER=<user> RHQ_PASS=<password> `basename $0`"
  echo
}

if [ "$1" == "--help" ];
then
  usage
  exit 
fi
: ${RHQ_HOST:="localhost"}
: ${RHQ_USER:="rhqadmin"}
: ${RHQ_PASS:="rhqadmin"}

_curl="curl --user ${RHQ_USER}:${RHQ_PASS}"
endpoint="http://${RHQ_HOST}:7080/rest"

resources=`${_curl} ${endpoint}/resource?status=new | grep "resourceId:" | awk -F: '{print $2;}' | sort`
for id in $resources; do
  echo "Importing $id .."
  ${_curl} ${endpoint}/resource/${id} -X "PUT" \
    -d "{\"status\":\"COMMITTED\"}" \
    -H "Content-Type: application/json"
done
