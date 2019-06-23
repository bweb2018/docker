import * as PropTypes from 'prop-types';
import * as React from 'react';
import C from 'classnames';

const Button = ({
  className, dark, mild, disabled, onClick, children, ...others
}) => (
  disabled
    ? (
      <span
        className={`pa2 c-st ${className}`}
        style={{ userSelect: 'none' }}
        {...others}
      >
        {children}
      </span>
    )
    : (
      <span
        className={C('pointer ', className)}
        style={{ userSelect: 'none' }}
        onClick={onClick}
        {...others}
      >
        {children}
      </span>
    )
);

Button.propTypes = {
  disabled: PropTypes.bool,
  dark: PropTypes.bool,
  mild: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

Button.defaultProps = {
  dark: false,
  mild: false,
  className: '',
  disabled: false,
  onClick: null,
};

export default Button;
