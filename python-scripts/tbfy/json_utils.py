# -*- coding: utf-8 -*-

#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (http://data.tbfy.eu/)
#
# This file contains helper functions for processing JSON documents.
# 
# Copyright: SINTEF 2018-2021
# Author   : Brian Elvesæter (brian.elvesater@sintef.no)
# License  : Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
# Project  : Developed as part of the TheyBuyForYou project (https://theybuyforyou.eu/)
# Funding  : TheyBuyForYou has received funding from the European Union's Horizon 2020
#            research and innovation programme under grant agreement No 780247
#####################################################################################################

import json
import dpath.util
import xmltodict
import re


# *************************
# OpenOpps helper functions
# *************************

def is_openopps_json(filename):
    if "-release" in str(filename):
        return True
    else:
        return False


def get_release_tag(release_data):
    try:
        tags = str(release_data['releases'][0]['tag'])

        release_tag = ""

        if "planning" in tags:
            release_tag = "planning"
        if "tender" in tags:
            release_tag = "tender"
        if "tenderAmendment" in tags:
            release_tag = "tenderAmendment"
        if "tenderUpdate" in tags:
            release_tag = "tenderUpdate"
        if "tenderCancellation" in tags:
            release_tag = "tenderCancellation"
        if "award" in tags:
            release_tag = "award"
        if "awardUpdate" in tags:
            release_tag = "awardUpdate"
        if "awardCancellation" in tags:
            release_tag = "awardCancellation"
        if "contract" in tags:
            release_tag = "contract"
        if "contractAmendment" in tags:
            release_tag = "contractAmendment"
        if "implementation" in tags:
            release_tag = "implementation"
        if "implementationUpdate" in tags:
            release_tag = "implementationUpdate"
        if "contractTermination" in tags:
            release_tag = "contractTermination"
        if release_tag == "":
            release_tag = "unknown"

        return release_tag
    except KeyError:
        return "unknown"


# *******************************
# OpenCorporates helper functions
# *******************************

def is_opencorporates_json(filename):
    if "-supplier" in str(filename):
        return True
    else:
        return False


# ************************
# General helper functions
# ************************

def read_jsonfile(input_filePath):
    try:
        f = open(input_filePath)
        lines = f.read()

        dictionary_data = json.loads(lines)
        f.close()   
        return dictionary_data
    except:
        return None


def write_jsonfile(dictionary_data, output_filePath):
    if dictionary_data:
        jfile = open(output_filePath, 'w+', encoding='utf8', errors='ignore')
        jfile.write(json.dumps(dictionary_data, indent=4).replace(': null', ': ""'))
        jfile.close()


def get_value(json_dict, path):
    try:
        new_path = path.replace('[', '').replace(']', '')
        value = dpath.util.get(json_dict, new_path, separator='.')
        return value
    except KeyError:
        return None


def add_property_to_single_node(json_dict, node_path, new_prop, val):
    try:
        new_path = node_path + '.' + new_prop
        new_path = new_path.replace('[', '').replace(']', '')
        dpath.util.new(json_dict, new_path, val, separator='.')
    except KeyError:
        return None


def add_property_to_array_node(json_dict, array_path, new_prop, val):
    try:
        array_nodes = dpath.util.get(json_dict, array_path, separator='.')
        new_path = array_path.replace('[', '').replace(']', '')

        i = 0
        for item in array_nodes:
            item_path = new_path + '.' + str(i) + '.' + new_prop
            dpath.util.new(json_dict, item_path, val, separator='.')
            i += 1
    
    except KeyError:
        return None


def convert_to_xml(json_dict):
    if json_dict:
        return xmltodict.unparse(json_dict, pretty=True)
    else:
        return None


def strip_illegal_xml_chars(illegal_xml_string):  
    illegal_xml_re = re.compile(u'[\x00-\x08\x0b-\x1f\x7f-\x84\x86-\x9f\ud800-\udfff\ufdd0-\ufddf\ufffe-\uffff]')
    clean_xml_string = illegal_xml_re.sub('', illegal_xml_string)
    return clean_xml_string


def write_xmlfile(xml_string, output_filePath):
    if xml_string:
        clean_xml_string = strip_illegal_xml_chars(xml_string)
        xfile = open(output_filePath, 'w+', encoding='utf8', errors='ignore')
        xfile.write(clean_xml_string)
        xfile.close()
