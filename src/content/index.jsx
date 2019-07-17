import * as PropTypes from 'prop-types';
import * as React from 'react';
import * as C from 'classnames'
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react'

import Button from '../components/button'
import * as Models from '../models';
import AddStep from './addStep';
import EditStep from './editStep';
import EditGeneral from './editGeneral';
import EditDocke from './editDocker';
import EditDockerfile from './editDockerfile';
import  * as iconParameter from  '../sidebar/iconParameter'
import { styles } from 'ansi-colors';

const stepTypeTitle = {
  add_run_step: 'Add Run Step',
  add_entrypoint_step: 'Add Entrypoint Step',
  edit_run_step: 'Edit Run Step',
  edit_entrypoint_step: 'Edit Entrypoint Step',
  edit_general: 'General Config',
  edit_docker: 'Base Docker',
  edit_dockerfile: 'Generated Dockerfile',
};

function click (props,button) {
  const { content:{type}, onSwitchContent } = props
  const isSwitchBool = button.target.innerHTML === 'Next Page'
  switch (type) {
    case 'edit_general':
        onSwitchContent({ type: 'edit_docker' })
        break;
    case 'edit_docker':
        isSwitchBool ?
        onSwitchContent({ type: 'add_run_step' }) :
        onSwitchContent({ type: 'edit_general' })
        break;
    case 'add_run_step':
        isSwitchBool ?
        onSwitchContent({ type: 'add_entrypoint_step' }) :
        onSwitchContent({ type: 'edit_docker' })
        break;
    case 'add_entrypoint_step':
        onSwitchContent({ type: 'add_run_step' })
        break;
  }
} 

const Content = ({
  config, content, onUpdate, onSwitchContent, enSteps, runSteps, baseDockers, addIcon, addSteps, addValue
}) => {
  const stepType= stepTypeTitle[content.type]
  const stepRunBool = stepType === 'Edit Run Step'
  const stepEnBool =  stepType === 'Edit Entrypoint Step'
  const stepEditDockerBool =  content.type === 'edit_docker'
  const stepAddEnBool = content.type === 'add_entrypoint_step'
  const stepAddRunBool = content.type === 'add_run_step'
  const stepEditBool = content.type === 'edit_general'
  const stepEditRunBool = content.type === 'edit_run_step'
  const stepEditEnBool = content.type === 'edit_entrypoint_step'
  const stepEditDockerfileBool = content.type === 'edit_dockerfile'
  const stepToEdit = content.stepToEdit ? content.stepToEdit : ''
  const sharedProps = {
    addIcon,
    baseDockers,
    content,
    config,
    onUpdate,
    onSwitchContent,
    addSteps
  };
  return (
    <div className="mt2">
      <div className="pl4 mb3 h2 flex relative items-center">{stepTypeTitle[content.type]}
        <i className={"f7 ml3 ms-Icon ms-Icon--ChevronRight"} aria-hidden="true" />
        {/* <span>{ stepRunBool ? addRunStep.name : '' || stepEnBool ? addEnStep.name : ''}</span> */}
        { stepType === 'Base Docker' ? 
            <Button 
            className='absolute-l right-0-l' 
            onClick={ ()=> {addIcon({type:'from',iconParameter,}), addSteps( '', 'baseDockers')} }
            >Delete
            </Button> 
          : ''
        }
        { stepRunBool || stepEnBool ?
            <Button className="absolute-l right-0-l"
              onClick={()=> stepRunBool ? 
                onSwitchContent({ type: 'add_run_step' }):
                onSwitchContent({ type: 'add_entrypoint_step' })}
              >
              <i className="mr2 f7 ms-Icon ms-Icon--RevToggleKey" aria-hidden="true" />
              <span>Back</span>
            </Button> 
        : ''
        }
      </div>
      {(() => {
        switch (content.type) {
          case 'add_run_step':
            return (
              <AddStep type="run" {...sharedProps}
               runSteps={runSteps} 
               enSteps={enSteps} 
               />);
          case 'add_entrypoint_step':
            return (
              <AddStep type="entrypoint" {...sharedProps} enSteps={enSteps} runSteps={runSteps} />
            );
          case 'edit_run_step':
            return (
              <EditStep
                  type="run"
                  runSteps={runSteps}
                  enSteps={enSteps}
                  key={stepToEdit?content.stepToEdit.id : ''}
                  stepToEdit={stepToEdit}
                  onUpdate={onUpdate}
                  {...sharedProps}
              />
            );
          case 'edit_entrypoint_step':
            return (
              <EditStep
                runSteps={runSteps}
                enSteps={enSteps}
                type="entrypoint"
                key={stepToEdit?content.stepToEdit.id : ''}
                stepToEdit={stepToEdit}
                onUpdate={onUpdate}
                {...sharedProps}
              />
            );
          case 'edit_general':
            return (
              <EditGeneral {...sharedProps} />
            );
          case 'edit_docker':
            return (
              <EditDocke {...sharedProps} addValue={addValue} />
            );
          case 'edit_dockerfile':
            return (
              <EditDockerfile
                text={content.text}
                key={content.text}
              />
            );
          default:
            return null;
        }
      })()}
    <PrimaryButton
      content={content} 
      text='Previous Page'
      styles={{
        root:{
          display: C({'none': stepEditBool || stepEditRunBool || stepEditEnBool || stepEditDockerfileBool}),
          marginLeft: C({'696px': stepEditDockerBool || stepAddRunBool, '858px': stepAddEnBool}),
          width: '132px',
          marginTop: '16px',
          
      }}}
      onClick={ click.bind(this,{...sharedProps}) }
      allowDisabledFocus={true}
      />
    <PrimaryButton
      text='Next Page'
      styles={{
        root:{
          display: C({'none':stepAddEnBool || stepEditRunBool || stepEditEnBool || stepEditDockerfileBool}),
          marginLeft: C({'858px': stepEditBool,'32px': stepEditDockerBool || stepAddRunBool}),
          width: '132px',
          marginTop: '16px'
        }}}
      onClick={ click.bind(this,{...sharedProps}) }
      allowDisabledFocus={true}  
    />
    </div>
  );
};

Content.propTypes = {
  addIcon: PropTypes.func.isRequired,
  addSteps: PropTypes.func.isRequired,
  config: Models.config.isRequired,
  content: Models.content.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onSwitchContent: PropTypes.func.isRequired,
};

export default Content;
