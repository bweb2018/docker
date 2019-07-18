import { cloneDeep, fromPairs } from 'lodash';

const settingTransformDefinitions = {
  field: {
    condition: (value, setting) => setting.type === 'table' && setting.headers.length === 2,
    load: value => Object.entries(value).map(([key, val]) => ({ key, value: val })),
    save: (value, setting) => fromPairs(
      value.map(pair => setting.headers.map(({ name }) => pair[name])),
    ),
  },
  flatarray: {
    condition: (value, setting) => setting.type === 'table' && setting.headers.length === 1,
    load: (value, setting) => value.map(val => ({ [setting.headers[0].name]: val })),
    save: (value, setting) => value.map(val => val[setting.headers[0].name]),
  },
};

export const save = (settings, values, isStep) => {
  const newValues = cloneDeep(values);
  settings.forEach((setting) => {
    if (setting.condition
      && (isStep ? values.config : values)[setting.condition.name] !== setting.condition.equals) {
      delete (isStep ? newValues.config : newValues)[setting.name];
      return;
    }
    const transform = setting.transform && settingTransformDefinitions[setting.transform];
    const currVal = isStep ? values.config[setting.name] : values[setting.name];
    if (currVal !== undefined && transform && transform.condition(currVal, setting)) {
      (isStep ? newValues.config : newValues)[setting.name] = transform.save(currVal, setting);
    }
  });
  return newValues;
};

export const load = (settings, values, isStep) => {
  const newValues = cloneDeep(values);
  settings.forEach((setting) => {
    const transform = setting.transform && settingTransformDefinitions[setting.transform];
    const currVal = isStep ? values.config[setting.name] : values[setting.name];
    if (currVal !== undefined && transform && transform.condition(currVal, setting)) {
      (isStep ? newValues.config : newValues)[setting.name] = transform.load(currVal, setting);
    }
  });
  return newValues;
};
