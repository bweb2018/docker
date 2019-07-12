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
    const { settings, value, disabled, content, baseDockers, isAdd, putAdd } = this.props;
    
    const t = content? content.type:''
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
              value={value[setting.name]}
              onUpdate={val => this.onUpdate(setting.name, val)}
              validate={val => validate(setting, val)}
              disabled={setting.disabled || disabled}
            />
          );
          break;
        case 'choice':
            console.log('choice')
           
          contents = (
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
            console.log('table')
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
              isAdd={isAdd}
              putAdd={putAdd}
              label={label}
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
