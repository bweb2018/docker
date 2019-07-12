// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const Ajv = require('ajv')
const configSchema = require('../schemas/config_schema.json')
const stepSchemas = [
  require('../schemas/conda_install.json'),
  require('../schemas/custom_command.json'),
  require('../schemas/git_clone.json'),
  require('../schemas/hdfs_download.json'),
  require('../schemas/install_conda.json'),
  require('../schemas/install_git.json'),
  require('../schemas/install_python.json'),
  require('../schemas/pip_install.json')
]
const SchemaValidationError = require('./schema-validation-error')

function schemaValidator (config) {
  const ajv = new Ajv()
  const validate = ajv.addSchema(stepSchemas).compile(configSchema)
  const valid = validate(config)
  if (!valid) {
    throw new SchemaValidationError(`The config validation is not passed.`, validate.errors)
  }
}

module.exports = schemaValidator
