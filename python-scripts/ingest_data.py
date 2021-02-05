#!/usr/bin/python
# -*- coding: utf-8 -*-

# #####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (http://data.tbfy.eu/)
# 
# This file contains a script that executes the full data ingestion process by calling the other 
# scripts responsible for a step in the overall ingestion process.
# 
# Copyright: SINTEF 2018-2021
# Author   : Brian Elvesæter (brian.elvesater@sintef.no)
# License  : Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
# Project  : Developed as part of the TheyBuyForYou project (https://theybuyforyou.eu/)
# Funding  : TheyBuyForYou has received funding from the European Union's Horizon 2020
#            research and innovation programme under grant agreement No 780247
#####################################################################################################

import config

import openopps
import opencorporates
import enrich_json
import json2xml
import xml2rdf
import publish_rdf

import logging

import os
import sys
import getopt


# *************
# Main function
# *************
def main(argv):
    logging.basicConfig(level=config.logging["level"])
    
    openopps_username = ""
    openopps_password = ""
    opencorporates_reconcile_api_key = ""
    opencorporates_companies_api_key = ""
    rml_folder = ""
    start_date = ""
    end_date = ""
    output_folder = ""

    try:
        opts, args = getopt.getopt(argv, "hu:p:a:b:r:s:e:o:")
    except getopt.GetoptError:
        print("ingest_data.py -u <openopps_username> -p <openopps_password> -a <opencorporates_reconcile_api_key> -b <opencorporates_companies_api_key> -r <rml_folder> -s <start_date> -e <end_date> -o <output_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("ingest_data.py -u <openopps_username> -p <openopps_password> -a <opencorporates_reconcile_api_key> -b <opencorporates_companies_api_key> -r <rml_folder> -s <start_date> -e <end_date> -o <output_folder>")
            sys.exit()
        elif opt in ("-u"):
            openopps_username = arg
        elif opt in ("-p"):
            openopps_password = arg
        elif opt in ("-a"):
            opencorporates_reconcile_api_key = arg
        elif opt in ("-b"):
            opencorporates_companies_api_key = arg
        elif opt in ("-r"):
            rml_folder = arg
        elif opt in ("-s"):
            start_date = arg
        elif opt in ("-e"):
            end_date = arg
        elif opt in ("-o"):
            output_folder = arg

    logging.debug("ingest_data.py: openopps_username = " + openopps_username)
    logging.debug("ingest_data.py: openopps_password = " + openopps_password)
    logging.debug("ingest_data.py: opencorporates_reconcile_api_key = " + opencorporates_reconcile_api_key)
    logging.debug("ingest_data.py: opencorporates_companies_api_key = " + opencorporates_companies_api_key)
    logging.debug("ingest_data.py: rml_folder = " + rml_folder)
    logging.debug("ingest_data.py: start_date = " + start_date)
    logging.debug("ingest_data.py: end_date = " + end_date)
    logging.debug("ingest_data.py: output_folder = " + output_folder)

    openopps_folder = os.path.join(output_folder, "1_JSON_OpenOpps")
    openopps_argv = ["openopps.py", "-u", openopps_username, "-p", openopps_password, "-s", start_date, "-e", end_date, "-o", openopps_folder]
    openopps.main(openopps_argv[1:])

    opencorporates_folder = os.path.join(output_folder, "2_JSON_OpenCorporates")
    opencorporates_argv = ["opencorporates.py", "-a", opencorporates_reconcile_api_key, "-b", opencorporates_companies_api_key, "-s", start_date, "-e", end_date, "-i", openopps_folder, "-o", opencorporates_folder]
    opencorporates.main(opencorporates_argv[1:])

    enrich_json_folder = os.path.join(output_folder, "3_JSON_Enriched")
    enrich_json_argv = ["enrich_json.py", "-s", start_date, "-e", end_date, "-i", opencorporates_folder, "-o", enrich_json_folder]
    enrich_json.main(enrich_json_argv[1:])

    json2xml_folder = os.path.join(output_folder, "4_XML_Enriched")
    json2xml_argv = ["json2xml.py", "-s", start_date, "-e", end_date, "-i", enrich_json_folder, "-o", json2xml_folder]
    json2xml.main(json2xml_argv[1:])

    xml2rdf_folder = os.path.join(output_folder, "5_RDF_TBFY")
    xml2rdf_argv = ["xml2rdf.py", "-r", rml_folder, "-s", start_date, "-e", end_date, "-i", json2xml_folder, "-o", xml2rdf_folder]
    xml2rdf.main(xml2rdf_argv[1:])

    publish_rdf_argv = ["publish_rdf.py", "-s", start_date, "-e", end_date, "-i", xml2rdf_folder]
    publish_rdf.main(publish_rdf_argv[1:])


# *****************
# Run main function
# *****************
if __name__ == "__main__": main(sys.argv[1:])
