#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (https://theybuyforyou.eu/tbfy-knowledge-graph/)
# 
# This file contains a script that reconciles award suppliers with companies using the OpenCorporates 
# Reconciliation API (https://api.opencorporates.com/documentation/Open-Refine-Reconciliation-API)
#
# Company data for matching companies are downloaded as JSON documents from the
# OpenCorporates Company API (https://api.opencorporates.com/documentation/API-Reference)
# 
# Copyright: SINTEF 2017-2019
# Author   : Brian Elvesæter (brian.elvesater@sintef.no)
# License  : Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
# Project  : Developed as part of the TheyBuyForYou project (https://theybuyforyou.eu/)
# Funding  : TheyBuyForYou has received funding from the European Union's Horizon 2020
#            research and innovation programme under grant agreement No 780247
#####################################################################################################

#!/usr/bin/python

import config

import tbfy.json_utils
import tbfy.opencorporates_lookup

import logging

import requests
import json

import os
import sys
import getopt

import time
import datetime
from datetime import date
from datetime import datetime
from datetime import timedelta


# ****************
# Global variables
# ****************

opencorporates_reconcile_score = config.opencorporates["reconcile_score"]
opencorporates_reconcile_api_url = config.opencorporates["reconcile_api_url"]
opencorporates_companies_api_url = config.opencorporates["companies_api_url"]


# **********
# Statistics
# **********

stats_reconciliation = config.opencorporates_statistics.copy()

def write_stats(output_folder):
    global stats_reconciliation

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    sfile = open(os.path.join(output_folder, 'STATISTICS.TXT'), 'w+')
    for key in stats_reconciliation.keys():
        sfile.write(str(key) + " = " + str(stats_reconciliation[key]) + "\n")
    sfile.close()

def reset_stats():
    global stats_reconciliation

    for key in stats_reconciliation.keys():
        stats_reconciliation[key] = 0
    

# *****************************************
# Cached lookup table for matched suppliers
# *****************************************

suppliers_lookup_dict = dict() # Used for processing a singe award release in case the same supplier occurs multiple time. Must be reset after each award processing.

def add_supplier_to_lookup_dict(supplier_name, jurisdiction_code, company_number, identifier_notation, reconciliation_score, reconciliation_source, reconciliation_date):
    global suppliers_lookup_dict
    suppliers_lookup_dict[supplier_name] = (jurisdiction_code, company_number, identifier_notation, reconciliation_score, reconciliation_source, reconciliation_date)

def get_supplier_from_lookup_dict(supplier_name):
    global suppliers_lookup_dict
    if supplier_name in suppliers_lookup_dict.keys():
        return suppliers_lookup_dict[supplier_name]
    else:
        return None

def reset_suppliers_lookup_dict():
    global suppliers_lookup_dict
    suppliers_lookup_dict.clear()


# *****************************
# Country name codes key errors
# *****************************

country_name_codes_no_errors = 0
country_name_codes_key_errors = []

def write_country_name_codes_errors(output_folder):
    global country_name_codes_no_errors
    global country_name_codes_key_errors

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    sfile = open(os.path.join(output_folder, 'COUNTRY_NAME_CODES_ERRORS.TXT'), 'w+')
    sfile.write("country_name_codes_no_errors = " + str(country_name_codes_no_errors) +'\n')
    sfile.write("country_name_codes_key_errors = " + str(country_name_codes_key_errors) +'\n')
    sfile.close()


# ****************
# Lookup functions
# ****************

def country_name_2_code_jurisdiction(country_name):
    try:
        return tbfy.opencorporates_lookup.country_name_codes[country_name.lower()]
    except KeyError:
        global country_name_codes_no_errors
        global country_name_codes_key_errors
        country_name_codes_no_errors += 1
        country_name_codes_key_errors.append(country_name)
        return ""


# *****************
# Reconcile company
# *****************
def reconcile_company(company_name, jurisdiction_code):
    if config.opencorporates["country_name_codes_simulation"]:
        return None

    url = opencorporates_reconcile_api_url
    params = {
        "query": company_name,
        "jurisdiction_code": jurisdiction_code
    }
    headers = {
        "Content-Type": "application/json"
    }
    response = requests.get(url, params=params, headers=headers)

    if response.status_code != 200:
        logging.info("reconcile_company(): ERROR: " + json.dumps(response.json()))
        return None
    else:
        return response


