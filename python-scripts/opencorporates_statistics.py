#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (https://theybuyforyou.eu/tbfy-knowledge-graph/)
# 
# This file contains a script that aggregates and prints out the statistics from the 'STATISTICS.TXT'
# file that are written in each release-date subfolder in the OpenCorporates output folder when 
# running the opencorporates.py script.
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

stats_reconciliation = config.opencorporates_statistics.copy()

def print_stats():
    global stats_reconciliation

    print("*********************************************************")
    for key in stats_reconciliation.keys():
        print(str(key) + " = " + str(stats_reconciliation[key]))
    print("*********************************************************")

def update_stats(file_stats):
    global stats_reconciliation

    for key in stats_reconciliation.keys():
        if (key == "highest_result_score"):
            if (float(file_stats[key]) > float(stats_reconciliation[key])):
                stats_reconciliation[key] = file_stats[key]
        else:
            stats_reconciliation[key] += int(file_stats[key])


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
        print("opencorporates_statistics.py -s <start_date> -e <end_date> -o <opencorporates_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("opencorporates_statistics.py -s <start_date> -e <end_date> -o <opencorporates_folder>")
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
