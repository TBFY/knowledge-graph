#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (https://theybuyforyou.eu/tbfy-knowledge-graph/)
# 
# This file contains a script that runs the RML Mapper on XML files and produces N-triples files.
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

import logging

import requests
import json

import os
import shutil
import sys
import getopt

import time
import datetime
from datetime import datetime
from datetime import timedelta


# ****************
# Helper functions
# ****************

def is_openopps_json(filename):
    if "-release" in str(filename):
        return True
    else:
        return False

def is_opencorporates_json(filename):
    if "-supplier" in str(filename):
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
    rml_folder = ""
    input_folder = ""
    output_folder = ""

    try:
        opts, args = getopt.getopt(argv, "hs:e:r:i:o:")
    except getopt.GetoptError:
        print("xml2rdf.py -s <start_date> -e <end_date> -r <rml_folder> -i <input_folder> -o <output_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("xml2rdf.py -s <start_date> -e <end_date> -r <rml_folder> -i <input_folder> -o <output_folder>")
            sys.exit()
        elif opt in ("-s"):
            start_date = arg
        elif opt in ("-e"):
            end_date = arg
        elif opt in ("-r"):
            rml_folder = arg
        elif opt in ("-i"):
            input_folder = arg
        elif opt in ("-o"):
            output_folder = arg

    logging.debug("xml2rdf.py: start_date = " + start_date)
    logging.debug("xml2rdf.py: end_date = " + end_date)
    logging.debug("xml2rdf.py: rml_folder = " + rml_folder)
    logging.debug("xml2rdf.py: input_folder = " + input_folder)
    logging.debug("xml2rdf.py: output_folder = " + output_folder)

    rml_filename = config.rml["rml_filename"]
    openopps_mapping_filename = config.rml["openopps_mapping_filename"]
    opencorporates_mapping_filename = config.rml["opencorporates_mapping_filename"]
    rml_input_filename = config.rml["rml_input_filename"]
    rml_output_filename = config.rml["rml_output_filename"]

    logging.debug("xml2rdf.py: rml_filename = " + rml_filename)
    logging.debug("xml2rdf.py: openopps_mapping_filename = " + openopps_mapping_filename)
    logging.debug("xml2rdf.py: opencorporates_mapping_filename = " + opencorporates_mapping_filename)
    logging.debug("xml2rdf.py: rml_input_filename = " + rml_input_filename)
    logging.debug("xml2rdf.py: rml_output_filename = " + rml_output_filename)

    rmlOpenOppsInputFilePath = os.path.join(rml_folder, rml_input_filename)
    rmlOpenCorporatesInputFilePath = os.path.join(rml_folder, rml_input_filename)
    rmlOutputFilePath = os.path.join(rml_folder, rml_output_filename)

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
                filePath = os.path.join(dirPath, filename)
                outputFilePath = os.path.join(outputDirPath, str(filename).replace(".xml", ".nt"))
                logging.info("xml2rdf.py: file = " + outputFilePath)

                rmlInputFilePath = os.path.join(rml_folder, filename)
                if is_openopps_json(filename):
                    shutil.copy(filePath, rml_folder)
                    shutil.copyfile(rmlInputFilePath, rmlOpenOppsInputFilePath)
                    os.chdir(rml_folder)
                    os.system('java -jar ' + rml_filename + ' -m ' + openopps_mapping_filename + ' -o ' + rml_output_filename)
                    shutil.copyfile(rmlOutputFilePath, outputFilePath)
                    os.remove(rmlOpenOppsInputFilePath)
                if is_opencorporates_json(filename):
                    shutil.copy(filePath, rml_folder)
                    shutil.copyfile(rmlInputFilePath, rmlOpenCorporatesInputFilePath)
                    os.chdir(rml_folder)
                    os.system('java -jar ' + rml_filename + ' -m ' + opencorporates_mapping_filename + ' -o ' + rml_output_filename)
                    shutil.copyfile(rmlOutputFilePath, outputFilePath)
                    os.remove(rmlOpenCorporatesInputFilePath)

        start = start + timedelta(days=1) # Increase date by one day


# *****************
# Run main function
# *****************
if __name__ == "__main__": main(sys.argv[1:])
