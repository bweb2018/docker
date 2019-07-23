import * as PropTypes from 'prop-types';
import * as React from 'react';
import { DefaultButton } from 'office-ui-fabric-react'

import * as models from '../../models';

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
    const isShow = baseDocker && baseDockers.baseDocker ?
      baseDocker.presetBase === baseDockers.baseDocker.presetBase : baseDockers ?
      baseDockers.baseDocker.custom || false: false
    let arr  
    if(addValue && addValue.length > 0){
       arr = addValue.filter(e=> e)
    }
    return (
      <>
        <div>{label}</div>
        <div className="pt2 pl0">
          {options.map((option)=> {
            const isShowStyleBool = arr ? arr.find(e=> e=== option.name) === option.name :''
              return(
                  <DefaultButton
                    key={option.name}
                    styles={{
                      rootPressed: {
                        color:arr && isShow? isShowStyleBool ?'white': '':'',
                        backgroundColor: arr && isShow? isShowStyleBool ?'#0078D4':'#C8C8C8':'#C8C8C8'},
                      rootFocused: {backgroundColor: arr && isShow? isShowStyleBool ?'#0078D4':'#C8C8C8':'#C8C8C8'},
                      rootHovered: {
                        color:arr && isShow? isShowStyleBool ?'white': '':'',
                        backgroundColor:arr && isShow? isShowStyleBool ?'#0078D4': '#F4F4F4':''},
                      root: {border:'none', marginRight:'8px', marginBottom:'8px',fontWeight: 300, 
                      color:arr && isShow? isShowStyleBool ? 'white': '':'',
                      backgroundColor: arr && isShow? isShowStyleBool ?'#0078D4': '#F4F4F4':'#F4F4F4'
                    }}}
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
