// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const schemaValidator = require('../../schema-validator')
const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const SchemaValidationError = require('../../schema-validation-error')

/* eslint-env jest */
it('schema validation succeeds', async () => {
  expect.assertions(1)
  const exampleFile = path.resolve(__dirname, '..', '..', '..', 'examples', 'config-example.yml')
  const example = yaml.safeLoad(fs.readFileSync(exampleFile))
  expect(() => { schemaValidator(example) }).not.toThrowError()
})

it('schema validation fails', async () => {
  expect.assertions(1)
  const exampleFile = path.resolve(__dirname, '..', 'data', 'config-negative-example.yml')
  const example = yaml.safeLoad(fs.readFileSync(exampleFile))
  expect(() => { schemaValidator(example) }).toThrowError(SchemaValidationError)
})
