import 'babel-polyfill';
import { cloneDeep, find } from 'lodash';
import * as React from 'react';
import Alert from 'react-s-alert';
import 'tachyons/css/tachyons.min.css';
import 'react-s-alert/dist/s-alert-default.css';
import { DefaultButton, PrimaryButton, autobind } from 'office-ui-fabric-react'

import gelato from './gelato/lib/index';
import './main.scss';
import Title from './title';
import Content from './content';
import Sidebar from './sidebar/sidebar';
import { validateConfig, configPreSave } from './config-utils';
import Button from './components/button';
import  * as iconParameter from  './sidebar/iconParameter'
import { getRectCenter } from 'fullcalendar';

const dummyConfig = {
  version: '1',
  general: {
    name: 'noname',
    shell: 'bash -c',
    env_variables: [],
    workdir: '~',
  },
  base_docker: {
    invalid: true,
  },
  run_steps: [],
  entrypoint_steps: [],
  invalid: true,
};

const LOCAL_STORAGE_KEY = 'icecream-last-state';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: dummyConfig,
      content: {
        type: 'edit_general',
      },
      savedSteps: [],
      baseDockers: '',
      runSteps: [],
      entrypointSteps: [],
      addValue: []
    };
    this.onUpdate = this.onUpdate.bind(this);
    this.onSwitchContent = this.onSwitchContent.bind(this);
    this.onReset = this.onReset.bind(this);
    this.addSteps = this.addSteps.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  async componentDidMount() {
    const item = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (item) {
      try {
        const state = JSON.parse(item);
        this.setState(state);
      } catch (ex) {
        Alert.warning('Failed to load last state.');
      }
    }
    
  }
  
  componentDidUpdate() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.state));
    const {baseDockers,config } = this.state
    if(baseDockers)  this.addIcon({on: 'docker', type: 'from', iconParameter})
    if(!config.general.invalid){
      this.addIcon( {on:'docker', type:'general',iconParameter} );
    }else{
      this.addIcon({type:'general', iconParameter});
    }
  }
  
  onReset() {
    this.setState({
      config: cloneDeep(dummyConfig),
      content: {
        type: 'edit_general',
      },
    });
  }
  addSteps(step,type) {
    const { runSteps, entrypointSteps, addValue } = this.state
    switch (type) {
      case 'add_run_step':
        runSteps.push(step)
        break;
      case 'run':
        this.setState({runSteps: step})
        break;
      case 'en':
        entrypointSteps.push(step)
        break;
      case 'entrypoint':
        this.setState({entrypointSteps: step})
        break;
      case 'baseDockers':
        this.setState({baseDockers: step, addValue:[]})
      case 'addValue':
        addValue.push(step)
        break;
      default:
    }
    
  }
  onUpdate(update, onclick) {
    const { config, content } = this.state;
    const newConfig = validateConfig({ ...cloneDeep(config), ...update }, content);
    if (content.type === 'edit_run_step') {
      const { id } = content.stepToEdit;
      const step = find(newConfig.run_steps, { id });
      let newContent;
      if (step) {
        newContent = {
          type: 'edit_run_step',
          stepToEdit: step,
        };
      } else {
        newContent = {
          type: 'edit_general',
        };
      }
      this.setState({ content: newContent, config: newConfig });
    } else if (content.type === 'edit_entrypoint_step') {
      const { id } = content.stepToEdit;
      const step = find(newConfig.entrypoint_steps, { id });
      let newContent;
      if (step) {
        newContent = {
          type: 'edit_entrypoint_step',
          stepToEdit: step,
        };
      } else {
        newContent = {
          type: 'edit_general',
        };
      }
      this.setState({ content: newContent, config: newConfig });
    } else {
      this.setState({ config: newConfig }, ()=>{
        if(content.type === 'add_run_step' && onclick){
          {newConfig.run_steps.map((item)=>{
            onclick(item,'add_run_step')})}
        }else if (content.type === 'add_entrypoint_step' && onclick){
          {newConfig.entrypoint_steps.map((item)=>{
            onclick(item)})}
        }
      })
    }
  }

  onSwitchContent(newContent) {
    this.setState({ content: newContent });
  }

  componentDidCatch(error) {
    Alert.error(error.toString(), { position: 'bottom-right' });
  }
  onClick () {
    const { config, baseDockers } = this.state;
    try {
      if(!baseDockers) {Alert.error('docker should not be empty')
        return}
      this.onSwitchContent({
        type: 'edit_dockerfile',
        text: gelato(configPreSave(config)),
      });
    } catch (ex) {
      Alert.error(`An error occured while generating Dockerfile: ${ex}`, { position: 'bottom-right' });
      
    }
  }

  addIcon = ({on,type,iconParameter})=> {
    switch (type) {
      case 'from':
        type = iconParameter.from
        break;
      case 'general':
        type = iconParameter.general
        break;
        default:
    }
    const list = document.querySelectorAll('ul li')
    const i = document.createElement('i')
      i.className = `ms-Icon ms-Icon--${type.name}`
      i.style.zIndex = type.z
      i.style.color = type.color
      i.style.left= type.lef
      i.style.float= 'left'
      i.style.top= type.top
    const diva = list[type.bl].querySelector('div button')
    if (on) {
      if(diva.querySelectorAll('i')[1]) return
      diva.appendChild(i)
    }else{
      if(!diva.querySelectorAll('i')[1]) return
      diva.removeChild(diva.querySelectorAll('i')[1])
    }
  }

  render() {
    const { config, content, baseDockers, runSteps, entrypointSteps, addValue, savedSteps } = this.state;
    const docker = baseDockers? baseDockers: ''
    const { image_url } = docker.baseDocker ? docker.baseDocker :''
    console.log(config,entrypointSteps);
    
    return (
      <div className="helvetica dark-gray f6 flex flex-column vh-100">
        {/*<Title*/}
        {/*  config={config}*/}
        {/*  onUpdate={this.onUpdate}*/}
        {/*  onReset={this.onReset}*/}
        {/*  onSwitchContent={this.onSwitchContent}*/}
        {/*  invalid={config.invalid}*/}
        {/*/>*/}
        {/* https://stackoverflow.com/questions/16671914/flexible-box-layout-model-how-should-auto-margins-in-the-cross-axis-direction-b */}
        <div className="flex self-stretch flex-auto">
          <div className="flex flex-auto mw9 center">
              <div className="w-20 ml1 overflow-y-auto border-box br b--near-white bw1 flex flex-column justify-between">
                <div>
                  <Sidebar
                      savedSteps={savedSteps}
                      baseDockers={docker}
                      addSteps={this.addSteps}
                      config={config}
                      content={content}
                      runSteps={runSteps}
                      entrypointSteps={entrypointSteps}
                      onUpdate={this.onUpdate}
                      onSwitchContent={this.onSwitchContent}
                  />
                </div>
                <div style={{ flexGrow: 0}} className='center mb5'>
                  <PrimaryButton 
                    text='Generate Dockerfile'
                    onClick={this.onClick}
                    disabled={config.invalid || !image_url}
                    allowDisabledFocus={true}
                    styles={{root:{border:'none'}}}
                  />
                  {/* <Button
                      className= {config.invalid || !image_url? "f7 db w-60 bg-black-10 mid-gray  mb5 c-t tc center": "f7 db w-60 bg mid-gray  mb5 c-t tc center"}
                      disabled={config.invalid || !image_url}
                      dark
                      onClick={this.onClick}
                  >
                    Generate Dockerfile
                  </Button> */}
                </div>
              </div>
              <div className="w-70 pb4 mh2 overflow-y-auto border-box">
                <Content
                    savedSteps={savedSteps}
                    addIcon={this.addIcon}
                    addValue={addValue}
                    baseDockers={docker}
                    addSteps={this.addSteps}
                    delFromDocker={this.delFromDocker}
                    entrypointSteps={entrypointSteps}
                    runSteps={runSteps}
                    content={content}
                    config={config}
                    onUpdate={this.onUpdate}
                    onSwitchContent={this.onSwitchContent}
                />
              </div>
            </div>
          </div>
          <Alert stack={{ limit: 3 }} />
        </div>
    );
  }
}

export default App;
