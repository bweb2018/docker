// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const execa = require('execa')
const fs = require('fs-extra')
const path = require('path')
const _ = require('lodash')

const cliPath = path.resolve(__dirname, '..', '..', 'cli.js')
const exampleJson = path.resolve(__dirname, '..', '..', '..', 'examples', 'config-example.json')
const exampleYml = path.resolve(__dirname, '..', '..', '..', 'examples', 'config-example.yml')
const outputDir = path.resolve(__dirname, '..', '..', '..', 'out', 'cli')

/* eslint-env jest */
it('cli wrong arguments', async () => {
  try {
    await execa.shell(`node ${cliPath}`)
  } catch (e) {
    expect(_.includes(e.stderr, 'Arguments error!'))
  }
})

/* eslint-env jest */
it('cli supports json config', async () => {
  await execa.shell(`node ${cliPath} ${exampleJson}`)
}, 5 * 1000)

/* eslint-env jest */
it('cli supports yml config', async () => {
  await execa.shell(`node ${cliPath} ${exampleYml}`)
}, 5 * 1000)

/* eslint-env jest */
it('cli saves dockerfile successfully', async () => {
  expect.assertions(1)
  await fs.remove(outputDir)
  await execa.shell(`node ${cliPath} --output ${outputDir} ${exampleYml}`)
  const result = await fs.pathExists(path.join(outputDir, 'dockerfile'))
  expect(result).toBe(true)
})
