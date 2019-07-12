// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const availableVersions = require('./python').availableVersions
const util = require('../util')

function buildInstallConda (step) {
  let pythonVersion = step.config.python_version || '3.6'
  if (!availableVersions.includes(pythonVersion)) {
    throw Error(`Invalid python version ${pythonVersion}`)
  }
  const condaVersion = step.config.conda_version || 'latest'
  const osType = step.config.bit === '64' ? 'Linux-x86_64' : 'Linux-x86'
  const result = [util.aptInstall('curl', 'wget', 'gnupg', 'bzip2')]
  const envName = step.config.env_name || 'docker'
  result.push(
    `wget --quiet https://repo.anaconda.com/miniconda/Miniconda3-${condaVersion}-${osType}.sh -O ~/miniconda.sh`,
    '/bin/bash ~/miniconda.sh -b -p /opt/conda',
    'rm ~/miniconda.sh',
    util.writeBashrc('export PATH=/opt/conda/bin:$PATH'),
    `conda create --yes -n ${envName} python=${step.config.python_version}`,
    util.writeBashrc(`source activate ${envName}`),
    util.writeBashrc(`export PATH=/opt/conda/envs/${envName}/bin:$PATH`)
  )

  return result
}

module.exports = {
  type: 'install_conda',
  build: buildInstallConda,
  os: ['debian', 'ubuntu'],
  command: ['run']
}
