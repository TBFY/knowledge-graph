#!/usr/bin/python
# -*- coding: utf-8 -*-

#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (http://data.tbfy.eu/)
# 
# This file contains a script that can be used to perform a simple string replace in the produced 
# RDF (N-Triples) files. (E.g., correcting simple mistakes in the mapping rules without having to
# reprocess the JSON/XML files with RML Mapper, which is quite time-consuming).
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
import sys
import getopt

import time
import datetime
from datetime import datetime
from datetime import timedelta


# ***************
# Helper function
# ***************

def inplace_change(filename, old_string, new_string):
    s = open(filename, errors="ignore").read()
    s = s.replace(old_string, new_string)
    f = open(filename, 'w')
    f.write(s)
    f.close()


# *************
# Main function
# *************
def main(argv):
    logging.basicConfig(level=config.logging["level"])
    
    old_string = ""
    new_string = ""
    start_date = ""
    end_date = ""
    input_folder = ""
    output_folder = ""

    try:
        opts, args = getopt.getopt(argv, "ha:b:s:e:i:o:")
    except getopt.GetoptError:
        print("replace_string_rdf.py -a <old_string> -b <new_string> -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("replace_string_rdf.py -a <old_string> -b <new_string> -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>")
            sys.exit()
        elif opt in ("-a"):
            old_string = arg
        elif opt in ("-b"):
            new_string = arg
        elif opt in ("-s"):
            start_date = arg
        elif opt in ("-e"):
            end_date = arg
        elif opt in ("-i"):
            input_folder = arg
        elif opt in ("-o"):
            output_folder = arg

    logging.info("main(): old_string = " + old_string)
    logging.info("main(): new_string = " + new_string)
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

    logging.info("replace_string_rdf.py: platform = " + sys.platform.lower())
    logging.info("replace_string_rdf.py: copy_command = " + copy_command)

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
                outputFilePath = os.path.join(outputDirPath, filename)
                logging.info("replace_string_rdf.py: file = " + outputFilePath)
                os.system(copy_command + ' ' + filePath + ' ' + outputFilePath)
                inplace_change(outputFilePath, old_string, new_string)
 
        start = start + timedelta(days=1) # Increase date by one day


# *****************
# Run main function
# *****************
if __name__ == "__main__": main(sys.argv[1:])
