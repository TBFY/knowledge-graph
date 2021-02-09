#!/bin/bash
#SBATCH --output /home/bre/jobs/zip_data-%j.out
#SBATCH --job-name ZIP_DATA
#SBATCH --partition sintef
#SBATCH --ntasks 1
#SBATCH --cpus-per-task=1
#SBATCH --mem=8GB
#SBATCH --time 1-00:00:00

homedir=/data/bre

cd $homedir
export DATE=`date +%F_%H%M`
srun zip -r 1_JSON_OpenOpps.zip 1_JSON_OpenOpps && srun zip -r 2_JSON_OpenCorporates.zip 2_JSON_OpenCorporates && srun zip -r 3_JSON_Enriched.zip 3_JSON_Enriched && srun zip -r 4_XML_Enriched.zip 4_XML_Enriched && srun zip -r 5_RDF_TBFY.zip 5_RDF_TBFY > /home/bre/jobs/job_$DATE.log 2>&1

