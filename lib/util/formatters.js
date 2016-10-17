'use strict';

const _ = require('lodash');

module.exports = class Formatters {
  static bySection(data, steps, fields) {
    return _(steps)
      // reject all steps without locals, fields, or all fields in step are empty
      .reject(step => !step.locals || !step.fields || _.every(
        step.fields,
        field => data[field] === undefined)
      )
      // group by section
      .groupBy(step => step.locals.section)
      // flatten fields into sections bypassing steps
      .map((groupedSteps, section) => ({
          section,
          fields: _(groupedSteps)
            .map('fields')
            .flatten()
            // reject any fields with includeInEmail: false
            .reject(field => fields[field].includeInEmail === false)
            // map value to field
            .map(field => ({
              field,
              value: data[field]
            }))
            .value()
        })
      )
      .value();
  }

  static byField(data) {
    return data;
  }
};
