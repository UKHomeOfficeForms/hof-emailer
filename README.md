# HOF Emailer

An emailer service for HOF applications.

## Installation

```bash
$ npm install hof-emailer --save
```

## Usage

HOF Emailer exports a class which should be initialised with an options object containing the following config:

* steps <Object>: your step config
* fields <Object>: your field config
* data <Object>: a hash of field names and values
* groupBySection <Boolean>: group fields into sections
* subject <String>: the email subject
