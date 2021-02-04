#!/usr/bin/python
# -*- coding: utf-8 -*-

#####################################################################################################
# Data ingestion script for the Norwegian Knowledge Graph (http://norway.tbfy.eu/)
# 
# This file contains a script that generates and submits a daily Slurm job for filtering Norwegian
# data processed by the TBFY data ingestion pipeline and publishing the Norwegian data to the
# Norwegian knowledge graph. (This script must be run after completion of the daily TBFY data 
# ingestion pipeline script.)
# 
# Copyright: SINTEF 2018-2021
# Author   : Brian Elvesæter (brian.elvesater@sintef.no)
# License  : Apache License 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
# Project  : Developed as part of the TheyBuyForYou project (https://theybuyforyou.eu/)
# Funding  : TheyBuyForYou has received funding from the European Union's Horizon 2020
#            research and innovation programme under grant agreement No 780247
#####################################################################################################

import config

import logging

from dotenv import load_dotenv

import os
import subprocess
import sys
import getopt

import time
import datetime
from datetime import datetime
from datetime import timedelta


# ****************
# Global variables
# ****************

script_file = "/home/bre/jobs/ingest_data_job_norwegian.sh"
env_file = "/home/bre/jobs/ingest_data_config.env"

load_dotenv(env_file)

days_delayed = os.environ["DAYS_DELAYED"]
output_folder = os.environ["OUTPUT_FOLDER"]


# ****************
# Helper functions
# ****************
def generate_slurm_script(date, output_folder, script_file):
    slurm_script = "#!/bin/bash\n"
    slurm_script += "#SBATCH --output /home/bre/jobs/ingest_data_norwegian-%j.out\n"
    slurm_script += "#SBATCH --job-name INGEST_DATA_NORWEGIAN\n"
    slurm_script += "#SBATCH --partition sintef\n"
    slurm_script += "#SBATCH --ntasks 1\n"
    slurm_script += "#SBATCH --cpus-per-task=1\n"
    slurm_script += "#SBATCH --mem=8GB\n"
    slurm_script += "#SBATCH --time 1-00:00:00\n"
    slurm_script += "\n"
    slurm_script += "# Use the virtual miniconda python environment 'tbfy' instead of system python\n"
    slurm_script += "source /opt/miniconda3/bin/activate\n"
    slurm_script += "conda env list\n"
    slurm_script += "conda activate tbfy\n"
    slurm_script += "conda env list\n"
    slurm_script += "# . \"/opt/miniconda3/etc/profile.d/conda.sh\"\n"
    slurm_script += "homedir=/home/bre/knowledge-graph/python-scripts\n"
    slurm_script += "\n"
    slurm_script += "cd $homedir\n"
    slurm_script += "export DATE=`date +%F_%H%M`\n"
    slurm_script += "srun python -u ingest_data_norwegian.py -s '" + date + "' -e '" + date + "' -o '" + output_folder + "' > /home/bre/jobs/job_$DATE.log 2>&1\n"

    sfile = open(script_file, 'w+')
    sfile.write(slurm_script)
    sfile.close()


def submit_slurm_script(script_file):
    subprocess.call(['sbatch', script_file])


# *************
# Main function
# *************
def main(argv):
    logging.basicConfig(level=config.logging["level"])
    
    try:
        opts, args = getopt.getopt(argv, "h")
    except getopt.GetoptError:
        print("generate_submit_slurm_job.py")
        sys.exit(2)
    for opt, arg in opts:
        if opt == "-h":
            print("generate_submit_slurm_job")
            sys.exit()

    logging.debug("generate_submit_slurm_job_norwegian.py: days_delayed = " + days_delayed)
    logging.debug("generate_submit_slurm_job_norwegian.py: output_folder = " + output_folder)

    created_date = datetime.strftime((datetime.now() - timedelta(days=int(days_delayed))), "%Y-%m-%d")
    logging.info("generate_submit_slurm_job.py: date = " + created_date)

    generate_slurm_script(created_date, output_folder, script_file)
    submit_slurm_script(script_file)


# *****************
# Run main function
# *****************
if __name__ == "__main__": main(sys.argv[1:])
