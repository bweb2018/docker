import C from 'classnames';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import * as models from '../models';
import ChoiceGroup from './settings/choiceGroup';
import TextField from './settings/textField';
import TableEditor from './settings/tableEditor';
import TagGroup from './settings/tagGroup';
import validate from './validator';

export default class SettingsEditor extends React.Component {
  onUpdate(key, value) {
    const { onUpdate } = this.props;
    const res = {};
    res[key] = value;
    onUpdate(res);
  }

  render() {
    const { settings, value, disabled } = this.props;
    return settings.map((setting, i) => {
      let { label } = setting;
      if (!label) {
        label = setting.name;
      }
      if (setting.condition && value[setting.condition.name] !== setting.condition.equals) {
        return null;
      }
      let content = null;
      switch (setting.type) {
        case 'text':
          content = (
            <TextField
              label={label}
              value={value[setting.name]}
              onUpdate={val => this.onUpdate(setting.name, val)}
              validate={val => validate(setting, val)}
              disabled={setting.disabled || disabled}
            />
          );
          break;
        case 'choice':
          content = (
            <ChoiceGroup
              label={label}
              value={value[setting.name]}
              onUpdate={val => this.onUpdate(setting.name, val)}
              options={setting.options}
              disabled={disabled}
            />
          );
          break;
        case 'table':
          content = (
            <TableEditor
              label={label}
              value={value[setting.name]}
              onUpdate={val => this.onUpdate(setting.name, val)}
              validate={val => validate(setting, val)}
              headers={setting.headers}
              disabled={disabled}
            />
          );
          break;
        case 'tag-group':
          content = (
            <TagGroup
              label={label}
              value={value[setting.name]}
              onUpdate={val => this.onUpdate(setting.name, val)}
              groupLabels={setting.groupLabels}
              tags={setting.tags}
              disabled={disabled}
            />
          );
          break;
        default:
          throw new Error(`invalid setting type ${setting.type}`);
      }
      return (
        <div
          className={C({ pt3: i > 0, pt1: i === 0 }, 'pt3 pb3 f6 bt b--near-white')}
          key={setting.name}
        >
          {content}
          <div className='bt b--near-white'></div>
        </div>
      );
    });
  }
}

SettingsEditor.propTypes = {
  settings: PropTypes.arrayOf(models.stepSetting).isRequired,
  // eslint-disable-next-line
  value: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

SettingsEditor.defaultProps = {
  disabled: false,
};
