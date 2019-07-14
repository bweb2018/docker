import * as PropTypes from 'prop-types';
import * as React from 'react';
import C from 'classnames';
import { cloneDeep, memoize } from 'lodash';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react'

import * as Models from '../models';
import Button from '../components/button';
import SettingsEditor from '../settingsEditor';
import dockers from './dockers';
import * as Settings from './settings';
import { getStep } from './steps';
import  * as iconParameter from  '../sidebar/iconParameter'
import {validateConfig} from "../config-utils";
import { Position } from 'office-ui-fabric-react/lib/utilities/positioning';
import { root } from 'postcss-selector-parser';

    const ResetButton = ({ onClick, item, index, id}) => (<Button className="fr" onClick={onClick} >
    { <i className={ index === id ? "fr f7 ms-Icon ms-Icon--ChevronUpMed black-30" : "f7 ms-Icon ms-Icon--ChevronDownMed black-30"} aria-hidden="true" /> }
    </Button>);

    ResetButton.propTypes = {
      onClick: PropTypes.func.isRequired,
  };

    class EditDocker extends React.Component {
      state ={
        id: '',
        isShow: false,
        isAdd: false
      }
    getPreset = memoize(base => dockers.find(p => p.base === base));
      onPresetChosen(to, index) {
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
      this.baseDocker = newBaseDocker
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
    putAdd (t) {
      t.setState({
        isAdd: false 
      })
    }
    _clicked () {
      const {  baseDocker, th, text,  } = this
      const { items, props:{addSteps, addIcon, addValue}, putAdd} = th
      if(baseDocker.invalid && items === 'Custom'){
        alert('docker should not be empty')
        return
      }
      if (text === 'Apply') {
        if(!baseDocker.image_url) return
        th.setState({
          isShow: false,
          isAdd: true
        })
        if (items === 'Custom') {
          th.setState({
            isShow: true,
            isAdd: true
          })
          addIcon({on: 'docker', type: 'from', iconParameter})
          addSteps(baseDocker, 'baseDockers')
          return
        }  
        addIcon({on: 'docker', type: 'from',iconParameter})
        addSteps(baseDocker, 'baseDockers')
      }else if(text === 'Cancel'){
        th.setState({
          isShow: false,
          isAdd: false
        })
        addIcon({type:'from',iconParameter})
        if(items !== 'Custom') th.update(th.baseDocker)
        addSteps('', 'baseDockers')
      }
    }
   
   
      _getButton () {
        const { baseDockers, config: { base_docker: baseDocker } } = this.props
        const { _clicked } = this
        const th = this
        const { isShow } = this.state
        const presetBase = baseDockers? baseDockers.presetBase ? cloneDeep(baseDockers.presetBase ) : 'a': ''
        return baseDocker.presetBase === presetBase || isShow ?  <DefaultButton
            baseDocker={baseDocker}
            th={th}
            styles={{root:{border:'none'}}}
            text='Cancel'
            onClick={_clicked}
            allowDisabledFocus={true}
        /> : <PrimaryButton
                                                          baseDocker={baseDocker}
                                                          text='Apply'
                                                          th={th}
                                                          onClick={_clicked}
                                                          allowDisabledFocus={true}
                                                      />
    }
    render() {
      const { config: { base_docker: baseDocker }, baseDockers, addValue, addSteps } = this.props;
      const { id,isAdd } = this.state
      if (baseDocker.custom) {
      this.a = <div className="bg-white">
                <div className="mv2">Custom Base Docker</div>
                <SettingsEditor
                addValue={addValue}
                baseDockers={baseDockers}
                settings={Settings.docker}
                isAdd={isAdd}
                addSteps={addSteps}
                putAdd={()=>this.putAdd(this)}
                value={baseDocker}
                onUpdate={this.onCustomUpdate}
                />
                { this._getButton () }
                </div>
      }
      if (baseDocker.presetBase) {
          const preset = this.getPreset(baseDocker.presetBase);
          this.a = <div className="bg-white">
          <div className="mv2">{preset.name}</div>
          <div className="c-st mv2 f7">[Image: {baseDocker.image_url}]</div>
          <SettingsEditor
          isAdd={isAdd}
          addValue={addValue}
          addSteps={addSteps}
          putAdd={()=>this.putAdd(this)}
          baseDockers={baseDockers}
          settings={preset.config}
          baseDocker={baseDocker}
          value={{ tag: baseDocker.image_url && baseDocker.image_url.split(':').pop() }}
          onUpdate={this.onPresetUpdate}
          />
          { this._getButton () }
          </div>
    }
      return (
        <ul className={'list pl4 f6 pr1 black-80'}>
          {dockers.map((item, index) => <li className={'cb pv3 bt b--near-white '} key={index}><span className={'pointer h3 mv7 '}  
            onClick={() => { this.items= item, this.onPresetChosen(item,index)}}>{ index === id ? '' : item.name}</span>
            {/* <ResetButton onClick={ ()=> {this.items= item, this.onPresetChosen(item,index,id)}} /> */}
            <i className= {C({"dn":index === id,},"fr f7 ms-Icon ms-Icon--ChevronDownMed black-30")}
              onClick= {() => { this.items= item, this.onPresetChosen(item,index)}}
              />
            <i className={C({'dn':index !== id,},"fr f7 ms-Icon ms-Icon--ChevronUpMed black-30")}
              onClick= {()=> this.setState({id:10})}
              />
            { index === id ? this.a : <div></div>}
          </li>)}
          <li className={'cb pv3 bt-m bt bb b--near-white'}><span  className={'h3 mv7 pointer'}
            onClick={() => { this.items = 'Custom', this.onPresetChosen('Custom',4)}}>{ id === 4 ? '' : 'custom'}</span>
            <ResetButton onClick={() => this.onPresetChosen(null)} index={4} id={id}/>
            { id === 4 ? this.a : <div></div>}
          </li>
        </ul>
      );
  }}

    EditDocker.propTypes = {
      addSteps: PropTypes.func.isRequired,
      addIcon: PropTypes.func.isRequired,
      config: Models.config.isRequired,
      onUpdate: PropTypes.func.isRequired,
  };

    export default EditDocker;


