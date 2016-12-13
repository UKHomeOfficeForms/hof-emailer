'use strict';

const path = require('path');
const nodemailer = require('nodemailer');
const transports = require('../transports');

module.exports = class Emailer {

  constructor(options) {
    this.options = options;

    options.transportType = options.transportType || 'smtp';

    const settings = transports[options.transportType](options);
    this.transport = settings.transport;

    // eslint-disable-next-line no-console
    console.log('Using', options.transportType, 'transport');

    this.emailer = nodemailer.createTransport(this.transport(settings.options));
  }

  sendEmail(to, subject, values, callback) {
    this.emailer.sendMail({
      to,
      subject,
      from: this.options.from,
      replyTo: this.options.replyTo || this.options.from,
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
