// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

function buildBase (config) {
  if (!config.base_docker) {
    throw new Error('No base docker in config file.')
  }

  return [`From ${config.base_docker.image_url}`]
}

module.exports = {
  type: 'base_docker',
  build: buildBase
}
