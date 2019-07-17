import { cloneDeep } from 'lodash';
import uuid from 'uuid';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import C from 'classnames';

import EditStep from './editStep';
import * as Models from '../models';
import { filterSteps, getStepSettings } from './steps';
import validate from '../settingsEditor/validator';

class AddStep extends React.Component {
  state = {
    selectedCard: '',
    editing: false,
    editingSavedStep: {},
  };

  onSelect(cardId) {
    this.setState({ selectedCard: cardId, editingSavedStep: {}, editing: false });
  }

  onEdit(savedStep) {
    if (!savedStep) {
      this.setState({ editingSavedStep: {}, editing: false });
    } else {
      this.setState({ editingSavedStep: savedStep, editing: true });
    }
  }

  onConfigChange = (configUpdate) => {
    const { editingSavedStep } = this.state;
    const newSavedStep = cloneDeep(editingSavedStep);
    newSavedStep.defaultConfig = { ...newSavedStep.defaultConfig, ...configUpdate };
    newSavedStep.defaultConfig.invalid = !validate(
      getStepSettings(editingSavedStep.baseType),
      newSavedStep.defaultConfig,
    );
    this.setState({ editingSavedStep: newSavedStep });
  }

  onConfigSave = () => {
    this.onEdit(null);
  }
  _addSteps = (item,add)=> {
    const { config, type, onUpdate, onSwitchContent, addSteps } = this.props;
    const stepListName = `${type}_steps`;
    const step = {
      id: uuid(),
      name: item.name,
      type: item.type,
      config: item.defaultConfig || {},
    };
    if (item.config && !item.config.every(c => c.optional)) {
      console.log(1111);
      step.invalid = true;
    }
    const newStepList = cloneDeep(config[stepListName]);
    newStepList.shift()
    newStepList.push(step);
    onUpdate({ [stepListName]: newStepList },(item,type)=> {
      if(type){
        if(add) addSteps(item,type)
        onSwitchContent({ type: 'add_run_step', stepToEdit: item })
      }else {
        if(add) addSteps(item,'en')
        onSwitchContent({ type: 'add_entrypoint_step', stepToEdit: item })
      }
    });
  }

  renderBaseStepList(filteredSteps) {
    const { content, onUpdate, onSwitchContent } = this.props;
    const { selectedCard } = this.state;
    return (
        <ul className={'list pl4 f6 black-80'}>
          {filteredSteps.map((item, index) => 
          <li className={'cb pv3 bt b--near-white '} key={index}>
            <span className={'pointer h3 mv7 '}  onClick={(e) => {
            e.stopPropagation();
            this._addSteps(item)
          }}>{ item.name }</span>
          <i 
            className={C({'dn':content.stepToEdit && content.stepToEdit.type === item.type},
            "fr pointer mr3 f7 ms-Icon ms-Icon--ChevronDownMed")}
            aria-hidden="true" 
            onClick={(e)=>{
              e.stopPropagation();
              this._addSteps(item)
            }}
           />
           <i 
            className={C({'dn':!content.stepToEdit || content.stepToEdit && content.stepToEdit.type !== item.type},
            "fr pointer mr3 f7 ms-Icon ms-Icon--ChevronUpMed")}
            aria-hidden="true" 
            onClick={(e)=>{
              e.stopPropagation();
              // this._addSteps(item)
              if(content.type==='add_run_step') {
                onSwitchContent({ type: 'add_run_step' })
              }else {
                onSwitchContent({ type: 'add_entrypoint_step' })
              }}}
           />
          {content.stepToEdit && content.stepToEdit.type === item.type? <EditStep
              type="run"
              key={content.stepToEdit.id || ''}
              stepToEdit={content.stepToEdit}
              onUpdate={onUpdate}
              onSddSteps={()=>this._addSteps(item,'add')}
              {...this.props}
          /> : ''}
          </li>)}
        </ul>
      )
  }

  render() {
    const { baseDockers, type } = this.props;
    const { os } = baseDockers.baseDocker ? baseDockers.baseDocker:''
    const filteredSteps = filterSteps(type, os);
    return (
      <div>
        {this.renderBaseStepList(filteredSteps)}
      </div>
    );
  }
}

AddStep.propTypes = {
  content: Models.content.isRequired,
  config: Models.config.isRequired,
  type: Models.stepCommand.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onSwitchContent: PropTypes.func.isRequired
};

export default AddStep;