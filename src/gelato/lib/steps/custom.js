// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

function build (step) {
  return [step.config.command]
}

module.exports = {
  type: 'custom_command',
  build,
  os: ['debian', 'ubuntu'],
  command: ['run', 'entrypoint']
}
