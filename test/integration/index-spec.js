'use strict';

const _ = require('lodash');
const DOMParser = require('xmldom').DOMParser;
const config = require('../fixtures/config');
const data = require('../fixtures/data');

const EmailService = require('../../');

const parser = new DOMParser();

describe('HOF Emailer', () => {
  let emailService;

  beforeEach(() => {
    emailService = new EmailService(Object.assign({}, config, {data}));
  });

  it('sends emails', () =>
    emailService.sendEmails().then(info => {
      info[0].response.should.be.an.instanceOf(Buffer);
      info[1].response.should.be.an.instanceOf(Buffer);
    })
  );

  it('contains data passed', () =>
    emailService.sendEmails().then(info => {
      const response = info[0].response.toString('utf-8');

      response.should.contain('123 Example Street, Croydon');
      response.should.contain('Some text to find from within the email');
    })
  );

  describe('Template Rendering', () => {
    describe('Raw Template', () => {
      let output;
      beforeEach(() =>
        emailService._renderTemplate('raw', 'customer', emailService.data).then(html => {
          output = html.trim().split('\n').map(line => line.trim());
        })
      );

      it('contains both customer intro paragraphs', () => {
        config.customerIntro.forEach(paragraph => {
          (output.indexOf(paragraph) > -1).should.be.true;
        });
      });

      it('contains the customer subject', () => {
        output.should.contain(config.subject.customer);
      });

      it('contains all labels and values from passed config', () => {
        const formatted = _.map(_.flatten(_.map(data, 'fields')), field => `${field.label}: ${field.value}`);
        formatted.forEach(line => (output.indexOf(line) > -1).should.be.true);
      });
    });

    describe('Formatted Email', () => {
      let document;
      beforeEach(() =>
        emailService._renderTemplate('formatted', 'customer', emailService.data).then(html => {
          document = parser.parseFromString(html, 'text/html');
        })
      );

      describe('DocumentType', () => {
        let doctype;
        beforeEach(() => {
          doctype = document.childNodes[0];
        });

        it('has a html as nodeName', () => {
          doctype.nodeName.should.be.equal('html');
        });

        it('has the correct publicId', () => {
          doctype.publicId.should.be.equal('-//W3C//DTD XHTML 1.0 Transitional//EN');
        });

        it('has the correct systemId', () => {
          doctype.systemId.should.be.equal('http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd');
        });
      });

      describe('Content', () => {
        let contentTable;
        let rows;
        beforeEach(() => {
          contentTable = document.getElementById('main-content');
          rows = Array.prototype.filter.call(contentTable.childNodes, node =>
            node.nodeName === 'tr'
          );
        });

        it('contains the correct amount of rows (fields + intro + outro)', () => {
          const fieldRows = _.flatten(_.map(data, 'fields')).length;
          const introRows = config.customerIntro.length;
          const outroRows = config.customerOutro.length;
          rows.length.should.be.equal(fieldRows + introRows + outroRows);
        });
      });
    });
  });
});
