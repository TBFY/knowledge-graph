<p align="center"><img width=50% src="https://github.com/TBFY/general/blob/master/figures/tbfy-logo.png"></p>
<p align="center"><img width=40% src="https://github.com/TBFY/knowledge-graph/blob/master/logo.png"></p>

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
![Docker](https://img.shields.io/badge/python-v3.0-blue.svg)
[![](https://jitpack.io/v/TBFY/knowledge-graph.svg)](https://jitpack.io/#TBFY/knowledge-graph)
[![GitHub Issues](https://img.shields.io/github/issues/TBFY/knowledge-graph.svg)](https://github.com/TBFY/knowledge-graph/issues)
[![License](https://img.shields.io/badge/license-Apache2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![DOI](https://zenodo.org/badge/123939667.svg)](https://zenodo.org/badge/latestdoi/123939667)

# About

This is the repository where all the work towards the creation of the TheyBuyForYou knowledge graph (KG) will be done. This repository is mostly related to activities that are being done in the context of Work Packages 1 and 2. In this repository we will keep:

* Ontology model file that defines the schema for the TBFY knowledge graph:
  * TBFY ontology [ [.ttl file](https://github.com/TBFY/knowledge-graph/blob/master/model/tbfy-ontology.ttl) ]
* Data that must be loaded into the TBFY knowledge graph:
  * NACE and OpenCorporates identifier system data files [ [repository folder](https://github.com/TBFY/knowledge-graph/tree/master/data) ]
* Python scripts and RML mappings for the data ingestion pipeline (onboarding data to the knowledge graph):
  * Python scripts [ [repository folder](https://github.com/TBFY/knowledge-graph/tree/master/python-scripts) ]
  * RML mappings [ [repository folder](https://github.com/TBFY/knowledge-graph/tree/master/rml-mappings) ]
* Docker scripts for deploying the TBFY knowledge graph:
  * Docker scripts [ [repository folder](https://github.com/TBFY/knowledge-graph/tree/master/docker-scripts) ]
* SLURM scripts for running jobs (e.g., Python scripts to ingest and publish data):
  * SLURM scripts [ [repository folder](https://github.com/TBFY/knowledge-graph/tree/master/slurm-scripts) ]

# References

* [OCDS ontology](https://github.com/TBFY/ocds-ontology) for procurement data. This ontology is being developed in the [TBFY project](http://theybuyforyou.eu) as part of the work on the main TBFY ontology.
* [euBusinessGraph ontology](https://github.com/euBusinessGraph/eubg-data) for company data. This ontology is being developed in the [euBusinessGraph project](http://eubusinessgraph.eu/) and used by the TBFY ontology, which in addition to representing procurement data also aims to define links between procurement data and companies.
