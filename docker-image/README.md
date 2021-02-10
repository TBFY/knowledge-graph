# Docker file for the knowledge graph ingestion service (kg-ingestion-service)
This module contains a Docker file for creating the knowledge graph ingestion service [Docker image](https://hub.docker.com/r/tbfy/kg-ingestion-service).

## Prerequisites
To use this service you must first acquire:

* Username and password credentials for the [OpenOpps API](https://theybuyforyou.eu/openopps-api/) 
* API key for the [OpenCorporates Company API](https://api.opencorporates.com/)

by contacting OpenOpps and OpenCorporates.

## Using the service
The service definition is commented out in the Docker compose file in the [Docker scripts](https://github.com/TBFY/knowledge-graph/tree/master/docker-scripts) module. The reason is that the service is quite CPU intensive. It can take up to 2 hours to process 1 day of procurement data running the [Python data ingestion scripts](https://github.com/TBFY/knowledge-graph/tree/master/python-scripts) and the [RML mapper](https://github.com/TBFY/knowledge-graph/tree/master/rml-mappings). Thus, we do not run the service on the Amazon EC2 instance where we are running the other [TBFY services](https://github.com/TBFY/knowledge-graph/tree/master/docker-scripts). Instead we are generating [Slurm scripts](https://github.com/TBFY/knowledge-graph/tree/master/slurm-scripts) that issues daily jobs on a local server for processing. 

If you intend to run all the TBFY service on a local machine, then you are free to also deploy the ingestion service by removing the comment chars `#` in the Docker compose file. However, before deploying the ingestion service you first have to run the Fuseki service and [create the TBFY knowledge graph dataset and load data files into Fuseki](https://github.com/TBFY/knowledge-graph/tree/master/docker-scripts#create-dataset-and-load-data-files-into-fuseki).

### Environment variables
In order to use the service you have to set the following variables in the `kg-ingestion-service.env` file in the [Docker scripts](https://github.com/TBFY/knowledge-graph/tree/master/docker-scripts) module:
* `OPENOPPS_USERNAME:` OpenOpps API username.
* `OPENOPPS_PASSWORD:` OpenOpps API password.
* `OPENCORPORATES_RECONCILE_API_KEY:` OpenCorporates API key for the reconciliation service.
* `OPENCORPORATES_COMPANIES_API_KEY:` OpenCorporates API key for the companies service.
* `RML_FOLDER:` Folder location for RML inside the Docker container. Use the default value `/home/rml-mappings` that is configured for the Docker image.
* `START_DATE:` Start date for data to be ingested. The default value is `2020-01-01`. Change this accordingly.
* `END_DATE:` End date for data to no longer be ingested. The service terminates at this date (+ days delayed). The default value is `2020-12-31`. Change this accordingly.
* `DAYS_DELAYED:` Number of days to wait before ingesting the data at a specific date. The default value is `1`, which means that the service ingests the data from the day before. Change this accordingly.
* `DAILY_SCHEDULE:` Time to run the daily ingestion. The default value is `03:00`. Change this accordingly.
* `OUTPUT_FOLDER:` Folder location for the ingested data to be stored inside the Docker container. Use the default value `/ingestion` that is configured for the Docker image. It is suggested that you map this to a e.g. a local folder on the Ubuntu server running the Docker container. The Docker compose file uses the `volmues:` configuration setting `/data/ingestion:/ingestion` to redirect to a folder `/data/ingestion` that must be created on the Ubuntu server.
* `TBFY_FUSEKI_URL:` The URL of the Apache Fuseki server that you are running.
* `TBFY_FUSEKI_DATASET:` Name of the TBFY knowledge graph dataset that you created in your Apache Fuseki server.

## Build the Docker image

### Dockerfile
Command line:
```
docker build -t tbfy/kg-ingestion-service:latest -f docker-image/Dockerfile .
```

### Push to Docker Hub
Command line:
```
docker tag <imageid> <yourhubusername>/kg-ingestion-service:<newtag>
docker login --username=<yourhubusername> --email=<youremail@company.com>
docker push <yourhubusername>/kg-ingestion-service
```
