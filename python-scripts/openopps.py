#!/usr/bin/python

import config

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

openopps_sleep = config.openopps["sleep"]


# *******************************
# Acquire token from OpenOpps API
# *******************************
def acquire_token(username, password):
    url = "https://api.openopps.com/api/api-token-auth/"
    headers = {
        "Content-Type": "application/json"
    }
    data = {
        "username": username, 
        "password": password
    }
    response = requests.post(url, headers=headers, data=json.dumps(data))

    data = json.loads(json.dumps(response.json()))
    if response.status_code != 200:
        print("ERROR: " + json.dumps(data))
        sys.exit(2)

    token = "JWT " + data["token"]
    return token


# ************************************
# Authenticate token from OpenOpps API
# ************************************
def authenticate_token(token):
    url = "https://api.openopps.com/api/"
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
def get_releases(date, username, password, token, page_size):
    # Authenticate token
    if not authenticate_token(token):
        token = acquire_token(username, password)

    # Get releases
    url = "https://api.openopps.com/api/tbfy/ocds/"
    params = {
        "page_size": page_size,
        "min_releasedate": date,
        "max_releasedate": date,
        "ordering": "releasedate",
        "format": "json"
    }
    headers = {
        "Authorization": token
    }
    response = requests.get(url, params=params, headers=headers)
    return response


# *******************************************************************************
# Get next releases by date from OpenOpps API (limitation of count 1000 per page)
# *******************************************************************************
def get_next_releases(url, token, page_size):
    headers = {
        "Authorization": token
    }
    response = requests.get(url, headers=headers)
    return response


# *******************************************
# Process response and write releases to file
# *******************************************
def write_releases(response_releases, output_folder):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    data = json.loads(json.dumps(response_releases.json()))
    for element in data['results']:
        jfile = open(output_folder + '\\' + element['ocid'] + '-release.json', 'w+')
        jfile.write(json.dumps(element, indent=4).replace('null', '""'))
        jfile.close


# **********************
# Get and write releases 
# **********************
def get_and_write_releases(date, username, password, token, page_size, output_folder):
    response_releases_first_page = get_releases(date, username, password, token, page_size)
    write_releases(response_releases_first_page, output_folder)

    response_releases_first_page_data = json.loads(json.dumps(response_releases_first_page.json()))

    next_page_url = response_releases_first_page_data['next']
    while next_page_url != None:
        time.sleep(openopps_sleep) # Sleep to not stresss max retries
        response_releases_next_page = get_next_releases(next_page_url, token, page_size)
        write_releases(response_releases_next_page, output_folder)

        response_releases_next_page_data = json.loads(json.dumps(response_releases_next_page.json()))
        next_page_url = response_releases_next_page_data['next']


# *************
# Main function
# *************
def main(argv):
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

    page_size = config.openopps["page_size"]
    token = acquire_token(username, password)

    print("username = " + username)
    print("password = " + password)
    print("token = " + token)
    print("start_date = " + start_date)
    print("end_date = " + end_date)
    print("output_folder = " + output_folder)

    start = datetime.strptime(start_date, "%Y-%m-%d")
    stop = datetime.strptime(end_date, "%Y-%m-%d")

    while start <= stop:
        release_date = datetime.strftime(start, "%Y-%m-%d")
        print("release_date = " + release_date)
        get_and_write_releases(release_date, username, password, token, page_size, output_folder + "\\" + release_date)
        start = start + timedelta(days=1)  # increase day one by one


# *****************
# Run main function
# *****************
if __name__ == "__main__": main(sys.argv[1:])
