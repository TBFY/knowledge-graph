# Slurm scripts
This module contains example Slurm scripts that can be used to run the [Python scripts](https://github.com/TBFY/knowledge-graph/tree/master/python-scripts) using the [Slurm workload manager](https://slurm.schedmd.com/documentation.html).

The Python script [generate_submit_slurm_job](https://github.com/TBFY/knowledge-graph/blob/master/python-scripts/generate_submit_slurm_job.py) generates and submits a daily Slurm job for ingesting data to the TBFY knowledge graph. The generated Slurm job is similar to the [ingest_data_job.sh](https://github.com/TBFY/knowledge-graph/blob/master/slurm-scripts/ingest_data_job.sh) example, but adjusted for daily ingestion (i.e., the start and end dates are the same). Some settings/variables in the Python code, e.g. `homedir`, `script_file` and `env_file`, has to be changed/customized in order to make it work on your specific environment.

## Cron
To schedule a Cron job edit your user-specific crontab file with the following command:
```
crontab -e
```

To schedule a daily Cron job at 03:00 add an entry similar to the following example:
```
00 03 * * * /opt/miniconda3/bin/python -u /home/bre/knowledge-graph/python-scripts/generate_submit_slurm_job.py >> /home/bre/jobs/generate_submit_slurm_job.log 2>&1
```

For more information about Cron see [Cron howto](https://help.ubuntu.com/community/CronHowto).
