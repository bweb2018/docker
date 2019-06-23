import * as PropTypes from 'prop-types';
import * as React from 'react';
import { cloneDeep, memoize } from 'lodash';

import * as Models from '../models';
import Button from '../components/button';
import SettingsEditor from '../settingsEditor';
import dockers from './dockers';
import * as Settings from './settings';
import { getStep } from './steps';
import {validateConfig} from "../config-utils";

const ResetButton = ({ onClick, index, id}) => (<Button className="fr" onClick={onClick} >
    { <i className={ index === id ? "fr f7 ms-Icon ms-Icon--ChevronUpMed black-30" : "f7 ms-Icon ms-Icon--ChevronDownMed black-30"} aria-hidden="true" /> }
</Button>);

    ResetButton.propTypes = {
    onClick: PropTypes.func.isRequired,
  };

    class EditDocker extends React.Component {
    state ={
      id: '',
      isShow: true
    }
    getPreset = memoize(base => dockers.find(p => p.base === base));

    onPresetChosen(to, index) {
    const {id} = this.state
    this.setState({
    id: index,
  })
    let newBaseDocker;
    if (!to) {
    newBaseDocker = {};
  } else if (to === 'Custom') {
    newBaseDocker = {
    custom: true,
  };
  } else {
    newBaseDocker = {
    presetBase: to.base,
  };
  }

    this.update(newBaseDocker);
  }

    onPresetUpdate = ({ tag }) => {
    const { config } = this.props;
    const newBaseDocker = cloneDeep(config.base_docker);
    newBaseDocker.image_url = `${newBaseDocker.presetBase}:${tag}`;
    newBaseDocker.os = 'ubuntu';
    this.update(newBaseDocker);
  }

    onCustomUpdate = (dockerUpdate) => {
    const { config } = this.props;
    this.update({ ...cloneDeep(config.base_docker), ...dockerUpdate });
  }

    update(newBaseDocker) {
    const { onUpdate, config } = this.props;
    if (newBaseDocker.os) {
    const pred = s => getStep(s.type).os.includes(newBaseDocker.os);
    onUpdate({
    run_steps: config.run_steps.filter(pred),
    entrypoint_steps: config.entrypoint_steps.filter(pred),
    base_docker: newBaseDocker,
  });
  } else {
    onUpdate({
    base_docker: newBaseDocker,
  });
  }
  }

    render() {
    const { config: { base_docker: baseDocker } } = this.props;
    const { id } = this.state
    if (baseDocker.custom) {
    this.a = <div className="bg-white pa3">
    <div className="f3 mv2">Custom Base Docker</div>
    <SettingsEditor
    settings={Settings.docker}
    value={baseDocker}
    onUpdate={this.onCustomUpdate}
    />
    </div>
  }
    if (baseDocker.presetBase) {
    const preset = this.getPreset(baseDocker.presetBase);
    this.a = <div className="bg-white pa3">
    <div className="f3 mv2">{preset.name}</div>
    <div className="c-st mv2">[Image: {baseDocker.image_url}]</div>
    <SettingsEditor
    settings={preset.config}
    value={{ tag: baseDocker.image_url && baseDocker.image_url.split(':').pop() }}
    onUpdate={this.onPresetUpdate}
    />
    </div>
  }
    return (
    <ul className={'list pl4 pr1'}>
    {dockers.map((item, index) => <li className={'cb pv3 bt b--near-white '} key={index}><span className={'pointer h3 mv7 '}  onClick={() => this.onPresetChosen(item,index)}>{ index === id ? '' : item.name}</span>
      <ResetButton onClick={() => this.onPresetChosen(null)} index={index} id={id}/>
      { index === id ? this.a : <div></div>}
    </li>)}
    <li className={'cb pv3 bt-m bt bb b--near-white'}><span  className={'h3 mv7 pointer'} onClick={() => this.onPresetChosen('Custom',4)}>{ id === 4 ? '' : 'custom'}</span>
    <ResetButton onClick={() => this.onPresetChosen(null)} index={4} id={id}/>
    { id === 4 ? this.a : <div></div>}
    </li>
    </ul>
    );
  }}

    EditDocker.propTypes = {
    config: Models.config.isRequired,
    onUpdate: PropTypes.func.isRequired,
  };

    export default EditDocker;
    // <div>
    //   {
//     dockers.map(item => (
//         <Card
//             key={item.base}
//             name={item.name}
//             pointer
//             newConfig={this.newConfig}
//             icon={item.icon}
//             onClick={() => this.onPresetChosen(item)}
//         />
//     ))
//   }
//   <Card
//       name="Custom"
//       pointer
//       icon="fa fa-cogs"
//       onClick={() => this.onPresetChosen('Custom')}
    {/*  />*/}
  {/*</div>*/}


