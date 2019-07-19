import C from 'classnames';
import { cloneDeep } from 'lodash';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';

import * as models from '../../models';
import Button from '../../components/button';

export default class TableEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invalid: !props.validate(props.value),
    };
  }

  onChange(row, col, val) {
   
    const { value } = this.props;
    const newVal = cloneDeep(value);
    newVal[row][col] = val;
    this.validateAndUpdate(newVal);
  }

  onAddRow() {
    const { value } = this.props;
    const newVal = cloneDeep(value);
    newVal.push({});
    this.validateAndUpdate(newVal);
  }

  onRemoveRow(row) {
    const { value } = this.props;
    const newVal = cloneDeep(value);
    newVal.splice(row, 1);
    this.validateAndUpdate(newVal);
  }

  validateAndUpdate(newVal) {
    const { onUpdate, validate } = this.props;
    if (validate(newVal)) {
      this.setState({ invalid: false });
    } else {
      this.setState({ invalid: true });
    }
    onUpdate(newVal);
  }
  
  render() {
    const { invalid } = this.state;
    const {
      label, value, headers, disabled, t
    } = this.props;
    const flatHeaders = headers.map(x => (
      typeof x === 'object' ? x.name : x
    ));

    return (
      <>
        <div className={C({ red: invalid })}>
          {label}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${flatHeaders.length}, auto) min-content`,
          }}
          className="mt2 w-50"
        >
          {flatHeaders.map((x => (
            <div key={`header-${x}`} className="pb2">
              {x}
            </div>
          )))}
          <div />
          {value.map((row, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={idx}>
              {flatHeaders.map(col => {
                return(
                  <div key={col + idx}>
                    <TextField
                      key={col + idx}
                      autoComplete='off'
                      value={row[col] || ''}
                      className={col === 'Package' ? "mb3 w-95" : "mb3 w-90"}
                      type="text"
                      onChange={e => this.onChange(idx, col, e.target.value)}
                      disabled={disabled}
                      label="" 
                      placeholder="Please enter text here" 
                    />
                    <div className='w-90 h-10 white'>&nbsp</div>
                </div>
                // <input
                //   // eslint-disable-next-line react/no-array-index-key
                //   key={col + idx}
                //   style={ col === 'Package' ? {border: 0, outline: 0, backgroundColor: 'white', borderBottom: '2px solid #4EA1E1'}: {} }
                //   className={col === 'Package' ? "ph1 mb3 pv1 w-95 black-50" : "ph1 mb3 pv1 w-90 black-50" }
                //   value={row[col] || ''}
                //   type="text"
                //   onChange={e => this.onChange(idx, col, e.target.value)}
                //   disabled={disabled}
                // />
              )})}
              <Button
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                className='ml-1'
                onClick={() => this.onRemoveRow(idx)}
                disabled={disabled}
              >
                <i className="ms-Icon ms-Icon--Cancel" />
              </Button>
            </React.Fragment>
          ))}
        </div>
        <div className={C({'dn':t ==="add_run_step" || t === "add_entrypoint_step"},'w-20')}>
          <Button className='flex' onClick={() => this.onAddRow()} disabled={disabled}>
            <i className='f5 ms-Icon ms-Icon--CircleAddition mr1' aria-hidden="true"/>Add items
          </Button>
        </div>
      </>
    );
  }
}

TableEditor.propTypes = {
  label: PropTypes.node.isRequired,
  headers: PropTypes.arrayOf(models.tableHeader).isRequired,
  // eslint-disable-next-line
  value: PropTypes.array,
  onUpdate: PropTypes.func.isRequired,
  validate: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

TableEditor.defaultProps = {
  value: [],
  disabled: false,
};