# ***********
# Get company
# ***********
def get_company(company_id, api_token):
    if config.opencorporates["country_name_codes_simulation"]:
        return None

    url = opencorporates_companies_api_url + company_id
    params = {
        "api_token": api_token
    }
    headers = {
        "Content-Type": "application/json"
    }
    response = requests.get(url, params=params, headers=headers)

    if response.status_code != 200:
        logging.info("get_company(): ERROR: " + json.dumps(response.json()))
        return None
    else:
        return response


# ********************
# Is candidate company
# ********************
def is_candidate_company(buyer_data, supplier_data, result_data):
    global stats_reconciliation

    supplier_name = get_supplier_name(supplier_data)
    result_id = result_data['id']
    result_score = result_data['score']

    # If score lower than configured score then return false
    if float(result_score) < float(opencorporates_reconcile_score):
        return False

    if float(result_score) > float(stats_reconciliation['highest_result_score']):
        stats_reconciliation['highest_result_score'] = result_score

    # If buyer jurisdiction is empty then return false
    buyer_jurisdiction = get_buyer_country_code(buyer_data)
    if not buyer_jurisdiction:
        return False

    # If supplier jurisdiction is empty then use buyer jurisdiction for matching
    supplier_jurisdiction = get_supplier_country_code(supplier_data)
    if not supplier_jurisdiction:
        supplier_jurisdiction = buyer_jurisdiction

    # If supplier jurisdiction matches result jurisdiction then return true
    result_jurisdiction = get_result_jurisdiction(result_data)
    if supplier_jurisdiction == result_jurisdiction:
        logging.info("is_candidate_company(): supplier_name = " + supplier_name)
        logging.info("is_candidate_company(): result_id = " + result_id)
        logging.info("is_candidate_company(): result_score = " + str(result_score))
        stats_reconciliation['candidate_companies'] += 1
        return True
    else:
        return False


# *******************
# Is matching company
# *******************

def is_matching_company(supplier_data, company_data): 
    global stats_reconciliation

    supplier_postal_code = get_supplier_postal_code(supplier_data)
    supplier_street_address = get_supplier_street_address(supplier_data)
    company_registered_address_in_full = get_company_registered_address_in_full(company_data)

    if (supplier_postal_code == "") and (supplier_street_address == ""):
        return False
    elif not company_registered_address_in_full:
        return False
    elif (supplier_postal_code in company_registered_address_in_full) and (supplier_street_address in company_registered_address_in_full):
        logging.info("is_matching_company(): supplier_postal_code = " + supplier_postal_code)
        logging.info("is_matching_company(): supplier_street_address = " + supplier_street_address)
        logging.info("is_matching_company(): company_registered_address_in_full = " + company_registered_address_in_full)
        stats_reconciliation['matching_companies'] += 1
        return True
    else:
        return False


