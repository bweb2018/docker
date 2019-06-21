// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const execa = require('execa')
const fs = require('fs-extra')
const path = require('path')

const gelato = require('..')

const tempPath = path.resolve(__dirname, '..', '..', 'out')

async function buildAndRun (template, name) {
  const imageName = `test_image_${name}`
  const containerName = `test_container_${name}`
  const dockerfile = await gelato(template)
  const dockerFileFolder = path.join(tempPath, name)
  await fs.ensureDir(dockerFileFolder)
  await fs.writeFile(path.join(dockerFileFolder, 'dockerfile'), dockerfile)
  await execa.shell(`docker build -t ${imageName} ${dockerFileFolder}`)
  await execa.shell(`docker run --rm --name ${containerName} ${imageName}`)
  await execa.shell(`docker rmi ${imageName}`)
}

module.exports = {
  buildAndRun
}
