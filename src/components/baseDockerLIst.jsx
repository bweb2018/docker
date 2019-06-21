import * as PropTypes from 'prop-types';
import * as React from 'react';
import C from 'classnames';

const BaseDockerLIst = ({
  name,
  icon,
  warning,
  onClick,
  selected,
  pointer,
  children,
  newConfig
}) => {
  console.log(newConfig)
  return(<ul
    className={C({
      'bg-white-80': selected,
      'bg-white hover-bg-white-90': !selected && !warning,
      'bg-washed-red': warning,
      pointer,
    }, 'h3 pa3 flex items-center justify-between')}
    style={{ userSelect: 'none' }}
    onClick={onClick}
  >
    <li className="flex">
      <div>{name}</div>
    </li>
  </ul>
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
