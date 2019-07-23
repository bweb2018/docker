// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const buildAndRun = require('../util').buildAndRun

async function test (version) {
  const templateFile = path.resolve(__dirname, '..', 'data', 'install-python.yml')
  const template = yaml.safeLoad(fs.readFileSync(templateFile))
  template.run_steps[0].config.version = version
  await buildAndRun(template, `python_${version}`)
}

/* eslint-env jest */
it.each(['2', '2.6'])('string version', async (version) => {
  await test(version)
}, 500 * 1000)

/* eslint-env jest */
it.each([3, 3.7])('number version', async (version) => {
  await test(version)
}, 500 * 1000)

/* eslint-env jest */
it('invalid version', async () => {
  expect.assertions(1)
  await expect(test(4)).rejects.toThrowError()
})
