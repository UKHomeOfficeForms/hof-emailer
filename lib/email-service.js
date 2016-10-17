'use strict';

const path = require('path');
const _ = require('lodash');
const express = require('express');
const hoganExpressStrict = require('hogan-express-strict');
const traverse = require('express-partial-templates/lib/traverse');

const Emailer = require('./emailer');
const Formatters = require('./util/formatters');

module.exports = class EmailerService {
  constructor(options) {
    if (!options) {
      throw new Error('No options provided');
    }

    this.emailerOptions = _.pick(options, [
      'host',
      'port',
      'ignoreTLS',
      'auth',
      'secure',
      'from',
      'replyTo'
    ]);

    const formatter = options.groupBySection ? 'bySection' : 'byField';
    this.data = Formatters[formatter](options.data, options.steps, options.fields);

    if (!this.data) {
      throw new Error('No data provided');
    }
    this.customerEmail = options.customerEmail;
    this.caseworkerEmail = options.caseworkerEmail;
    this.subject = options.subject;
    this._initApp();
    this._initEmailer();
    if (options.includeDate !== false) {
      this._includeDate();
    }
  }

  sendEmails() {
    return Promise.all([
      this.sendEmail(this.caseworkerEmail, 'caseworker', this.data),
      this.sendEmail(this.customerEmail, 'customer', this.data)
    ]);
  }

  sendEmail(to, recipient, data) {
    return new Promise((resolve, reject) => {
      Promise.all([
        this._renderTemplate('formatted', recipient, data),
        this._renderTemplate('raw', recipient, data),
      ]).then(values => {
        this.emailer.sendEmail(to, this.subject, values, (err, info) => {
          if (err) {
            // eslint-disable-next-line no-console
            console.error('Error sending email to:', to, err);
            return reject(err);
          }
          // eslint-disable-next-line no-console
          console.info('Email sent to', to, info);
          return resolve(info);
        });
      }, err => reject(err));
    });
  }

  _initApp() {
    this.app = express();
    this.app.set('view engine', 'html');
    this.app.set('views', path.resolve(__dirname, '../views'));
    this.app.engine('html', hoganExpressStrict);
    this.app.enable('view cache');
    this.partials = traverse(this.app.get('views'));
  }

  _initEmailer() {
    this.emailer = new Emailer(this.emailerOptions);
  }

  _includeDate() {
    _.first(this.data).fields.unshift({
      field: 'submission-date',
      value: (new Date()).toUTCString()
    });
  }

  _renderTemplate(template, recipient, data) {
    return new Promise((resolve, reject) => {
      this.app.render(template, {
        recipient,
        data,
        partials: this.partials
      }, (err, html) => {
        if (err) {
          return reject(err);
        }
        return resolve(html);
      });
    });
  }
};
