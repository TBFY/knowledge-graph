# Docker scripts
This module contains Docker scripts for deploying the TBFY knowledge graph.

## Docker Compose and environment files
* `docker-compose.yml`: Docker Compose file for running the services required to host the TBFY knowledge graph.
* `fuseki.env`: Environment file for the [Apache Jena Fuseki](https://jena.apache.org/documentation/fuseki2/index.html) service defined in the Docker Compose file. Here you must set the admin password for the Fuseki administration GUI.
* `yasgui.env`: Environment file for the [YASGUI](https://github.com/TriplyDB/Yasgui) service defined in the Docker Compose file. Here you must set the SPARQL endpoint for the TBFY knowledge graph.
* `kg-api.env`: Environment file for the [Knowledge Graph API](https://github.com/TBFY/knowledge-graph-API) service defined in the Docker Compose file. Here you must set the SPARQL endpoint for the TBFY knowledge graph, the resource namespace and the server path.
* `kg-ingestion-service.env`: Environment file for the [Knowledge Graph Ingestion Service](https://github.com/TBFY/knowledge-graph-API) defined in the Docker Compose file. This service is commented out. See the [docker-image](https://github.com/TBFY/knowledge-graph/tree/master/docker-image) module for further details.

## Prerequisites
The instructions here assumes that you are planning to deploy the TBFY knowledge graph on an [Ubuntu Server 18.04.4 LTS](https://ubuntu.com/download/server) virtual machine. After setting up the Ubuntu server please follow the instructions on [www.docker.com](https://www.docker.com/) to install Docker and Docker Compose:
* [Install Docker on Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
* [Install Docker Compose](https://docs.docker.com/compose/install/)

## Deploying the TBFY knowledge graph

### Create local data folders for Fuseki
Command line:
```
sudo mkdir /data
sudo mkdir /data/fuseki
```

### Run docker-compose
Command line:
```
docker-compose up -d
```

### Check docker-compose log
Command line:
```
docker-compose logs -f
```

### Create dataset and load data files into Fuseki
* Log into the Fuseki administration GUI, e.g. [http://52.19.213.234:3030](http://52.19.213.234:3030), using the admin password that you set in the `fuseki.env` file.
* Create a new dataset `tbfy` with the dataset type `Persistent (TDB2)`.
* Upload the NACE and OpenCorporates identifer system data files from the [data folder](https://github.com/TBFY/knowledge-graph/tree/master/data).
* Download the TBFY procurement data from the [TBFY data sources repository](https://github.com/TBFY/data-sources).
* Publish TBFY procurement data using the [Python scripts](https://github.com/TBFY/knowledge-graph/tree/master/python-scripts).

### Query the data using YASGUI
* Open YASGUI in your browser, e.g. [http://52.19.213.234:3040](http://52.19.213.234:3040), and enter your SPARQL queries.

### Query the data using the Knowledge Graph API
* See [https://github.com/TBFY/knowledge-graph-API/wiki](https://github.com/TBFY/knowledge-graph-API/wiki) for documentation and examples.
* Example: Obtain the list of tenders that contain the word "cluster".
  * [http://52.19.213.234:7777/kg-api/tender?title=cluster](http://52.19.213.234:7777/kg-api/tender?title=cluster)
