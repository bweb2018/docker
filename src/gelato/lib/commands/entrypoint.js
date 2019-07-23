// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const _ = require('lodash')

const steps = require('../steps')

function buildSteps (config) {
  if (_.isEmpty(config.entrypoint_steps)) {
    return []
  }

  const result = []

  for (const step of config.entrypoint_steps) {
    const builder = steps[step.step_type]
    if (_.isNil(builder)) {
      throw Error(`cannot find step builder: '${step.type}'`)
    }
    if (!builder.command.includes('entrypoint')) {
      throw Error(`Step ${step.type} doesn't support ENTRYPOINT`)
    }
    if (!builder.os.includes(config.base_docker.os)) {
      throw Error(`Step ${step.type} doesn't support ${config.base_docker.os} OS`)
    }
    result.push(...builder.build(step))
  }

  return [`ENTRYPOINT ${result.join(` && \\ \n${' '.repeat(11)}`)}`]
}

module.exports = {
  type: 'entrypoint_steps',
  build: buildSteps
}
