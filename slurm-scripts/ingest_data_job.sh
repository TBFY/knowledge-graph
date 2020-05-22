#!/bin/bash
#SBATCH --output /home/bre/jobs/ingest_data-%j.out
#SBATCH --job-name INGEST_DATA
#SBATCH --partition sintef
#SBATCH --ntasks 1
#SBATCH --cpus-per-task=2
#SBATCH --mem=16GB
#SBATCH --time 7-00:00:00

homedir=/home/bre/knowledge-graph/python-scripts

cd $homedir
export DATE=`date +%F_%H%M`
srun python -u ingest_data.py -u 'username' -p 'password' -a 'secret' -r '/home/bre/knowledge-graph/rml-mappings' -s '2019-01-01' -e '2019-01-31' -o '/data/bre' > /home/bre/jobs/job_$DATE.log 2>&1
