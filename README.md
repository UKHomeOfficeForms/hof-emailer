# HOF Emailer

An emailer service for HOF applications.

## Installation

```bash
$ npm install hof-emailer --save
```

## Usage

```js
// first create an emailer instance
const Emailer = require('hof-emailer');
const emailer = new Emailer({
  from: 'sender@example.com',
  transport: 'smtp',
  transportOptions: {
    host: 'my.smtp.host',
    port: 25
  }
});

// then you can use your emailer to send emails
const to = 'recipient@example.com';
const body = 'This is the email body';
const subject = 'Important email!'
emailer.send(to, body, subject)
  .then(() => {
    console.log(`Email sent to ${to}!`);
  });
```

## Options

- `from`: <String>: Address to send emails from. Required.
- `transport`: <String>: Select what mechanism to use to send emails. Defaults: 'smtp'.
- `transportOptions`: <Object>: Set the options for the chosen transport, as defined below. Required.
- `layout`: <String>: Optional path to use a custom layout for email content.

## Transports

The following transport options are available:

### `smtp`

[nodemailer-smtp-transport](https://github.com/andris9/nodemailer-smtp-transport)

#### Options

- `host` <String>: Address of the mailserver. Required.
- `port` <String|Number>: Port of the mailserver. Required.
- `ignoreTLS` <Boolean>: Defaults to false.
- `secure` <Boolean>: Defaults to true.
- `auth.user` <String>: Mailserver authorisation username.
- `auth.pass` <String>: Mailserver authorisation password.

### `ses`
[nodemailer-ses-transport](https://github.com/andris9/nodemailer-ses-transport)

#### Options

- `accessKeyId` <String>: AWS accessKeyId. Required.
- `secretAccessKey` <String>: AWS accessKeyId. Required.
- `sessionToken` <String>
- `region` <String>. Defaults to 'eu-west-1'.
- `httpOptions` <String>
- `rateLimit` <String>
- `maxConnections` <String>

### `debug`

A development option to write the html content of the email to a file for inspection.

`transport: 'debug'`

#### debug options

- `dir` <String>: The location to save html to. Default: `./.emails`. This directory will be created if it does not exist.
- `open` <Boolean>: If set to true, will automatically open the created html file in a browser.

#### debug example

```
transport: 'debug'
transportOptions: {
  dir: './emails',
  open: true
}
```
### `stub`

Disables sending email. No options are required.
