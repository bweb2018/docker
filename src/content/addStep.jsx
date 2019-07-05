import { cloneDeep } from 'lodash';
import uuid from 'uuid';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import BaseDockerLIst from '../components/card';
import EditStep from './editStep';
import * as Models from '../models';
import { filterSteps, getStepSettings } from './steps';
import Button from '../components/button';
import validate from '../settingsEditor/validator';
import dockers from "./dockers";

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

  renderBaseStepList(filteredSteps) {
    const { content, config, type, onUpdate, onSwitchContent} = this.props;
    const { selectedCard } = this.state;
    return (
        <ul className={'list pl4 f6 black-80'}>
      {filteredSteps.map((item, index) => <li className={'cb pv3 bt b--near-white '} key={index}><span className={'pointer h3 mv7 '}  onClick={(e) => {
        e.stopPropagation();
        const stepListName = `${type}_steps`;
        const step = {
          id: uuid(),
          name: item.name,
          type: item.type,
          config: item.defaultConfig || {},
        };
        if (item.config && !item.config.every(c => c.optional)) {
          step.invalid = true;
        }
        const newStepList = cloneDeep(config[stepListName]);
        newStepList.push(step);
        onUpdate({ [stepListName]: newStepList },(item,type)=> {
          if(type){
            onSwitchContent({ type: 'add_run_step', stepToEdit: item })
          }else {
            onSwitchContent({ type: 'add_entrypoint_step', stepToEdit: item })
          }
        });
      }}>{ item.name }</span>
        <i className={content.stepToEdit && content.stepToEdit.type === item.type? "fr f7 ms-Icon ms-Icon--ChevronUpMed black-30" : "fr f7 ms-Icon ms-Icon--ChevronDownMed black-30"} aria-hidden="true" />
        {content.stepToEdit && content.stepToEdit.type === item.type? <EditStep
            type="run"
            key={content.stepToEdit.id}
            stepToEdit={content.stepToEdit}
            onUpdate={onUpdate}
            {...this.props}
        /> : ''}
      </li> )}
    </ul>
    )
    // filteredSteps.map((item) => {
    //   const card = (
    //
    //   );
    //   if (selectedCard === item.type) {
    //     return <>
    //       {card}
    //       <div className="f6 c-st ph3 pb3 bg-white-80">
    //         Description: <span className="c-pt">{item.description || item.name}</span>
    //       </div>
    //     </>;
    //   }
    //   return card;
    // });
  }

  render() {

    const { config, baseDockers, type, content} = this.props;
    console.log(config, baseDockers, type);
    const filteredSteps = filterSteps(type, baseDockers.os);
    console.log(filteredSteps);
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
// <BaseDockerLIst
//     key={item.type}
//     name={item.name}
//     selected={item.type === selectedCard}
//     pointer
//     icon={item.icon || 'fa fa-terminal'}
//     onClick={(e) => {
//       e.stopPropagation();
//       const stepListName = `${type}_steps`;
//       const step = {
//         id: uuid(),
//         name: item.name,
//         type: item.type,
//         config: item.defaultConfig || {},
//       };
//       if (item.config && !item.config.every(c => c.optional)) {
//         step.invalid = true;
//       }
//       const newStepList = cloneDeep(config[stepListName]);
//       newStepList.push(step);
{/*      onUpdate({ [stepListName]: newStepList },(item)=> console.log(item));*/}

{/*    }}*/}

{/*>*/}

{/*</BaseDockerLIst>*/}
