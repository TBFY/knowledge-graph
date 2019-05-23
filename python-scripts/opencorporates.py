#!/usr/bin/python

import config
import opencorporates_lookup

import logging

import requests
import json

import os
import sys
import getopt


# ****************
# Global variables
# ****************

opencorporates_reconcile_score = config.opencorporates["reconcile_score"]
opencorporates_reconcile_api_url = config.opencorporates["reconcile_api_url"]
opencorporates_companies_api_url = config.opencorporates["companies_api_url"]


# **********
# Statistics
# **********

stat_no_awards = 0
stat_no_suppliers = 0
stat_no_candidate_companies = 0
stat_no_matching_companies = 0
stat_highest_result_score = 0

def write_stats(output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    sfile = open(os.path.join(output_folder, 'STATISTICS.TXT'), 'w+')
    sfile.write("stat_no_awards             : " + str(stat_no_awards) +'\n')
    sfile.write("stat_no_suppliers          : " + str(stat_no_suppliers) +'\n')
    sfile.write("stat_no_candidate_companies: " + str(stat_no_candidate_companies) +'\n')
    sfile.write("stat_no_matching_companies : " + str(stat_no_matching_companies) +'\n')
    sfile.write("stat_highest_result_score  : " + str(stat_highest_result_score) + '\n')
    sfile.close()


# ****************
# Lookup functions
# ****************

def country_name_2_code_jurisdiction(country_name):
    try:
        return opencorporates_lookup.country_name_codes[country_name.lower()]
    except KeyError:
        return ""


# *****************
# Reconcile company
# *****************
def reconcile_company(company_name):
    url = opencorporates_reconcile_api_url
    params = {
        "query": company_name
    }
    headers = {
        "Content-Type": "application/json"
    }
    response = requests.get(url, params=params, headers=headers)
    return response


# ***********
# Get company
# ***********
def get_company(company_id, api_token):
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
    supplier_name = get_supplier_name(supplier_data)
    result_id = result_data['id']
    result_score = result_data['score']

    # If score lower than configured score then return false
    if float(result_score) < float(opencorporates_reconcile_score):
        return False

    global stat_highest_result_score
    if float(result_score) > float(stat_highest_result_score):
        stat_highest_result_score = result_score

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
        global stat_no_candidate_companies
        stat_no_candidate_companies += 1
        return True
    else:
        return False


# *******************
# Is matching company
# *******************

def is_matching_company(supplier_data, company_data): 
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
        global stat_no_matching_companies
        stat_no_matching_companies += 1
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

        jfile = open(output_folder + '\\' + str(ocid) + '-supplier-' + str(company_jurisdiction) + '-' + str(company_number) + '.json', 'w+')
        jfile.write(json.dumps(data, indent=4).replace(': null', ': ""'))
        jfile.close()


# *****************************************************************************
# Loop through suppliers, reconcile and and write file for each candidate match
# *****************************************************************************
def process_suppliers(api_token, release_data, filename, output_folder):
    logging.info("process_suppliers(): tag_value = " + str(get_tag(release_data)))
    buyer_data = get_buyer(release_data)
    buyer_name = get_buyer_name(buyer_data)
    buyer_country_code = get_buyer_country_code(buyer_data)
    logging.info("process_suppliers(): buyer_name = " + buyer_name)
    logging.info("process_suppliers(): buyer_country_code = " + buyer_country_code)

    # Try to reconcile each supplier
    suppliers_data = get_suppliers(release_data)
    if suppliers_data:
        supplier_index = 0
        for supplier_data in suppliers_data:
            global stat_no_suppliers
            stat_no_suppliers += 1
            supplier_name = get_supplier_name(supplier_data)

            # Get reconcile results
            response_reconcile_results = reconcile_company(supplier_name)
            reconcile_results_data = json.loads(json.dumps(response_reconcile_results.json()))
            for reconcile_result in reconcile_results_data['result']:
                result_score = reconcile_result['score']
                
                if is_candidate_company(buyer_data, supplier_data, reconcile_result):
                    logging.info("process_suppliers(): result_score = " + str(result_score))
                    release_ocid = release_data['ocid']
                    company_id = reconcile_result['id']
                    response_company = get_company(company_id, api_token)
                    company_data = json.loads(json.dumps(response_company.json()))

                    if is_matching_company(supplier_data, company_data):
                        write_company(release_ocid, response_company, output_folder)
                        # Add specific TBFY property for OpenCorporates Id
                        release_data['json']['releases'][0]['awards'][0]['suppliers'][supplier_index]['tbfyOpenCorporatesUrl'] = company_data['results']['company']['opencorporates_url']

            supplier_index += 1

    # Write award release to output folder
    jfile = open(os.path.join(output_folder, release_data['ocid'] + '-release.json'), 'w+')
    jfile.write(json.dumps(release_data, indent=4).replace(': null', ': ""'))
    jfile.close()


# ****************************************************
# Collection of helper functions for JSON release data
# ****************************************************
def get_tag(release_data):
    return release_data['json']['releases'][0]['tag']

def get_buyer(release_data):
    return release_data['json']['releases'][0]['buyer']

def get_suppliers(release_data):
    try:
        return release_data['json']['releases'][0]['awards'][0]['suppliers']
    except KeyError:
        return None

def is_award(release_data):
    tag_value = get_tag(release_data)
    if ("award" in tag_value) or ("awardUpdate" in tag_value):
        global stat_no_awards
        stat_no_awards += 1
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
        if supplier_legal_name != "":
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
    input_folder = ""
    output_folder = ""

    try:
        opts, args = getopt.getopt(argv, "ha:i:o:")
    except getopt.GetoptError:
        print("opencorporates.py -a <api_token> -i <input_folder> -o <output_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("opencorporates.py -a <api_token> -i <input_folder> -o <output_folder>")
            sys.exit()
        elif opt in ("-a"):
            api_token = arg
        elif opt in ("-i"):
            input_folder = arg
        elif opt in ("-o"):
            output_folder = arg

    logging.info("main(): input_folder = " + input_folder)
    logging.info("main(): output_folder = " + output_folder)

    for dirname in os.listdir(input_folder):
        dirPath = os.path.join(input_folder, dirname)
        outputDirPath = os.path.join(output_folder, dirname)
        if not os.path.exists(outputDirPath):
            os.makedirs(outputDirPath)
        if os.path.isdir(dirPath):
            for filename in os.listdir(dirPath):
                filePath = os.path.join(dirPath, filename)
                outputFilePath = os.path.join(outputDirPath, filename)
                f = open(filePath)
                lines = f.read()
                release_data = json.loads(lines)
                f.close()
                if is_award(release_data):
                    logging.info("main(): filename = " + f.name)
                    process_suppliers(api_token, release_data, filename, outputDirPath)
                else:
                    os.system('copy ' + filePath + ' ' + outputFilePath)

    write_stats(output_folder)


# *****************
# Run main function
# *****************
if __name__ == "__main__": main(sys.argv[1:])
