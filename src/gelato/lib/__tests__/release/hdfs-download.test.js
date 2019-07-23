// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const fs = require('fs-extra')
const path = require('path')
const yaml = require('js-yaml')
const util = require('../util')

/* eslint-env jest */
it('hdfs download', async () => {
  const templateFile = path.resolve(__dirname, '..', 'data', 'hdfs-download-insecure.yml')
  const template = yaml.safeLoad(fs.readFileSync(templateFile))
  await util.buildAndRun(template, 'hdfs')
}, 500 * 1000)
