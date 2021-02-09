# RML mappings
This is the folder for all the RML mappings that are part of the ingestion pipeline. Currently, these are the following two:

## Mapping files
* `openopps_mapping.ttl`: Mapping rules for transforming XML data from OpenOpps into RDF format according to the [OCDS ontology](https://github.com/TBFY/ocds-ontology/blob/master/model/ocds.ttl).
The mapping accepts one XML file named `input.xml` and produces one output file in the N-Triples format (.nt).
* `opencorporates_mapping.ttl`: Mapping rules for transforming XML data from OpenCorporates into RDF format according to the [euBusinessGraph ontology](https://github.com/euBusinessGraph/eubg-data/blob/master/model/ebg-ontology.ttl).
The mapping accepts one XML file named `input.xml` and produces one output file in the N-Triples format (.nt).

## Running the mappings

### openopps_mapping.ttl
Command line:
```
java -jar rmlmapper.jar -m openopps_mapping.ttl -o output.nt
```

### opencorporates_mapping.ttl
Command line: 
```
java -jar rmlmapper.jar -m opencorporates_mapping.ttl -o output.nt
```

## Prerequisites
You need to download the RML Mapper from https://github.com/RMLio/rmlmapper-java/releases and place it in the same folder as the RML mapping files. We currently use version [v4.9.1](https://github.com/RMLio/rmlmapper-java/releases/tag/v4.9.1), but later versions will probably work just as well. 

The RML mapper runs on Java, so you also need to have Java installed on your machine.
