#!/usr/bin/python
# -*- coding: utf-8 -*-

#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (http://data.tbfy.eu/)
# 
# This file contains a script that runs a daily ingestion service that executes the full data 
# ingestion process for a delayed date interval at a specific hour. E.g., one can configure the 
# service to ingest the data from -3 days ago at 03:00 every night. One reason to delay the data 
# ingestion in this manner is due to the fact that data are not neccessarily available at the source 
# at the exact date.
# 
# Copyright: SINTEF 2018-2021
# Author   : Brian Elvesæter (brian.elvesater@sintef.no)
# License  : Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
# Project  : Developed as part of the TheyBuyForYou project (https://theybuyforyou.eu/)
# Funding  : TheyBuyForYou has received funding from the European Union's Horizon 2020
#            research and innovation programme under grant agreement No 780247
#####################################################################################################

import config

import ingest_data

import logging

import os
import sys
import getopt

import time
import datetime
from datetime import datetime
from datetime import timedelta


# ****************
# Helper functions
# ****************

def wait_until(end_datetime):
    while True:
        diff = (end_datetime - datetime.now()).total_seconds()
        if diff < 0: return       # In case end_datetime was in past to begin with
        time.sleep(diff/2)
        if diff <= 0.1: return


# *************
# Main function
# *************
def main(argv):
    logging.basicConfig(level=config.logging["level"])
    
    openopps_username = os.environ["OPENOPPS_USERNAME"]
    openopps_password = os.environ["OPENOPPS_PASSWORD"]
    opencorporates_reconcile_api_key = os.environ["OPENCORPORATES_RECONCILE_API_KEY"]
    opencorporates_companies_api_key = os.environ["OPENCORPORATES_COMPANIES_API_KEY"]
    rml_folder = os.environ["RML_FOLDER"]
    start_date = os.environ["START_DATE"]
    end_date = os.environ["END_DATE"]
    days_delayed = os.environ["DAYS_DELAYED"]
    daily_schedule = os.environ["DAILY_SCHEDULE"]
    output_folder = os.environ["OUTPUT_FOLDER"]
    tbfy_fuseki_url = os.environ["TBFY_FUSEKI_URL"]
    tbfy_fuseki_dataset = os.environ["TBFY_FUSEKI_DATASET"]

    logging.debug("kg_ingestion_service.py: openopps_username = " + openopps_username)
    logging.debug("kg_ingestion_service.py: openopps_password = " + openopps_password)
    logging.debug("kg_ingestion_service.py: opencorporates_reconcile_api_key = " + opencorporates_reconcile_api_key)
    logging.debug("kg_ingestion_service.py: opencorporates_companies_api_key = " + opencorporates_companies_api_key)
    logging.debug("kg_ingestion_service.py: rml_folder = " + rml_folder)
    logging.debug("kg_ingestion_service.py: start_date = " + start_date)
    logging.debug("kg_ingestion_service.py: end_date = " + end_date)
    logging.debug("kg_ingestion_service.py: days_delayed = " + days_delayed)
    logging.debug("kg_ingestion_service.py: daily_schedule = " + daily_schedule)
    logging.debug("kg_ingestion_service.py: output_folder = " + output_folder)
    logging.debug("kg_ingestion_service.py: tbfy_fuseki_url = " + tbfy_fuseki_url)
    logging.debug("kg_ingestion_service.py: tbfy_fuseki_dataset = " + tbfy_fuseki_dataset)

    start = datetime.strptime(start_date, "%Y-%m-%d")
    stop = datetime.strptime(end_date, "%Y-%m-%d")

    schedule_hour, schedule_minute = daily_schedule.split(':')

    while start <= stop:
        wait_date = start + timedelta(days=int(days_delayed)) # Set delayed date
        wait_date = wait_date.replace(hour=int(schedule_hour), minute=int(schedule_minute)) # Set schedule for delayed date

        # Wait until delayed date
        logging.info("kg_ingestion_service.py: wait_date = " + wait_date.strftime("%Y-%m-%d %H:%M"))
        wait_until(wait_date)
        
        # Set date to process
        created_date = datetime.strftime(start, "%Y-%m-%d") 
        logging.info("kg_ingestion_service.py: date = " + created_date)

        # Run ingestion script
        ingest_data_argv = ["ingest_data.py", "-u", openopps_username, "-p", openopps_password, "-a", opencorporates_reconcile_api_key, "-b", opencorporates_companies_api_key, "-r", rml_folder, "-s", created_date, "-e", created_date, "-o", output_folder]
        ingest_data.main(ingest_data_argv[1:])

        start = start + timedelta(days=1) # Increase date by one day


# *****************
# Run main function
# *****************
if __name__ == "__main__": main(sys.argv[1:])
