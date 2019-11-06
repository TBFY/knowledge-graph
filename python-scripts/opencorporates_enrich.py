#!/usr/bin/python

import config

import logging

import json

import os
import sys
import getopt


# ************
# Read company
# ************

def read_company(input_filePath):                
    try:
        f = open(input_filePath)
        lines = f.read()

        company_data = json.loads(lines)
        f.close()   
        return company_data
    except:
        return None


# **************
# Enrich company
# **************

def enrich_company(company_data):
    company_jurisdiction_code = company_data['results']['company']['jurisdiction_code']
    company_company_number = company_data['results']['company']['company_number']

    officers_data = company_data['results']['company']['officers']
    officer_index = 0
    for officer in officers_data:
        company_data['results']['company']['officers'][officer_index]['officer']['tbfy_company_jurisdiction_code'] = company_jurisdiction_code
        company_data['results']['company']['officers'][officer_index]['officer']['tbfy_company_company_number'] = company_company_number
        officer_index += 1

    return company_data


# *************
# Write company
# *************
def write_company(company_data, output_filePath):
    if company_data:
        jfile = open(output_filePath, 'w+')
        jfile.write(json.dumps(company_data, indent=4).replace(': null', ': ""'))
        jfile.close()


# ***************
# Process company
# ***************

def process_company(input_filePath, output_filePath):
    input_data = read_company(input_filePath)
    enriched_company_data = enrich_company(input_data)
    write_company(enriched_company_data, output_filePath)


# *************
# Main function
# *************
def main(argv):  
    logging.basicConfig(level=config.logging["level"])

    input_filename = ""
    output_filename = ""

    try:
        opts, args = getopt.getopt(argv, "hi:o:")
    except getopt.GetoptError:
        print("opencorporates_enrich.py -i <input_filename> -o <output_filename>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("opencorporates_enrich.py -i <input_filename> -o <output_filename>")
            sys.exit()
        elif opt in ("-i"):
            input_filename = arg
        elif opt in ("-o"):
            output_filename = arg

    logging.info("main(): input_filename = " + input_filename)
    logging.info("main(): output_filename = " + output_filename)

    process_company(input_filename, output_filename)


# *****************
# Run main function
# *****************
if __name__ == "__main__": main(sys.argv[1:])
