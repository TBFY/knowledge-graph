#!/bin/bash

if [ -f "/data/fuseki/system/tdb.lock" ]
then
	sudo rm /data/fuseki/system/tdb.lock
fi

if [ -f "/data/fuseki/databases/tbfy/tdb.lock" ]
then
	sudo rm /data/fuseki/databases/tbfy/tdb.lock
fi

sudo docker-compose up -d
