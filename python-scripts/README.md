# Python scripts
This module contains Python scripts for downloading procurement data from the OpenOpps API, matching supplier records using the OpenCorporates Reconciliation and Company APIs, enrich and map the downloaded data to RDF, and publish the RDF data to the TBFY knowledge graph.

## Process
The data ingestion process consists of the following steps:

1. `openopps.py`: Downloads procurement data (plans, tenders and awards) from the [OpenOpps OCDS API](https://openopps.com/api/tbfy/ocds/) as JSON data files. The output folder of this script is input to the 2nd step.
2. `opencorporates.py`: Matches supplier records in awards using the [OpenCorporates Reconciliation API](https://api.opencorporates.com/documentation/Open-Refine-Reconciliation-API). For matching suppliers the company data is downloaded using the [OpenCorporates Company API](https://api.opencorporates.com/documentation/API-Reference) as JSON data files. The output folder of this script is input to the 3rd step.
3. `enrich_json.py`: Enriches the JSON data files downloaded in steps 1 and 2, e.g. adding new properties to support the mapping to RDF. The output folder of this script is input to the 4th step.
4. `json2xml.py`: Converts the JSON data files from step 3 into corresponding XML data files. Due to limitations in JSONPath, i.e., lack of operations for accessing parent or sibling nodes from a given node, we prefer to use [XPath](https://www.w3schools.com/xml/xpath_syntax.asp) as the query language in RML. The output folder of this script is input to the 5th step. 
5. `xml2rdf.py`: Runs RML Mapper on the enriched XML data files from step 4 and produces N-Triples files. The script requires an RML folder which contains the [RML Mapper v4.6.0 release file](https://github.com/RMLio/rmlmapper-java/releases/tag/v4.6.0) and the [RML mapping files](https://github.com/TBFY/knowledge-graph/tree/master/rml-mappings).
6. `publish_rdf.py`: Publishes the RDF (N-Triples) files from step 5 to [Apache Jena Fuseki](https://jena.apache.org/documentation/fuseki2/index.html) and [Apache Jena TBD](https://jena.apache.org/documentation/tdb/index.html). Jena TDB is used as the triplestore for the TBFY Knowledge Graph (KG) RDF dataset. Jena Fuseki provides a SPARQL endpoint to the TBFY KG.

Configuration parameters for these scripts are set in the `config.py` file.

We have defined a main script `ingest_data.py` that runs the whole data ingestion process.

### Running the main data ingestion script

#### ingest_data.py
Command line:
```
python ingest_data.py -u <openopps_username> -p <openopps_password> -a <opencorporates_api_key> -r <rml_folder> -s <start_date> -e <end_date> -o <output_folder>
```

Example:
```
python ingest_data.py -u 'johndoe@tbfy.eu' -p 'password' -a 'secret' -r 'C:\TBFY\RML_Mapper_Scripts' -s '2019-01-01' -e '2019-01-31' -o 'C:\TBFY\DATA_INGESTION'
```

### Running individual ingestion step scripts

#### openopps.py
Command line:
```
python openopps.py -u <username> -p <password> -s <start_date> -e <end_date> -o <output_folder>
```

Example:
```
python openopps.py -u 'johndoe@tbfy.eu' -p 'password' -s '2019-01-01' -e '2019-01-31' -o 'C:\TBFY\1_JSON_OpenOpps'
```

#### opencorporates.py
Command line:
```
python opencorporates.py -a <api_key_reconcile> -b <api_key_companies> -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>
```

Example:
```
python opencorporates.py -a 'secret' -b 'secret' -s '2019-01-01' -e '2019-01-31' -i 'C:\TBFY\1_JSON_OpenOpps' -o 'C:\TBFY\2_JSON_OpenCorporates'
```

#### enrich_json.py
Command line:
```
python enrich_json.py -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>
```

Example:
```
python enrich_json.py -s '2019-01-01' -e '2019-01-31' -i 'C:\TBFY\2_JSON_OpenCorporates' -o 'C:\TBFY\3_JSON_Enriched'
```

#### json2xml.py
Command line:
```
python json2xml.py -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>
```

Example:
```
python json2xml.py -s '2019-01-01' -e '2019-01-31' -i 'C:\TBFY\3_JSON_Enriched' -o 'C:\TBFY\4_XML_Enriched'
```

#### xml2rdf.py
Command line:
```
python xml2rdf.py -s <start_date> -e <end_date> -r <rml_folder> -i <input_folder> -o <output_folder>
```

Example:
```
python xml2rdf.py -s '2019-01-01' -e '2019-01-31' -r 'C:\TBFY\RML_Mapper_Scripts' -i 'C:\TBFY\4_XML_Enriched' -o 'C:\TBFY\5_RFD_TBFY'
```

#### publish_rdf.py
Command line:
```
python publish_rdf.py -s <start_date> -e <end_date> -i <input_folder>
```

Example:
```
python publish_rdf.py -s '2019-01-01' -e '2019-01-31' -i 'C:\TBFY\5_RFD_TBFY'
```

## Statistics
Scripts for processing statistics:

* `openopps_statistics.py`: Script that aggregates and prints out performance statistics computed from the 'STATISTICS.TXT' files that are written in each release-date subfolder in the OpenOpps output folder when running the `openopps.py` script.
* `opencorporates_statistics.py`: Script that aggregates and prints out performance statistics computed from the 'STATISTICS.TXT' files that are written in each release-date subfolder in the OpenCorporates output folder when running the `opencorporates.py` script.
* `enrich_json_statistics.py`: Script that aggregates and prints out performance statistics computed from the 'STATISTICS.TXT' files that are written in each release-date subfolder in the output folder when running the `enrich_json.py` script.
* `json2xml_statistics.py`: Script that aggregates and prints out performance statistics computed from the 'STATISTICS.TXT' files that are written in each release-date subfolder in the output folder when running the `json2xml.py` script. 
* `xml2rdf_statistics.py`: Script that aggregates and prints out performance statistics computed from the 'STATISTICS.TXT' files that are written in each release-date subfolder in the output folder when running the `xml2rdf.py` script. 
* `publish_rdf_statistics.py`: Script that aggregates and prints out performance statistics computed from the 'STATISTICS_PUBLISH.TXT' files that are written in each release-date subfolder in the input folder when running the `publish_rdf.py` script. 

### Runnings the scripts

#### openopps_statistics.py
Command line:
```
python openopps_statistics.py -s <start_date> -e <end_date> -i <openopps_folder>
```

Example:
```
python openopps_statistics.py -s '2019-01-01' -e '2019-01-31' -i 'C:\TBFY\2_JSON_OpenOpps'
```

#### opencorporates_statistics.py
Command line:
```
python opencorporates_statistics.py -s <start_date> -e <end_date> -i <opencorporates_folder>
```

Example:
```
python opencorporates_statistics.py -s '2019-01-01' -e '2019-01-31' -i 'C:\TBFY\2_JSON_OpenCorporates'
```

#### enrich_statistics.py
Command line:
```
python enrich_statistics.py -s <start_date> -e <end_date> -i <enrich_folder>
```

Example:
```
python enrich_statistics.py -s '2019-01-01' -e '2019-01-31' -i 'C:\TBFY\3_JSON_Enriched'
```

#### json2xml_statistics.py
Command line:
```
python json2xml_statistics.py -s <start_date> -e <end_date> -i <json2xml_folder>
```

Example:
```
python json2xml_statistics.py -s '2019-01-01' -e '2019-01-31' -i 'C:\TBFY\4_XML_Enriched'
```

#### xml2rdf_statistics.py
Command line:
```
python xml2rdf_statistics.py -s <start_date> -e <end_date> -i <xml2rdf_folder>
```

Example:
```
python xml2rdf_statistics.py -s '2019-01-01' -e '2019-01-31' -i 'C:\TBFY\5_RDF_TBFY'
```

#### publish_rdf_statistics.py
Command line:
```
python publish_rdf_statistics.py -s <start_date> -e <end_date> -i <publish_rdf_folder>
```

Example:
```
python publish_rdf_statistics.py -s '2019-01-01' -e '2019-01-31' -i 'C:\TBFY\5_RDF_TBFY'
```

## Utilities
Utility scripts:

* `replace_string_rdf.py`: Script that can be used to perform a simple string replace in the produced RDF (N-Triples) files.
* `validate_rdf.py`: Script that can be used to validate the produced RDF (N-Triples) files. Requires that the [Apache Jena command line tools](https://jena.apache.org/download/index.cgi) are installed.

### Runnings the scripts

#### replace_string_rdf.py
Command line:
```
python replace_string_rdf.py -a <old_string> -b <new_string> -s <start_date> -e <end_date> -i <old_rdf_folder> -i <new_rdf_folder>
```

Example:
```
python replace_string_rdf.py -a 'data.tbfy.org' -b 'data.tbfy.eu' -s '2019-01-01' -e '2019-01-31' -i 'C:\TBFY\5_RDF_TBFY' -o 'C:\TBFY\5_RDF_TBFY_REPLACED'
```

#### validate_rdf.py
Command line:
```
python validate_rdf.py -s <start_date> -e <end_date> -i <input_folder>
```

Example:
```
python validate_rdf.py -s '2019-01-01' -e '2019-01-31' -i 'C:\TBFY\5_RDF_TBFY'
```

## Norwegian
Scripts for processing Norwegian data:

* `filter_json_norwegian.py`: Script that filters the Norwegian JSON data files.
* `filter_rdf_norwegian.py`: Script that filters the Norwegian RDF data files.
* `publish_rdf_norwegian.py`: Script that publishes the Norwegian RDF data files to the triplestore database.

#### filter_json_norwegian.py
Command line:
```
python filter_json_norwegian.py -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>
```

Example:
```
python filter_json_norwegian.py -s '2019-01-01' -e '2019-01-31' -i 'C:\TBFY\3_JSON_Enriched' -o 'C:\TBFY\NO_3_JSON_Enriched'
```

#### filter_rdf_norwegian.py
Command line:
```
python filter_rdf_norwegian.py -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>
```

Example:
```
python filter_rdf_norwegian.py -s '2019-01-01' -e '2019-01-31' -i 'C:\TBFY\5_RDF_TBFY' -o 'C:\TBFY\NO_5_RDF_TBFY'
```

#### publish_rdf_norwegian.py
Command line:
```
python publish_rdf_norwegian.py -s <start_date> -e <end_date> -i <input_folder>
```

Example:
```
python publish_rdf_norwegian.py -s '2019-01-01' -e '2019-01-31' -i 'C:\TBFY\NO_5_RDF_TBFY'
```

## 3rd party Python modules
The Python scripts use the following Python modules:
* [requests](https://pypi.org/project/requests/): Requests allows you to send HTTP/1.1 requests extremely easily.
* [dpath](https://pypi.org/project/dpath/): A python library for accessing and searching dictionaries via /slashed/paths ala xpath.
* [xmltodict](https://pypi.org/project/xmltodict/): Python module that makes working with XML feel like you are working with JSON.
* [python-dotenv](https://pypi.org/project/python-dotenv/): Reads the key-value pair from .env file and adds them to environment variable.

### Installing the modules

#### pip install
Command line:
```
pip install requests
pip install dpath
pip install xmltodict
pip install python-dotenv
```
