import 'babel-polyfill';
import { cloneDeep, find } from 'lodash';
import * as React from 'react';
import Alert from 'react-s-alert';
import 'tachyons/css/tachyons.min.css';
import 'react-s-alert/dist/s-alert-default.css';

import gelato from './gelato/lib/index';
import './main.scss';
import Title from './title';
import Content from './content';
import Pipeline from './pipeline/pipeline';
import Index from './sider/index.jsx';
import Bar from './bar/bar';
import { validateConfig, configPreSave } from './config-utils';
import Button from './components/button';



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
      addRunStep: null,
      addEnStep: null,
      savedSteps: [],
    };
    this.onUpdate = this.onUpdate.bind(this);
    this.onSwitchContent = this.onSwitchContent.bind(this);
    this.onReset = this.onReset.bind(this);
    this.addSteps = this.addSteps.bind(this);
    this.delFromDocker = this.delFromDocker.bind(this);
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
  delFromDocker () {

  }
  componentDidUpdate() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.state));
  }

  onReset() {
    this.setState({
      config: cloneDeep(dummyConfig),
      content: {
        type: 'edit_general',
      },
    });
  }
  addSteps(step,run) {
      run ? this.setState({
        addRunStep: step
      }) : this.setState({
        addEnStep: step
      })


  }
  onUpdate(update, onclick) {
    console.log(update)
    const { config, content } = this.state;
    const newConfig = validateConfig({ ...cloneDeep(config), ...update });
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

  render() {
    const { config, content, invalid, addRunStep, addEnStep } = this.state;
    return (
      <div className="helvetica flex flex-column vh-100">
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
            <div className="w-20 ml1 br b--near-white bw1 flex flex-column justify-between pb2">
              <div className="overflow-hidden">
                {/*<Index*/}
                {/*    config={config}*/}
                {/*    content={content}*/}
                {/*    onUpdate={this.onUpdate}*/}
                {/*    onSwitchContent={this.onSwitchContent}*/}
                {/*/>*/}
                <Bar
                    addSteps={this.addSteps}
                    config={config}
                    content={content}
                    onUpdate={this.onUpdate}
                    onSwitchContent={this.onSwitchContent}
                />
                {/*<Pipeline*/}
                {/*    config={config}*/}
                {/*    content={content}*/}
                {/*    onUpdate={this.onUpdate}*/}
                {/*    onSwitchContent={this.onSwitchContent}*/}
                {/*/>*/}
              </div>
              <div style={{ flexGrow: 0 }}>
                <Button
                    className= {config.invalid ? "db w-60 bg-black-10 mid-gray  mb5 c-t tc center": "db w-60 bg-blue mid-gray  mb5 c-t tc center"}
                    disabled={config.invalid}
                    dark
                    onClick={() => {
                      try {
                        this.onSwitchContent({
                          type: 'edit_dockerfile',
                          text: gelato(configPreSave(config)),
                        });
                      } catch (ex) {
                        Alert.error(`An error occured while generating Dockerfile: ${ex}`, { position: 'bottom-right' });
                      }
                    }}
                >
                  Generate Dockerfile
                </Button>
              </div>
            </div>
            <div className="w-70 pb4 mh2 overflow-y-auto ">
              <Content
                delFromDocker={this.delFromDocker}
                addEnStep={addEnStep}
                addRunStep={addRunStep}
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
