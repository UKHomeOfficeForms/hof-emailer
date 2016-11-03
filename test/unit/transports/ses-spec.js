'use strict';

const proxyquire = require('proxyquire');
const _ = require('lodash');

describe('transports/ses', () => {

  let nodemailerSesTransport;
  let sesTransport;

  beforeEach(() => {

    nodemailerSesTransport = sinon.stub();

    sesTransport = proxyquire('../../../transports/ses', {
      'nodemailer-ses-transport': nodemailerSesTransport,
    });
  });

  it('returns the ses transport', () => {
    const options = {
      accessKeyId: 'foo',
      secretAccessKey: 'bar'
    };
    sesTransport(options).transport.should.equal(nodemailerSesTransport);
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

});
