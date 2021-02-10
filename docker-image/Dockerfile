# Download base image for Java and extend with Python
FROM openjdk:11-jre-slim
COPY --from=python:3.7-slim / /

# Define the ENV variable
ENV OPENOPPS_USERNAME=username
ENV OPENOPPS_PASSWORD=password
ENV OPENCORPORATES_API_KEY=secret
ENV RML_FOLDER=/home/rml-mappings
ENV START_DATE=2020-01-01
ENV END_DATE=2020-12-31
ENV DAYS_DELAYED=3
ENV DAILY_SCHEDULE=03:00
ENV OUTPUT_FOLDER=/ingestion
ENV TBFY_FUSEKI_URL=http://52.19.213.234:3030
ENV TBFY_FUSEKI_DATASET=tbfy
 
# Add Python and RML files
ADD python-scripts /home/python-scripts
RUN rm /home/python-scripts/__pycache__/*
RUN rm /home/python-scripts/shelve/*
RUN rm /home/python-scripts/tbfy/__pycache__/*
ADD rml-mappings /home/rml-mappings
ADD https://github.com/RMLio/rmlmapper-java/releases/download/v4.9.1/rmlmapper-4.9.1.jar /home/rml-mappings/rmlmapper.jar

# Make ingestion dir
RUN mkdir -p /ingestion

# Install Python modules
RUN pip install requests
RUN pip install --user --trusted-host files.pythonhosted.org dpath
RUN pip install xmltodict

# Volume configuration
VOLUME ["/ingestion"]

# Change working dir and run service
WORKDIR /home/python-scripts
CMD ["python", "kg_ingestion_service.py"]
