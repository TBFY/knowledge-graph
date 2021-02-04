#!/usr/bin/python
# -*- coding: utf-8 -*-

#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (http://data.tbfy.eu/)
# 
# This file contains a script that aggregates and prints out the statistics from the 'STATISTICS.TXT'
# file that are written in each release-date subfolder in the OpenOpps output folder when 
# running the openopps.py script.
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

stats_releases = tbfy.statistics.openopps_statistics_releases.copy()
stats_performance = tbfy.statistics.openopps_statistics_performance.copy()
stats_aggregate = tbfy.statistics.openopps_statistics_aggregate.copy()

def print_stats():
    global stats_releases
    global stats_aggregate

    print("*********************************************************")
    print("OpenOpps statistics - releases (counts per type)         ")
    print("*********************************************************")
    for key in stats_releases.keys():
        print(str(key) + " = " + str(stats_releases[key]))
    print("")

    print("*********************************************************")
    print("OpenOpps statistics - performance (aggregated)           ")
    print("*********************************************************")
    for key in stats_aggregate.keys():
        if not "list_" in key:
            print(str(key) + " = " + str(stats_aggregate[key]))
    print("")


def update_stats_releases(file_stats):
    global stats_releases

    for key in stats_releases.keys():
        stats_releases[key] += int(file_stats[key])


def update_stats_performance(file_stats):
    global stats_performance

    try:
        stats_performance['download_duration_in_seconds'] += Decimal(file_stats['download_duration_in_seconds'])
        stats_performance['number_of_releases'] += int(file_stats['number_of_releases'])
    except KeyError:
        None


def update_stats_aggregate_count(file_stats):
    global stats_releases
    global stats_performance
    global stats_aggregate

    try:
        stats_aggregate['number_of_days'] += 1

        number_of_releases = 0
        for key in stats_releases.keys():
            number_of_releases += int(file_stats[key])
        stats_aggregate['list_releases_per_day'].append(number_of_releases)

        stats_aggregate['list_planning_releases_per_day'].append(int(file_stats['planning']))
        stats_aggregate['list_tender_releases_per_day'].append((int(file_stats['tender']) + int(file_stats['tenderAmendment']) + int(file_stats['tenderUpdate']) + int(file_stats['tenderCancellation'])))
        stats_aggregate['list_award_releases_per_day'].append((int(file_stats['award']) + int(file_stats['awardUpdate']) + int(file_stats['awardCancellation'])))
        stats_aggregate['list_contract_releases_per_day'].append((int(file_stats['contract']) + int(file_stats['contractAmendment'])))
    except KeyError:
        None


def compute_stats_aggregate():
    global stats_releases
    global stats_performance
    global stats_aggregate

    try:
        stats_aggregate['number_of_releases'] = stats_performance['number_of_releases']
        stats_aggregate['download_duration_in_seconds'] = stats_performance['download_duration_in_seconds']
        stats_aggregate['releases_downloaded_per_second'] = tbfy.statistics.safe_div(stats_aggregate['number_of_releases'], stats_aggregate['download_duration_in_seconds'])

        stats_aggregate['min_releases_per_day'] = min(stats_aggregate['list_releases_per_day'])
        stats_aggregate['max_releases_per_day'] = max(stats_aggregate['list_releases_per_day'])
        stats_aggregate['average_releases_per_day'] = mean(stats_aggregate['list_releases_per_day'])

        stats_aggregate['min_planning_releases_per_day'] = min(stats_aggregate['list_planning_releases_per_day'])
        stats_aggregate['max_planning_releases_per_day'] = max(stats_aggregate['list_planning_releases_per_day'])
        stats_aggregate['average_planning_releases_per_day'] = mean(stats_aggregate['list_planning_releases_per_day'])

        stats_aggregate['min_tender_releases_per_day'] = min(stats_aggregate['list_tender_releases_per_day'])
        stats_aggregate['max_tender_releases_per_day'] = max(stats_aggregate['list_tender_releases_per_day'])
        stats_aggregate['average_tender_releases_per_day'] = mean(stats_aggregate['list_tender_releases_per_day'])

        stats_aggregate['min_award_releases_per_day'] = min(stats_aggregate['list_award_releases_per_day'])
        stats_aggregate['max_award_releases_per_day'] = max(stats_aggregate['list_award_releases_per_day'])
        stats_aggregate['average_award_releases_per_day'] = mean(stats_aggregate['list_award_releases_per_day'])

        stats_aggregate['min_contract_releases_per_day'] = min(stats_aggregate['list_contract_releases_per_day'])
        stats_aggregate['max_contract_releases_per_day'] = max(stats_aggregate['list_contract_releases_per_day'])
        stats_aggregate['average_contract_releases_per_day'] = mean(stats_aggregate['list_contract_releases_per_day'])
    except KeyError:
        None


# *************
# Main function
# *************
def main(argv):
    logging.basicConfig(level=config.logging["level"])

    start_date = ""
    end_date = ""
    openopps_folder = ""

    try:
        opts, args = getopt.getopt(argv, "hs:e:i:")
    except getopt.GetoptError:
        print("openopps_statistics.py -s <start_date> -e <end_date> -i <openopps_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("openopps_statistics.py -s <start_date> -e <end_date> -i <openopps_folder>")
            sys.exit()
        elif opt in ("-s"):
            start_date = arg
        elif opt in ("-e"):
            end_date = arg
        elif opt in ("-i"):
            openopps_folder = arg

    logging.info("main(): start_date = " + start_date)
    logging.info("main(): end_date = " + end_date)
    logging.info("main(): openopps_folder = " + openopps_folder)

    start = datetime.strptime(start_date, "%Y-%m-%d")
    stop = datetime.strptime(end_date, "%Y-%m-%d")

    while start <= stop:
        release_date = datetime.strftime(start, "%Y-%m-%d")

        dirname = release_date
        stats_filepath = os.path.join(openopps_folder, dirname, 'STATISTICS.TXT')
        if os.path.isfile(stats_filepath):
            file_stats = {}
            with open(stats_filepath) as stats_file:
                for line in stats_file:
                    s_key, s_value = line.partition("=")[::2]
                    file_stats[s_key.strip()] = s_value
                update_stats_releases(file_stats)
                update_stats_performance(file_stats)
                update_stats_aggregate_count(file_stats)

        start = start + timedelta(days=1)  # increase day one by one

    # Compute and print aggregated performance stats
    compute_stats_aggregate()
    print_stats()


# *****************
# Run main function
# *****************
if __name__ == "__main__": main(sys.argv[1:])
