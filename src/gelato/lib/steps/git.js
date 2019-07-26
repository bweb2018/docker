// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const _ = require('lodash')

function install (step) {
  return [
    'apt-get install -y --no-install-recommends git'
  ]
}

function clone (step) {
  let result = install(step)

  // clone
  result.push(`git clone ${step.config.url}`)

  // do not cd !
  // const repoNameReg = /\/([\w.@:-~_]+?)(\/)?(\.git)?$/
  // const repoName = repoNameReg.exec(step.config.url)[1]
  // result.push(`cd ${repoName}`)

  // branch
  if (step.config.branch !== 'master') {
    result.push(`git checkout ${step.config.branch}`)
  }

  // tag
  if (!_.isEmpty(step.config.tag)) {
    result.push(`git checkout tags/${step.config.tag}`)
  }

  return result
}

module.exports = {
  clone: {
    type: 'git_clone',
    build: clone,
    os: ['debian', 'ubuntu'],
    command: ['run', 'entrypoint']
  },
  install: {
    type: 'install_git',
    build: install,
    os: ['debian', 'ubuntu'],
    command: ['run']
  }
}
