#!/bin/bash
#SBATCH --output /home/bre/jobs/json2rdf-%j.out
#SBATCH --job-name JSON2RDF
#SBATCH --partition sintef
#SBATCH --ntasks 1
#SBATCH --cpus-per-task=6
#SBATCH --time 7-00:00:00

homedir=/home/bre/knowledge-graph/python-scripts

cd $homedir
export DATE=`date +%F_%H%M`
srun python -u json2rdf.py -s '2019-05-01' -e '2019-05-01' -r '/home/bre/RML_Mapper_Scripts' -i '/home/bre/Test_2_JSON_OpenCorporates' -o '/home/bre/Test_3_RDF_TBFY' > job_$DATE.log 2>&1
