#!/bin/bash
#SBATCH --output /home/bre/jobs/publish_rdf-%j.out
#SBATCH --job-name PUBLISH_RDF
#SBATCH --partition sintef
#SBATCH --ntasks 1
#SBATCH --cpus-per-task=1
#SBATCH --mem=8GB
#SBATCH --time 1-00:00:00

homedir=/home/bre/knowledge-graph/python-scripts

cd $homedir
export DATE=`date +%F_%H%M`
srun python -u publish_rdf.py -s '2019-01-01' -e '2019-01-31' -i '/data/bre/5_RDF_TBFY' > /home/bre/jobs/job_$DATE.log 2>&1
