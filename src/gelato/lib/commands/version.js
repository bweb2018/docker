// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

function buildVersion (config) {
  if (!config.version) {
    return []
  }

  return [`# version: ${config.version}`]
}

module.exports = {
  type: 'version',
  build: buildVersion
}
