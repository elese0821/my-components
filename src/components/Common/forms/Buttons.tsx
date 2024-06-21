import PropTypes from 'prop-types';
import { Button } from '@headlessui/react'
import React from 'react';

const Buttons = ({ type = 'button', className = "", children, ...props }) => {
    return (
        <Button type={type} className={`bg-black rounded text-white block hover:bg-gray1 transition inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white ${className}`} {...props}>
            {children}
        </Button>
    );
};

Buttons.propTypes = {
    type: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export default Buttons;
