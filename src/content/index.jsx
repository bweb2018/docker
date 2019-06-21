import * as PropTypes from 'prop-types';
import * as React from 'react';

import Button from '../components/button'
import * as Models from '../models';
import AddStep from './addStep';
import EditStep from './editStep';
import EditGeneral from './editGeneral';
import EditDocke from './editDocker';
import EditDockerfile from './editDockerfile';

const stepTypeTitle = {
  add_run_step: 'Add Run Step',
  add_entrypoint_step: 'Add Entrypoint Step',
  edit_run_step: 'Edit Run Step',
  edit_entrypoint_step: 'Edit Entrypoint Step',
  edit_general: 'General Config',
  edit_docker: 'Base Docker',
  edit_dockerfile: 'Generated Dockerfile',
};

const Content = ({
  config, content, onUpdate, onSwitchContent, invalid, addRunStep, addEnStep, delFromDocker
}) => {
  const stepType= stepTypeTitle[content.type]
  const stepRunBool = stepType === 'Edit Run Step'
  const stepEnBool =  stepType === 'Edit Entrypoint Step'
  const {custom} = config.base_docker
  const sharedProps = {
    delFromDocker,
    addEnStep,
    addRunStep,
    invalid,
    content,
    config,
    onUpdate,
    onSwitchContent,
  };
  return (
    <div className="black mt3 relative">
      <div className="pl4 mb3 h2 flex items-center black">{stepTypeTitle[content.type]}<i className={"f7 ml3 ms-Icon ms-Icon--ChevronRight black-30"} aria-hidden="true" />
         <span>{ stepRunBool ? addRunStep.name : '' || stepEnBool ? addEnStep.name : ''}</span>
        { stepType === 'Base Docker' ? <Button className='absolute-l right-0-l' onClick={()=> onUpdate({base_docker: {}})}>Delete</Button> : ''}
        { stepRunBool || stepEnBool ? <Button className="absolute-l right-0-l"
           onClick={()=> stepRunBool ? onSwitchContent({ type: 'add_run_step' }):onSwitchContent({ type: 'add_entrypoint_step' })} >
          <i className="mr2 f7 ms-Icon ms-Icon--RevToggleKey" aria-hidden="true" />
          <span>Back</span>
        </Button> : ''}
      </div>
      {(() => {
        switch (content.type) {
          case 'add_run_step':
            return (
                <AddStep type="run" {...sharedProps} />);
          case 'add_entrypoint_step':
            return (
              <AddStep type="entrypoint" {...sharedProps} />
            );
          // case 'edit_run_step':
          case 'edit_run_step':
            return (
                <EditStep
                    type="run"
                    key={content.stepToEdit.id}
                    stepToEdit={content.stepToEdit}
                    onUpdate={onUpdate}
                    {...sharedProps}
                />
            );
          case 'edit_entrypoint_step':
            return (
              <EditStep
                type="entrypoint"
                key={content.stepToEdit.id}
                stepToEdit={content.stepToEdit}
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
              <EditDocke {...sharedProps} />
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
    </div>
  );
};

Content.propTypes = {
  delFromDocker: PropTypes.func.isRequired,
  addEnStep: PropTypes.object.isRequired,
  addRunStep: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  config: Models.config.isRequired,
  content: Models.content.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onSwitchContent: PropTypes.func.isRequired,
};

export default Content;
