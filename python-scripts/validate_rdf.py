#!/usr/bin/python
# -*- coding: utf-8 -*-

#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (http://data.tbfy.eu/)
# 
# This file contains a script that validates the produced RDF (N-triples) files.
# 
# Copyright: SINTEF 2018-2021
# Author   : Brian Elvesæter (brian.elvesater@sintef.no)
# License  : Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
# Project  : Developed as part of the TheyBuyForYou project (https://theybuyforyou.eu/)
# Funding  : TheyBuyForYou has received funding from the European Union's Horizon 2020
#            research and innovation programme under grant agreement No 780247
#####################################################################################################

import config

import logging

import os
import subprocess
import sys
import getopt

import time
import datetime
from datetime import datetime
from datetime import timedelta


# ****************
# Global variables
# ****************

riot_command = config.jena_tools["riot_command"]


# *************
# Main function
# *************
def main(argv):
    logging.basicConfig(level=config.logging["level"])
    
    start_date = ""
    end_date = ""
    input_folder = ""

    try:
        opts, args = getopt.getopt(argv, "hs:e:i:")
    except getopt.GetoptError:
        print("validate_rdf.py -s <start_date> -e <end_date> -i <input_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("validate_rdf.py -s <start_date> -e <end_date> -i <input_folder>")
            sys.exit()
        elif opt in ("-s"):
            start_date = arg
        elif opt in ("-e"):
            end_date = arg
        elif opt in ("-i"):
            input_folder = arg

    logging.info("validate_rdf.py: start_date = " + start_date)
    logging.info("validate_rdf.py: end_date = " + end_date)
    logging.info("validate_rdf.py: input_folder = " + input_folder)

    if sys.platform.lower().startswith("win"):
        global riot_command
        riot_command = riot_command + ".bat"

    logging.info("validate_rdf.py: riot_command = " + riot_command)

    start = datetime.strptime(start_date, "%Y-%m-%d")
    stop = datetime.strptime(end_date, "%Y-%m-%d")

    while start <= stop:
        release_date = datetime.strftime(start, "%Y-%m-%d")

        dirname = release_date
        dirPath = os.path.join(input_folder, dirname)
        if os.path.isdir(dirPath):
            for filename in os.listdir(dirPath):
                filePath = os.path.join(dirPath, filename)
                logging.info("validate_rdf.py: file = " + filePath)
                subprocess.call([riot_command, "--validate", filePath])
 
        start = start + timedelta(days=1) # Increase date by one day


# *****************
# Run main function
# *****************
if __name__ == "__main__": main(sys.argv[1:])
