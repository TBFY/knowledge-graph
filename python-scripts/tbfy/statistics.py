# -*- coding: utf-8 -*-

#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (http://data.tbfy.eu/)
#
# This file contains statistics definitions and helper functions for the different steps in the data 
# ingestion process (https://github.com/TBFY/knowledge-graph/tree/master/python-scripts)
# 
# Copyright: SINTEF 2018-2021
# Author   : Brian Elvesæter (brian.elvesater@sintef.no)
# License  : Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
# Project  : Developed as part of the TheyBuyForYou project (https://theybuyforyou.eu/)
# Funding  : TheyBuyForYou has received funding from the European Union's Horizon 2020
#            research and innovation programme under grant agreement No 780247
#####################################################################################################

from statistics import mean
from decimal import Decimal


# *******************
# OpenOpps statistics
# *******************

openopps_statistics_releases = {
    "unknown": 0,
    "planning": 0,
    "tender": 0,
    "tenderAmendment": 0,
    "tenderUpdate": 0,
    "tenderCancellation": 0,
    "award": 0,
    "awardUpdate": 0,
    "awardCancellation": 0,
    "contract": 0,
    "contractAmendment": 0,
    "implementation": 0,
    "implementationUpdate": 0,
    "contractTermination": 0,
}


openopps_statistics_performance = {
    "download_start_time": 0,
    "download_end_time": 0,
    "download_duration_in_seconds": 0,
    "number_of_releases": 0,
    "releases_downloaded_per_second": 0
}


openopps_statistics_aggregate = {
    "number_of_releases": 0,
    "download_duration_in_seconds": 0,
    "releases_downloaded_per_second": 0,
    "number_of_days": 0,
    "list_releases_per_day": [],
    "min_releases_per_day": None,
    "max_releases_per_day": None,
    "average_releases_per_day": None,
    "list_planning_releases_per_day": [],
    "min_planning_releases_per_day": None,
    "max_planning_releases_per_day": None,
    "average_planning_releases_per_day": None,
    "list_tender_releases_per_day": [], 
    "min_tender_releases_per_day": None,
    "max_tender_releases_per_day": None,
    "average_tender_releases_per_day": None,
    "list_award_releases_per_day": [],
    "min_award_releases_per_day": None,
    "max_award_releases_per_day": None,
    "average_award_releases_per_day": None,
    "list_contract_releases_per_day": [],
    "min_contract_releases_per_day": None,
    "max_contract_releases_per_day": None,
    "max_contract_releases_per_day": None,
    "average_contract_releases_per_day": None
}


# *************************
# OpenCorporates statistics
# *************************

opencorporates_statistics_reconciliation = {
    "releases_processed_duration_in_seconds": 0,
    "number_of_releases": 0,
    "number_of_award_releases": 0,
    "award_releases_processed_duration_in_seconds": 0, 
    "awards": 0,
    "suppliers": 0,
    "list_suppliers_per_award": [],
    "candidate_companies": 0,
    "matching_companies": 0,
    "reconciliation_lookups_from_api": 0,
    "reconciliation_lookups_from_cache": 0,
    "reconciliation_lookups_from_api_duration_in_seconds": 0,
    "list_result_score": [],
    "company_downloads_from_api": 0,
    "company_downloads_from_cache": 0,
    "company_downloads_from_api_duration_in_seconds": 0,
    "company_files_written": 0,
    "company_files_written_duration_in_seconds": 0
}


opencorporates_statistics_performance = {
    "number_of_releases": 0,
    "releases_processed_duration_in_seconds": 0,
    "releases_processed_per_second": 0,
    "number_of_award_releases": 0,
    "award_releases_processed_duration_in_seconds": 0,
    "award_releases_processed_per_second": 0,
    "awards": 0,
    "suppliers": 0,
    "list_suppliers_per_award": [],
    "min_suppliers_per_award": None,
    "max_suppliers_per_award": None,
    "average_suppliers_per_award": None,
    "candidate_companies": 0,
    "matching_companies": 0,
    "reconciliation_lookups_from_api": 0,
    "reconciliation_lookups_from_cache": 0,
    "reconciliation_lookups_from_api_duration_in_seconds": 0,
    "reconciliation_lookups_from_api_per_second": 0,
    "list_result_score": [],
    "lowest_result_score": None,
    "highest_result_score": None,
    "average_result_score": None,
    "company_downloads_from_api": 0,
    "company_downloads_from_cache": 0,
    "company_downloads_from_api_duration_in_seconds": 0,
    "company_downloads_from_api_per_second": 0,
    "company_files_written": 0,
    "company_files_written_duration_in_seconds": 0,
    "company_files_written_per_second": 0
}


def compute_opencorporates_stats_performance(stats_performance, stats_reconciliation):
    for key in stats_performance.keys():
        try:
            update_stats_value(stats_performance, key, stats_reconciliation[key])
        except KeyError:
            None

    try:
        stats_performance["releases_processed_per_second"] = safe_div(stats_performance["number_of_releases"], stats_performance["releases_processed_duration_in_seconds"])
        stats_performance["award_releases_processed_per_second"] = safe_div(stats_performance["number_of_award_releases"], stats_performance["award_releases_processed_duration_in_seconds"])

        stats_performance["min_suppliers_per_award"] = min(stats_performance["list_suppliers_per_award"])
        stats_performance["max_suppliers_per_award"] = max(stats_performance["list_suppliers_per_award"])
        stats_performance["average_suppliers_per_award"] = mean(stats_performance["list_suppliers_per_award"])

        stats_performance["reconciliation_lookups_from_api_per_second"] = safe_div(stats_performance["reconciliation_lookups_from_api"], stats_performance["reconciliation_lookups_from_api_duration_in_seconds"])

        stats_performance["lowest_result_score"] = min(stats_performance["list_result_score"])
        stats_performance["highest_result_score"] = max(stats_performance["list_result_score"])
        stats_performance["average_result_score"] = mean(stats_performance["list_result_score"])

        stats_performance["company_downloads_from_api_per_second"] = safe_div(stats_performance["company_downloads_from_api"], stats_performance["company_downloads_from_api_duration_in_seconds"])
        stats_performance["company_files_written_per_second"] = safe_div(stats_performance["company_files_written"], stats_performance["company_files_written_duration_in_seconds"])
    except KeyError:
        None
    except ValueError:
        None


