// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const Ajv = require('ajv')

function schemaValidator (schema, data) {
  const ajv = new Ajv()
  const valid = ajv.validate(schema, data)
  if (!valid) {
    return { valid: false, errors: ajv.errors }
  } else {
    return { valid: true }
  }
}

module.exports = schemaValidator
