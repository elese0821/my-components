import PropTypes from 'prop-types';

const Button = ({ type = 'button', className, children, ...props }) => {
    return (
        <button type={type} className={`bg-black py-2 px-4 rounded text-white block hover:bg-gray1 transition ${className}`} {...props}>
            {children}
        </button>
    );
};

Button.propTypes = {
    type: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export default Button;
