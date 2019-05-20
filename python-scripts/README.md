# Python scripts
This module contains Python scripts for downloading procurement data from the OpenOpps API and matching supplier records using the OpenCorporates Reconciliation and Company APIs.

## Process
The data ingestion process consists of the following steps:

1. Batch download of procurement data (tenders and awards) from OpenOpps (using `openopps.py`)
2. Company matching of supplier records in awards with OpenCorporates (using `opencorporates.py`)

### Running the scripts

#### openopps.py
Command line:
```
python openopps.py -u <username> -p <password>' -s <start_date> -e <end_date> -o <output_folder>
```

Example:
```
python openopps.py -u 'johndoe@tbfy.eu' -p 'secret' -s '2019-01-01' -e '2019-01-31' -o 'C:\TBFY\OpenOpps'
```

#### opencorporates.py
Command line:
```
python opencorporates.py -a <api_key> -i <input_folder> -o <output_folder>
```
