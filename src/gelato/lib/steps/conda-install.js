// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

function buildCondaInstall (step) {
  const packages = step.config.packages
  return packages ? 
    [`conda install ${packages.join(' ')}`] :
    [`conda install`] 
}

module.exports = {
  type: 'conda_install',
  build: buildCondaInstall,
  os: ['debian', 'ubuntu'],
  command: ['run', 'entrypoint']
}
