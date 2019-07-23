// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

module.exports = {
  writeBashrc: (content) => `echo "${content}" >> ~/.bashrc && source ~/.bashrc`,
  aptInstall: (...packages) => `apt-get install -y --no-install-recommends ${packages.join(' ')}`,
  appendToFile: (content, file) => `echo "${content}" >> ${file}`
}
