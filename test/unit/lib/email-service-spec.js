'use strict';

const path = require('path');
const data = require('../../fixtures/data');
const proxyquire = require('proxyquire');

describe('Email Service', () => {
  let emailService;
  let EmailService;
  let Emailer;
  let express;
  let hoganExpressStrict;
  let traverse;

  beforeEach(() => {
    express = sinon.stub();
    hoganExpressStrict = sinon.stub();
    traverse = sinon.stub().returns({});
    Emailer = sinon.stub();
    EmailService = proxyquire('../../../lib/email-service', {
      express,
      'hogan-express-strict': hoganExpressStrict,
      'express-partial-templates/lib/traverse': traverse,
      './emailer': Emailer
    });
  });

  describe('init', () => {
    beforeEach(() => {
      sinon.stub(EmailService.prototype, '_initApp');
      sinon.stub(EmailService.prototype, '_includeDate');
      sinon.stub(EmailService.prototype, '_initEmailer');
    });

    afterEach(() => {
      EmailService.prototype._initApp.restore();
      EmailService.prototype._includeDate.restore();
      EmailService.prototype._initEmailer.restore();
    });

    it('calls _initApp', () => {
      emailService = new EmailService({data});
      EmailService.prototype._initApp.should.have.been.calledOnce;
    });

    it('calls _initEmailer', () => {
      emailService = new EmailService({data});
      EmailService.prototype._initEmailer.should.have.been.calledOnce;
    });

    it('calls _includeDate', () => {
      emailService = new EmailService({data});
      EmailService.prototype._includeDate.should.have.been.calledOnce;
    });

    it('throws an error if options not provided', () => {
      chai.expect(() => new EmailService(null)).to.throw(/^No options provided$/);
    });

    it('throws an error if data not provided', () => {
      chai.expect(() => new EmailService({})).to.throw(/^No data provided$/);
    });

    it('doesn\'t call _includeDate if options.includeDate is false', () => {
      emailService = new EmailService({data, includeDate: false});
      EmailService.prototype._includeDate.should.not.have.been.called;
    });

    it('sets subject to email-service instance if passed object', () => {
      const subject = {
        customer: '',
        caseworker: ''
      };
      emailService = new EmailService({data, subject});
      emailService.subject.should.be.equal(subject);
    });

    it('sets customer and caseworker subject to email-service instance if passed string', () => {
      const subject = 'a subject';
      emailService = new EmailService({data, subject});
      emailService.subject.customer.should.be.equal(subject);
      emailService.subject.caseworker.should.be.equal(subject);
    });

    describe('public methods', () => {
      beforeEach(() => {
        emailService = new EmailService({data});
      });

      describe('sendEmails()', () => {
        beforeEach(() => {
          sinon.stub(EmailService.prototype, 'sendEmail');
        });

        afterEach(() => {
          EmailService.prototype.sendEmail.restore();
        });

        it('returns a promise', () => {
          emailService.sendEmails().should.be.an.instanceOf(Promise);
        });

        it('resolves once sendEmail has resolved twice', () => {
          EmailService.prototype.sendEmail.returns(new Promise(resolve => resolve()));
          return emailService.sendEmails().then(() =>
            EmailService.prototype.sendEmail.should.have.been.calledTwice
          );
        });
      });

      describe('sendEmail()', () => {
        beforeEach(() => {
          emailService.subject = {
            customer: 'A customer email',
            caseworker: 'A caseworker email'
          };
          emailService.emailer = {
            sendEmail: sinon.stub().yields(null, 'info')
          };
          sinon.stub(console, 'info');
          sinon.stub(console, 'error');
          sinon.stub(EmailService.prototype, '_renderTemplate').returns(new Promise(resolve => resolve('html')));
        });

        afterEach(() => {
          EmailService.prototype._renderTemplate.restore();
          console.error.restore();
          console.info.restore();
        });

        it('returns a promise', () => {
          emailService.sendEmail().should.be.an.instanceOf(Promise);
        });

        it('calls _renderTemplate twice', () =>
          emailService.sendEmail().then(() =>
            EmailService.prototype._renderTemplate.should.have.been.calledTwice
          )
        );

        it('calls emailer.sendEmail passing to address, customer subject and rendered templates', () =>
          emailService.sendEmail('sterling@archer.com', 'customer').then(() =>
            emailService.emailer.sendEmail.should.have.been.calledOnce
              .and.calledWith('sterling@archer.com', 'A customer email', ['html', 'html'])
          )
        );

        it('calls emailer.sendEmail passing to address, caseworker subject and rendered templates', () =>
          emailService.sendEmail('sterling@archer.com', 'caseworker').then(() =>
            emailService.emailer.sendEmail.should.have.been.calledOnce
              .and.calledWith('sterling@archer.com', 'A caseworker email', ['html', 'html'])
          )
        );

        it('logs to the console when an email is successfully sent', () =>
          emailService.sendEmail('sterling@archer.com').then(() =>
            console.info.should.have.been.calledWithExactly('Email sent')
          )
        );

        it('catches errors bubbled from emailer', () => {
          emailService.emailer.sendEmail.yields(new Error('oops'));
          return emailService.sendEmail('sterling@archer.com').catch(err =>
            err.should.be.an.instanceOf(Error)
          );
        });

        it('logs errors to the console', () => {
          const err = new Error('oops');
          emailService.emailer.sendEmail.yields(err);
          return emailService.sendEmail('sterling@archer.com').catch(() =>
            console.error.should.have.been.calledWithExactly('Error sending email')
          );
        });

        it('catches errors bubbled from _renderTemplate', () => {
          const err = new Error('oops');
          EmailService.prototype._renderTemplate.returns(new Promise((resolve, reject) => reject(err)));
          return emailService.sendEmail('sterling@archer.com').catch(error =>
            error.should.be.an.instanceOf(Error)
          );
        });
      });
    });

    describe('private methods', () => {
      beforeEach(() => {
        emailService = new EmailService({data});
      });

      describe('_initApp()', () => {
        let app;
        beforeEach(() => {
          app = {
            set: sinon.stub(),
            engine: sinon.stub(),
            enable: sinon.stub(),
            get: sinon.stub().returns('/path/to/views')
          };
          express.returns(app);
          EmailService.prototype._initApp.restore();
          emailService._initApp();
        });

        afterEach(() => {
          sinon.stub(EmailService.prototype, '_initApp');
        });

        it('initialises a new express instance', () => {
          express.should.have.been.calledOnce;
        });

        it('attaches the return value of express to the service', () => {
          emailService.app.should.be.equal(app);
        });

        it('sets the app view engine property to html', () => {
          emailService.app.set.firstCall.should.have.been.calledWithExactly('view engine', 'html');
        });

        it('sets the app view property to the views path', () => {
          const viewsPath = path.resolve(__dirname, '../../../views');
          emailService.app.set.secondCall.should.have.been.calledWithExactly('views', viewsPath);
        });

        it('sets the app engine html property to hoganExpressStrict', () => {
          emailService.app.engine.should.have.been.calledWithExactly('html', hoganExpressStrict);
        });

        it('enables view cache', () => {
          emailService.app.enable.should.have.been.calledWithExactly('view cache');
        });

        it('sets partials on the emailService instance', () => {
          emailService.partials.should.be.ok;
        });

        it('gets the views from the app', () => {
          emailService.app.get.should.have.been.calledWithExactly('views');
        });

        it('calls traverse with the views directory', () => {
          traverse.should.have.been.calledWithExactly('/path/to/views');
        });
      });

      describe('_initEmailer()', () => {
        beforeEach(() => {
          EmailService.prototype._initEmailer.restore();
        });

        afterEach(() => {
          sinon.stub(EmailService.prototype, '_initEmailer');
        });

        it('calls Emailer', () => {
          emailService._initEmailer();
          Emailer.should.have.been.calledOnce;
        });

        it('attaches an emailer instance to the emailService', () => {
          Emailer.returns({});
          emailService._initEmailer();
          emailService.emailer.should.be.ok;
        });
      });

      describe('_includeDate()', () => {
        beforeEach(() => {
          sinon.stub(global, 'Date').returns({
            toUTCString: sinon.stub().returns('00:00:00 01/01/2001')
          });
          EmailService.prototype._includeDate.restore();
          emailService.data = [{
            fields: [{
              label: 'a-field',
              value: 'A Value'
            }]
          }];
          emailService._includeDate();
        });

        afterEach(() => {
          Date.restore();
          sinon.stub(EmailService.prototype, '_includeDate');
        });

        it('inits a new Date object', () => {
          Date.should.have.been.calledOnce;
        });

        it('prepends a new field to the email service data', () => {
          emailService.data[0].fields.length.should.be.equal(2);
        });

        it('adds the UTC date returned', () => {
          emailService.data[0].fields[0].should.be.eql({
            label: 'Submission Date',
            value: '00:00:00 01/01/2001'
          });
        });
      });

      describe('_renderTemplate()', () => {
        beforeEach(() => {
          emailService.app = {
            render: sinon.stub().yields()
          };
          emailService.subject = {
            customer: 'customer subject',
            caseworker: 'caseworker subject'
          };
        });

        it('returns a promise', () => {
          emailService._renderTemplate().should.be.an.instanceOf(Promise);
        });

        it('calls the render method of the app', () =>
          emailService._renderTemplate().then(() =>
            emailService.app.render.should.have.been.calledOnce
          )
        );

        it('passes template, subject, recipient and data to the render method of the app', () => {
          const dummyData = {};
          return emailService._renderTemplate('template', 'customer', dummyData).then(() =>
            emailService.app.render.should.have.been.calledWith('template', {
              data: dummyData,
              intro: undefined,
              subject: 'customer subject',
              outro: undefined,
              partials: undefined
            })
          );
        });

        it('resolves with html on successful calls', () => {
          emailService.app.render.yields(null, '<div>html</div>');
          return emailService._renderTemplate().then(html =>
            html.should.be.equal('<div>html</div>')
          );
        });

        it('rejects with an error on unsuccessful calls', () => {
          emailService.app.render.yields(new Error('oops'));
          return emailService._renderTemplate().catch(err =>
            err.should.be.an.instanceOf(Error)
          );
        });
      });
    });
  });
});
