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
        isAdd: false,
      }
    getPreset = memoize(base => dockers.find(p => p.base === base));
      onPresetChosen(to, index) {
        const { id } = this.state
        this.setState({
        id: index,
      })
        if(id === index) return
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
      const {  baseDocker, th, text, baseDockers } = this
      const { items, props:{addSteps, addIcon} } = th
      const { image_url } = baseDockers ? baseDockers.baseDocker:''
      if(baseDocker.invalid || image_url){
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
          
          th.setState({docker:items})
          addIcon({on: 'docker', type: 'from', iconParameter})
          addSteps({baseDocker,items}, 'baseDockers')
          return
        }  
        th.setState({docker:items})
        addIcon({on: 'docker', type: 'from',iconParameter})
        addSteps({baseDocker,items}, 'baseDockers')
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
        const presetBase = baseDockers? baseDockers.baseDocker.presetBase ? cloneDeep(baseDockers.baseDocker.presetBase ) : 'a': ''
        return baseDocker.presetBase === presetBase || isShow || baseDockers.items  ?  <DefaultButton
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
      const { config: { base_docker: baseDocker }, baseDockers, addValue, addSteps, addIcon} = this.props;
      const { id,isAdd } = this.state
      const docker = baseDockers.items? baseDockers.items:''
      if (baseDocker.custom) {
      this.a = <div className="bg-white black-60">
                <div className="mv2">Custom Base Docker</div>
                <SettingsEditor
                addValue={addValue}
                addSteps={addSteps}
                baseDockers={baseDockers}
                settings={Settings.docker}
                isAdd={isAdd}
                putAdd={()=>this.putAdd(this)}
                value={baseDocker}
                onUpdate={this.onCustomUpdate}
                />
                { this._getButton () }
                </div>
      }
      if (baseDocker.presetBase) {
          const preset = this.getPreset(baseDocker.presetBase);
          this.a = <div className="bg-white black-60">
          {/* <div className="mv2">{preset.name}</div> */}
          <div className="c-st mv2 f7">[Image: {baseDocker.image_url}]</div>
          <SettingsEditor
          isAdd={isAdd}
          addValue={addValue}
          addSteps={addSteps}
          putAdd={()=>this.putAdd(this)}
          baseDocker={baseDocker}
          baseDockers={baseDockers}
          settings={preset.config}
          value={{ tag: baseDocker.image_url && baseDocker.image_url.split(':').pop() }}
          onUpdate={this.onPresetUpdate}
          />
          { this._getButton () }
          </div>
    }
      return (
        <ul className={'list pl4 f6 pr1'}>
          {dockers.map((item, index) => <li className={'cb pv3 bt b--near-white '} key={index}><span className={C({'blue':docker.name === item.name},'pointer h3 mv7')}  
            onClick={() => { this.items= item, this.onPresetChosen(item,index)}}>{item.name}
            </span>
            <i className={C({'dn':docker.name !== item.name},'v-mid ml3 ms-Icon ms-Icon--CircleFill blue')} />
            <i className={C({'dn':docker.name !== item.name},'v-top nl2_9 ms-Icon ms-Icon--StatusCircleCheckmark white')} />
            <i className= {C({"dn":index === id,},"pointer mr3 fr f7 ms-Icon ms-Icon--ChevronDownMed black-30")}
             onClick= {() => { this.items= item, this.onPresetChosen(item,index)}}
            />
            <i className={C({'dn':index !== id,},"pointer mr3 fr f7 ms-Icon ms-Icon--ChevronUpMed black-30")}
            onClick= {()=> this.setState({id:10})}
            />
            { index === id ? this.a : <div></div>}
          </li>)}
          <li className={'cb pv3 bt-m bt bb b--near-white'}><span  className={C({'blue':docker==='Custom'},'h3 mv7 pointer')}
            onClick={() => { this.items = 'Custom', this.onPresetChosen('Custom',4)}}>Custom</span>
            <i className={C({'dn':docker !== 'Custom'},'v-mid ml3 ms-Icon ms-Icon--CircleFill blue')} />
            <i className={C({'dn':docker !== 'Custom'},'v-top nl2_9 ms-Icon ms-Icon--StatusCircleCheckmark white')} />
            <i className= {C({"dn":id === 4,},"pointer mr3 fr f7 ms-Icon ms-Icon--ChevronDownMed black-30")}
             onClick= {() => { this.items= 'Custom', this.onPresetChosen('Custom',4)}}
            />
            <i className={C({'dn':id !== 4,},"pointer mr3 fr f7 ms-Icon ms-Icon--ChevronUpMed black-30")}
            onClick= {()=> this.setState({id:10})}
            />
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


