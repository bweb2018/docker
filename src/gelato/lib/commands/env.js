// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

function buildEnv (config) {
  if (!config.env_variables) {
    return []
  }

  return Object.entries(config.env_variables).map(
    ([key, val]) => `ENV ${key}="${val}"`
  )
}

module.exports = {
  type: 'env_variables',
  build: buildEnv
}
