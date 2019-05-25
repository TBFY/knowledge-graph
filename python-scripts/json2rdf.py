#!/usr/bin/python

import config

import logging

import requests
import json

import os
import sys
import getopt


# ****************
# Helper functions
# ****************

def is_openopps_json(filename):
    if "-release" in str(filename):
        return True
    else:
        return False

def is_opencorporates_json(filename):
    if "-supplier" in str(filename):
        return True
    else:
        return False


# *************
# Main function
# *************
def main(argv):
    logging.basicConfig(level=config.logging["level"])
    
    rml_folder = ""
    input_folder = ""
    output_folder = ""

    try:
        opts, args = getopt.getopt(argv, "hr:i:o:")
    except getopt.GetoptError:
        print("json2rdf.py -r <rml_folder> -i <input_folder> -o <output_folder>")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("json2rdf.py -r <rml_folder> -i <input_folder> -o <output_folder>")
            sys.exit()
        elif opt in ("-r"):
            rml_folder = arg
        elif opt in ("-i"):
            input_folder = arg
        elif opt in ("-o"):
            output_folder = arg

    logging.info("main(): rml_folder = " + rml_folder)
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

    rmlOpenOppsInputFilePath = os.path.join(rml_folder, "openopps.json")
    rmlOpenCorporatesInputFilePath = os.path.join(rml_folder, "opencorp.json")
    rmlOutputFilePath = os.path.join(rml_folder, "out.ttl")

    for dirname in os.listdir(input_folder):
        dirPath = os.path.join(input_folder, dirname)
        outputDirPath = os.path.join(output_folder, dirname)
        if not os.path.exists(outputDirPath):
            os.makedirs(outputDirPath)
        if os.path.isdir(dirPath):
            for filename in os.listdir(dirPath):
                logging.info("main(): filename = " + filename)
                filePath = os.path.join(dirPath, filename)
                outputFilePath = os.path.join(outputDirPath, str(filename).replace(".json", ".ttl"))
                rmlInputFilePath = os.path.join(rml_folder, filename)
                if is_openopps_json(filename):
                    os.system(copy_command + ' ' + filePath + ' ' + rml_folder)
                    os.replace(rmlInputFilePath, rmlOpenOppsInputFilePath)
                    os.chdir(rml_folder)
                    os.system('java -jar RML-Mapper-v3.0.2.jar -m openopps.rml -o out.ttl')
                    os.replace(rmlOutputFilePath, outputFilePath)
                    os.remove(rmlOpenOppsInputFilePath)
                if is_opencorporates_json(filename):
                    os.system(copy_command + ' ' + filePath + ' ' + rml_folder)
                    os.replace(rmlInputFilePath, rmlOpenCorporatesInputFilePath)
                    os.chdir(rml_folder)
                    os.system('java -jar RML-Mapper-v3.0.2.jar -m opencorp.rml -o out.ttl')
                    os.replace(rmlOutputFilePath, outputFilePath)
                    os.remove(rmlOpenCorporatesInputFilePath)


# *****************
# Run main function
# *****************
if __name__ == "__main__": main(sys.argv[1:])
