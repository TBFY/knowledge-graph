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
    if release_data['json']['releases'][0]['tag'][0] == "tender":
        return enrich_tender(release_data)
    elif release_data ['json']['releases'][0]['tag'][0] == "award":
        return enrich_award(release_data)
    else:
        return release_data


def enrich_tender(release_data):
    ocid = tbfy.json_utils.get_value(release_data, "ocid")
    tender_id = tbfy.json_utils.get_value(release_data, "json.releases.[0].tender.id")

    tbfy.json_utils.add_property_to_array_node(release_data, "json.releases.[0].tender.items", "tbfy_tender_id", tender_id)
    tbfy.json_utils.add_property_to_single_node(release_data, "json.releases.[0].tender.maxValue", "tbfy_tender_id", tender_id)
    tbfy.json_utils.add_property_to_single_node(release_data, "json.releases.[0].tender.minValue", "tbfy_tender_id", tender_id)
    tbfy.json_utils.add_property_to_array_node(release_data, "json.releases.[0].tender.documents", "tbfy_tender_id", tender_id)
    tbfy.json_utils.add_property_to_array_node(release_data, "json.releases.[0].tender.milestones", "tbfy_tender_id", tender_id)

    return release_data


def enrich_award(release_data):
    ocid = tbfy.json_utils.get_value(release_data, "ocid")

    awards_data = release_data['json']['releases'][0]['awards']
    i = 0
    for award in awards_data:
        award_path = "json.releases.[0].awards.[" + str(i) + "]"
        award_id = tbfy.json_utils.get_value(release_data, award_path + ".id")

        tbfy.json_utils.add_property_to_single_node(release_data, "json.releases.[0].awards.[" + str(i) + "].value", "tbfy_award_id", award_id)

        suppliers_data = release_data['json']['releases'][0]['awards'][i]['suppliers']
        j = 0
        for supplier in suppliers_data:
            supplier_path = award_path + '.suppliers.[' + str(j) + ']'
            tbfy.json_utils.add_property_to_single_node2(release_data, supplier_path, "tbfy_ocid", ocid)
            tbfy.json_utils.add_property_to_single_node2(release_data, supplier_path, "tbfy_id", j)
            tbfy.json_utils.add_property_to_single_node2(release_data, supplier_path, "tbfy_award_id", award_id)
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
