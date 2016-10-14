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

  it('sends emails', done => {
    emailer.sendEmails().then(info => {
      info[0].response.should.be.an.instanceOf(Buffer);
      info[1].response.should.be.an.instanceOf(Buffer);
      done();
    });
  });

  it('contains data passed', done => {
    emailer.sendEmails().then(info => {
      const response = info[0].response.toString('utf-8');

      response.should.contain('123 Example Street\nCroydon');
      response.should.contain('Some text to find from within the email');
      done();
    }).catch(err => {
      console.log(err);
    });
  });
});
