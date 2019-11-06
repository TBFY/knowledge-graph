#!/usr/bin/python

import config

import logging

import json

import os
import sys
import getopt


# *******************************
# Read release (procurement data)
# *******************************

def read_release(input_filePath):                
    try:
        f = open(input_filePath)
        lines = f.read()

        release_data = json.loads(lines)
        f.close()   
        return release_data
    except:
        return None


# *********************************
# Enrich release (procurement data)
# *********************************

def enrich_release(release_data):
    if release_data['json']['releases'][0]['tag'][0] == "tender":
        return enrich_tender(release_data)
    else:
        return release_data

def enrich_tender(release_data):
    ocid = release_data['ocid']
    tender_id = release_data['json']['releases'][0]['tender']['id']

    documents_data = release_data['json']['releases'][0]['tender']['documents']
    document_index = 0
    for document in documents_data:
        release_data['json']['releases'][0]['tender']['documents'][document_index]['tbfy_tender_id'] = tender_id
        document_index += 1

    return release_data


# ********************************
# Write release (procurement data)
# ********************************
def write_release(release_data, output_filePath):
    if release_data:
        jfile = open(output_filePath, 'w+')
        jfile.write(json.dumps(release_data, indent=4).replace(': null', ': ""'))
        jfile.close()


# **********************************
# Process release (procurement data)
# **********************************

def process_release(input_filePath, output_filePath):
    input_data = read_release(input_filePath)
    enriched_release_data = enrich_release(input_data)
    write_release(enriched_release_data, output_filePath)


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

    process_release(input_filename, output_filename)


# *****************
# Run main function
# *****************
if __name__ == "__main__": main(sys.argv[1:])
