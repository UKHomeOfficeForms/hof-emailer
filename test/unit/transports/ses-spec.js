'use strict';

const proxyquire = require('proxyquire');
const _ = require('lodash');

describe('transports/ses', () => {

  let nodemailerSesTransport;
  let nodemailerStubTransport;
  let sesTransport;

  beforeEach(() => {

    nodemailerSesTransport = sinon.stub();
    nodemailerStubTransport = sinon.stub();

    sesTransport = proxyquire('../../../transports/ses', {
      'nodemailer-ses-transport': nodemailerSesTransport,
      'nodemailer-stub-transport': nodemailerStubTransport
    });
  });

  it('returns the ses transport', () => {
    const options = {
      accessKeyId: 'foo',
      secretAccessKey: 'bar'
    };
    sesTransport(options).transport.should.equal(nodemailerSesTransport);
  });

  it('returns the stub transport if no access tokens are passed', () => {
    const options = {
      accessKeyId: '',
      secretAccessKey: ''
    };
    sesTransport(options).transport.should.equal(nodemailerStubTransport);
  });

  it('returns options that are passed', () => {
    const options = {
      accessKeyId: 'foo',
      secretAccessKey: 'bar',
      sessionToken: '1234',
      region: 'world',
      httpOptions: {foo: 'bar'},
      rateLimit: 1,
      maxConnections: 1
    };
    sesTransport(options).options.should.deep.equal(options);
  });

  it('does not return options that are passed with undefined values', () => {
    const options = {
      accessKeyId: 'foo',
      secretAccessKey: 'bar',
      sessionToken: '1234',
      region: 'world',
      httpOptions: {foo: 'bar'},
      rateLimit: 0,
      maxConnections: undefined
    };
    sesTransport(options).options.should.deep.equal(_.omit(options, 'maxConnections'));
  });

  it('region options defaults to `eu-west-1`', () => {
    const options = {
      accessKeyId: 'foo',
      secretAccessKey: 'bar'
    };
    sesTransport(options).options.region.should.equal('eu-west-1');
  });

});
