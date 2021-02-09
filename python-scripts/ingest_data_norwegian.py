#!/usr/bin/python
# -*- coding: utf-8 -*-

# #####################################################################################################
# Data ingestion script for the Norwegian Knowledge Graph (http://norway.tbfy.eu/)
# 
# This file contains a script that executes the Norwegian data ingestion process by calling the other 
# scripts responsible for filtering and publishing the Norwegian data to the Norwegian knolwedge graph.
# 
# Copyright: SINTEF 2018-2021
# Author   : Brian Elvesæter (brian.elvesater@sintef.no)
# License  : Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
# Project  : Developed as part of the TheyBuyForYou project (https://theybuyforyou.eu/)
# Funding  : TheyBuyForYou has received funding from the European Union's Horizon 2020
#            research and innovation programme under grant agreement No 780247
#####################################################################################################

import config

import filter_json_norwegian
import filter_rdf_norwegian
import publish_rdf_norwegian

import logging

import os
import sys
import getopt


# *************
# Main function
# *************
def main(argv):
    logging.basicConfig(level=config.logging["level"])
    
    start_date = ""
    end_date = ""
    input_folder = ""
    output_folder = ""

    try:
        opts, args = getopt.getopt(argv, "hs:e:o:")
    except getopt.GetoptError:
        print("ingest_data_norwegian.py -s <start_date> -e <end_date> -o <output_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("ingest_data_norwegian.py -s <start_date> -e <end_date> -o <output_folder>")
            sys.exit()
        elif opt in ("-s"):
            start_date = arg
        elif opt in ("-e"):
            end_date = arg
        elif opt in ("-o"):
            output_folder = arg

    logging.debug("ingest_data_norwegian.py: start_date = " + start_date)
    logging.debug("ingest_data_norwegian.py: end_date = " + end_date)
    logging.debug("ingest_data_norwegian.py: output_folder = " + output_folder)

    filter_json_norwegian_input_folder = os.path.join(output_folder, "3_JSON_Enriched")
    filter_json_norwegian_output_folder = os.path.join(output_folder, "NO_3_JSON_Enriched")
    filter_json_norwegian_argv = ["filter_json_norwegian.py", "-s", start_date, "-e", end_date, "-i", filter_json_norwegian_input_folder, "-o", filter_json_norwegian_output_folder]
    filter_json_norwegian.main(filter_json_norwegian_argv[1:])

    filter_rdf_norwegian_input_folder = os.path.join(output_folder, "5_RDF_TBFY")
    filter_rdf_norwegian_output_folder = os.path.join(output_folder, "NO_5_RDF_TBFY")
    filter_rdf_norwegian_argv = ["filter_rdf_norwegian.py", "-s", start_date, "-e", end_date, "-i", filter_rdf_norwegian_input_folder, "-o", filter_rdf_norwegian_output_folder]
    filter_rdf_norwegian.main(filter_rdf_norwegian_argv[1:])

    publish_rdf_norwegian_input_folder = os.path.join(output_folder, "NO_5_RDF_TBFY")
    publish_rdf_norwegian_argv = ["publish_rdf_norwegian.py", "-s", start_date, "-e", end_date, "-i", publish_rdf_norwegian_input_folder]
    publish_rdf_norwegian.main(publish_rdf_norwegian_argv[1:])


# *****************
# Run main function
# *****************
if __name__ == "__main__": main(sys.argv[1:])
