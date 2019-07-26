import * as PropTypes from 'prop-types';
import * as React from 'react';
import { cloneDeep } from 'lodash';
import C from 'classnames';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react'

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
      editingName: props.stepToEdit?!props.stepToEdit.name:'',
      saving: false,
      saveInfo: { invalid: true },
    };
  }

  get editingStep() {
    
    const { stepToEdit, config, type, runSteps } = this.props;
    let list = config[`${type}_steps`] || `${type}Steps`;
    if(list === 'runSteps') list = runSteps
    return stepToEdit?stepToEdit || list.find(item =>  item.id === stepToEdit.id) :''
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
  
  // isDelStep = (steps)=> {
  //   const {
  //     type, onSwitchContent, addSteps, content, runSteps, entrypointSteps, stepToEdit, savedSteps
  //   } = this.props;
  //   const newStepList = cloneDeep(steps);
  //   const idx = newStepList.findIndex(item => item.id === stepToEdit.id);
  //   steps.splice(0, 1)
  //   if(!runSteps.length&&!entrypointSteps.length){
  //     // savedSteps.splice(1,1,'edit_general')
  //     onSwitchContent({type: 'edit_general'})
  //   }else if (idx === steps.length) {
  //     onSwitchContent({ type: content.type, stepToEdit: steps[idx - 1] });
  //   }{
  //     // savedSteps.splice(1,1,'add_run_step')
  //     onSwitchContent({ type: content.type, stepToEdit: steps[idx] });
  //   }
  //   // if(runSteps.length === 0 && entrypointSteps.length > 1){
  //     //   savedSteps.splice(1,1,'add_entrypoint_step')
  //     // }else if(entrypointSteps.length === 0 && runSteps.length > 1) {
  //     //   savedSteps.splice(1,1,'add_run_step')
  //     // }else {
  //     //   savedSteps.splice(1,1,'edit_general')
  //     // }
  //   addSteps(steps,type)
  // }

  // delete = (e) => {
  //   e.stopPropagation()
  //   const {
  //     type, runSteps, entrypointSteps
  //   } = this.props;
  //   if(type === 'run'){
  //     if(!runSteps) return
  //     this.isDelStep(runSteps)
  //   }else if(type === 'entrypoint'){
  //     if(!entrypointSteps) return
  //     this.isDelStep(entrypointSteps)
  //   }
   
  //   // onUpdate({ [stepListName]: newStepList });
  //   // if(runSteps && !runSteps.length){
  //   //   onSwitchContent({type: "add_run_step"})
  //   // }else if(entrypointSteps && !entrypointSteps.length){
  //   //   onSwitchContent({type: "add_entrypoint_step"})
  //   // }
    
  // }

  save = () => {
    this.onLeaveSavingMode();
  }
  _updateStepList (newStepList,steps, newStep) {
    newStepList = cloneDeep(steps);
    const idx = newStepList.findIndex(item => item.id === newStep.id)
    newStepList[idx] = newStep;
    steps.splice(idx,1,newStep)
    return newStepList
  }
  submitChange(name, to) {
    const { onUpdate, type, runSteps, entrypointSteps } = this.props;
    const newStep = cloneDeep(this.editingStep);
    newStep[name] = to;
    const stepListName = `${type}_steps`;
    let newStepList
    if(stepListName === 'run_steps') {
      const stepList = this._updateStepList(newStepList, runSteps, newStep)
      onUpdate({ [stepListName]: stepList });
    }else if(stepListName === 'entrypoint_steps') {
      const stepList = this._updateStepList(newStepList, entrypointSteps, newStep)
      onUpdate({ [stepListName]: stepList });
    }
  }

  render() {
    const { editingStep, state: { editingName, saving } } = this;
    const { onSddSteps, content: { type }, content } = this.props
    const baseStep = editingStep ? getStep(editingStep.type) : '';
    return (
        baseStep ? <div className={C({'ml4': type === 'edit_run_step'
         || type === 'edit_entrypoint_step'},"c-st mv2 pt1")}>
        {/* <div className="mt2 fr">
          <Button onClick={this.delete}>
            Delete
          </Button>
        </div> */}
        <div className="mv2">
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
                  className="ml2 fa fa-edit hover-black-80 pointer dn"
                  onClick={() => this.setState({ editingName: true })}
                />
              </>
            )
          }
        </div>
        {baseStep.name !== editingStep.name && (
          <div className="c-st mv2">(Base step: {baseStep.name})</div>
        )}
        {/* {saving && (
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
        )} */}
       {<SettingsEditor
          settings={getStepSettings(editingStep.type)}
          onUpdate={ type ==="edit_entrypoint_step" || type === "edit_run_step"?this.onConfigChange:(()=>{})}
          content={content}
          value={editingStep.config||''}
          disabled={saving}
        />}
        {
          type ==="add_entrypoint_step" || type === "add_run_step" ? 
          <PrimaryButton
            text='Add'
            onClick={onSddSteps}
            allowDisabledFocus={true}/> 
          :''
        }
    </div> : <div></div>
    );
  }
}

EditStep.propTypes = {
  config: Models.config.isRequired,
  type: Models.stepCommand.isRequired,
  // stepToEdit: Models.step.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onSwitchContent: PropTypes.func.isRequired,
};

export default EditStep;
