import * as PropTypes from 'prop-types';
import * as React from 'react';
import C from 'classnames';
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
    const { onUpdate, options, value, isAdd, putAdd, baseDockers } = this.props;
    console.log(value);
    if(isAdd) {
      console.log(111)
      baseDockers.option = value
      console.log(putAdd())
    }
    if (!options || !options.length) {
      throw new Error('invalid options');
    }
    if (!value || !options.find(x => x.name === value)) {
      console.log(options[0].name);
      onUpdate(options[0].name);
    }
  }

  render() {
    const {
      label, options, onUpdate, value, disabled, baseDockers,putAdd
    } = this.props;
    const tag = baseDockers ? baseDockers.image_url && baseDockers.image_url.split(':').pop():''
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
                    rootHovered: {backgroundColor: tag === option.name.slice(0,5)?'#0078D4': '#EDEBE9',
                    color: tag === option.name.slice(0,5)?'white': ''
                    },
                    root: {border:'none', marginRight:'8px',
                    color: tag === option.name.slice(0,5)?'white': '',
                    backgroundColor: tag === option.name.slice(0,5)?'#0078D4': '#F3F2F1'
                  }}}
                    onClick={disabled ? null : (() => onUpdate(option.name))}
                  >
                    {/* {option.iconClass && <i className={C(option.iconClass, 'mr1')} />} */}
                    {option.name}
                  </DefaultButton>
              // <div
              //   key={option.name}
              //   className={C({
              //     'b--pd': value === option.name,
              //     'b--pl': value !== option.name,
              //     'c-st': disabled,
              //     pointer: !disabled,
              //   }, 'bg-black-05 ba dib mr2 mb1 pv1 ph2')}
              //   style={{ userSelect: 'none' }}
              //   onClick={disabled ? null : (() => onUpdate(option.name))}
              // >
              //   {option.iconClass && <i className={C(option.iconClass, 'mr1')} />}
              //   {option.name}
              // </div>
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
