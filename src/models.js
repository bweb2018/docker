import * as PropTypes from 'prop-types';
import { availableOSs } from './content/settings';

export const os = PropTypes.oneOf(availableOSs);
export const stepCommand = PropTypes.oneOf(['run', 'entrypoint']);

export const step = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  invalid: PropTypes.bool,
  config: PropTypes.object,
});

export const config = PropTypes.shape({
  version: PropTypes.string.isRequired,
  general: PropTypes.shape({
    name: PropTypes.string,
    shell: PropTypes.string,
    workdir: PropTypes.string,
    env_variables: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      value: PropTypes.string,
    })).isRequired,
    invalid: PropTypes.bool,
  }),
  base_docker: PropTypes.shape({
    image_url: PropTypes.string,
    os,
    custom: PropTypes.bool,
    presetBase: PropTypes.string,
    invalid: PropTypes.bool,
  }).isRequired,
  run_steps: PropTypes.arrayOf(step).isRequired,
  entrypoint_steps: PropTypes.arrayOf(step).isRequired,
  invalid: PropTypes.bool,
});

export const content = PropTypes.shape({
  type: PropTypes.oneOf([
    'add_run_step',
    'add_entrypoint_step',
    'edit_run_step',
    'edit_entrypoint_step',
    'edit_general',
    'edit_docker',
    'edit_dockerfile',
  ]).isRequired,
  stepToEdit: step,
  text: PropTypes.string,
});

export const baseStepSetting = {
  label: PropTypes.node,
  name: PropTypes.string.isRequired,
  description: PropTypes.node,
  condition: PropTypes.object,
};

export const textFieldSetting = PropTypes.shape({
  ...baseStepSetting,
  type: PropTypes.oneOf(['text']).isRequired,
  regex: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
});

export const choiceOption = PropTypes.shape({
  iconClass: PropTypes.string,
  name: PropTypes.string.isRequired,
});

export const choiceSetting = PropTypes.shape({
  ...baseStepSetting,
  type: PropTypes.oneOf(['choice']).isRequired,
  options: PropTypes.arrayOf(choiceOption).isRequired,
});

export const tableHeader = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    unique: PropTypes.bool,
  }),
]);

export const tableSetting = PropTypes.shape({
  ...baseStepSetting,
  type: PropTypes.oneOf(['table']).isRequired,
  headers: PropTypes.arrayOf(tableHeader).isRequired,
  transform: PropTypes.oneOf(['field', 'flatarray']),
});

export const tagGroupTag = PropTypes.shape({
  tagList: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
});

export const tagGroupSetting = PropTypes.shape({
  ...baseStepSetting,
  type: PropTypes.oneOf(['tag-group']).isRequired,
  groupLabels: PropTypes.arrayOf(PropTypes.node).isRequired,
  tags: PropTypes.arrayOf(tagGroupTag).isRequired,
});

export const stepSetting = PropTypes.oneOfType([
  textFieldSetting,
  choiceSetting,
  tableSetting,
  tagGroupSetting,
]);

export const availableBaseStep = PropTypes.shape({
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  type: PropTypes.string.isRequired,
  command: PropTypes.arrayOf(stepCommand).isRequired,
  os: PropTypes.arrayOf(os).isRequired,
  config: PropTypes.arrayOf(stepSetting),
  configFinalize: PropTypes.func,
  defaultConfig: PropTypes.object,
  icon: PropTypes.string,
});

export const availableSavedStep = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  baseType: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  defaultConfig: PropTypes.object.isRequired,
});

export const savedSteps = PropTypes.arrayOf(availableSavedStep);

export const availableStep = PropTypes.oneOf([
  availableBaseStep,
  availableSavedStep,
]);
