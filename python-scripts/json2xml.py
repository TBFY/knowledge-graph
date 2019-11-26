#####################################################################################################
# Data ingestion script for the TBFY Knowledge Graph (https://theybuyforyou.eu/tbfy-knowledge-graph/)
# 
# This file contains a script that converts JSON documents to XML documents.
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
import tbfy.json_utils

import logging

import xmltodict

import os
import sys
import getopt

import time
import datetime
from datetime import datetime
from datetime import timedelta


# *************
# Main function
# *************
def main(argv):
    logging.basicConfig(level=config.logging["level"])
    
    start_date = ""
    end_date = ""
    rml_folder = ""
    input_folder = ""
    output_folder = ""

    try:
        opts, args = getopt.getopt(argv, "hs:e:r:i:o:")
    except getopt.GetoptError:
        print("json2xml.py -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("json2xml.py -s <start_date> -e <end_date> -i <input_folder> -o <output_folder>")
            sys.exit()
        elif opt in ("-s"):
            start_date = arg
        elif opt in ("-e"):
            end_date = arg
        elif opt in ("-i"):
            input_folder = arg
        elif opt in ("-o"):
            output_folder = arg

    logging.info("main(): start_date = " + start_date)
    logging.info("main(): end_date = " + end_date)
    logging.info("main(): input_folder = " + input_folder)
    logging.info("main(): output_folder = " + output_folder)

    copy_command = ""
    if sys.platform.lower().startswith("win"):
        copy_command = "copy"
    elif sys.platform.lower().startswith("linux"):
        copy_command = "cp"
    else:
        copy_command = "copy"

    logging.info("main(): platform = " + sys.platform.lower())
    logging.info("main(): copy_command = " + copy_command)

    start = datetime.strptime(start_date, "%Y-%m-%d")
    stop = datetime.strptime(end_date, "%Y-%m-%d")

    while start <= stop:
        release_date = datetime.strftime(start, "%Y-%m-%d")

        dirname = release_date
        dirPath = os.path.join(input_folder, dirname)
        outputDirPath = os.path.join(output_folder, dirname)
        if os.path.isdir(dirPath):
            if not os.path.exists(outputDirPath):
                os.makedirs(outputDirPath)
            for filename in os.listdir(dirPath):
                logging.info("main(): filename = " + filename)
                inputFilePath = os.path.join(dirPath, filename)
                xml_filename = os.path.splitext(filename)[0] + '.xml'
                outputFilePath = os.path.join(outputDirPath, xml_filename)
                json_dict = tbfy.json_utils.read_jsonfile(inputFilePath)
                json_dict_one_root = {'root': json_dict}
                tbfy.json_utils.write_xmlfile(tbfy.json_utils.convert_to_xml(json_dict_one_root), outputFilePath)

        start = start + timedelta(days=1)  # increase day one by one


# *****************
# Run main function
# *****************
if __name__ == "__main__": main(sys.argv[1:])
