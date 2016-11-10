'use strict';

const smtp = require('nodemailer-smtp-transport');
const stub = require('nodemailer-stub-transport');

module.exports = (options) => {
  const settings = {
    transport: smtp
  };

  const opts = {
    host: options.host,
    port: options.port
  };

  if (!opts.host && !opts.port) {
    settings.transport = stub;
  } else {

    opts.ignoreTLS = options.ignoreTLS === true || false;
    opts.secure = options.secure !== false;

    if (options.auth && options.auth.user && options.auth.pass) {
      opts.auth = options.auth;
    }
  }

  settings.options = opts;

  return settings;
};
