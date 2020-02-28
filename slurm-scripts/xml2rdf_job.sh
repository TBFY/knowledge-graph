#!/bin/bash
#SBATCH --output /home/bre/jobs/xml2rdf-%j.out
#SBATCH --job-name XML2RDF
#SBATCH --partition sintef
#SBATCH --ntasks 1
#SBATCH --cpus-per-task=2
#SBATCH --mem=8GB
#SBATCH --time 7-00:00:00

homedir=/home/bre/knowledge-graph/python-scripts

cd $homedir
export DATE=`date +%F_%H%M`
srun python -u xml2rdf.py -s '2019-01-01' -e '2019-01-31' -r '/home/bre/knowledge-graph/rml-mappings' -i '/data/bre/4_XML_Enriched' -o '/data/bre/5_RDF_TBFY' > /home/bre/jobs/job_$DATE.log 2>&1
