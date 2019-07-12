// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const buildAndRun = require('../util').buildAndRun

/* eslint-env jest */
it('build and run pip-install image', async () => {
  const templateFilePath = path.resolve(__dirname, '..', 'data', 'pip-install.yml')
  const template = yaml.safeLoad(fs.readFileSync(templateFilePath))
  await buildAndRun(template, 'pip_success')
}, 500 * 1000)

/* eslint-env jest */
it('failed when pip is not installed', async () => {
  const templateFilePath = path.resolve(__dirname, '..', 'data', 'pip-install-no-pip.yml')
  const template = yaml.safeLoad(fs.readFileSync(templateFilePath))
  expect.assertions(1)
  await expect(buildAndRun(template, 'pip_failed')).rejects.toThrowError()
}, 500 * 1000)
