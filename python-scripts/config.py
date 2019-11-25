#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (https://theybuyforyou.eu/tbfy-knowledge-graph/)
# 
# This file contains configuration parameters for the data ingestion process.
# 
# Copyright: SINTEF 2017-2019
# Author   : Brian Elvesæter (brian.elvesater@sintef.no)
# License  : Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
# Project  : Developed as part of the TheyBuyForYou project (https://theybuyforyou.eu/)
# Funding  : TheyBuyForYou has received funding from the European Union's Horizon 2020
#            research and innovation programme under grant agreement No 780247
#####################################################################################################

openopps = {
    "api_url": "https://api.openopps.com/api/",
    "page_size": 1000,
    "sleep": 5
}

opencorporates = {
    "reconcile_api_url": "https://opencorporates.com/reconcile",
    "reconcile_score": 70,   
    "companies_api_url": "http://api.opencorporates.com",
    "smart_address_check": False,
    "country_name_codes_simulation": False
}

rml = {
    "rml_filename": "rmlmapper-4.5.1.jar",
    "openopps_mapping_filename": "openopps_mapping.ttl",
    "opencorporates_mapping_filename": "opencorporates_mapping.ttl",
    "rml_input_filename": "input.xml",
    "rml_output_filename": "output.nt"
}

logging = {
    "level": "INFO"
}
