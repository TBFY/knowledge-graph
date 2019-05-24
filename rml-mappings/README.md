# RML mappings
This is the folder for all the RML mappings that are part of the ingestion pipeline. Currently, these are the following two:

* openopps.rml [ [.rml file](https://github.com/TBFY/knowledge-graph/rml-mappings/openopps.rml) ] for transforming JSON data from OpenOpps into RDF format according to the OCDS ontology.
The mapping accepts one JSON file named openopps.json from the same repository and produces one output file in ttl-format. To run it, use 
```
java -jar RML-Mapper-v3.0.2.jar -m openopps.rml -o out.ttl
```
*  opencorp.rml [ [.rml file](https://github.com/TBFY/knowledge-graph/rml-mappings/opencorp.rml) ] for transforming JSON data from OpenCorporates into RDF format according to the euBusinessGraph ontology.
The mapping accepts one JSON file named opencorp.json from the same repository and produces one output file in ttl-format. To run it, use 
```
java -jar RML-Mapper-v3.0.2.jar -m opencorp.rml -o out.ttl
```

# Prerequisites

You need to download the RML Mapper from https://github.com/RMLio/RML-Mapper/releases and store it in the same repository as the RML mappings and JSON files. We currently use Version 3.0.2 here, but later versions will probably work just as well. 

The RML mapper runs on Java, so you also need to have Java installed on your machine.
