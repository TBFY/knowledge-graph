#!/usr/bin/python
# -*- coding: utf-8 -*-

#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (http://data.tbfy.eu/)
# 
# This file contains a script that runs the RML Mapper on XML files and produces N-triples files.
# 
# Copyright: SINTEF 2018-2021
# Author   : Brian Elvesæter (brian.elvesater@sintef.no)
# License  : Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
# Project  : Developed as part of the TheyBuyForYou project (https://theybuyforyou.eu/)
# Funding  : TheyBuyForYou has received funding from the European Union's Horizon 2020
#            research and innovation programme under grant agreement No 780247
#####################################################################################################

import config

import tbfy.statistics

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


# **********
# Statistics
# **********

stats_xml2rdf = tbfy.statistics.xml2rdf_statistics_count.copy()

def write_stats(output_folder):
    global stats_xml2rdf

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    sfile = open(os.path.join(output_folder, 'STATISTICS.TXT'), 'w+')
    for key in stats_xml2rdf.keys():
        sfile.write(str(key) + " = " + str(stats_xml2rdf[key]) + "\n")
    sfile.close()


def reset_stats():
    global stats_xml2rdf

    stats_xml2rdf = tbfy.statistics.xml2rdf_statistics_count.copy()


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
    global stats_xml2rdf

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
                outputFilePath = os.path.join(outputDirPath, str(filename).replace(".xml", ".nt"))
                logging.info("xml2rdf.py: file = " + outputFilePath)

                rmlInputFilePath = os.path.join(rml_folder, filename)
                if is_openopps_json(filename):
                    release_start_time = datetime.now()

                    shutil.copy(filePath, rml_folder) # Copy release file to RML folder
                    shutil.copyfile(rmlInputFilePath, rmlOpenOppsInputFilePath) # Copy/rename relase file to input file for RML
                    os.chdir(rml_folder)
                    os.system('java -jar ' + rml_filename + ' -m ' + openopps_mapping_filename + ' -o ' + rml_output_filename)
                    shutil.copyfile(rmlOutputFilePath, outputFilePath) # Copy output file from RML to output folder
                    os.remove(rmlInputFilePath) # Remove release file in RML folder
                    os.remove(rmlOpenOppsInputFilePath) # Remove input file from RML
                    os.remove(rmlOutputFilePath) # Remove output file from RML

                    release_end_time = datetime.now()
                    release_duration_in_seconds = (release_end_time - release_start_time).total_seconds()
                    tbfy.statistics.update_stats_add(stats_xml2rdf, "release_files_processed_duration_in_seconds", release_duration_in_seconds)
                    tbfy.statistics.update_stats_count(stats_xml2rdf, "number_of_release_files")
                    tbfy.statistics.update_stats_count(stats_xml2rdf, "number_of_files")
                if is_opencorporates_json(filename):
                    company_start_time = datetime.now()
                    
                    shutil.copy(filePath, rml_folder) # Copy company file to RML folder
                    shutil.copyfile(rmlInputFilePath, rmlOpenCorporatesInputFilePath) # Copy/rename company file to input file for RML Mapper
                    os.chdir(rml_folder)
                    os.system('java -jar ' + rml_filename + ' -m ' + opencorporates_mapping_filename + ' -o ' + rml_output_filename)
                    shutil.copyfile(rmlOutputFilePath, outputFilePath) # Copy output file from RML to output folder
                    os.remove(rmlInputFilePath) # Remove company file in RML folder
                    os.remove(rmlOpenCorporatesInputFilePath) # Remove input file from RML
                    os.remove(rmlOutputFilePath) # Remove output file from RML

                    company_end_time = datetime.now()
                    company_duration_in_seconds = (company_end_time - company_start_time).total_seconds()
                    tbfy.statistics.update_stats_add(stats_xml2rdf, "company_files_processed_duration_in_seconds", company_duration_in_seconds)
                    tbfy.statistics.update_stats_count(stats_xml2rdf, "number_of_company_files")
                    tbfy.statistics.update_stats_count(stats_xml2rdf, "number_of_files")

        process_end_time = datetime.now()
        duration_in_seconds = (process_end_time - process_start_time).total_seconds()
        tbfy.statistics.update_stats_value(stats_xml2rdf, "files_processed_duration_in_seconds", duration_in_seconds)
        write_stats(outputDirPath) # Write statistics
        reset_stats() # Reset statistics for next folder date

        start = start + timedelta(days=1) # Increase date by one day


# *****************
# Run main function
# *****************

if __name__ == "__main__": main(sys.argv[1:])
