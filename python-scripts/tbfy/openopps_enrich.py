# -*- coding: utf-8 -*-

#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (http://data.tbfy.eu/)
#
# This file contains JSON enrichment methods for OCDS 1.0 releases downloaded from the 
# OpenOpps OCDS API (https://openopps.com/api/tbfy/ocds/)
# 
# Copyright: SINTEF 2018-2021
# Author   : Brian Elvesæter (brian.elvesater@sintef.no)
# License  : Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
# Project  : Developed as part of the TheyBuyForYou project (https://theybuyforyou.eu/)
# Funding  : TheyBuyForYou has received funding from the European Union's Horizon 2020
#            research and innovation programme under grant agreement No 780247
#####################################################################################################

import config

import tbfy.json_utils

import logging

import json

import os
import sys
import getopt


# *********************************
# Enrich release (procurement data)
# *********************************

def enrich_release(release_data):
    try:
        release_tag = tbfy.json_utils.get_release_tag(release_data)
        if (release_tag == "planning"):
            return enrich_plan(release_data)
        elif (release_tag == "tender") or (release_tag == "tenderUpdate") or (release_tag == "tenderAmendment"):
            return enrich_tender(release_data)
        elif (release_tag == "award") or (release_tag == "awardUpdate") or (release_tag == "awardCancellation"):
            return enrich_award(release_data)
        else:
            return release_data
    except KeyError:
        return enrich_tender(release_data)


def enrich_plan(release_data):
    enrich_tender(release_data)
    return release_data


def enrich_tender(release_data):
    return release_data


def enrich_award(release_data):
    ocid = tbfy.json_utils.get_value(release_data, "ocid")

    awards_data = release_data['releases'][0]['awards']
    i = 0
    for award in awards_data:
        award_path = "releases.[0].awards.[" + str(i) + "]"
        award_id = tbfy.json_utils.get_value(release_data, award_path + ".id")

        suppliers_data = release_data['releases'][0]['awards'][i]['suppliers']
        j = 0
        for supplier in suppliers_data:
            supplier_path = award_path + '.suppliers.[' + str(j) + ']'
            tbfy.json_utils.add_property_to_single_node(release_data, supplier_path, "tbfy_id", j)
            j += 1

        i += 1

    return release_data


# **********************************
# Process release (procurement data)
# **********************************

def process_release(input_filePath, output_filePath):
    input_data = tbfy.json_utils.read_jsonfile(input_filePath)
    enriched_release_data = enrich_release(input_data)
    tbfy.json_utils.write_jsonfile(enriched_release_data, output_filePath)
