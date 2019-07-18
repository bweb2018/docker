// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const _ = require('lodash')
const util = require('../util')
const steps = require('../steps')

function buildSteps (config) {
  if (_.isEmpty(config.run_steps)) {
    return []
  }

  const result = [
    'apt-get update',
    util.aptInstall('apt-utils'),
    'touch ~/.bashrc',
    'mv ~/.bashrc ~/.bashrc.bak' // backup original bashrc to make user create new bashrc
  ]

  for (const step of config.run_steps) {
    const builder = steps[step.step_type]
    if (_.isNil(builder)) {
      throw Error(`cannot find step builder: '${step.type}'`)
    }
    if (!builder.command.includes('run')) {
      throw Error(`Step ${step.type} doesn't support RUN`)
    }
    if (!builder.os.includes(config.base_docker.os)) {
      throw Error(`Step ${step.type} doesn't support ${config.base_docker.os} OS`)
    }
    result.push(...builder.build(step))
  }
  // append original bashrc to the end
  result.push('cat ~/.bashrc.bak >> ~/.bashrc')

  return result.map((x) => `RUN ${x}`)
  // return [`RUN ${result.join(` && \\ \n${' '.repeat(4)}`)}`]
}

module.exports = {
  type: 'run_steps',
  build: buildSteps
}
