// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

module.exports = {
  type: 'shell',
  build: (config) => ['SHELL ["/bin/bash", "-c"]', 'ENV BASH_ENV=~/.bashrc']
}
