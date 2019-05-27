# Python scripts
This module contains Python scripts for downloading procurement data from the OpenOpps API and matching supplier records using the OpenCorporates Reconciliation and Company APIs.

## Process
The data ingestion process consists of the following steps:

1. `openopps.py`: Batch download of procurement data (tenders and awards) from OpenOpps. The output folder of this script is input to the 2nd step.
2. `opencorporates.py`: Company matching of supplier records in awards with OpenCorporates. The output folder of this script is input to 3rd step.
3. `json2rdf.py`: JSON 2 RDF that runs RML Mapper on release and supplier JSON files and produces TTL files. The script requires an RML folder which contains the RML Mapper v3.0.2 release (https://github.com/RMLio/RML-Mapper/releases/tag/v3.0.2) and the RML mapping files (https://github.com/TBFY/knowledge-graph/tree/master/rml-mappings).

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

#### json2rdf.py
Command line:
```
python json2rdf.py -s <start_date> -e <end_date> -r <rml_folder> -i <input_folder> -o <output_folder>
```

Example:
```
python json2rdf.py -s '2019-01-01' -e '2019-01-31' -r 'C:\TBFY\RML_Mapper_Scripts' -i 'C:\TBFY\2_JSON_OpenCorporates' -o 'C:\TBFY\3_RFD_TBFY'
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
