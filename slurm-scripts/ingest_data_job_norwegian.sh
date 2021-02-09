#!/bin/bash
#SBATCH --output /home/bre/jobs/ingest_data_norwegian-%j.out
#SBATCH --job-name INGEST_DATA_NORWEGIAN
#SBATCH --partition sintef
#SBATCH --ntasks 1
#SBATCH --cpus-per-task=1
#SBATCH --mem=8GB
#SBATCH --time 1-00:00:00

# Use the virtual miniconda python environment 'tbfy' instead of system python
source /opt/miniconda3/bin/activate
conda env list
conda activate tbfy
conda env list
# . "/opt/miniconda3/etc/profile.d/conda.sh"
homedir=/home/bre/knowledge-graph/python-scripts

cd $homedir
export DATE=`date +%F_%H%M`
srun python -u ingest_data_norwegian.py -s '2019-01-01' -e '2019-01-31' -o '/data/bre' > /home/bre/jobs/job_$DATE.log 2>&1
