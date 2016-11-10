'use strict';

const proxyquire = require('proxyquire');

describe('transports/smtp', () => {

  let nodemailerSmtpTransport;
  let nodemailerStubTransport;
  let smtpTransport;

  beforeEach(() => {

    nodemailerSmtpTransport = sinon.stub();
    nodemailerStubTransport = sinon.stub();

    smtpTransport = proxyquire('../../../transports/smtp', {
      'nodemailer-smtp-transport': nodemailerSmtpTransport,
      'nodemailer-stub-transport': nodemailerStubTransport
    });
  });

  it('returns the smtp transport', () => {
    const options = {
      host: '1.1.1.1',
      port: '8080'
    };
    smtpTransport(options).transport.should.equal(nodemailerSmtpTransport);
  });

  it('returns the stub transport if no host and port are passed', () => {
    const options = {
      host: '',
      port: ''
    };
    smtpTransport(options).transport.should.equal(nodemailerStubTransport);
  });

  it('returns options that are passed', () => {
    const options = {
      host: '1.1.1.1',
      port: '8080',
      auth: {
        user: 'foo',
        pass: 'bar'
      },
      secure: true,
      ignoreTLS: false
    };
    smtpTransport(options).options.should.deep.equal(options);
  });

  it('returns implicit values only for boolean options that are not passed', () => {
    const options = {
      host: '1.1.1.1',
      port: '8080',
    };
    smtpTransport(options).options.should.have.property('ignoreTLS').and.equal(false);
    smtpTransport(options).options.should.have.property('secure').and.equal(true);
    smtpTransport(options).options.should.not.have.property('auth');
  });

  it('secure option defaults to true', () => {
    const options = {
      host: '1.1.1.1',
      port: '8080',
      auth: {
        user: 'foo',
        pass: 'bar'
      },
      ignoreTLS: false
    };
    smtpTransport(options).options.secure.should.equal(true);
  });

  it('ignoreTLS option defaults to false', () => {
    const options = {
      host: '1.1.1.1',
      port: '8080',
      auth: {
        user: 'foo',
        pass: 'bar'
      },
      secure: true
    };
    smtpTransport(options).options.ignoreTLS.should.equal(false);
  });

});
