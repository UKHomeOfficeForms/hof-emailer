'use strict';

const steps = require('../fixtures/steps');
const fields = require('../fixtures/fields');
const config = Object.assign({}, require('../fixtures/config'));
const data = Object.assign({}, require('../fixtures/data'));

const EmailService = require('../../');

describe('HOF Emailer', () => {
  let emailService;

  beforeEach(() => {
    emailService = new EmailService(Object.assign(config, {data, steps, fields}));
  });

  it('sends emails', done => {
    emailService.sendEmails().then(info => {
      info[0].response.should.be.an.instanceOf(Buffer);
      info[1].response.should.be.an.instanceOf(Buffer);
      done();
    });
  });

  it('contains data passed', done => {
    emailService.sendEmails().then(info => {
      const response = info[0].response.toString('utf-8');

      response.should.contain('123 Example Street\nCroydon');
      response.should.contain('Some text to find from within the email');
      done();
    });
  });

  describe('Template Rendering', () => {
    describe('Raw Template', () => {
      let output;
      beforeEach(done => {
        emailService._renderTemplate('raw', 'customer', emailService.data).then(html => {
          output = html.trim().split('\n').map(line => line.trim());
          done();
        });
      });

      it('contains both customer intro paragraphs', () => {
        output.includes(config.intro.customer[0]).should.be.true;
        output.includes(config.intro.customer[1]).should.be.true;
      });
    });
  });
});
