/* eslint-disable no-param-reassign */
import uuid from 'uuid';
import { getStepSettings } from './content/steps';
import * as Settings from './content/settings';
import * as Visitors from './settingsEditor/visitors';
import validate from './settingsEditor/validator';

// visitorfn(settings, values, [isStep])
export function visitConfigSettings(config, visitorfn) {
  const newConfig = {
    version: config.version,
  };
  newConfig.general = visitorfn(Settings.general, config.general);
  newConfig.base_docker = visitorfn(Settings.docker, config.base_docker);
  [newConfig.run_steps, newConfig.entrypoint_steps] = [config.run_steps, config.entrypoint_steps]
    .map(steps => steps
      .map(step => visitorfn(getStepSettings(step.type), step, true)));
  return newConfig;
}

export function validateConfig(config) {
  let hasInvalid = false;
  const newConfig = visitConfigSettings(
    config,
    (settings, values, isStep) => {
      const invalid = isStep
        ? !validate(settings, values.config) || !values.name
        : !validate(settings, values);
      hasInvalid = hasInvalid || invalid;
      return { ...values, invalid };
    },
  );
  if (hasInvalid) {
    newConfig.invalid = true;
  }
  return newConfig;
}

export function configPreSave(config) {
  const newConfig = visitConfigSettings(config, Visitors.save);
  [newConfig.run_steps, newConfig.entrypoint_steps]
    .forEach(array => array.forEach((item) => {
      item.step_type = item.type;
      delete item.type;
      delete item.id;
    }));
  Object.assign(newConfig, newConfig.general);
  delete newConfig.general;
  return newConfig;
}

export function configPostLoad(config) {
  config.general = {};
  ['name', 'shell', 'env_variables', 'workdir'].forEach((key) => {
    config.general[key] = config[key];
    delete config[key];
  });
  [config.run_steps, config.entrypoint_steps].forEach(array => array.forEach((item) => {
    item.id = uuid();
    item.type = item.step_type;
    delete item.step_type;
  }));
  const newConfig = visitConfigSettings(config, Visitors.load);
  return newConfig;
}
