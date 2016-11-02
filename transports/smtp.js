'use strict';

const smtp = require('nodemailer-smtp-transport');
const stub = require('nodemailer-stub-transport');

module.exports = (options) => {
  const settings = {};
  const opts = {
    host: options.host,
    port: options.port,
    ignoreTLS: options.ignoreTLS === true || false,
    secure: options.secure !== false || false
  };

  settings.transport = opts.host === '' && opts.port === '' ? stub : smtp;

  if (options.auth && options.auth.user && options.auth.pass) {
    opts.auth = options.auth;
  }

  settings.options = opts;

  return settings;
};
