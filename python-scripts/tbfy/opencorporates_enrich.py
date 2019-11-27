#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (https://theybuyforyou.eu/tbfy-knowledge-graph/)
#
# This file contains JSON enrichment functions for company data downloaded from the 
# OpenCorporates Company API (https://api.opencorporates.com/documentation/API-Reference)
# 
# Copyright: SINTEF 2017-2019
# Author   : Brian Elvesæter (brian.elvesater@sintef.no)
# License  : Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
# Project  : Developed as part of the TheyBuyForYou project (https://theybuyforyou.eu/)
# Funding  : TheyBuyForYou has received funding from the European Union's Horizon 2020
#            research and innovation programme under grant agreement No 780247
#####################################################################################################

import config

import tbfy.json_utils

import logging

import json

import os
import sys
import getopt


# **************
# Enrich company
# **************

def enrich_company(company_data):
    company_jurisdiction_code = tbfy.json_utils.get_value(company_data, "results.company.jurisdiction_code")
    company_company_number = tbfy.json_utils.get_value(company_data, "results.company.company_number")

    company_identifier_notation = company_jurisdiction_code + '/' + company_company_number
    company_data['results']['company']['tbfy_company_identifier_notation'] = company_identifier_notation

#    tbfy.json_utils.add_property_to_array_node(company_data, "results.company", "tbfy_company_identifier_notation", company_identifier_notation)

    tbfy.json_utils.add_property_to_array_node(company_data, "results.company.officers", "officer.tbfy_company_jurisdiction_code", company_jurisdiction_code)
    tbfy.json_utils.add_property_to_array_node(company_data, "results.company.officers", "officer.tbfy_company_company_number", company_company_number)

    return company_data


# ***************
# Process company
# ***************

def process_company(input_filePath, output_filePath):
    input_data = tbfy.json_utils.read_jsonfile(input_filePath)
    enriched_company_data = enrich_company(input_data)
    tbfy.json_utils.write_jsonfile(enriched_company_data, output_filePath)
