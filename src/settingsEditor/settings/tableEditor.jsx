import C from 'classnames';
import { cloneDeep } from 'lodash';
import * as PropTypes from 'prop-types';
import * as React from 'react';

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
      label, value, headers, disabled,
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

          className="pv2 w-50 mb4"
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
              {flatHeaders.map(col => (
                <input
                  // eslint-disable-next-line react/no-array-index-key
                  key={col + idx}
                  className="ph2 pv1 w-90"
                  value={row[col] || ''}
                  type="text"
                  onChange={e => this.onChange(idx, col, e.target.value)}
                  disabled={disabled}
                />
              ))}
              <Button
                // eslint-disable-next-line react/no-array-index-key
                key={idx}
                onClick={() => this.onRemoveRow(idx)}
                disabled={disabled}
              >
                <i className="fa fa-remove" />
              </Button>
            </React.Fragment>
          ))}
        </div>
        <div className="mt1">
          <Button onClick={() => this.onAddRow()} disabled={disabled}>
            <i className="fa fa-plus mr1" />
            <span>Add</span>
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
