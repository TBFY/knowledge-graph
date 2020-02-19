#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (https://theybuyforyou.eu/tbfy-knowledge-graph/)
# 
# This file contains a script that enriches the JSON documents with TBFY-specific properties.
# 
# Copyright: SINTEF 2017-2020
# Author   : Brian Elvesæter (brian.elvesater@sintef.no)
# License  : Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
# Project  : Developed as part of the TheyBuyForYou project (https://theybuyforyou.eu/)
# Funding  : TheyBuyForYou has received funding from the European Union's Horizon 2020
#            research and innovation programme under grant agreement No 780247
#####################################################################################################

#!/usr/bin/python

import config

import tbfy.json_utils
import tbfy.openopps_enrich
import tbfy.opencorporates_enrich

import logging

import json

import os
import sys
import getopt

import time
import datetime
from datetime import datetime
from datetime import timedelta


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
        opts, args = getopt.getopt(argv, "hs:e:i:o:")
    except getopt.GetoptError:
        print("enrich_json.py -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("enrich_json.py -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>")
            sys.exit()
        elif opt in ("-s"):
            start_date = arg
        elif opt in ("-e"):
            end_date = arg
        elif opt in ("-i"):
            input_folder = arg
        elif opt in ("-o"):
            output_folder = arg

    logging.info("main(): start_date = " + start_date)
    logging.info("main(): end_date = " + end_date)
    logging.info("main(): input_folder = " + input_folder)
    logging.info("main(): output_folder = " + output_folder)

    copy_command = ""
    if sys.platform.lower().startswith("win"):
        copy_command = "copy"
    elif sys.platform.lower().startswith("linux"):
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
            for filename in os.listdir(dirPath):
                logging.info("main(): filename = " + filename)
                filePath = os.path.join(dirPath, filename)
                outputFilePath = os.path.join(outputDirPath, filename)
                if tbfy.json_utils.is_openopps_json(filename):
                    tbfy.openopps_enrich.process_release(filePath, outputFilePath)
                if tbfy.json_utils.is_opencorporates_json(filename):
                    tbfy.opencorporates_enrich.process_company(filePath, outputFilePath)

        start = start + timedelta(days=1) # Increase date by one day


# *****************
# Run main function
# *****************
if __name__ == "__main__": main(sys.argv[1:])
