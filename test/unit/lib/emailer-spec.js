'use strict';

const proxyquire = require('proxyquire');

describe('HOF Emailer', () => {
  let EmailerService;
  let emailerService;
  let nodemailer;
  let stubTransport;
  let smtpTransport;

  beforeEach(() => {
    nodemailer = {
      createTransport: sinon.stub().returns({
        sendMail: sinon.stub()
      })
    };
    stubTransport = sinon.stub();
    smtpTransport = sinon.stub();
    EmailerService = proxyquire('../../../lib/emailer', {
      nodemailer,
      'nodemailer-stub-transport': stubTransport,
      'nodemailer-smtp-transport': smtpTransport
    });
  });

  describe('Init', () => {
    it('adds options to self', () => {
      const options = {
        a: 1,
        b: 2
      };
      emailerService = new EmailerService(options);
      emailerService.options.should.be.equal(options);
    });

    it('sets transport to stubTransport if host and port are empty strings', () => {
      emailerService = new EmailerService({
        host: '',
        port: ''
      });
      emailerService.transport.should.be.equal(stubTransport);
    });

    it('sets transport to smtpTransport if host and port are set', () => {
      emailerService = new EmailerService({
        host: '127.0.0.1',
        port: '8080'
      });
      emailerService.transport.should.be.equal(smtpTransport);
    });

    it('passes options to transport', () => {
      const options = {
        host: '127.0.0.1',
        port: '8080',
        ignoreTLS: true,
        auth: {
          user: 'user',
          pass: 'pass'
        },
        secure: true
      };
      emailerService = new EmailerService(options);
      smtpTransport.should.have.been.calledWith(options);
    });

    it('passes transport return value to nodemailer', () => {
      const options = {
        some: 'options'
      };
      smtpTransport.returns(options);
      emailerService = new EmailerService({
        host: 'localhost',
        port: '8080'
      });
      nodemailer.createTransport.should.have.been.calledWith(options);
    });
  });

  describe('sendEmail', () => {
    beforeEach(() => {
      const options = {
        host: '127.0.0.1',
        port: '8080',
        ignoreTLS: true,
        auth: {
          user: 'user',
          pass: 'pass'
        },
        secure: true
      };
      emailerService = new EmailerService(options);
    });

    it('passes to address from arguments', () => {
      emailerService.sendEmail('sterling@archer.com', null, []);
      emailerService.emailer.sendMail.should.have.been.calledWith(sinon.match({
        to: 'sterling@archer.com'
      }));
    });

    it('passes subject from arguments', () => {
      emailerService.sendEmail(null, 'An Email', []);
      emailerService.emailer.sendMail.should.have.been.calledWith(sinon.match({
        subject: 'An Email'
      }));
    });
  });
});
