# HOF Emailer

An emailer service for HOF applications.

## Installation

```bash
$ npm install hof-emailer --save
```

## Usage

HOF Emailer exports a class which should be initialised with an options object containing the following config, which is used to build the email content.

* `steps` <Object>: your step config
* `fields` <Object>: your field config
* `data` <Object>: a hash of field names and values
* `groupBySection` <Boolean>: group fields into sections
* `subject` <String>: the email subject

## Options

- `transportType`: <String>: Defaults to 'smtp' - nodemailer-smtp-transport. Also available is 'ses' - nodemailer-ses-transport.

### smtp options
[nodemailer-smtp-transport](https://github.com/andris9/nodemailer-smtp-transport)

- `host` <String>: Address of the mailserver. Required.
- `port` <String|Number>: Port of the mailserver. Required.
- `ignoreTLS` <Boolean>: Defaults to false.
- `secure` <Boolean>: Defaults to true.
- `auth.user` <String>: Mailserver authorisation username.
- `auth.pass` <String>: Mailserver authorisation password.

If `host` and `port` are not set, transport used is [nodemailer-stub-transport](https://github.com/andris9/nodemailer-stub-transport).

### ses (AWS Simple Email Server API) options
[nodemailer-ses-transport](https://github.com/andris9/nodemailer-ses-transport)

- `accessKeyId` <String>: AWS accessKeyId. Required.
- `secretAccessKey` <String>: AWS accessKeyId. Required.
- `sessionToken` <String>
- `region` <String>. Defaults to 'eu-west-1'.
- `httpOptions` <String>
- `rateLimit` <String>
- `maxConnections` <String>

If `accessKeyId` and `secretAccessKey` are not set, transport used is [nodemailer-stub-transport](https://github.com/andris9/nodemailer-stub-transport).
