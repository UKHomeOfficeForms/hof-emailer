'use strict';

const path = require('path');
const nodemailer = require('nodemailer');
const stubTransport = require('nodemailer-stub-transport');
const smtpTransport = require('nodemailer-smtp-transport');

module.exports = class EmailService {
  constructor(options) {
    this.options = options;

    const emailOptions = {
      host: options.host,
      port: options.port,
      ignoreTLS: options.ignoreTLS
    };

    if (options.auth && options.auth.user && options.auth.pass) {
      emailOptions.auth = options.auth;
    }

    if (options.secure) {
      emailOptions.secure = options.secure;
    }

    this.transport = options.host === '' && options.port === ''
      ? stubTransport
      : smtpTransport;
    this.emailer = nodemailer.createTransport(this.transport(emailOptions));
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
