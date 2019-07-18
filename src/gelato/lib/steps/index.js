// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const steps = [
  require('./conda-install'),
  require('./custom'),
  require('./git').clone,
  require('./git').install,
  require('./conda'),
  require('./python').install,
  require('./python').pip_install,
  require('./hdfs').download
]

const result = {}

for (const step of steps) {
  if (result[step.type]) {
    throw Error(`Step ID ${step.type} is not unique.`)
  }

  result[step.type] = step
}

module.exports = result
