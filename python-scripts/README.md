# Python scripts
This module contains Python scripts for downloading procurement data from the OpenOpps API and matching supplier records using the OpenCorporates Reconciliation and Company APIs.

## Process
The data ingestion process consists of the following steps:

1. `openopps.py`: Batch download of procurement data (tenders and awards) from OpenOpps. The output folder of this script is input to the 2nd step.
2. `opencorporates.py`: Company matching of supplier records in awards with OpenCorporates. The output folder of this script is input to the 3rd step.
3. `enrich_json.py`: Enrichment of the JSON data files downloaded in steps 1 and 2, e.g. adding new properties to support the mapping to RDF. The output folder of this script is input to the 4th step.
4. `json2rdf.py`: JSON 2 RDF that runs RML Mapper on the enriched JSON data files and produces N-Triples files. The script requires an RML folder which contains the [RML Mapper v4.5.1 release file](https://github.com/RMLio/rmlmapper-java/releases/tag/v4.5.1) and the [RML mapping files](https://github.com/TBFY/knowledge-graph/tree/master/rml-mappings).

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

#### json2rdf.py
Command line:
```
python json2rdf.py -s <start_date> -e <end_date> -r <rml_folder> -i <input_folder> -o <output_folder>
```

Example:
```
python json2rdf.py -s '2019-01-01' -e '2019-01-31' -r 'C:\TBFY\RML_Mapper_Scripts' -i 'C:\TBFY\3_JSON_Enriched' -o 'C:\TBFY\4_RFD_TBFY'
```

## Statistics
Scripts for processing statistics:

* `statistics.py`: Script that aggregates and prints out the statistics from the 'STATISTICS.TXT' file that are written in each release-date subfolder in the OpenCorporates output folder when running the `opencorporates.py` script.

### Runnings the scripts

#### statistics.py
Command line:
```
python statistics.py -s <start_date> -e <end_date> -o <opencorporates_folder>
```

Example:
```
python statistics.py -s '2019-01-01' -e '2019-01-31' -o 'C:\TBFY\2_JSON_OpenCorporates'
```
