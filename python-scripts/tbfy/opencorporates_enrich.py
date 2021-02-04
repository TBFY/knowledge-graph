# -*- coding: utf-8 -*-

#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (http://data.tbfy.eu/)
#
# This file contains JSON enrichment functions for company data downloaded from the 
# OpenCorporates Company API (https://api.opencorporates.com/documentation/API-Reference)
# 
# Copyright: SINTEF 2018-2021
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
from urllib import parse

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

    url = tbfy.json_utils.get_value(company_data, "results.company.source.url")
    url_parsed = parse.urlparse(url).hostname
    tbfy.json_utils.add_property_to_single_node(company_data, "results.company.source", "tbfy_url", url_parsed)

    ramon_code = str(company_jurisdiction_code).upper()
    if (ramon_code == "GB"):
        ramon_code = "UK"

    tbfy.json_utils.add_property_to_single_node(company_data, "results.company", "tbfy_ramon_code", ramon_code)

    tbfy.json_utils.add_property_to_array_node(company_data, "results.company.officers", "officer.tbfy_company_jurisdiction_code", company_jurisdiction_code)
    tbfy.json_utils.add_property_to_array_node(company_data, "results.company.officers", "officer.tbfy_company_company_number", company_company_number)

    try: 
        industry_codes = company_data['results']['company']['industry_codes']
        i = 0
        for industry_code in industry_codes:
            code = company_data['results']['company']['industry_codes'][i]['industry_code']['code']
            code_scheme_id = company_data['results']['company']['industry_codes'][i]['industry_code']['code_scheme_id']
            if (code_scheme_id == "eu_nace_2"):
                tbfy.json_utils.add_property_to_single_node(company_data, "results.company.industry_codes.[" + str(i) + "].industry_code", "tbfy_nace.code", code)
            i += 1
    except KeyError:
        pass

    return company_data


# ***************
# Process company
# ***************

def process_company(input_filePath, output_filePath):
    input_data = tbfy.json_utils.read_jsonfile(input_filePath)
    enriched_company_data = enrich_company(input_data)
    tbfy.json_utils.write_jsonfile(enriched_company_data, output_filePath)
