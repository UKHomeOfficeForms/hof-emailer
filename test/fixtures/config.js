'use strict';

module.exports = {
  host: '',
  port: '',
  ignoreTLS: true,
  auth: {
    user: 'user',
    pass: 'pass'
  },
  secure: false,
  includeInEmail: true,
  from: 'sterling@archer.com',
  groupBySection: true,
  customerEmail: 'customer@hotmail.com',
  caseworker: 'caseworker@digital.homeoffice.gov.uk',
  subject: {
    customer: 'GRO Email - customer',
    caseworker: 'GRO Email - caseworker'
  },
  customerIntro: [
    'This an email for the customer.',
    'This is another paragraph'
  ],
  caseworkerIntro: [
    'This is an email for the caseworker',
    'This is another paragraph'
  ],
  customerOutro: [
    'Thanks for reading.',
    'This is another paragraph'
  ]
};
