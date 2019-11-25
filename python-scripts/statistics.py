#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (https://theybuyforyou.eu/tbfy-knowledge-graph/)
# 
# This file contains a script that aggregates statistics from the specified input folders.
# 
# Copyright: SINTEF 2017-2019
# Author   : Brian Elvesæter (brian.elvesater@sintef.no)
# License  : Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
# Project  : Developed as part of the TheyBuyForYou project (https://theybuyforyou.eu/)
# Funding  : TheyBuyForYou has received funding from the European Union's Horizon 2020
#            research and innovation programme under grant agreement No 780247
#####################################################################################################

#!/usr/bin/python

import config

import logging

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

stat_no_awards = 0
stat_no_suppliers = 0
stat_no_candidate_companies = 0
stat_no_matching_companies = 0
stat_highest_result_score = 0

def print_stats():
    global stat_no_awards
    global stat_no_suppliers
    global stat_no_candidate_companies
    global stat_no_matching_companies
    global stat_highest_result_score

    print("*********************************************************")
    print("stat_no_awards = " + str(stat_no_awards))
    print("stat_no_suppliers = " + str(stat_no_suppliers))
    print("stat_no_candidate_companies = " + str(stat_no_candidate_companies))
    print("stat_no_matching_companies = " + str(stat_no_matching_companies))
    print("stat_highest_result_score = " + str(stat_highest_result_score))
    print("*********************************************************")

def update_stats(file_stats):
    global stat_no_awards
    global stat_no_suppliers
    global stat_no_candidate_companies
    global stat_no_matching_companies
    global stat_highest_result_score

    stat_no_awards += int(file_stats['stat_no_awards'])
    stat_no_suppliers += int(file_stats['stat_no_suppliers'])
    stat_no_candidate_companies += int(file_stats['stat_no_candidate_companies'])
    stat_no_matching_companies += int(file_stats['stat_no_matching_companies'])
    
    file_stats_score = float(file_stats['stat_highest_result_score'])

    if file_stats_score > stat_highest_result_score:
        stat_highest_result_score = file_stats_score


# *************
# Main function
# *************
def main(argv):
    logging.basicConfig(level=config.logging["level"])

    start_date = ""
    end_date = ""
    opencorporates_folder = ""

    try:
        opts, args = getopt.getopt(argv, "hs:e:o:")
    except getopt.GetoptError:
        print("statistics.py -s <start_date> -e <end_date> -o <opencorporates_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("statistics.py -s <start_date> -e <end_date> -o <opencorporates_folder>")
            sys.exit()
        elif opt in ("-s"):
            start_date = arg
        elif opt in ("-e"):
            end_date = arg
        elif opt in ("-o"):
            opencorporates_folder = arg

    logging.info("main(): start_date = " + start_date)
    logging.info("main(): end_date = " + end_date)
    logging.info("main(): opencorporates_folder = " + opencorporates_folder)

    start = datetime.strptime(start_date, "%Y-%m-%d")
    stop = datetime.strptime(end_date, "%Y-%m-%d")

    while start <= stop:
        release_date = datetime.strftime(start, "%Y-%m-%d")

        dirname = release_date
        stats_filepath = os.path.join(opencorporates_folder, dirname, 'STATISTICS.TXT')
        if os.path.isfile(stats_filepath):
            file_stats = {}
            with open(stats_filepath) as stats_file:
                for line in stats_file:
                    s_key, s_value = line.partition("=")[::2]
                    file_stats[s_key.strip()] = s_value
                update_stats(file_stats)

        start = start + timedelta(days=1)  # increase day one by one

    print_stats()


# *****************
# Run main function
# *****************
if __name__ == "__main__": main(sys.argv[1:])
