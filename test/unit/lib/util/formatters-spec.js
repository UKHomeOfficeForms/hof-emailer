'use strict';

const _ = require('lodash');
const Formatters = require('../../../../lib/util/formatters');
const fixtures = {
  data: Object.assign({}, require('../../../fixtures/data')),
  fields: Object.assign({}, require('../../../fixtures/fields')),
  steps: Object.assign({}, require('../../../fixtures/steps'))
};

describe('Data Formatters', () => {
  describe('bySection', () => {
    let result;
    describe('Simple Use', () => {
      beforeEach(() => {
        const data = {
          'field-1': 'Field 1 Value',
          'field-2': 'Field 2 Value',
          'field-x': 'Field x Value',
          'field-3': 'Field 3 Value',
          'field-4': 'Field 4 Value'
        };
        const steps = {
          'step-1': {
            fields: [
              'field-1'
            ],
            locals: {
              section: 'section-1'
            }
          },
          'step-2': {
            fields: [
              'field-2',
              'field-x'
            ],
            locals: {
              section: 'section-1'
            }
          },
          'step-3': {
            fields: [
              'field-3',
              'field-4'
            ],
            locals: {
              section: 'section-2'
            }
          },
          'step-4': {
            fields: [
              'field-5',
              'field-6'
            ],
            locals: {
              section: 'section-2'
            }
          }
        };
        const fields = {
          'field-1': {},
          'field-2': {},
          'field-x': {},
          'field-3': {},
          'field-4': {
            includeInEmail: false
          }
        };
        result = Formatters.bySection(data, steps, fields);
      });

      it('returns an array', () => {
        result.should.be.an('array');
      });

      it('contains 2 items', () => {
        result.length.should.be.equal(2);
      });

      describe('First child', () => {
        let child;
        beforeEach(() => {
          child = result[0];
        });

        it('has a section property equal to section-1', () => {
          child.should.have.property('section').and.be.equal('section-1');
        });

        it('has a fields property with 3 items', () => {
          child.should.have.property('fields')
            .and.have.property('length')
            .and.be.equal(3);
        });

        it('contains the correct fields', () => {
          child.fields.should.be.eql([
            {field: 'field-1', value: 'Field 1 Value'},
            {field: 'field-2', value: 'Field 2 Value'},
            {field: 'field-x', value: 'Field x Value'}
          ]);
        });
      });

      describe('Second child', () => {
        let child;
        beforeEach(() => {
          child = result[1];
        });

        it('has a section property equal to section-2', () => {
          child.should.have.property('section').and.be.equal('section-2');
        });

        it('has a fields property with 1 items', () => {
          child.should.have.property('fields')
            .and.have.property('length')
            .and.be.equal(1);
        });

        it('doesn\'t contain fields with includeInEmail: false', () => {
          const result = child.fields.find(field => field.field === 'field-4');
          chai.expect(result).to.be.undefined;
        });

        it('contains the correct fields', () => {
          child.fields.should.be.eql([
            {field: 'field-3', value: 'Field 3 Value'},
          ]);
        });
      });
    });

    describe('Complex Use', () => {
      beforeEach(() => {
        result = Formatters.bySection(fixtures.data, fixtures.steps, fixtures.fields);
      });

      it('contains 3 sections', () => {
        result.length.should.be.equal(3);
      });

      describe('First Section', () => {
        let child;
        beforeEach(() => {
          child = result[0];
        });

        it('has a section property equal to \'enquiry-details\'', () => {
          child.should.have.property('section')
            .and.be.equal('enquiry-details');
        });

        it('contains 11 fields', () => {
          child.should.have.property('fields')
            .and.have.property('length')
            .and.be.equal(11);
        });

        it('contains the correct fields and values', () => {
          _.sortBy(child.fields, 'field').should.be.eql(_.sortBy([
            {field: 'about-radio', value: 'Wrong Certificate'},
            {field: 'type-radio', value: 'birth'},
            {field: 'additional-names', value: 'Additional Names'},
            {field: 'additional-text', value: 'Some additional text'},
            {field: 'additional-radio', value: 'yes'},
            {field: 'details-text', value: 'Some further details'},
            {field: 'existing-radio', value: 'no'},
            {field: 'previous-radio', value: 'no'},
            {field: 'person-one', value: 'A name'},
            {field: 'person-two', value: 'Another name'},
            {field: 'person-text', value: 'Some text to find from within the email'}
          ], 'field'));
        });
      });

      describe('Second section', () => {
        let child;
        beforeEach(() => {
          child = result[1];
        });

        it('has a section property equal to \'order-details\'', () => {
          child.should.have.property('section')
            .and.be.equal('order-details');
        });

        it('contains 6 fields', () => {
          child.should.have.property('fields')
            .and.have.property('length')
            .and.be.equal(6);
        });

        it('contains the correct fields and values', () => {
          _.sortBy(child.fields, 'field').should.be.eql(_.sortBy([
            {field: 'how-radio', value: 'post'},
            {field: 'online-toggle-text', value: '12345'},
            {field: 'telephone-toggle-text', value: 'abcde'},
            {field: 'telephone-toggle-text-2', value: 'abc123'},
            {field: 'when-date', value: '01/01/2001'},
            {field: 'which-radio', value: 'post'}
          ], 'field'));
        });
      });

      describe('Third Section', () => {
        let child;
        beforeEach(() => {
          child = result[2];
        });

        it('has a section property equal to \'contact-details\'', () => {
          child.should.have.property('section')
            .and.be.equal('contact-details');
        });

        it('contains 6 fields', () => {
          child.should.have.property('fields')
            .and.have.property('length')
            .and.be.equal(5);
        });

        it('contains the correct fields and values', () => {
          _.sortBy(child.fields, 'field').should.be.eql(_.sortBy([
            {field: 'address-textarea', value: '123 Example Street\nCroydon'},
            {field: 'country-select', value: 'United Kingdom'},
            {field: 'email-text', value: 'sterling@archer.com'},
            {field: 'name-text', value: 'Sterling Archer'},
            {field: 'postcode-code', value: 'CR0 1ND'}
          ], 'field'));
        });
      });
    });
  });
});
