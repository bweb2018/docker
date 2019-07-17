import C from 'classnames';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import * as models from '../models';
import ChoiceGroup from './settings/choiceGroup';
import TextFields from './settings/textField';
import TableEditor from './settings/tableEditor';
import TagGroup from './settings/tagGroup';
import validate from './validator';

export default class SettingsEditor extends React.Component {
  onUpdate(key, value) {
    const { onUpdate } = this.props;
    const res = {};
    res[key] = value;
    if(!onUpdate) return 
    onUpdate(res)
  }

  render() {
    const { settings, value, disabled, content, baseDockers, isAdd, putAdd, addValue, addSteps, baseDocker } = this.props;
    const t = content? content.type:''
    const image_url = baseDockers ? baseDockers.baseDocker.image_url:''
    return settings.map((setting, i) => {
      let { label } = setting;
      if (!label) {
        label = setting.name;
      }
      if (setting.condition && value[setting.condition.name] !== setting.condition.equals) {
        return null;
      }
      let contents = null;
      switch (setting.type) {
        
        case 'text':
          contents = (
            <TextFields
              t={t}
              label={label}
              value={value[setting.name]||image_url}
              onUpdate={val => this.onUpdate(setting.name, val)}
              validate={val => validate(setting, val)}
              disabled={setting.disabled || disabled}
            />
          );
          break;
        case 'choice':
          contents = (
            <ChoiceGroup
              addSteps={addSteps}
              addValue={addValue}
              isAdd={isAdd}
              putAdd={putAdd}
              label={label}
              baseDockers={baseDockers}
              baseDocker={baseDocker}
              value={value[setting.name]}
              onUpdate={val => this.onUpdate(setting.name, val)}
              options={setting.options}
              disabled={disabled}
            />
          );
          break;
        case 'table':
          contents = (
            <TableEditor
              label={label}
              t={t}
              value={value[setting.name]}
              onUpdate={val => this.onUpdate(setting.name, val)}
              validate={val => validate(setting, val)}
              headers={setting.headers}
              disabled={disabled}
            />
          );
          break;
        case 'tag-group':
          contents = (
            <TagGroup
              addSteps={addSteps}
              addValue={addValue}
              isAdd={isAdd}
              putAdd={putAdd}
              label={label}
              baseDocker={baseDocker}
              baseDockers={baseDockers}
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
          className={C({'bt':t === 'edit_entrypoint_step' || t === 'edit_run_step'},'f7 b--near-white pv2')}
          key={setting.name}
        >
          {contents}
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
