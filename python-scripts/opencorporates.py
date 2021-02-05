#!/usr/bin/python
# -*- coding: utf-8 -*-

#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (http://data.tbfy.eu/)
# 
# This file contains a script that reconciles award suppliers with companies using the OpenCorporates 
# Reconciliation API (https://api.opencorporates.com/documentation/Open-Refine-Reconciliation-API)
#
# Company data for matching companies are downloaded as JSON documents from the
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
import tbfy.opencorporates_lookup
import tbfy.statistics

import logging

from decimal import Decimal

import shelve
import copy

import requests
import json

import os
import shutil
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

opencorporates_use_cached_company_database = config.opencorporates["use_cached_company_database"]
opencorporates_cached_company_database_retention_days = config.opencorporates["cached_company_database_retention_days"]
opencorporates_cached_company_database_filename = config.opencorporates["cached_company_database_filename"]


# **********
# Statistics
# **********

stats_reconciliation = tbfy.statistics.opencorporates_statistics_reconciliation.copy()

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

    stats_reconciliation = tbfy.statistics.opencorporates_statistics_reconciliation.copy()
    

# *************************************************
# Cached lookup database (dictionary) for companies
# *************************************************

# Used to lookup previously matched companies that are kept for the number of retention days specified in config
company_database_dict = shelve.open(opencorporates_cached_company_database_filename, writeback=True) 

def add_company_to_database_dict(company_id, entry_date, json_data):
    global company_database_dict
    company_database_dict[company_id] = (company_id, entry_date, json_data)


def get_company_from_database_dict(company_id):
    global company_database_dict

    if company_id in company_database_dict.keys():
        company_result = company_database_dict[company_id]
        entry_date = company_result[1]
        days_old = (date.today() - entry_date).days
        if (days_old > opencorporates_cached_company_database_retention_days):
            company_database_dict.pop(company_id, None)
        else:
            return company_result[2]
    else:
        return None


# ***********************************************************************
# Cached lookup table (dictionary) for suppliers (reconciliation results)
# ***********************************************************************

# Used for processing a single award release in case the same supplier occurs multiple time. Must be reset after each award release processing.
suppliers_lookup_dict = dict()

def add_supplier_to_lookup_dict(supplier_name, jurisdiction_code, json_data):
    global suppliers_lookup_dict
    suppliers_lookup_dict[(supplier_name, jurisdiction_code)] = (supplier_name, jurisdiction_code, json_data)


def get_supplier_from_lookup_dict(supplier_name, jurisdiction_code):
    global suppliers_lookup_dict

    if (supplier_name, jurisdiction_code) in suppliers_lookup_dict.keys():
        return suppliers_lookup_dict[(supplier_name, jurisdiction_code)][2]
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

def reconcile_company(company_name, jurisdiction_code, api_token_reconcile):
    global stats_reconciliation

    if config.opencorporates["country_name_codes_simulation"]:
        return None

    start_time = datetime.now()

    url = opencorporates_reconcile_api_url
    params = {
#        "query": company_name,
#        "jurisdiction_code": jurisdiction_code
        "queries": "{\"q0\": {\"query\": \"" + company_name + "\",  \"properties\": [{\"pid\": \"jurisdiction_code\", \"v\": \"" + jurisdiction_code + "\"}]}}",
        "api_token": api_token_reconcile
    }
    headers = {
        "Content-Type": "application/json"
    }
    response = requests.get(url, params=params, headers=headers)

    if response.status_code != 200:
        logging.error("reconcile_company(): ERROR: " + json.dumps(response.json()))
        return None
    else:
        end_time = datetime.now()
        duration_in_seconds = (end_time - start_time).total_seconds()
        tbfy.statistics.update_stats_add(stats_reconciliation, "reconciliation_lookups_from_api_duration_in_seconds", duration_in_seconds)
        tbfy.statistics.update_stats_count(stats_reconciliation, "reconciliation_lookups_from_api")
        return response


# ***********
# Get company
# ***********

