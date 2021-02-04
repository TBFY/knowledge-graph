#!/usr/bin/python
# -*- coding: utf-8 -*-

#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (http://data.tbfy.eu/)
# 
# This file contains a script that converts JSON documents to XML documents.
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
import tbfy.statistics

import logging

import xmltodict

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
        opts, args = getopt.getopt(argv, "hs:e:r:i:o:")
    except getopt.GetoptError:
        print("json2xml.py -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("json2xml.py -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>")
            sys.exit()
        elif opt in ("-s"):
            start_date = arg
        elif opt in ("-e"):
            end_date = arg
        elif opt in ("-i"):
            input_folder = arg
        elif opt in ("-o"):
            output_folder = arg

    logging.debug("json2xml.py: start_date = " + start_date)
    logging.debug("json2xml.py: end_date = " + end_date)
    logging.debug("json2xml.py: input_folder = " + input_folder)
    logging.debug("json2xml.py: output_folder = " + output_folder)

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
                inputFilePath = os.path.join(dirPath, filename)
                ext = os.path.splitext(inputFilePath)[-1].lower()
                if (ext == ".json"):
                    xml_filename = os.path.splitext(filename)[0] + '.xml'
                    outputFilePath = os.path.join(outputDirPath, xml_filename)
                    logging.info("json2xml.py: file = " + outputFilePath)
                    json_dict = tbfy.json_utils.read_jsonfile(inputFilePath)
                    json_dict_one_root = {'root': json_dict}
                    tbfy.json_utils.write_xmlfile(tbfy.json_utils.convert_to_xml(json_dict_one_root), outputFilePath)
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
