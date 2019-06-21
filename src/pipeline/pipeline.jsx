import * as PropTypes from 'prop-types';
import * as React from 'react';

import StepList from './stepList';
import BaseDockerLIst from '../components/card';
import * as Models from '../models';
import Button from '../components/button';

const Pipeline = ({
  config,
  content,
  onUpdate,
  onSwitchContent,
}) => (
  <div className="pt3 ph2 pb2">
    <div className="mb3 bg-p block">
      <div className="pa3 h3 flex items-center c-t">General</div>
      <BaseDockerLIst
        name={config.general.name}
        pointer
        warning={config.general.invalid}
        selected={content.type === 'edit_general'}
        onClick={() => { onSwitchContent({ type: 'edit_general' }); }}
      />
    </div>
    <div className="mb3 bg-p block">
      <div className="pa3 h3 flex items-center c-t">From</div>
      <BaseDockerLIst
        name={config.base_docker.image_url || 'Not specified'}
        pointer
        warning={config.base_docker.invalid}
        icon="devicon-docker-plain colored"
        selected={content.type === 'edit_docker'}
        onClick={() => { onSwitchContent({ type: 'edit_docker' }); }}
      />
    </div>
    {config.base_docker && (
      <>
        <div className="bg-p mb3 block">
          <div className="bg-p pa3 h3 flex items-center justify-between c-t sticky">
            <div>Run</div>
            <Button
              mild
              disabled={config.base_docker.invalid}
              onClick={() => onSwitchContent({ type: 'add_run_step' })}
            >
              <i className="fa fa-plus" />
            </Button>
          </div>
          <StepList
            items={config.run_steps}
            selected={content.type === 'edit_run_step' && content.stepToEdit.id}
            onSelect={(step) => { onSwitchContent({ type: 'edit_run_step', stepToEdit: step }); }}
            onUpdate={(steps) => { onUpdate({ run_steps: steps }); }}
          />
        </div>
        <div className="bg-p block">
          <div className="bg-p pa3 h3 flex items-center justify-between c-t sticky">
            <div>Entrypoint</div>
            <Button
              mild
              disabled={config.base_docker.invalid}
              onClick={() => onSwitchContent({ type: 'add_entrypoint_step' })}
            >
              <i className="fa fa-plus" />
            </Button>
          </div>
          <StepList
            items={config.entrypoint_steps}
            selected={content.type === 'edit_entrypoint_step' && content.stepToEdit.id}
            onSelect={(step) => { onSwitchContent({ type: 'edit_entrypoint_step', stepToEdit: step }); }}
            onUpdate={(steps) => { onUpdate({ entrypoint_steps: steps }); }}
          />
        </div>
      </>
    )}
  </div>
);

Pipeline.propTypes = {
  config: Models.config.isRequired,
  content: Models.content.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onSwitchContent: PropTypes.func.isRequired,
};

export default Pipeline;
