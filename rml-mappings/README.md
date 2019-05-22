# Knowledge Graph
This is the folder for all the RML mappings that are part of the ingestion pipeline. Currently, these are the following two:

* [ [.rml file](https://github.com/TBFY/knowledge-graph/rml-mappings/openopps.rml) ] for transforming JSON data from OpenOpps into RDF format according to the OCDS ontology.
The mapping accepts one JSON file named openopps.json from the same repository and produces one output file in ttl-format. To run it, use * java -jar RML-Mapper-v3.0.2.jar -m openopps.rml -o out.ttl *.
*  [ [.rml file](https://github.com/TBFY/knowledge-graph/rml-mappings/opencorp.rml) ] for transforming JSON data from OpenCorporates into RDF format according to the euBusinessGraph ontology.
The mapping accepts one JSON file named opencorp.json from the same repository and produces one output file in ttl-format. To run it, use * java -jar RML-Mapper-v3.0.2.jar -m opencorp.rml -o out.ttl *.



# References

* [OCDS ontology](https://github.com/TBFY/ocds-ontology) for procurement data. This ontology is being developed in the [TBFY project](http://theybuyforyou.eu) as part of the work on the main TBFY ontology.
* [euBusinessGraph ontology](https://github.com/euBusinessGraph/eubg-data) for company data. This ontology is being developed in the [euBusinessGraph project](http://eubusinessgraph.eu/) and used by the TBFY ontology, which in addition to representing procurement data also aims to define links between procurement data and companies.
