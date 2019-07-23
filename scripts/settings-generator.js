/* eslint-disable */
import { writeFileSync } from 'fs';
import * as path from 'path';

const basePath = process.argv[process.argv.length - 1];

const availableOSs = require('./available-os.json');

writeFileSync(path.join(basePath, 'available-os.json'), JSON.stringify(availableOSs, null, 2));

writeFileSync(path.join(basePath, 'save-step-settings.json'),
  JSON.stringify(
    [
      {
        label: 'Step Name',
        name: 'name',
        type: 'text',
        required: true,
      },
      {
        label: 'Author',
        name: 'author',
        type: 'text',
        required: true,
      },
    ], null, 2)
);

writeFileSync(path.join(basePath, 'custom-docker-settings.json'),
  JSON.stringify(
    [
      {
        label: 'Base Docker URL',
        name: 'image_url',
        type: 'text',
        required: true,
      },
      {
        label: 'Operation System',
        name: 'os',
        type: 'choice',
        options: availableOSs.map(os => ({
          iconClass: `devicon-${os}-plain colored`,
          name: os,
        })),
      },
    ], null, 2)
);

writeFileSync(path.join(basePath, 'edit-general-settings.json'),
  JSON.stringify(
    [
      {
        label: 'Name',
        name: 'name',
        type: 'text',
        required: true,
      },
      {
        label: 'Shell',
        name: 'shell',
        type: 'text',
        disabled: true,
      },
      {
        label: 'Working Directory',
        name: 'workdir',
        type: 'text',
      },
      {
        label: 'Environment Variable',
        name: 'env_variables',
        type: 'table',
        headers: [
          { name: 'key', unique: true },
          { name: 'value' },
        ],
        transform: 'field',
      },
    ], null, 2)
);