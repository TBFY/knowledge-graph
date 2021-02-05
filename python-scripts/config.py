# -*- coding: utf-8 -*-

# #####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (http://data.tbfy.eu/)
# 
# This file contains configuration parameters for the data ingestion process.
# 
# Copyright: SINTEF 2018-2021
# Author   : Brian Elvesæter (brian.elvesater@sintef.no)
# License  : Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
# Project  : Developed as part of the TheyBuyForYou project (https://theybuyforyou.eu/)
# Funding  : TheyBuyForYou has received funding from the European Union's Horizon 2020
#            research and innovation programme under grant agreement No 780247
#####################################################################################################

logging = {
    "level": "INFO"
}

openopps = {
    "api_url": "https://api.openopps.com/api/",
    "page_size": 1000,
    "sleep": 5
}

opencorporates = {
#    "reconcile_api_url": "https://opencorporates.com/reconcile",
    "reconcile_api_url": "https://reconcile.opencorporates.com",
    "reconcile_score": 60,
    "companies_api_url": "http://api.opencorporates.com",
    "smart_address_check": False,
    "country_name_codes_simulation": False,
    "use_cached_company_database": True,
    "cached_company_database_retention_days": 100,
    "cached_company_database_filename": "shelve/company_database_dict"
}

rml = {
    "rml_filename": "rmlmapper.jar",
    "openopps_mapping_filename": "openopps_mapping.ttl",
    "opencorporates_mapping_filename": "opencorporates_mapping.ttl",
    "rml_input_filename": "input.xml",
    "rml_output_filename": "output.nt"
}

jena_tools = {
    "riot_command": "riot",
}

jena_fuseki = {
    "fuseki_url": "http://52.19.213.234:3030", 
    "dataset": "tbfy"
}
