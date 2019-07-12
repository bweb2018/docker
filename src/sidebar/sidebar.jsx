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

class Bar extends React.Component {
    state = {
        step: null,
        selectedKey: '',
        addBool: true
    }
    componentDidMount() {
        const buttons = document.querySelectorAll('button')
        buttons.forEach( button=>{
            button.title =''
        })
    }

    _onLinkClick = (item,k) =>{
        const { runSteps, enSteps, onSwitchContent, config } = this.props
        let {key} = k;
        const  keyType = typeof k.key;
        switch ( keyType === 'string') {
            case key === 'edit_general':
                onSwitchContent({ type: 'edit_general' })
                break;
            case key === 'edit_docker':
                onSwitchContent({ type: 'edit_docker' })
                break;
            case key === 'add_run_step':
                onSwitchContent({ type: 'add_run_step' })
                break;
            case key === 'add_entrypoint_step':
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
        // config.run_steps.splice(idx, 1);
        // config.entrypoint_steps.splice(idx, 1);
        // onUpdate(entrypointNewItems);
        if(n === k.key){
            // console.log(runNewItems[idx])
            // addSteps(runNewItems[idx],'run')
            onSwitchContent({ type: 'edit_run_step', stepToEdit: runSteps[idx] })
        }else if(i === k.key){
          
            // addSteps(entrypoint_steps[id],'entrypoint')
            onSwitchContent({ type: 'edit_entrypoint_step', stepToEdit:  enSteps[id] })
        }
    }
    getStep = (steps) =>{
        return  steps.map((step) => {
            return {name: step.name , key: step.id}
        })
    }
    
    render (){
        const { content, config,  baseDockers, runSteps, enSteps } = this.props
        this.run_steps =  this.getStep(runSteps)
        this.entrypoint_steps = this.getStep(enSteps)
        let docker = baseDockers ? baseDockers.image_url: ''
        return (
            <div>
            <Nav
                selectedKey= { content.stepToEdit ? content.stepToEdit.id : content.type }
                onLinkClick={this._onLinkClick}
                styles={{
                    chevronIcon: {color: yellow},
                    root: { width: 290 },
                    link: { height: 52, whiteSpace: 'pre', lineHeight: 10 }
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
                                icon: docker ? `StatusCircleCheckmark` : 'warning',
                            },
                            {
                                name: 'Run',
                                key: 'add_run_step',
                                links:this.run_steps,
                                isExpanded: true,
                            },
                            {
                                name: 'Entrypoint',
                                key: 'add_entrypoint_step',
                                links:this.entrypoint_steps,
                                isExpanded: true,
                            }
                        ]
                    }
                ]}
            
            />
        
            </div>
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
