/* eslint-disable */
import { flatMap } from 'lodash';
import { writeFileSync } from 'fs';
import * as path from 'path';

const basePath = process.argv[process.argv.length - 1];

const availableOSs = require('./available-os.json');

const pythons = [
  '2',
  '2.6',
  '2.7',
  '3',
  '3.4',
  '3.5',
  '3.6',
  '3.7',
].map(ver => ({ label: ver, name: ver }));

const raw = [
  {
    name: 'Conda Install',
    type: 'conda_install',
    command: ['run', 'entrypoint'],
    config: [{
      label: 'Packages to install',
      name: 'packages',
      type: 'table',
      headers: [{ name: 'Package', unique: true }],
      transform: 'flatarray',
    }],
    os: availableOSs,
  },
  {
    name: 'Install Git',
    type: 'install_git',
    command: ['run'],
    config: [],
    os: availableOSs,
  },
  {
    name: 'Git Clone',
    type: 'git_clone',
    command: ['run', 'entrypoint'],
    config: [
      {
        label: 'URL of Git Repository',
        name: 'url',
        type: 'text',
        regex: /\/([\w.@:-~_]+?)(\/)?(\.git)?$/.source,
        required: true,
      },
      {
        label: 'Branch',
        name: 'branch',
        type: 'text',
        required: true,
      },
      { label: 'Tag', name: 'tag', type: 'text' },
    ],
    os: availableOSs,
  },
  {
    name: 'Install Conda',
    type: 'install_conda',
    command: ['run'],
    config: [
      {
        label: 'Bit',
        name: 'bit',
        type: 'choice',
        options: [{ label: '32-bits', name: '32' }, { label: '64-bits', name: '64' }],
      },
      {
        label: 'Environment Name for Conda to Install to',
        name: 'env_name',
        type: 'text',
      },
      {
        label: 'Python Version',
        name: 'python_version',
        type: 'choice',
        options: pythons,
      },
      {
        label: 'Conda Version (Default to latest)',
        name: 'conda_version',
        type: 'text',
      },
    ],
    defaultConfig: {
      conda_version: 'latest',
    },
    os: availableOSs,
  },
  {
    name: 'Install Python',
    type: 'install_python',
    command: ['run'],
    config: [{
      label: 'Python Version',
      name: 'version',
      type: 'choice',
      options: pythons,
    }],
    os: ['ubuntu'],
  },
  {
    name: 'HDFS Download',
    type: 'hdfs_download',
    command: ['entrypoint'],
    config: [
      {
        label: 'WebHDFS URL',
        name: 'url',
        type: 'text',
        required: true,
      },
      {
        label: 'Client Type',
        name: 'client_type',
        type: 'choice',
        options: ['TokenClient', 'InsecureClient'].map(x => ({ label: x, name: x })),
      },
      {
        label: 'Source Path on HDFS',
        name: 'source_path',
        type: 'text',
        required: true,
      },
      {
        label: 'Local Destination Path',
        name: 'destination_path',
        type: 'text',
        required: true,
      },
      {
        label: 'Token',
        name: 'token',
        type: 'text',
        required: true,
        condition: {
          name: 'client_type',
          equals: 'TokenClient',
        }
      },
      {
        label: 'User',
        name: 'user',
        type: 'text',
        required: true,
        condition: {
          name: 'client_type',
          equals: 'InsecureClient',
        }
      },
    ],
    os: ['ubuntu'],
  },
  {
    name: 'Custom Command',
    type: 'custom_command',
    command: ['run', 'entrypoint'],
    config: [{
      label: 'Command to Execute',
      name: 'command',
      type: 'text',
      required: true,
    }],
    os: availableOSs,
    icon: 'fa fa-edit',
  },
];

raw.forEach(step => {
  writeFileSync(
    path.join(basePath, step.type + '.json'),
    JSON.stringify(step, null, 2)
  );
});