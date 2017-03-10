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

- `from`: <String>: address to send emails from. Required.
- `transport`: <String>: Defaults to 'smtp' - nodemailer-smtp-transport. Also available is 'ses' - nodemailer-ses-transport.
- `transportOptions`: <Object>: Set the options for the chosen transport, as defined below. Required.
- `layout`: <String>: Optional path to use a custom layout for email content.

### smtp options
[nodemailer-smtp-transport](https://github.com/andris9/nodemailer-smtp-transport)

- `host` <String>: Address of the mailserver. Required.
- `port` <String|Number>: Port of the mailserver. Required.
- `ignoreTLS` <Boolean>: Defaults to false.
- `secure` <Boolean>: Defaults to true.
- `auth.user` <String>: Mailserver authorisation username.
- `auth.pass` <String>: Mailserver authorisation password.

### ses (AWS Simple Email Server API) options
[nodemailer-ses-transport](https://github.com/andris9/nodemailer-ses-transport)

- `accessKeyId` <String>: AWS accessKeyId. Required.
- `secretAccessKey` <String>: AWS accessKeyId. Required.
- `sessionToken` <String>
- `region` <String>. Defaults to 'eu-west-1'.
- `httpOptions` <String>
- `rateLimit` <String>
- `maxConnections` <String>

