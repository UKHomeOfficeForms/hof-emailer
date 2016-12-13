'use strict';

const path = require('path');
const _ = require('lodash');
const express = require('express');
const hoganExpressStrict = require('hogan-express-strict');
const traverse = require('express-partial-templates/lib/traverse');

const Emailer = require('./emailer');

module.exports = class EmailService {
  constructor(options) {
    if (!options) {
      throw new Error('No options provided');
    }

    this.viewsDir = [path.resolve(__dirname, ('../views'))];

    if (options.customViews) {
      this.viewsDir = [options.customViews].concat(this.viewsDir);
    }

    this.emailerOptions = options;

    if (!options.data && options.includeInEmail) {
      throw new Error('No data provided');
    }

    this.data = options.includeInEmail ? _.cloneDeep(options.data) : '';
    this.customerEmail = options.customerEmail;
    this.caseworkerEmail = options.caseworker;
    this.subject = options.subject;
    if (typeof this.subject === 'string') {
      this.subject = {
        customer: this.subject,
        caseworker: this.subject
      };
    }
    this.intro = {
      customer: options.customerIntro,
      caseworker: options.caseworkerIntro
    };
    this.outro = {
      customer: options.customerOutro,
      caseworker: options.caseworkerOutro
    };
    this._initApp();
    this._initEmailer();
    if (options.includeDate !== false && options.includeInEmail) {
      this._includeDate();
    }
  }

  sendEmails() {
    let emails = [];
    if (this.caseworkerEmail) {
      emails.push(this.sendEmail(this.caseworkerEmail, 'caseworker', this.data));
    } else {
      // eslint-disable-next-line no-console
      console.info('No caseworker email set');
    }
    if (this.customerEmail) {
      emails.push(this.sendEmail(this.customerEmail, 'customer', this.data));
    } else {
      // eslint-disable-next-line no-console
      console.info('No customer email set');
    }
    return Promise.all(emails);
  }

  sendEmail(to, recipient, data) {
    return new Promise((resolve, reject) => {
      Promise.all([
        this._renderTemplate('formatted', recipient, data),
        this._renderTemplate('raw', recipient, data),
      ]).then(values => {
        this.emailer.sendEmail(to, this.subject[recipient], values, (err, info) => {
          if (err) {
            // eslint-disable-next-line no-console
            console.error('Error sending email');
            return reject(err);
          }
          // eslint-disable-next-line no-console
          console.info('Email sent');
          return resolve(info);
        });
      }).catch(err => reject(err));
    });
  }

  _initApp() {
    this.app = express();
    this.app.set('view engine', 'html');
    this.app.set('views', this.viewsDir);
    this.app.engine('html', hoganExpressStrict);
    this.app.enable('view cache');
    this.partials = traverse(this.app.get('views'));
  }

  _initEmailer() {
    this.emailer = new Emailer(this.emailerOptions);
  }

  _includeDate() {
    _.first(this.data).fields.unshift({
      label: 'Submission Date',
      value: (new Date()).toUTCString()
    });
  }

  _renderTemplate(template, recipient, data) {
    return new Promise((resolve, reject) => {
      this.app.render(template, {
        data,
        subject: this.subject[recipient],
        intro: this.intro[recipient],
        outro: this.outro[recipient],
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
