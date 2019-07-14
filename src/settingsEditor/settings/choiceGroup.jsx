import * as PropTypes from 'prop-types';
import * as React from 'react';
import { cloneDeep } from 'lodash';
import C from 'classnames';
import { DefaultButton } from 'office-ui-fabric-react'

import * as models from '../../models';
import { HitDragListener } from 'fullcalendar';

class ChoiceGroup extends React.Component {
  componentDidMount() {
    this.onPropChange();
  }

  componentDidUpdate() {
    this.onPropChange();
  }
  
  onPropChange() {
    const { onUpdate, options, value, isAdd, putAdd, addSteps} = this.props;
    if(isAdd) {
      addSteps(value,'addValue')
      putAdd()
    }
    console.log(value)
    if (!options || !options.length) {
      throw new Error('invalid options');
    }
    if (!value || !options.find(x => x.name === value)) {
      onUpdate(options[0].name);
    }
  }

  render() {
    const {
      label, options, onUpdate, disabled, baseDockers, addValue, baseDocker
    } = this.props;
    let arr
    const isShow = baseDocker  ? baseDocker.presetBase === baseDockers.presetBase : baseDockers ? baseDockers.custom:''  
    if(addValue && addValue.length > 0){
       arr = addValue.filter(e=> e)
    }
     
    return (
      <>
        <div>{label}</div>
        <div className="pt2 pl0">
          {options.map((option)=> {
              return(
                  <DefaultButton
                  key={option.name}
                  styles={{
                    rootFocused: {backgroundColor:'#C8C8C8'},
                    rootHovered: {backgroundColor:arr && isShow? arr.find(e=> e=== option.name) === option.name ?'#0078D4': '#EDEBE9':''},
                     root: {border:'none', marginRight:'8px', marginBottom:'8px',
                     color:arr && isShow? arr.find(e=> e=== option.name) === option.name ? 'white': '':'',
                     backgroundColor: arr && isShow? arr.find(e=> e=== option.name) === option.name ?'#0078D4': '#F3F2F1':''
                   }
                }}
                    onClick={disabled ? null : (() => onUpdate(option.name))}
                  >
                    {option.name}
                  </DefaultButton>
            )})}
        </div>
      </>
    );
  }
}

ChoiceGroup.propTypes = {
  label: PropTypes.node.isRequired,
  options: PropTypes.arrayOf(models.choiceOption).isRequired,
  onUpdate: PropTypes.func.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
};

ChoiceGroup.defaultProps = {
  value: '',
  disabled: false,
};

export default ChoiceGroup;
