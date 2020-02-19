#########################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (https://theybuyforyou.eu/tbfy-knowledge-graph/)
#
# This file contains a script that downloads OCDS JSON documents from the 
# OpenOpps OCDS API (https://openopps.com/api/tbfy/ocds/)
# 
# Copyright: SINTEF 2017-2020
# Author   : Brian Elvesæter (brian.elvesater@sintef.no)
# License  : Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
# Project  : Developed as part of the TheyBuyForYou project (https://theybuyforyou.eu/)
# Funding  : TheyBuyForYou has received funding from the European Union's Horizon 2020
#            research and innovation programme under grant agreement No 780247
#########################################################################################################

#!/usr/bin/python

import config

import tbfy.json_utils

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


# ****************
# Global variables
# ****************

openopps_api_url = config.openopps["api_url"]
openopps_page_size = config.openopps["page_size"]
openopps_sleep = config.openopps["sleep"]


# **********
# Statistics
# **********

stats_releases = config.openopps_statistics.copy()

def write_stats(output_folder):
    global stats_releases

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    sfile = open(os.path.join(output_folder, 'STATISTICS.TXT'), 'w+')
    for key in stats_releases.keys():
        sfile.write(str(key) + " = " + str(stats_releases[key]) + "\n")
    sfile.close()

def update_stats(key):
    global stats_releases

    try:
        stats_releases[key] += 1
    except KeyError:
        stats_releases['ignored'] += 1

def reset_stats():
    global stats_releases

    for key in stats_releases.keys():
        stats_releases[key] = 0


# *******************************
# Acquire token from OpenOpps API
# *******************************
def acquire_token(username, password):
    url = openopps_api_url + "api-token-auth/"
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "username": username, 
        "password": password
    }
    response = requests.post(url, headers=headers, data=json.dumps(data))

    if response.status_code != 200:
        logging.info("acquire_token(): ERROR: " + json.dumps(response.json()))
        return None
    else:
        data = json.loads(json.dumps(response.json()))
        token = "JWT " + data["token"]
        return token


# ************************************
# Authenticate token from OpenOpps API
# ************************************
def authenticate_token(token):
    url = openopps_api_url
    params = {
        "format": "json"
    }
    headers = {
        "Authorization": token
    }
    response = requests.get(url, params=params, headers=headers)

    if response.status_code == 200:
        return True
    else:
        return False


# **************************************
# Get releases by date from OpenOpps API
# **************************************
def get_releases(date, username, password, token):
    # Authenticate token
    if not authenticate_token(token):
        token = acquire_token(username, password)

    # Get releases
    url = openopps_api_url + "tbfy/ocds/"
    params = {
        "page_size": openopps_page_size,
        "min_releasedate": date,
        "max_releasedate": date,
        "ordering": "releasedate",
        "format": "json"
    }
    headers = {
        "Authorization": token
    }
    response = requests.get(url, params=params, headers=headers)

    if response.status_code != 200:
        logging.info("get_releases(): ERROR: " + json.dumps(response.json()))
        return None
    else:
        return response


# *******************************************************************************
# Get next releases by date from OpenOpps API (limitation of count 1000 per page)
# *******************************************************************************
def get_next_releases(url, username, password, token):
    # Authenticate token
    if not authenticate_token(token):
        token = acquire_token(username, password)

    # Get next releases
    headers = {
        "Authorization": token
    }
    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        logging.info("acquire_token(): ERROR: " + json.dumps(response.json()))
        return None
    else:
        return response


# *******************************************
# Process response and write releases to file
# *******************************************
def write_releases(response_releases, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    if response_releases:
        data = json.loads(json.dumps(response_releases.json()))

        for element in data['results']:
            release_data = element['json']
            release_ocid = release_data['releases'][0]['ocid']

            release_tag = tbfy.json_utils.get_release_tag(release_data) # Get tag, if missing then "unknown" is returned
            update_stats(release_tag) # Update statistics

            jfile = open(os.path.join(output_folder, release_ocid + '-' + release_tag + '-release.json'), 'w+')
            jfile.write(json.dumps(release_data, indent=4).replace(': null', ': ""'))
            jfile.close()


# **********************
# Get and write releases 
# **********************
def get_and_write_releases(date, username, password, token, output_folder):
    time.sleep(openopps_sleep) # Sleep to not stress max retries
    response_releases_first_page = get_releases(date, username, password, token)
    write_releases(response_releases_first_page, output_folder)

    response_releases_first_page_data = json.loads(json.dumps(response_releases_first_page.json()))

    next_page_url = response_releases_first_page_data['next']
    while next_page_url != None:
        time.sleep(openopps_sleep) # Sleep to not stress max retries
        response_releases_next_page = get_next_releases(next_page_url, username, password, token)
        write_releases(response_releases_next_page, output_folder)

        response_releases_next_page_data = json.loads(json.dumps(response_releases_next_page.json()))
        next_page_url = response_releases_next_page_data['next']


# *************
# Main function
# *************
def main(argv):
    logging.basicConfig(level=config.logging["level"])

    username = ""
    password = ""
    start_date = ""
    end_date = ""
    output_folder = ""

    try:
        opts, args = getopt.getopt(argv, "hu:p:s:e:o:")
    except getopt.GetoptError:
        print("openopps.py -u <username> -p <password> -s <start_date> -e <end_date> -o <output_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("openopps.py -u <username> -p <password> -s <start_date> -e <end_date> -o <output_folder>")
            sys.exit()
        elif opt in ("-u"):
            username = arg
        elif opt in ("-p"):
            password = arg
        elif opt in ("-s"):
            start_date = arg
        elif opt in ("-e"):
            end_date = arg
        elif opt in ("-o"):
            output_folder = arg

    token = acquire_token(username, password)

    logging.info("main(): username = " + username)
    logging.info("main(): password = " + password)
    logging.info("main(): token = " + token)
    logging.info("main(): start_date = " + start_date)
    logging.info("main(): end_date = " + end_date)
    logging.info("main(): output_folder = " + output_folder)

    start = datetime.strptime(start_date, "%Y-%m-%d")
    stop = datetime.strptime(end_date, "%Y-%m-%d")

    while start <= stop:
        release_date = datetime.strftime(start, "%Y-%m-%d")
        logging.info("main(): release_date = " + release_date)
        outputDirPath = os.path.join(output_folder, release_date)
        get_and_write_releases(release_date, username, password, token, outputDirPath)
        write_stats(outputDirPath) # Write statistics
        reset_stats() # Reset statistics for next folder date
        start = start + timedelta(days=1) # Increase date by one day


# *****************
# Run main function
# *****************
if __name__ == "__main__": main(sys.argv[1:])
