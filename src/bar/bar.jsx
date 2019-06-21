import * as React from 'react';
import { cloneDeep } from 'lodash';
import { Nav } from 'office-ui-fabric-react/lib/Nav';
import * as Models from "../models";
import * as PropTypes from "prop-types";
import './bar.scss'
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

initializeIcons();

class Bar extends React.Component {
    state = {
        step: null,
        selectedKey: ''

    }

    _onLinkClick = (item,k) =>{
        const { config:{run_steps, entrypoint_steps}, content, onUpdate, onSwitchContent, addSteps } = this.props
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
        const entrypointNewItems = cloneDeep(entrypoint_steps)
        const runNewItems = cloneDeep(run_steps)
        const idx = runNewItems.findIndex(ni => {
            n = ni.id
            return ni.id === k.key
        });
        const id = entrypointNewItems.findIndex(ni => {
            i = ni.id
            return ni.id === k.key
        });
        // run_steps.splice(idx, 1);
        // onUpdate(entrypointNewItems);
        if(n === k.key){
            addSteps(runNewItems[idx],'run')
            onSwitchContent({ type: 'edit_run_step', stepToEdit: run_steps[idx] })
        }else if(i === k.key){
            addSteps(entrypoint_steps[id])
            onSwitchContent({ type: 'edit_entrypoint_step', stepToEdit:  entrypoint_steps[id] })
        }
    }
    getStep = (steps) =>{
       return  steps.map((step) => {
            return {name: step.name , key: step.id}
        })
    }

   render (){
        const { content, config, config:{ run_steps, entrypoint_steps }} = this.props
        this.run_steps =  this.getStep(run_steps)
        this.entrypoint_steps = this.getStep(entrypoint_steps)
       return (
               <Nav
                   className='ms-Nav-navItem'
                   aria-hidden="true"
                   selectedKey= { content.type }
                   onLinkClick={this._onLinkClick}
                   styles={{
                       root: { width: 286, boxSizing: 'border-box' },
                       link: { height: 60, whiteSpace: 'pre', lineHeight: 18 },
                   }}
                   expandButtonAriaLabel="Expand or collapse"
                   groups={[
                       {
                           links:[
                               {
                                   name: 'General'+'\n'+`${config.general.name || ''}`,
                                   key: 'edit_general',
                                   icon: config.general.name ? 'Completed': 'warning',
                               },
                               {
                                   name: 'From '+'\n'+`${config.base_docker.image_url || ''}`,
                                   key: 'edit_docker',
                                   icon: config.base_docker.image_url ? 'Completed': 'warning',
                                   className: 'ms-Button-icon icon'
                               },
                               {
                                   name: 'Run',
                                   key: 'add_run_step',
                                   links:this.run_steps,
                                   isExpanded: true
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