def get_company(company_id, api_token_companies):
    global stats_reconciliation

    if config.opencorporates["country_name_codes_simulation"]:
        return None

    start_time = datetime.now()

    url = opencorporates_companies_api_url + company_id
    params = {
        "api_token": api_token_companies
    }
    headers = {
        "Content-Type": "application/json"
    }
    response = requests.get(url, params=params, headers=headers)

    if response.status_code != 200:
        logging.error("get_company(): ERROR: " + json.dumps(response.json()))
        sys.exit(1)
    else:
        end_time = datetime.now()
        duration_in_seconds = (end_time - start_time).total_seconds()
        tbfy.statistics.update_stats_add(stats_reconciliation, "company_downloads_from_api_duration_in_seconds", duration_in_seconds)
        tbfy.statistics.update_stats_count(stats_reconciliation, "company_downloads_from_api")
        return response


# ********************
# Is candidate company
# ********************

def is_candidate_company(buyer_data, supplier_data, result_data):
    global stats_reconciliation

    supplier_name = get_supplier_name(supplier_data)
    result_id = result_data['id']
    result_score = result_data['score']

    # Update results score statistics
    tbfy.statistics.update_stats_append(stats_reconciliation, "list_result_score", result_score)

    # If score lower than configured score then return false
    if float(result_score) < float(opencorporates_reconcile_score):
        return False

    # If supplier jurisdiction is empty then use buyer jurisdiction for matching
    supplier_jurisdiction = get_supplier_country_code(supplier_data)
    if not supplier_jurisdiction:
        supplier_jurisdiction = get_buyer_country_code(buyer_data)
   
    # If supplier jurisdiction matches result jurisdiction then return true
    result_jurisdiction = get_result_jurisdiction(result_data)
    if supplier_jurisdiction == result_jurisdiction:
        logging.debug("is_candidate_company(): supplier_name = " + supplier_name)
        logging.debug("is_candidate_company(): result_id = " + result_id)
        logging.debug("is_candidate_company(): result_score = " + str(result_score))
        tbfy.statistics.update_stats_count(stats_reconciliation, "candidate_companies")
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
        logging.debug("is_matching_company(): supplier_postal_code = " + supplier_postal_code)
        logging.debug("is_matching_company(): supplier_street_address = " + supplier_street_address)
        logging.debug("is_matching_company(): company_registered_address_in_full = " + company_registered_address_in_full)
        tbfy.statistics.update_stats_count(stats_reconciliation, "matching_companies")
        return True
    else:
        return False


# *************
# Write company
# *************

def write_company(ocid, response_company, output_folder):
    global stats_reconciliation

    start_time = datetime.now()

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    if response_company:
        data = json.loads(json.dumps(response_company.json()))
        company_number = data['results']['company']['company_number']
        company_jurisdiction = data['results']['company']['jurisdiction_code']

        outputFilePath = os.path.join(output_folder, str(ocid) + '-supplier-' + str(company_jurisdiction) + '-' + str(company_number) + '.json')
        if not os.path.exists(outputFilePath):
            jfile = open(outputFilePath, 'w+')
            jfile.write(json.dumps(data, indent=4).replace(': null', ': ""'))
            jfile.close()

            end_time = datetime.now()
            duration_in_seconds = (end_time - start_time).total_seconds()
            tbfy.statistics.update_stats_add(stats_reconciliation, "company_files_written_duration_in_seconds", duration_in_seconds)
            tbfy.statistics.update_stats_count(stats_reconciliation, "company_files_written")


# *****************************************************************************
# Loop through suppliers, reconcile and and write file for each candidate match
# *****************************************************************************

