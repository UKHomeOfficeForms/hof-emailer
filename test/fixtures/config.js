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
  from: 'sterling@archer.com',
  groupBySection: true,
  customerEmail: 'customer@hotmail.com',
  caseworker: 'caseworker@digital.homeoffice.gov.uk',
  subject: 'GRO Email',
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
