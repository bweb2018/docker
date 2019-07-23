// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const _ = require('lodash')
const util = require('../util')

function writeConfig (step) {
  const result = []
  const hdfsConfigFile = '~/.hdfscli.cfg'
  result.push(
    util.appendToFile('[global]', hdfsConfigFile),
    util.appendToFile('default.alias = dev', hdfsConfigFile),
    util.appendToFile('[dev.alias]', hdfsConfigFile)
  )
  if (step.config.client_type === 'TokenClient') {
    if (_.isNil(step.config.token)) {
      throw new Error(`step type ${step.type}: token client does not have token`)
    }
    result.push(
      util.appendToFile('client = TokenClient', hdfsConfigFile),
      util.appendToFile(`url = ${step.config.url}`, hdfsConfigFile),
      util.appendToFile(`token = ${step.config.token}`, hdfsConfigFile)
    )
  } else {
    result.push(
      util.appendToFile('client = InsecureClient', hdfsConfigFile),
      util.appendToFile(`url = ${step.config.url}`, hdfsConfigFile),
      _.isNil(step.config.user) ? null : util.appendToFile(`user = ${step.config.user}`, hdfsConfigFile)
    )
  }

  return result
}

function download (step) {
  if (_.isNil(step.config.url)) {
    throw new Error(`step type ${step.type}: hdfs does not have url`)
  }
  const result = [
    `(pip -V || (echo "Error: pip is not installed" && exit 1))`,
    'pip install hdfs'
  ]
  result.push(...writeConfig(step))
  result.push(
    `hdfscli download ${step.config.source_path} ${step.config.destination_path}`
  )

  return result
}

module.exports = {
  download: {
    type: 'hdfs_download',
    build: download,
    os: ['ubuntu'],
    command: ['entrypoint']
  }
}
