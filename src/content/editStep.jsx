import * as PropTypes from 'prop-types';
import * as React from 'react';
import { cloneDeep } from 'lodash';
import C from 'classnames';

import * as Models from '../models';
import Button from '../components/button';
import SettingsEditor from '../settingsEditor';
import { getStepSettings, getStep } from './steps';
import * as Settings from './settings';
import validate from '../settingsEditor/validator';

class EditStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingName: !props.stepToEdit.name,
      saving: false,
      saveInfo: { invalid: true },
    };
  }

  get editingStep() {
    const { stepToEdit, config, type } = this.props;
    console.log(type)
    const list = config[`${type}_steps`];
    console.log(list)
    return list.find(item =>  item.id === stepToEdit.id)
  }

  onNameChange = (e) => {
    this.submitChange(e.target.name, e.target.value);
  }

  onConfigChange = (configUpdate) => {
    this.submitChange('config', { ...this.editingStep.config, ...configUpdate });
  }

  onSaveInfoChange = (saveInfoUpdate) => {
    const { saveInfo } = this.state;
    const newSaveInfo = { ...cloneDeep(saveInfo), ...saveInfoUpdate };
    newSaveInfo.invalid = !validate(Settings.saveStep, newSaveInfo);
    this.setState({ saveInfo: newSaveInfo });
  }


  onLeaveSavingMode = () => {
    this.setState({ saving: false });
  }

  delete = () => {
    const {
      onUpdate, config, type, stepToEdit, onSwitchContent,
    } = this.props;

    const stepListName = `${type}_steps`;
    const newStepList = cloneDeep(config[stepListName]);
    const idx = newStepList.findIndex(item => item.id === stepToEdit.id);
    newStepList.splice(idx, 1);
    onUpdate({ [stepListName]: newStepList });

    if (!newStepList.length) {
      onSwitchContent({ type: 'edit_general' });
    } else if (idx === newStepList.length) {
      onSwitchContent({ type: `edit_${type}_step`, stepToEdit: newStepList[idx - 1] });
    } else {
      onSwitchContent({ type: `edit_${type}_step`, stepToEdit: newStepList[idx] });
    }
  }

  save = () => {
    this.onLeaveSavingMode();
  }

  submitChange(name, to) {
    const { onUpdate, config, type } = this.props;
    const newStep = cloneDeep(this.editingStep);
    newStep[name] = to;

    const stepListName = `${type}_steps`;
    const newStepList = cloneDeep(config[stepListName]);
    newStepList[newStepList.findIndex(item => item.id === newStep.id)] = newStep;
    onUpdate({ [stepListName]: newStepList });
  }

  render() {
    const { editingStep, state: { editingName, saving, saveInfo } } = this;
    const baseStep = editingStep ? getStep(editingStep.type) : '';
    return (
        baseStep ? <div className="bg-white pa3 bt b--near-white ml3">
        <div className="mt2 fr">
          <Button onClick={this.delete}>
            <i className="fa fa-trash mr1" />
            Delete
          </Button>
        </div>
        <div className="f3 mv2">
          {
            editingName ? (
              <input
                name="name"
                className={C({ 'ba b--red': !editingStep.name })}
                onChange={this.onNameChange}
                onBlur={() => editingStep.name && this.setState({ editingName: false })}
                value={editingStep.name}
              />
            ) : (
              <>
                <span>{editingStep.name}</span>
                <i
                  className="f5 ml2 fa fa-edit hover-black-70 pointer dn"
                  onClick={() => this.setState({ editingName: true })}
                />
              </>
            )
          }
        </div>
        {baseStep.name !== editingStep.name && (
          <div className="c-st mv2">(Base step: {baseStep.name})</div>
        )}
        {saving && (
          <>
            <SettingsEditor
              settings={Settings.saveStep}
              onUpdate={this.onSaveInfoChange}
              value={saveInfo}
            />
            <div className="flex justify-between">
              <div>
                <Button className="dib mt2" onClick={this.onLeaveSavingMode}>
                  <i className="fa fa-times mr1" />
                  Cancel
                </Button>
              </div>
              <div>
                <Button className="dib mt2" onClick={this.save} disabled={saveInfo.invalid}>
                  <i className="fa fa-save mr1" />
                  Save
                </Button>
              </div>
            </div>
            <hr />
          </>
        )}
        <SettingsEditor
          settings={getStepSettings(editingStep.type)}
          onUpdate={this.onConfigChange}
          value={editingStep.config}
          disabled={saving}
        />
    </div> : <div></div>
    );
  }
}

EditStep.propTypes = {
  config: Models.config.isRequired,
  type: Models.stepCommand.isRequired,
  stepToEdit: Models.step.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onSwitchContent: PropTypes.func.isRequired,
};

export default EditStep;
