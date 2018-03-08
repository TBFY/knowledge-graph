Here we will provide information about the entity extractor that UPM has developed before the start of the project, called HNER.

## HNER

Repo: https://github.com/oeg-upm/hner

This is a Java library, developed as an extension over the General Architecture for Text Engineering (GATE) framework. This extension is designed to load big collections of documents, with new features to create, evaluate and store gold standards and improvements to work with other libraries such as CoreNLP, OpenNLP and Freeling. 

The NER process is mainly guided by linguistic models: gazetteers and rules. The framework provides a robust grammar engine called JAPE for recognizing patterns over documents. JAPE is a version of Common Pattern Specification Language (CPSL) and is based on finite state transducers. HNER library provides plugins and methods to ease the creation of gazetteers from external dictionaries and to support executions and evaluations of the implemented rules. The first probabilistic model implemented in the library has integrated the Conditional Random Fields (CRF) model from Mallet.

### Implementation developed for ICIJ

Repo: https://github.com/oeg-upm/ICIJ

The implementation developed for the International Consortium of Investigative Journalism (ICIJ), used in some of their projects, was focused on the recognition of the following multilingual entities over highly unstructured texts:  

*	Companies
*	Person Names
*	Countries 
*	Addresses 
*	Emails
*	Telephone/fax

### Implementation for the Spanish drug regulatory agency (AEMPS)
Repo: https://github.com/oeg-upm/AEMPS

This implementation is oriented for Spanish disease entity recognition and linking with SNOMED-CT Terminology or MedDRA dictionary, both in their Spanish version. 


