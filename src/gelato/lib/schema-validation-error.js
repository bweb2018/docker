// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

class SchemaValidationError extends Error {
  constructor (message, evalutionDetails) {
    super(message)
    this.message = message
    this.validationDetails = evalutionDetails
    this.name = 'SchemaValidation'
  }
}

module.exports = SchemaValidationError
