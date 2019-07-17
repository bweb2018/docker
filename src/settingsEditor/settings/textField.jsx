import * as PropTypes from 'prop-types';
import * as React from 'react';
import C from 'classnames';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Stack, IStackProps } from 'office-ui-fabric-react/lib/Stack';

export default class TextFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invalid: !props.validate(props.value),
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(values) {
    const { onUpdate, validate } = this.props;
    const value = values ? values : ''
    if (validate(value)) {
      console.log(value)
      this.setState({ invalid: false });
    } else {
      this.setState({ invalid: true });
    }
    onUpdate(value);
  }
  _inputMessage = (e)=> {
    const value = e.target.value
    this.onChange(value)
  }
  render() {
    const { invalid } = this.state;
    const errorMessage = invalid ? 'docker should not be empty' : ''
    const { value, label, disabled, t } = this.props;
    return (
      <>
        <div className={C({ red: invalid})} className={t ==='add_run_step' || t === 'add_entrypoint_step' ? 'mb0':'mb3'}>{label}</div>
        {
          !disabled 
            ? (
                <Stack horizontal tokens={{ childrenGap: 50 }}  >
                  <TextField className={C({'dn':t==='add_run_step' || t=== 'add_entrypoint_step'})} 
                    errorMessage={errorMessage} 
                    onChange ={this._inputMessage} 
                    defaultValue={value}  
                    required placeholder="Enter text here" 
                    label="Required:"
                    underlined 
                  />
                </Stack>
            )
            : (
                <Stack horizontal tokens={{ childrenGap: 50 }} >
                  <TextField label="Disabled:" underlined disabled defaultValue={value} />
                </Stack>
            )
        }
      </>
    );
  }
}

TextFields.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.string,
  onUpdate: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  validate: PropTypes.func.isRequired,
};

TextFields.defaultProps = {
  value: '',
  disabled: false,
};
{/*<input*/}
{/*    style={{ border: 0, outline: 0, borderBottom: '1px solid' }}*/}
{/*    className={C({ 'bb b-red': invalid }, 'pb1 w-20 nb3-ns black-70')}*/}
{/*    value={value}*/}
{/*    onChange={this.onChange}*/}
{/*/>*/}
{/*<input*/}
{/*    style={{ border: 0, outline: 0, backgroundColor: 'white', borderBottom: '2px solid #4EA1E1' }}*/}
{/*    className='w-20 nb4-ns black-70'*/}
{/*    disabled*/}
{/*    value={value}*/}
{/*/>*/}
