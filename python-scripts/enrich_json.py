#!/usr/bin/python
# -*- coding: utf-8 -*-

#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (http://data.tbfy.eu/)
# 
# This file contains a script that enriches the JSON documents with TBFY-specific properties.
# 
# Copyright: SINTEF 2018-2021
# Author   : Brian Elvesæter (brian.elvesater@sintef.no)
# License  : Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
# Project  : Developed as part of the TheyBuyForYou project (https://theybuyforyou.eu/)
# Funding  : TheyBuyForYou has received funding from the European Union's Horizon 2020
#            research and innovation programme under grant agreement No 780247
#####################################################################################################

import config

import tbfy.json_utils
import tbfy.openopps_enrich
import tbfy.opencorporates_enrich
import tbfy.statistics

import logging

import json

import os
import sys
import getopt

import time
import datetime
from datetime import datetime
from datetime import timedelta


# **********
# Statistics
# **********

stats_files = tbfy.statistics.files_statistics_count.copy()

def write_stats(output_folder):
    global stats_files

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    sfile = open(os.path.join(output_folder, 'STATISTICS.TXT'), 'w+')
    for key in stats_files.keys():
        sfile.write(str(key) + " = " + str(stats_files[key]) + "\n")
    sfile.close()


def reset_stats():
    global stats_files

    stats_files = tbfy.statistics.files_statistics_count.copy()


# *************
# Main function
# *************

def main(argv):
    global stats_files

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

    logging.debug("enrich_json.py: start_date = " + start_date)
    logging.debug("enrich_json.py: end_date = " + end_date)
    logging.debug("enrich_json.py: input_folder = " + input_folder)
    logging.debug("enrich_json.py: output_folder = " + output_folder)

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
            for filename in os.listdir(dirPath):
                filePath = os.path.join(dirPath, filename)
                outputFilePath = os.path.join(outputDirPath, filename)
                logging.info("enrich_json.py: file = " + outputFilePath)
                if tbfy.json_utils.is_openopps_json(filename):
                    tbfy.openopps_enrich.process_release(filePath, outputFilePath)
                    tbfy.statistics.update_stats_count(stats_files, "number_of_files")
                if tbfy.json_utils.is_opencorporates_json(filename):
                    tbfy.opencorporates_enrich.process_company(filePath, outputFilePath)
                    tbfy.statistics.update_stats_count(stats_files, "number_of_files")

        process_end_time = datetime.now()
        duration_in_seconds = (process_end_time - process_start_time).total_seconds()
        tbfy.statistics.update_stats_value(stats_files, "files_processed_duration_in_seconds", duration_in_seconds)
        write_stats(outputDirPath) # Write statistics
        reset_stats() # Reset statistics for next folder date

        start = start + timedelta(days=1) # Increase date by one day


# *****************
# Run main function
# *****************

if __name__ == "__main__": main(sys.argv[1:])