def process_suppliers(api_token_reconcile, api_token_companies, release_data, award_index, filename, output_folder):
    global stats_reconciliation

    logging.debug("process_suppliers(): tag_value = " + str(get_tag(release_data)))
    buyer_data = get_buyer(release_data)
    buyer_name = get_buyer_name(buyer_data)
    buyer_country_code = get_buyer_country_code(buyer_data)
    logging.debug("process_suppliers(): buyer_name = " + buyer_name)
    logging.debug("process_suppliers(): buyer_country_code = " + buyer_country_code)

    # Try to reconcile each supplier
    suppliers_data = get_suppliers(release_data, award_index)
    if suppliers_data:
        supplier_index = 0
        for supplier_data in suppliers_data:
            tbfy.statistics.update_stats_count(stats_reconciliation, "suppliers")
            supplier_name = get_supplier_name(supplier_data)

            # If supplier jurisdiction is empty then use buyer jurisdiction for matching
            supplier_jurisdiction_code = get_supplier_country_code(supplier_data)
            if not supplier_jurisdiction_code:
                supplier_jurisdiction_code = buyer_country_code

            release_ocid = release_data['releases'][0]['ocid']

            # Check lookup table for supplier reconciliation results entries for previously looked up suppliers (multiple occurences) in this award release
            reconcile_results_data = get_supplier_from_lookup_dict(supplier_name, supplier_jurisdiction_code)
            if not reconcile_results_data:
                # Get result from reconcile API if no match is found in the lookup table 
                response_reconcile_results = reconcile_company(supplier_name, supplier_jurisdiction_code, api_token_reconcile)
                reconcile_q0_data = json.loads(json.dumps(response_reconcile_results.json()))
                reconcile_results_data = reconcile_q0_data['q0']
                # Add new reconciliation results to lookup table
                add_supplier_to_lookup_dict(supplier_name, supplier_jurisdiction_code, reconcile_results_data)
            else:
                tbfy.statistics.update_stats_count(stats_reconciliation, "reconciliation_lookups_from_cache")
            
            # Check if reconcile results data contains an actual result, i.e., score is available
            reconcile_result = None
            result_score = None
            try:
                reconcile_result = reconcile_results_data['result'][0]
                result_score = reconcile_result['score']
            except:
                None

            # Check for match
            if result_score:
                match_found = False

                if is_candidate_company(buyer_data, supplier_data, reconcile_result):
                    match_found = True
                    logging.debug("process_suppliers(): result_score = " + str(result_score))
                    company_id = reconcile_result['id']

                    response_company = None
                    if opencorporates_use_cached_company_database:
                        response_company = get_company_from_database_dict(company_id)
                        if response_company == None:
                            response_company = get_company(company_id, api_token_companies)
                            add_company_to_database_dict(company_id, date.today(), response_company)
                        else:
                            tbfy.statistics.update_stats_count(stats_reconciliation, "company_downloads_from_cache")
                    else:
                        response_company = get_company(company_id, api_token_companies)

                    company_data = json.loads(json.dumps(response_company.json()))

                    # Stricter matching using address check
                    if config.opencorporates['smart_address_check']:
                        match_found = is_matching_company(supplier_data, company_data)
                    else:
                        tbfy.statistics.update_stats_count(stats_reconciliation, "matching_companies")

                    if match_found:
                        company_jurisdiction_code = company_data['results']['company']['jurisdiction_code']
                        company_number = company_data['results']['company']['company_number']
                        company_identifier_notation = company_jurisdiction_code + "/" + company_number
                        company_reconciliation_score = result_score
                        company_reconciliation_source = opencorporates_reconcile_api_url
                        company_reconciliation_date = str(date.today())

                        # Write company data
                        write_company(release_ocid, response_company, output_folder)

                        # Add TBFY specific properties to award
                        tbfy.json_utils.add_property_to_single_node(release_data, "releases.[0].awards.[" + str(award_index) + "].suppliers.[" + str(supplier_index) +"]", "tbfy_company_jurisdiction_code", company_jurisdiction_code)
                        tbfy.json_utils.add_property_to_single_node(release_data, "releases.[0].awards.[" + str(award_index) + "].suppliers.[" + str(supplier_index) +"]", "tbfy_company_number", company_number)
                        tbfy.json_utils.add_property_to_single_node(release_data, "releases.[0].awards.[" + str(award_index) + "].suppliers.[" + str(supplier_index) +"]", "tbfy_company_identifier_notation", company_identifier_notation)
                        tbfy.json_utils.add_property_to_single_node(release_data, "releases.[0].awards.[" + str(award_index) + "].suppliers.[" + str(supplier_index) +"]", "tbfy_company_reconciliation_score", company_reconciliation_score)
                        tbfy.json_utils.add_property_to_single_node(release_data, "releases.[0].awards.[" + str(award_index) + "].suppliers.[" + str(supplier_index) +"]", "tbfy_company_reconciliation_source", company_reconciliation_source)
                        tbfy.json_utils.add_property_to_single_node(release_data, "releases.[0].awards.[" + str(award_index) + "].suppliers.[" + str(supplier_index) +"]", "tbfy_company_reconciliation_date", company_reconciliation_date)
            
            supplier_index += 1
        
        tbfy.statistics.update_stats_append(stats_reconciliation, "list_suppliers_per_award", (supplier_index))

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
    global stats_reconciliation

    logging.basicConfig(level=config.logging["level"])
    
    api_token_reconcile = ""
    api_token_companies = ""
    start_date = ""
    end_date = ""
    input_folder = ""
    output_folder = ""

    try:
        opts, args = getopt.getopt(argv, "ha:b:s:e:i:o:")
    except getopt.GetoptError:
        print("opencorporates.py -a <api_token_reconcile> -b <api_token_companies> -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("opencorporates.py -a <api_token_reconcile> -b <api_token_companies> -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>")
            sys.exit()
        elif opt in ("-a"):
            api_token_reconcile = arg
        elif opt in ("-b"):
            api_token_companies = arg
        elif opt in ("-s"):
            start_date = arg
        elif opt in ("-e"):
            end_date = arg
        elif opt in ("-i"):
            input_folder = arg
        elif opt in ("-o"):
            output_folder = arg

    logging.debug("opencorporates.py: api_token_reconcile = " + api_token_reconcile)
    logging.debug("opencorporates.py: api_token_companies = " + api_token_companies)
    logging.debug("opencorporates.py: start_date = " + start_date)
    logging.debug("opencorporates.py: end_date = " + end_date)
    logging.debug("opencorporates.py: input_folder = " + input_folder)
    logging.debug("opencorporates.py: output_folder = " + output_folder)

    start = datetime.strptime(start_date, "%Y-%m-%d")
    stop = datetime.strptime(end_date, "%Y-%m-%d")

    while start <= stop:
        process_start_time = datetime.now()

        created_date = datetime.strftime(start, "%Y-%m-%d")
        dirname = created_date
        dirPath = os.path.join(input_folder, dirname)
        outputDirPath = os.path.join(output_folder, dirname)
        if os.path.isdir(dirPath):
            if not os.path.exists(outputDirPath):
                os.makedirs(outputDirPath)

            for filename in os.listdir(dirPath):
                filePath = os.path.join(dirPath, filename)
                outputFilePath = os.path.join(outputDirPath, filename)
                f = open(filePath)
                lines = f.read()
                
                try:
                    release_data = json.loads(lines)
                    f.close()
                    tbfy.statistics.update_stats_count(stats_reconciliation, "number_of_releases")

                    if is_award(release_data):
                        logging.info("opencorporates.py: file = " + outputFilePath)
                        tbfy.statistics.update_stats_count(stats_reconciliation, "number_of_award_releases")
                        award_start_time = datetime.now()

                        awards_data = get_awards(release_data)
                        if awards_data:
                            award_index = 0
                            for award_data in awards_data:
                                process_suppliers(api_token_reconcile, api_token_companies, release_data, award_index, filename, outputDirPath)
                                award_index += 1

                        award_end_time = datetime.now()
                        award_duration_in_seconds = (award_end_time - award_start_time).total_seconds()
                        tbfy.statistics.update_stats_add(stats_reconciliation, "award_releases_processed_duration_in_seconds", award_duration_in_seconds)

                        # Reset suppliers lookup table for processing new award release
                        reset_suppliers_lookup_dict()
                    else:
                        if not config.opencorporates["country_name_codes_simulation"]:
                            shutil.copy(filePath, outputFilePath)
                except SystemExit:
                    sys.exit(1)
                except:
                    pass

        process_end_time = datetime.now()
        duration_in_seconds = (process_end_time - process_start_time).total_seconds()
        tbfy.statistics.update_stats_value(stats_reconciliation, "releases_processed_duration_in_seconds", duration_in_seconds)
        write_stats(outputDirPath) # Write statistics
        reset_stats() # Reset statistics for next folder date

        start = start + timedelta(days=1) # Increase date by one day

    if opencorporates_use_cached_company_database:
        company_database_dict.close() # Close shelve in order to persist data

    if config.opencorporates["country_name_codes_simulation"]:
        write_country_name_codes_errors(output_folder)


# *****************
# Run main function
# *****************

if __name__ == "__main__": main(sys.argv[1:])
