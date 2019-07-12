import { memoize } from 'lodash';

import condaInstall from './conda_install.json';
import installGit from './install_git.json';
import gitClone from './git_clone.json';
import installConda from './install_conda.json';
import installPython from './install_python.json';
import hdfsDownload from './hdfs_download.json';
import customCommand from './custom_command.json';

export const availableSteps = [
  condaInstall,
  installGit,
  gitClone,
  installConda,
  installPython,
  hdfsDownload,
  customCommand,
];

export function filterSteps(command, os) {
  return availableSteps.filter(s => s.command.includes(command) && s.os.includes(os));
}

export const getStep = memoize(type => availableSteps.find(s => s.type === type));

export const getStepSettings = memoize((type) => {
  const foundAvailableStep = getStep(type);
  if (!foundAvailableStep) {
    throw new Error(`Missing step prototype for ${type}`);
  }
  return foundAvailableStep.config;
});
