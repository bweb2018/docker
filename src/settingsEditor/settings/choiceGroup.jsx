import * as PropTypes from 'prop-types';
import * as React from 'react';
import C from 'classnames';

import * as models from '../../models';

class ChoiceGroup extends React.Component {
  componentDidMount() {
    this.onPropChange();
  }

  componentDidUpdate() {
    this.onPropChange();
  }

  onPropChange() {
    const { onUpdate, options, value } = this.props;
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
      label, options, onUpdate, value, disabled
    } = this.props;
    return (
      <>
        <div>{label}</div>
        <div className="pt2 pl0">
          {
            options.map((option)=> (
             
              <div
                key={option.name}
                className={C({
                  'b--pd': value === option.name,
                  'b--pl': value !== option.name,
                  'c-st': disabled,
                  pointer: !disabled,
                }, 'bg-black-05 ba dib mr2 mb1 pv1 ph2')}
                style={{ userSelect: 'none' }}
                onClick={disabled ? null : (() => onUpdate(option.name))}
              >
                {option.iconClass && <i className={C(option.iconClass, 'mr1')} />}
                {option.name}
              </div>
            ))
          }
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
