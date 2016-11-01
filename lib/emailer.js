'use strict';

const path = require('path');
const nodemailer = require('nodemailer');
const stubTransport = require('nodemailer-stub-transport');
const smtpTransport = require('nodemailer-smtp-transport');
let transport;

module.exports = class Emailer {

  constructor(options) {
    this.options = options;

    const emailOptions = Object.assign({
      host: options.host,
      port: options.port,
      ignoreTLS: options.ignoreTLS
    }, options.transportOpts);

    if (options.auth && options.auth.user && options.auth.pass) {
      emailOptions.auth = options.auth;
    }

    if (options.secure) {
      emailOptions.secure = options.secure;
    }

    transport = options.transport || smtpTransport;

    if (emailOptions.host === '' && emailOptions.port === '') {
      transport = stubTransport;
    }

    this.emailer = nodemailer.createTransport(this.transport(emailOptions));
  }

  get transport() {
    return transport;
  }

  sendEmail(to, subject, values, callback) {
    this.emailer.sendMail({
      to,
      subject,
      from: this.options.from,
      html: values[0],
      text: values[1],
      attachments: [{
        filename: 'govuk_logotype_email.png',
        path: path.resolve(__dirname, '../assets/images/govuk_logotype_email.png'),
        cid: 'govuk_logotype_email'
      },
      {
        filename: 'ho_crest_27px.png',
        path: path.resolve(__dirname, '../assets/images/ho_crest_27px.png'),
        cid: 'ho_crest_27px'
      },
      {
        filename: 'spacer.gif',
        path: path.resolve(__dirname, '../assets/images/spacer.gif'),
        cid: 'spacer_image'
      }]
    }, callback);
  }
};
