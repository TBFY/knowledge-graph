#!/usr/bin/python
# -*- coding: utf-8 -*-

#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (http://data.tbfy.eu/)
# 
# This file contains a script that publishes the RDF (N-Triples) files to the triplestore database.
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
import sys
import getopt

import time
import datetime
from datetime import datetime
from datetime import timedelta


# **********
# Statistics
# **********

stats_publish = tbfy.statistics.publish_statistics_count.copy()

def write_stats(output_folder):
    global stats_publish

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    sfile = open(os.path.join(output_folder, 'STATISTICS_PUBLISH.TXT'), 'w+')
    for key in stats_publish.keys():
        sfile.write(str(key) + " = " + str(stats_publish[key]) + "\n")
    sfile.close()


def reset_stats():
    global stats_publish

    stats_publish = tbfy.statistics.publish_statistics_count.copy()


# ****************
# Global variables
# ****************

jena_fuseki_url = os.getenv("TBFY_FUSEKI_URL") or config.jena_fuseki["fuseki_url"]
jena_fuseki_dataset = os.getenv("TBFY_FUSEKI_DATASET") or config.jena_fuseki["dataset"]


# ***************************
# Read RDF data from RDF file
# ***************************

def read_rdf_data(rdf_file):
    rdf_contents = open(rdf_file, encoding='utf-8').read()
    return rdf_contents.encode('utf-8')
    

def number_of_triples(rdf_file):
    no_triples = 0
    with open(rdf_file, encoding='utf-8') as f:
        for line in f:
            no_triples += 1
    return no_triples


# ****************************************
# Publish RDF data to triplestore database
# ****************************************

def publish_rdf(rdf_data):
    url = jena_fuseki_url + "/" + jena_fuseki_dataset + "/data?default"

    body = rdf_data

    headers = {
        "Content-Type": "text/turtle;charset=utf-8"
    }

    response = requests.post(url, data=body, headers=headers)

    if response.status_code != 200:
        logging.info("publish_rdf(): ERROR: " + json.dumps(response.json()))
        return None
    else:
        return response


# *************
# Main function
# *************

def main(argv):
    global stats_publish

    logging.basicConfig(level=config.logging["level"])
    
    start_date = ""
    end_date = ""
    input_folder = ""

    try:
        opts, args = getopt.getopt(argv, "hs:e:i:")
    except getopt.GetoptError:
        print("publish_rdf.py -s <start_date> -e <end_date> -i <input_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("publish_rdf.py -s <start_date> -e <end_date> -i <input_folder>")
            sys.exit()
        elif opt in ("-s"):
            start_date = arg
        elif opt in ("-e"):
            end_date = arg
        elif opt in ("-i"):
            input_folder = arg

    logging.debug("publish_rdf.py: start_date = " + start_date)
    logging.debug("publish_rdf.py: end_date = " + end_date)
    logging.debug("publish_rdf.py: input_folder = " + input_folder)

    start = datetime.strptime(start_date, "%Y-%m-%d")
    stop = datetime.strptime(end_date, "%Y-%m-%d")

    while start <= stop:
        process_start_time = datetime.now()

        created_date = datetime.strftime(start, "%Y-%m-%d")
        dirname = created_date
        dirPath = os.path.join(input_folder, dirname)
        
        rdf_data = b''

        if os.path.isdir(dirPath):
            for filename in os.listdir(dirPath):
                filePath = os.path.join(dirPath, filename)
                ext = os.path.splitext(filePath)[-1].lower()
                if (ext == ".nt"):
                    rdf_data = rdf_data + read_rdf_data(filePath)
                    
                    # Update statistics
                    tbfy.statistics.update_stats_count(stats_publish, "number_of_files")
                    tbfy.statistics.update_stats_add(stats_publish, "number_of_triples", number_of_triples(filePath))

        logging.info("publish_rdf.py: date = " + created_date)

        publish_rdf(rdf_data)

        process_end_time = datetime.now()
        duration_in_seconds = (process_end_time - process_start_time).total_seconds()
        tbfy.statistics.update_stats_value(stats_publish, "publish_duration_in_seconds", duration_in_seconds)
        write_stats(dirPath) # Write statistics
        reset_stats() # Reset statistics for next folder date

        start = start + timedelta(days=1) # Increase date by one day


# *****************
# Run main function
# *****************

if __name__ == "__main__": main(sys.argv[1:])
