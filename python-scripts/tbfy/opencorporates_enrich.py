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
