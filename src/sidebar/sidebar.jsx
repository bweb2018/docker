import * as React  from 'react';
import { cloneDeep } from 'lodash';
import { Nav } from 'office-ui-fabric-react/lib/Nav';
import * as Models from "../models";
import * as PropTypes from "prop-types";
import './sidebar.scss'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';
 
initializeIcons();
import { from } from 'rxjs';
import { yellow } from 'ansi-colors';
import { is } from 'immutable';

class Bar extends React.Component {
    state = {
        step: null,
        selectedKey: '',
        addBool: true,
        switchType: ''
    }
    componentDidMount() {
        const buttons = document.querySelectorAll('button')
        buttons.forEach( button=>{
            button.title =''
        })
    }
//     isDelStep = (steps)=> {
//     const {
//       type, onSwitchContent, addSteps, content, runSteps, enSteps, stepToEdit, savedSteps
//     } = this.props;
//     const newStepList = cloneDeep(steps);
//     const idx = newStepList.findIndex(item => item.id === stepToEdit.id);
//     steps.splice(0, 1)
//     console.log(steps);
//     if(!runSteps.length&&!enSteps.length){
//       savedSteps.splice(1,1,'edit_general')
//       onSwitchContent({type: 'edit_general'})
//     }else if(runSteps.length) {
//       console.log(steps[idx+1]);
//       savedSteps.splice(1,1,step[idx].id)
//       console.log(savedSteps);
//     }
//     // if(runSteps.length === 0 && enSteps.length > 1){
//       //   savedSteps.splice(1,1,'add_entrypoint_step')
//       // }else if(enSteps.length === 0 && runSteps.length > 1) {
//       //   savedSteps.splice(1,1,'add_run_step')
//       // }else {
//       //   savedSteps.splice(1,1,'edit_general')
//       // }
//     addSteps(steps,type)
//   }

 
    _onLinkClick = (item,k) =>{
        const { className } = item.target
        const { runSteps, enSteps, onSwitchContent, savedSteps, content, addSteps } = this.props
        let {key} = k;
        savedSteps.splice(1,1,key || 'edit_general')
        switch ( key) {
            // case 'edit_general':
            //     onSwitchContent({ type: 'edit_general' })
            //     break;
            // case 'edit_docker':
            //     onSwitchContent({ type: 'edit_docker' })
            //     break;
            // case 'add_run_step':
            //     onSwitchContent({ type: 'add_run_step' })
            //     break;
            // case 'add_entrypoint_step':
            //     onSwitchContent({ type: 'add_entrypoint_step' })
            //     break;
                case 'edit_general':
                        savedSteps.splice(1,1,'edit_general')
                        onSwitchContent({ type: 'edit_general' })
                        break;
                case 'edit_docker':
                    
                    savedSteps.splice(1,1,'edit_docker')
                    onSwitchContent({ type: 'edit_docker' }) 
                    
                    break;
                case 'add_run_step':
                    savedSteps.splice(1,1,'add_run_step')
                    onSwitchContent({ type: 'add_run_step' }) 
                    break;
                case 'add_entrypoint_step':
                    savedSteps.splice(1,1,'add_entrypoint_step')
                    onSwitchContent({ type: 'add_entrypoint_step' })
                    break;
            }
        let n
        let i
        const entrypointNewItems = cloneDeep(enSteps)
        const runNewItems = cloneDeep(runSteps)
        const idx = runNewItems.findIndex(ni => {
            n = ni.id
            return ni.id === k.key
        });
        const id = entrypointNewItems.findIndex(ni => {
            i = ni.id
            return ni.id === k.key
        });
        if((idx || id) && (className.indexOf('icon') != -1)) {
            if(content.type === 'edit_run_step') {
                runSteps.splice(idx,1)
                addSteps(runSteps, 'run')
                if(runSteps.length) {savedSteps.splice(1,1,runSteps[0].id)
                }else {
                    if(enSteps.length) {savedSteps.splice(1,1,enSteps[0].id)
                    }else {
                        onSwitchContent({ type: 'edit_general' })
                        savedSteps.splice(1,1,'edit_general')
                    }
                }
            }else if(content.type === 'edit_entrypoint_step') {
                enSteps.splice(id,1)
                addSteps(enSteps, 'entrypoint')
                if(enSteps.length) {savedSteps.splice(1,1,enSteps[0].id)
                }else {
                    if(runSteps.length) {savedSteps.splice(1,1,runSteps[0].id)
                    }else {
                        onSwitchContent({ type: 'edit_general' })
                        savedSteps.splice(1,1,'edit_general')
                    }
                }
            }
        }
        if(n === k.key && runSteps.length){
            onSwitchContent({ type: 'edit_run_step', stepToEdit: runSteps[idx] })
        }else if(i === k.key && enSteps.length){
            onSwitchContent({ type: 'edit_entrypoint_step', stepToEdit:  enSteps[id] })
        }
    }
    getStep = (steps) =>{
        return  steps.map((step) => {
            return {name: step.name , key: step.id, icon: 'Delete'}
        })
    }
    
    render (){
        const {  config,  baseDockers, runSteps, enSteps, savedSteps } = this.props
        this.run_steps =  this.getStep(runSteps)
        this.entrypoint_steps = this.getStep(enSteps)
        let docker = baseDockers ? baseDockers.baseDocker.image_url: ''
        return (
           savedSteps.length > 1 ? <Nav
                initialSelectedKey= { savedSteps[1] }
                selectedKey= { savedSteps[1] }
                onLinkClick={ this._onLinkClick }
                styles={{
                    chevronIcon: {color: yellow},
                    link: { height: 52, whiteSpace: 'pre', lineHeight: 14, color:'#333' }
                }}
                groups={[
                    {
                        links:[
                            {
                                name: 'General'+'\n'+`${config.general.name || ''}`,
                                key: 'edit_general',
                                icon: config.general.name ? `StatusCircleCheckmark` : 'warning',
                            },
                            {
                                name: 'From'+'\n'+`${docker}`,
                                key: 'edit_docker',
                                icon: docker ? 'StatusCircleCheckmark' : 'warning',
                            },
                            {
                                name: 'Run',
                                key: 'add_run_step',
                                links: this.run_steps,
                                isExpanded: true,
                            },
                            {
                                name: 'Entrypoint',
                                key: 'add_entrypoint_step',
                                links: this.entrypoint_steps,
                                isExpanded: true,
                                
                            }
                        ]
                    }
                ]}
            /> : <div></div>
        )
    };
}

Bar.propTypes = {
    addSteps: PropTypes.func.isRequired,
    config: Models.config.isRequired,
    content: Models.content.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onSwitchContent: PropTypes.func.isRequired,
};
export default Bar;
