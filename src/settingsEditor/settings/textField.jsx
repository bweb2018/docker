import * as PropTypes from 'prop-types';
import * as React from 'react';
import C from 'classnames';

export default class TextField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invalid: !props.validate(props.value),
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { onUpdate, validate } = this.props;
    const { value } = e.target;
    if (validate(value)) {
      this.setState({ invalid: false });
    } else {
      this.setState({ invalid: true });
    }
    onUpdate(value);
  }

  render() {
    const { invalid } = this.state;
    const { value, label, disabled } = this.props;
    return (
      <>
        <div className={C({ red: invalid })}>{label}</div>
        {
          !disabled
            ? (
              <input
                style={{ border: 0, outline: 0, borderBottom: '1px solid #cdecff' }}
                className={C({ 'ba b--red': invalid }, 'w-20 ')}
                value={value}
                onChange={this.onChange}
              />
            )
            : (
              <input
                style={{ border: 0, outline: 0, backgroundColor: 'white', borderBottom: '2px solid #cdecff' }}
                className='w-20 '
                disabled
                value={value}
              />
            )
        }
      </>
    );
  }
}

TextField.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  validate: PropTypes.func.isRequired,
};

TextField.defaultProps = {
  value: '',
  disabled: false,
};
