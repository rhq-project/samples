#!/bin/sh

function usage {
  echo "Usage: `badename $0` <user> <password>"
echo
}

if [ $# -ne 2 ];
then
   usage
   exit 
fi

curl --user $1:$2 http://localhost:7080/rest/1/status
