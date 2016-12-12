'use strict';

const proxyquire = require('proxyquire');

describe('Emailer', () => {
  let EmailerService;
  let emailerService;
  let nodemailer;
  let smtpTransport;
  let sesTransport;

  beforeEach(() => {
    nodemailer = {
      createTransport: sinon.stub().returns({
        sendMail: sinon.stub()
      })
    };

    smtpTransport = sinon.stub().returns({transport: sinon.stub()});
    sesTransport = sinon.stub().returns({transport: sinon.stub()});

    EmailerService = proxyquire('../../../lib/emailer', {
      nodemailer,
      '../transports': {
        smtp: smtpTransport,
        ses: sesTransport
      }
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

    it('passes options to ses transport function if transport option is \'ses\'', () => {
      const options = {
        transportType: 'ses',
        accessKeyId: 'foo',
        secretAccessKey: 'bar'
      };

      emailerService = new EmailerService(options);
      sesTransport.should.have.been.calledWith(options);
    });

    it('passes transport return value to nodemailer', () => {
      const settings = {
        transport: sinon.stub(),
        options: {
          some: 'options'
        }
      };
      smtpTransport.returns(settings);
      emailerService = new EmailerService({
        host: 'localhost',
        port: '8080'
      });
      nodemailer.createTransport.should.have.been.calledWith(settings.transport(settings.options));
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
        secure: true,
        from: 'my-from-address@somewhere.com',
        replyTo: 'reply-to@somewhere.com'
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

    it('passes from address from options', () => {
      emailerService.sendEmail(null, null, []);
      emailerService.emailer.sendMail.should.have.been.calledWith(sinon.match({
        from: 'my-from-address@somewhere.com'
      }));
    });

    it('passes replyTo address from options', () => {
      emailerService.sendEmail(null, null, []);
      emailerService.emailer.sendMail.should.have.been.calledWith(sinon.match({
        replyTo: 'reply-to@somewhere.com'
      }));
    });

    it('replyTo uses from address if no replyTo is present in the options', () => {
      const options = {
        host: '127.0.0.1',
        port: '8080',
        ignoreTLS: true,
        auth: {
          user: 'user',
          pass: 'pass'
        },
        secure: true,
        from: 'my-from-address@somewhere.com'
      };
      emailerService = new EmailerService(options);
      emailerService.sendEmail(null, null, []);
      emailerService.emailer.sendMail.should.have.been.calledWith(sinon.match({
        replyTo: 'my-from-address@somewhere.com',
        from: 'my-from-address@somewhere.com'
      }));
    });
  });
});
