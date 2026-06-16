import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

const BASE = 'inline-flex items-center justify-center font-[LINESeedKR-Rg] font-medium transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none rounded-lg text-sm';

const VARIANTS = {
    primary:   'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 hover:shadow-md',
    secondary: 'bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300',
    ghost:     'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800',
    danger:    'bg-red-500 text-white shadow-sm hover:bg-red-600',
};

const Buttons: React.FC<ButtonProps> = ({
    className = '',
    onClick,
    disabled = false,
    children,
    type = 'button',
    variant = 'primary',
    ...rest
}) => {
    return (
        <button
            type={type as 'button' | 'submit' | 'reset'}
            onClick={onClick}
            disabled={disabled}
            className={`${BASE} ${VARIANTS[variant]} py-2 px-4 ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Buttons;
