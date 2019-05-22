# Data ingestion
This module contains shell scripts and documentation for converting OCDS in JSON format to CSV format as input for the [Grafterizer](https://github.com/datagraft/grafterizer-2.0) transformation, which is being used to RDFize and publish OCDS data to the Knowledge Graph.

## Process
Grafterizer is a cloud-based service that is used to create a transformation that RDFizes the OCDS data. In order to do this you follow two steps:

1. json -> csv (using `json2csv`)
2. csv -> rdf (using `Grafterizer`)

The result of this step is an executable transformation process/service that can be used to batch process OCDS data (step 3):

3. batch csv -> rdf (using `Grafterizer`)

### Converting json to csv

#### Prerequisites (install)
We use [json2csv](https://www.npmjs.com/package/json2csv) to convert ODCS in JSON format to CVS format.
This requires [Angular](https://cli.angular.io). To install the packages run the following commands:

```
npm install -g @angular/cli
npm install -g json2csv
```

#### Build (project)
Run the following commands to build a json2csv project:

```
ng new [project-name]
```

Run the included shell script to convert from JSON to CSV:

```
ocds2csv.bat
```