# *************
# Write company
# *************
def write_company(ocid, response_company, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    if response_company:
        data = json.loads(json.dumps(response_company.json()))
        company_number = data['results']['company']['company_number']
        company_jurisdiction = data['results']['company']['jurisdiction_code']

        jfile = open(os.path.join(output_folder, str(ocid) + '-supplier-' + str(company_jurisdiction) + '-' + str(company_number) + '.json'), 'w+')
        jfile.write(json.dumps(data, indent=4).replace(': null', ': ""'))
        jfile.close()


# *****************************************************************************
# Loop through suppliers, reconcile and and write file for each candidate match
# *****************************************************************************
def process_suppliers(api_token, release_data, award_index, filename, output_folder):
    global stats_reconciliation

    logging.info("process_suppliers(): tag_value = " + str(get_tag(release_data)))
    buyer_data = get_buyer(release_data)
    buyer_name = get_buyer_name(buyer_data)
    buyer_country_code = get_buyer_country_code(buyer_data)
    logging.info("process_suppliers(): buyer_name = " + buyer_name)
    logging.info("process_suppliers(): buyer_country_code = " + buyer_country_code)

    # Reset suppliers lookup table for processing new award
    reset_suppliers_lookup_dict()

    # Try to reconcile each supplier
    suppliers_data = get_suppliers(release_data, award_index)
    if suppliers_data:
        supplier_index = 0
        for supplier_data in suppliers_data:
            stats_reconciliation['suppliers'] += 1
            supplier_name = get_supplier_name(supplier_data)

            # If supplier jurisdiction is empty then use buyer jurisdiction for matching
            supplier_jurisdiction_code = get_supplier_country_code(supplier_data)
            if not supplier_jurisdiction_code:
                supplier_jurisdiction_code = buyer_country_code

            release_ocid = release_data['releases'][0]['ocid']

            # Get reconcile results
            response_reconcile_results = reconcile_company(supplier_name, supplier_jurisdiction_code)
            reconcile_results_data = json.loads(json.dumps(response_reconcile_results.json()))
            for reconcile_result in reconcile_results_data['result']:
                result_score = reconcile_result['score']

                match_found = False
                # Check lookup for previous matches
                if supplier_name in suppliers_lookup_dict.keys():
                    match_found = True

                new_match_found = False
                if ((not match_found) and (is_candidate_company(buyer_data, supplier_data, reconcile_result))):
                    logging.info("process_suppliers(): result_score = " + str(result_score))
                    company_id = reconcile_result['id']
                    response_company = get_company(company_id, api_token)
                    company_data = json.loads(json.dumps(response_company.json()))

                    if not config.opencorporates['smart_address_check']:
                        new_match_found = True

                    if ((not new_match_found) and (is_matching_company(supplier_data, company_data))):
                        new_match_found = True

                    if new_match_found:
                        match_found = True
                        stats_reconciliation['matching_companies'] += 1

                        # Add company to lookup table if new match
                        company_jurisdiction_code = company_data['results']['company']['jurisdiction_code']
                        company_number = company_data['results']['company']['company_number']
                        company_identifier_notation = company_jurisdiction_code + "/" + company_number
                        company_reconciliation_score = result_score
                        company_reconciliation_source = opencorporates_reconcile_api_url
                        company_reconciliation_date = str(date.today())

                        add_supplier_to_lookup_dict(supplier_name, company_jurisdiction_code, company_number, company_identifier_notation, company_reconciliation_score, company_reconciliation_source, company_reconciliation_date)

                        # Write company data
                        write_company(release_ocid, response_company, output_folder)

                if match_found:
                    # Add specific TBFY property for OpenCorporates Id
                    values = get_supplier_from_lookup_dict(supplier_name)
                    company_jurisdiction_code = values[0]
                    company_number = values[1]
                    company_identifier_notation = values[2]
                    company_reconciliation_score = values[3]
                    company_reconciliation_source = values[4]
                    company_reconciliation_date = values[5]

                    tbfy.json_utils.add_property_to_single_node(release_data, "releases.[0].awards.[" + str(award_index) + "].suppliers.[" + str(supplier_index) +"]", "tbfy_company_jurisdiction_code", company_jurisdiction_code)
                    tbfy.json_utils.add_property_to_single_node(release_data, "releases.[0].awards.[" + str(award_index) + "].suppliers.[" + str(supplier_index) +"]", "tbfy_company_number", company_number)
                    tbfy.json_utils.add_property_to_single_node(release_data, "releases.[0].awards.[" + str(award_index) + "].suppliers.[" + str(supplier_index) +"]", "tbfy_company_identifier_notation", company_identifier_notation)
                    tbfy.json_utils.add_property_to_single_node(release_data, "releases.[0].awards.[" + str(award_index) + "].suppliers.[" + str(supplier_index) +"]", "tbfy_company_reconciliation_score", company_reconciliation_score)
                    tbfy.json_utils.add_property_to_single_node(release_data, "releases.[0].awards.[" + str(award_index) + "].suppliers.[" + str(supplier_index) +"]", "tbfy_company_reconciliation_source", company_reconciliation_source)
                    tbfy.json_utils.add_property_to_single_node(release_data, "releases.[0].awards.[" + str(award_index) + "].suppliers.[" + str(supplier_index) +"]", "tbfy_company_reconciliation_date", company_reconciliation_date)
            
            supplier_index += 1

    # Write award release to output folder
    jfile = open(os.path.join(output_folder, filename), 'w+')
    jfile.write(json.dumps(release_data, indent=4).replace(': null', ': ""'))
    jfile.close()


# ****************************************************
# Collection of helper functions for JSON release data
# ****************************************************
def get_tag(release_data):
    return release_data['releases'][0]['tag']

def get_buyer(release_data):
    return release_data['releases'][0]['buyer']

def get_awards(release_data):
    try:
        return release_data['releases'][0]['awards']
    except KeyError:
        return None

def get_suppliers(release_data, award_index):
    try:
        return release_data['releases'][0]['awards'][award_index]['suppliers']
    except KeyError:
        return None

def is_award(release_data):
    global stats_reconciliation

    tag_value = get_tag(release_data)
    if ("award" in tag_value) or ("awardUpdate" in tag_value):
        stats_reconciliation['awards'] += 1
        return True
    else:
        return False


# *************************************************************
# Collection of helper functions for JSON reconcile result data
# *************************************************************

def get_buyer_name(buyer_data):
    try:
        name = buyer_data['name']
        return name
    except KeyError:
        return ""

def get_buyer_country_code(buyer_data):
    try:
        country_name = buyer_data['address']['countryName']
        return country_name_2_code_jurisdiction(country_name)
    except KeyError:
        return ""

def get_supplier_name(supplier_data):
    try:
        supplier_name = supplier_data['name']
        supplier_legal_name = supplier_data['identifier']['legalName']
        if ((supplier_legal_name != "") and (supplier_legal_name != None)):
            return supplier_legal_name
        else:
            return supplier_name
    except KeyError:
        return ""

def get_supplier_country_code(supplier_data):
    try:
        country_name = supplier_data['address']['countryName']
        return country_name_2_code_jurisdiction(country_name)
    except KeyError:
        return ""

def get_supplier_postal_code(supplier_data):
    try:
        postal_code = supplier_data['address']['postalCode']
        return postal_code
    except KeyError:
        return ""

def get_supplier_street_address(supplier_data):
    try:
        street_address = supplier_data['address']['streetAddress']
        return street_address
    except KeyError:
        return ""

def get_result_jurisdiction(result_data):
    try:
        result_id = str(result_data['id']).replace("/companies/", "")
        result_jurisdiction = result_id[0:result_id.find("/")]
        return result_jurisdiction
    except KeyError:
        return ""

def get_company_registered_address_in_full(company_data):
    try:
        registered_address_in_full = company_data['results']['company']['registered_address_in_full']
        return registered_address_in_full
    except KeyError:
        return ""


# *************
# Main function
# *************
def main(argv):
    logging.basicConfig(level=config.logging["level"])
    
    api_token = ""
    start_date = ""
    end_date = ""
    input_folder = ""
    output_folder = ""

    try:
        opts, args = getopt.getopt(argv, "ha:s:e:i:o:")
    except getopt.GetoptError:
        print("opencorporates.py -a <api_token> -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("opencorporates.py -a <api_token> -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>")
            sys.exit()
        elif opt in ("-a"):
            api_token = arg
        elif opt in ("-s"):
            start_date = arg
        elif opt in ("-e"):
            end_date = arg
        elif opt in ("-i"):
            input_folder = arg
        elif opt in ("-o"):
            output_folder = arg

    logging.info("main(): api_token = " + api_token)
    logging.info("main(): start_date = " + start_date)
    logging.info("main(): end_date = " + end_date)
    logging.info("main(): input_folder = " + input_folder)
    logging.info("main(): output_folder = " + output_folder)

    copy_command = ""
    if sys.platform.lower().startswith("win"):
        copy_command = "copy"
    elif sys.platform.lower().startswith("linux"):
        copy_command = "cp"
    elif sys.platform.lower().startswith("darwin"):
        copy_command = "cp"
    else:
        copy_command = "copy"

    logging.info("main(): platform = " + sys.platform.lower())
    logging.info("main(): copy_command = " + copy_command)

    start = datetime.strptime(start_date, "%Y-%m-%d")
    stop = datetime.strptime(end_date, "%Y-%m-%d")

    while start <= stop:
        release_date = datetime.strftime(start, "%Y-%m-%d")

        dirname = release_date
        dirPath = os.path.join(input_folder, dirname)
        outputDirPath = os.path.join(output_folder, dirname)
        if os.path.isdir(dirPath):
            if not os.path.exists(outputDirPath):
                os.makedirs(outputDirPath)
            reset_stats()

            for filename in os.listdir(dirPath):
                filePath = os.path.join(dirPath, filename)
                outputFilePath = os.path.join(outputDirPath, filename)
                f = open(filePath)
                lines = f.read()
                
                try:
                    release_data = json.loads(lines)
                    f.close()

                    if is_award(release_data):
                        logging.info("main(): filename = " + f.name)

                        awards_data = get_awards(release_data)
                        if awards_data:
                            award_index = 0
                            for award_data in awards_data:
                                process_suppliers(api_token, release_data, award_index, filename, outputDirPath)
                                award_index += 1
                    else:
                        if not config.opencorporates["country_name_codes_simulation"]:
                            os.system(copy_command + ' ' + filePath + ' ' + outputFilePath)
                except:
                    pass

            write_stats(outputDirPath) # Write statistics

        start = start + timedelta(days=1)  # increase day one by one

    if config.opencorporates["country_name_codes_simulation"]:
        write_country_name_codes_errors(output_folder)


# *****************
# Run main function
# *****************
if __name__ == "__main__": main(sys.argv[1:])
