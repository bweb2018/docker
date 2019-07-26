import * as PropTypes from 'prop-types';
import * as React from 'react';
import C from 'classnames';

const BaseDockerLIst = ({
  name,
  warning,
  onClick,
  selected,
  pointer,
  children,
  newConfig
}) => {

  return(
      <div
    className={C({
      'bg-white-80': selected,
      'bg-white hover-bg-white-90 ph4': !selected && !warning,
      'bg-washed-red': warning,
      pointer,
    }, 'h3 pa3 flex items-center justify-between')}
    style={{ userSelect: 'none' }}
    onClick={onClick}
  >
    <div className="flex">
      <div>{name}</div>
    </div>
    <div>
      {warning && <i className="f4 dark-red fa fa-exclamation-triangle" />}
      {children}
    </div>
  </div>
)};

BaseDockerLIst.propTypes = {
  name: PropTypes.node.isRequired,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  warning: PropTypes.bool,
  selected: PropTypes.bool,
  pointer: PropTypes.bool,
  children: PropTypes.node,
  newConfig: PropTypes.object
};

BaseDockerLIst.defaultProps = {
  icon: '',
  onClick: () => {},
  selected: false,
  pointer: false,
  warning: false,
  children: null,
};

export default BaseDockerLIst;
