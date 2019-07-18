// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const util = require('../util')

const testVersions = [
  { condaVersion: '4.5.11', pythonVersion: '2.7' },
  { condaVersion: 'latest', pythonVersion: '3.6' }
]

async function buildAndRun (condaVersion, pythonVersion) {
  const templateFile = path.resolve(__dirname, '..', 'data', 'install-conda.yml')
  const template = yaml.safeLoad(fs.readFileSync(templateFile))
  template.run_steps[0].config.conda_version = condaVersion
  template.run_steps[0].config.python_version = pythonVersion
  await util.buildAndRun(template, `conda_${condaVersion}_py${pythonVersion}`)
}

/* eslint-env jest */
it('install conda', async () => {
  for (const { condaVersion, pythonVersion } of testVersions) {
    await buildAndRun(condaVersion, pythonVersion)
  }
}, 500 * 1000)
