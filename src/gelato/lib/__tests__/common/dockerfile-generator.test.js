// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const gelato = require('../..')
const SchemaValidationError = require('../../schema-validation-error')
const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')

/* eslint-env jest */
it('throws schema validation error', async () => {
  const templateFile = path.resolve(__dirname, '..', 'data', 'config-negative-example.yml')
  const template = yaml.safeLoad(fs.readFileSync(templateFile))
  expect(() => gelato(template)).toThrow(SchemaValidationError)
})

it.each([
  path.resolve(__dirname, '..', '..', '..', 'examples', 'config-example.yml'),
  path.resolve(__dirname, '..', 'data', 'install-conda.yml'),
  path.resolve(__dirname, '..', 'data', 'install-python.yml'),
  path.resolve(__dirname, '..', 'data', 'pip-install.yml'),
  path.resolve(__dirname, '..', 'data', 'hdfs-download-insecure.yml'),
  path.resolve(__dirname, '..', 'data', 'hdfs-download-token.yml')
])('generates dockerfile successfully', async (filePath) => {
  const template = yaml.safeLoad(fs.readFileSync(filePath))
  try {
    const result = gelato(template)
    expect(typeof result).toBe('string')
  } catch (e) {
    if (e instanceof SchemaValidationError) {
      console.log(`${e.message}, details:`)
      console.log(e.validationDetails)
    } else {
      console.log(e)
    }
    throw new Error(e)
  }
})
