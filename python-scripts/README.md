# Python scripts
This module contains Python scripts for downloading procurement data from the OpenOpps API and matching supplier records using the OpenCorporates Reconciliation and Company APIs.

## Process
The data ingestion process consists of the following steps:

1. `openopps.py`: Downloads procurement data (plans, tenders and awards) from the [OpenOpps OCDS API](https://openopps.com/api/tbfy/ocds/) as JSON data files. The output folder of this script is input to the 2nd step.
2. `opencorporates.py`: Matches supplier records in awards using the [OpenCorporates Reconciliation API](https://api.opencorporates.com/documentation/Open-Refine-Reconciliation-API). For matching suppliers the company data is downloaded using the [OpenCorporates Company API](https://api.opencorporates.com/documentation/API-Reference) as JSON data files. The output folder of this script is input to the 3rd step.
3. `enrich_json.py`: Enriches the JSON data files downloaded in steps 1 and 2, e.g. adding new properties to support the mapping to RDF. The output folder of this script is input to the 4th step.
4. `json2xml.py`: Converts the JSON data files from step 3 into corresponding XML data files. Due to limitations in JSONPath, i.e., lack of operations for accessing parent or sibling nodes from a given node, we prefer to use [XPath](https://www.w3schools.com/xml/xpath_syntax.asp) as the query language in RML. The output folder of this script is input to the 5th step. 
5. `xml2rdf.py`: Runs RML Mapper on the enriched XML data files from step 4 and produces N-Triples files. The script requires an RML folder which contains the [RML Mapper v4.5.1 release file](https://github.com/RMLio/rmlmapper-java/releases/tag/v4.5.1) and the [RML mapping files](https://github.com/TBFY/knowledge-graph/tree/master/rml-mappings).
6. `publish_rdf.py`: Publishes the RDF (N-Triples) files from step 5 to [Apache Jena Fuseki](https://jena.apache.org/documentation/fuseki2/index.html) and [Apache Jena TBD](https://jena.apache.org/documentation/tdb/index.html). Jena TDB is used as the triplestore for the TBFY Knowledge Graph (KG) RDF dataset. Jena Fuseki provides a SPARQL endpoint to the TBFY KG.

Configuration parameters for the four scripts are set in the `config.py` file.

### Running the scripts

#### openopps.py
Command line:
```
python openopps.py -u <username> -p <password>' -s <start_date> -e <end_date> -o <output_folder>
```

Example:
```
python openopps.py -u 'johndoe@tbfy.eu' -p 'secret' -s '2019-01-01' -e '2019-01-31' -o 'C:\TBFY\1_JSON_OpenOpps'
```

#### opencorporates.py
Command line:
```
python opencorporates.py -a <api_key> -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>
```

Example:
```
python opencorporates.py -a 'secret' -s '2019-01-01' -e '2019-01-31' -i 'C:\TBFY\1_JSON_OpenOpps' -o 'C:\TBFY\2_JSON_OpenCorporates'
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

* `openopps_statistics.py`: Script that aggregates and prints out the statistics from the 'STATISTICS.TXT' file that are written in each release-date subfolder in the OpenOpps output folder when running the `openopps.py` script.
* `opencorporates_statistics.py`: Script that aggregates and prints out the statistics from the 'STATISTICS.TXT' file that are written in each release-date subfolder in the OpenCorporates output folder when running the `opencorporates.py` script.

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
