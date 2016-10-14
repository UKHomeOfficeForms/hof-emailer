'use strict';

const steps = require('../fixtures/steps');
const fields = require('../fixtures/fields');
const config = Object.assign({}, require('../fixtures/config'));
const data = Object.assign({}, require('../fixtures/data'));

const Emailer = require('../../');

describe('HOF Emailer', () => {
  let emailer;

  beforeEach(() => {
    emailer = new Emailer(Object.assign(config, { data, steps, fields }));
  });

  it('does something', () => {
    emailer.sendEmails()
  });
});
