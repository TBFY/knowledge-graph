#!/usr/bin/python
# -*- coding: utf-8 -*-

#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (http://data.tbfy.eu/)
# 
# This file contains a script that aggregates and prints out the statistics from the 'STATISTICS.TXT'
# file that are written in each release-date subfolder in the output folder when running the 
# json2xml.py script.
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

from statistics import mean
from decimal import Decimal

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
stats_performance = tbfy.statistics.files_statistics_performance.copy()

def print_stats():
    global stats_files
    global stats_performance

    print("*********************************************************")
    print("JSON 2 XML statistics - performance (aggregated)         ")
    print("*********************************************************")
    for key in stats_performance.keys():
        if not "list_" in key:
            print(str(key) + " = " + str(stats_performance[key]))
    print("")


def update_stats_files(file_stats):
    global stats_files

    try:
        for key in stats_files.keys():
            if "list_" in key:
                tbfy.statistics.update_stats_list(stats_files, key, file_stats[key])
            else:
                tbfy.statistics.update_stats_add(stats_files, key, Decimal(file_stats[key]))
    except KeyError:
        None


def compute_stats_performance():
    global stats_files
    global stats_performance

    tbfy.statistics.compute_files_stats_performance(stats_performance, stats_files)


# *************
# Main function
# *************

def main(argv):
    logging.basicConfig(level=config.logging["level"])

    start_date = ""
    end_date = ""
    json2xml_folder = ""

    try:
        opts, args = getopt.getopt(argv, "hs:e:i:")
    except getopt.GetoptError:
        print("json2xml_statistics.py -s <start_date> -e <end_date> -i <json2xml_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("json2xml_statistics.py -s <start_date> -e <end_date> -i <json2xml_folder>")
            sys.exit()
        elif opt in ("-s"):
            start_date = arg
        elif opt in ("-e"):
            end_date = arg
        elif opt in ("-i"):
            json2xml_folder = arg

    logging.info("main(): start_date = " + start_date)
    logging.info("main(): end_date = " + end_date)
    logging.info("main(): json2xml_folder = " + json2xml_folder)

    start = datetime.strptime(start_date, "%Y-%m-%d")
    stop = datetime.strptime(end_date, "%Y-%m-%d")

    while start <= stop:
        release_date = datetime.strftime(start, "%Y-%m-%d")

        dirname = release_date
        stats_filepath = os.path.join(json2xml_folder, dirname, 'STATISTICS.TXT')
        if os.path.isfile(stats_filepath):
            file_stats = {}
            with open(stats_filepath) as stats_file:
                for line in stats_file:
                    s_key, s_value = line.partition("=")[::2]
                    file_stats[s_key.strip()] = s_value
                update_stats_files(file_stats)

        start = start + timedelta(days=1)  # increase day one by one

    # Compute and print aggregated performance stats
    compute_stats_performance()
    print_stats()


# *****************
# Run main function
# *****************

if __name__ == "__main__": main(sys.argv[1:])
