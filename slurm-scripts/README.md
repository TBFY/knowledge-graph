# Slurm scripts
This module contains example Slurm scripts that can be used to run the [Python scripts](https://github.com/TBFY/knowledge-graph/tree/master/python-scripts) using the [Slurm workload manager](https://slurm.schedmd.com/documentation.html).

The Python script [generate_submit_slurm_job](https://github.com/TBFY/knowledge-graph/blob/master/python-scripts/generate_submit_slurm_job.py) generates a Slurm script similar to the [ingest_data_job.sh](https://github.com/TBFY/knowledge-graph/blob/master/slurm-scripts/ingest_data_job.sh) and then submits it as a job. Some settings/variables in the Python code, e.g. `homedir`, `script_file` and `env_file`, has to be changed/customized in order to make it work on your specific environment.
