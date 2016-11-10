'use strict';

const transport = require('nodemailer-ses-transport');
const stub = require('nodemailer-stub-transport');

module.exports = (options) => {

  const settings = {
    transport: transport
  };

  const opts = {
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey
  };

  if (!opts.accessKeyId && !opts.secretAccessKey) {
    settings.transport = stub;
  } else {
    opts.region = options.region || 'eu-west-1';

    if (options.sessionToken) {
      opts.sessionToken = options.sessionToken;
    }

    if (options.httpOptions) {
      opts.httpOptions = options.httpOptions;
    }

    if (options.rateLimit !== undefined) {
      opts.rateLimit = options.rateLimit;
    }

    if (options.maxConnections !== undefined) {
      opts.maxConnections = options.maxConnections;
    }
  }

  settings.options = opts;

  return settings;
};