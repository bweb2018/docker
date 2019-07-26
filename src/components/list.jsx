import * as PropTypes from 'prop-types';
import * as React from 'react';
import C from 'classnames';

const Card = ({
                  name,
                  icon,
                  warning,
                  onClick,
                  selected,
                  pointer,
                  children,
              }) => (
    <div
        className={C({
            'bg-white-80': selected,
            'bg-white hover-bg-white-90': !selected && !warning,
            'bg-washed-red': warning,
            pointer,
        }, 'h3 pa3 flex items-center justify-between')}
        style={{ userSelect: 'none' }}
        onClick={onClick}
    >
        <div className="flex">
            { icon && (
                <div className="w2">
                    <i className={`f4 ${icon}`} />
                </div>
            )}
            <div>{name}</div>
        </div>
        <div>
            {warning && <i className="f4 dark-red fa fa-exclamation-triangle" />}
            {children}
        </div>
    </div>
);

Card.propTypes = {
    name: PropTypes.node.isRequired,
    icon: PropTypes.string,
    onClick: PropTypes.func,
    warning: PropTypes.bool,
    selected: PropTypes.bool,
    pointer: PropTypes.bool,
    children: PropTypes.node,
};

Card.defaultProps = {
    icon: '',
    onClick: () => {},
    selected: false,
    pointer: false,
    warning: false,
    children: null,
};

export default Card;