# ****************************
# Enrich & JSON2XML statistics
# ****************************

files_statistics_count = {
    "number_of_files": 0,
    "files_processed_duration_in_seconds": 0
}


files_statistics_performance = {
    "number_of_files": 0,
    "files_processed_duration_in_seconds": 0,
    "files_processed_per_second": 0
}


def compute_files_stats_performance(stats_performance, stats_count):
    for key in stats_performance.keys():
        try:
            update_stats_value(stats_performance, key, stats_count[key])
        except KeyError:
            None

    try:
        stats_performance["files_processed_per_second"] = safe_div(stats_performance["number_of_files"], stats_performance["files_processed_duration_in_seconds"])
    except KeyError:
        None


# ****************************
# XML2RDF statistics
# ****************************

xml2rdf_statistics_count = {
    "number_of_files": 0,
    "files_processed_duration_in_seconds": 0,
    "number_of_release_files": 0,
    "release_files_processed_duration_in_seconds": 0,
    "number_of_company_files": 0,
    "company_files_processed_duration_in_seconds": 0
}


xml2rdf_statistics_performance = {
    "number_of_files": 0,
    "files_processed_duration_in_seconds": 0,
    "average_time_to_process_each_file_in_seconds": 0,
    "files_processed_per_second": 0,
    "number_of_release_files": 0,
    "release_files_processed_duration_in_seconds": 0,
    "average_time_to_process_each_release_file_in_seconds": 0,
    "release_files_processed_per_second": 0,
    "number_of_company_files": 0,
    "company_files_processed_duration_in_seconds": 0,
    "average_time_to_process_each_company_file_in_seconds": 0,
    "company_files_processed_per_second": 0
}


def compute_xml2rdf_stats_performance(stats_performance, stats_count):
    for key in stats_performance.keys():
        try:
            update_stats_value(stats_performance, key, stats_count[key])
        except KeyError:
            None

    try:
        stats_performance["files_processed_per_second"] = safe_div(stats_performance["number_of_files"], stats_performance["files_processed_duration_in_seconds"])
        stats_performance["average_time_to_process_each_file_in_seconds"] = safe_div(stats_performance["files_processed_duration_in_seconds"], stats_performance["number_of_files"])

        stats_performance["release_files_processed_per_second"] = safe_div(stats_performance["number_of_release_files"], stats_performance["release_files_processed_duration_in_seconds"])
        stats_performance["average_time_to_process_each_release_file_in_seconds"] = safe_div(stats_performance["release_files_processed_duration_in_seconds"], stats_performance["number_of_release_files"])

        stats_performance["company_files_processed_per_second"] = safe_div(stats_performance["number_of_company_files"], stats_performance["company_files_processed_duration_in_seconds"])
        stats_performance["average_time_to_process_each_company_file_in_seconds"] = safe_div(stats_performance["company_files_processed_duration_in_seconds"], stats_performance["number_of_company_files"])
    except KeyError:
        None


# **********************
# Publish RDF statistics
# **********************

publish_statistics_count = {
    "number_of_files": 0,
    "number_of_triples": 0,
    "publish_duration_in_seconds": 0
}


publish_statistics_performance = {
    "number_of_files": 0,
    "number_of_triples": 0,
    "publish_duration_in_seconds": 0,
    "files_published_per_second": 0,
    "triples_published_per_second": 0
}


def compute_publish_stats_performance(stats_performance, stats_count):
    for key in stats_performance.keys():
        try:
            update_stats_value(stats_performance, key, stats_count[key])
        except KeyError:
            None

    try:
        stats_performance["files_published_per_second"] = safe_div(stats_performance["number_of_files"], stats_performance["publish_duration_in_seconds"])
        stats_performance["triples_published_per_second"] = safe_div(stats_performance["number_of_triples"], stats_performance["publish_duration_in_seconds"])
    except KeyError:
        None


# ****************
# Helper functions
# ****************

def update_stats_count(dict, key):
    dict[key] += 1


def update_stats_value(dict, key, value):
    dict[key] = value


def update_stats_add(dict, key, value):
    dict[key] += value


def update_stats_append(dict, key, value):
    dict[key].append(value)


def update_stats_list(dict, key, value):
    value = value.replace("[", "").replace(" ", "").replace("\n", "").replace("]", "")
    for item in value.split(","):
        if item:
            dict[key].append(Decimal(item))


def update_stats_min(dict, key, value):
    if dict[key] == None:
        dict[key] = value
    else:
        dict[key] = min(dict[key], value)


def update_stats_max(dict, key, value):
    if dict[key] == None:
        dict[key] = value
    else:
        dict[key] = max(dict[key], value)


def safe_div(x, y):
    if y == 0:
        return 0
    else:
        return x / y
