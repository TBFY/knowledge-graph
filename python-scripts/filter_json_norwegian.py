#!/usr/bin/python
# -*- coding: utf-8 -*-

#####################################################################################################
# Data ingestion script for the Norwegian Knowledge Graph (http://norway.tbfy.eu/)
# 
# This file contains a script that filters the Norwegian JSON data.
# 
# Copyright: SINTEF 2017-2021
# Author   : Brian Elvesæter (brian.elvesater@sintef.no)
# License  : Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
# Project  : Developed as part of the Norwegian TBFY project.
# Funding  : The Norwegian TBFY project has received funding from the Norwegian Resarch Council
#            to support Norwegian uptake of the results from TBFY (https://theybuyforyou.eu/)
#####################################################################################################

import config

import tbfy.json_utils

import logging

import os
import shutil
import sys
import getopt

import time
import datetime
from datetime import datetime
from datetime import timedelta


# ***************
# Helper function
# ***************

def is_norwegian_buyer(input_filePath):
    release_data = tbfy.json_utils.read_jsonfile(input_filePath)
    buyer_countryName = release_data['releases'][0]['buyer']['address']['countryName']

    if buyer_countryName == "Norway":
        return True
    else:
        return False


def is_matched_supplier(supplier_filename, award_release_filename):
    if award_release_filename == "":
        return False
    else:
        ocid_from_supplier_filename = supplier_filename.split('-supplier')[0]
        if ocid_from_supplier_filename in award_release_filename:
            return True
        else:
            return False


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
        opts, args = getopt.getopt(argv, "hs:e:r:i:o:")
    except getopt.GetoptError:
        print("filter_norwegian_data_json.py -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("filter_norwegian_data_json.py -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>")
            sys.exit()
        elif opt in ("-s"):
            start_date = arg
        elif opt in ("-e"):
            end_date = arg
        elif opt in ("-i"):
            input_folder = arg
        elif opt in ("-o"):
            output_folder = arg

    logging.debug("filter_norwegian_data_json.py: start_date = " + start_date)
    logging.debug("filter_norwegian_data_json.py: end_date = " + end_date)
    logging.debug("filter_norwegian_data_json.py: input_folder = " + input_folder)
    logging.debug("filter_norwegian_data_json.py: output_folder = " + output_folder)

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

            last_award_release_filename = ""
            for filename in os.listdir(dirPath):
                inputFilePath = os.path.join(dirPath, filename)
                outputFilePath = os.path.join(outputDirPath, filename)
                ext = os.path.splitext(inputFilePath)[-1].lower()
                if (ext == ".json"):
                    file_to_copy = False
                    # Check if buyer is Norwegian
                    if tbfy.json_utils.is_openopps_json(filename):
                        if is_norwegian_buyer(inputFilePath):
                            file_to_copy = True
                            last_award_release_filename = filename
                    # Check if matched supplier
                    if tbfy.json_utils.is_opencorporates_json(filename):
                        if is_matched_supplier(filename, last_award_release_filename):
                            file_to_copy = True
                    # Copy file
                    if (file_to_copy):
                        shutil.copy(inputFilePath, outputFilePath)
                        logging.info("filter_norwegian_data_json.py: file = " + outputFilePath)

        start = start + timedelta(days=1) # Increase date by one day


# *****************
# Run main function
# *****************

if __name__ == "__main__": main(sys.argv[1:])
