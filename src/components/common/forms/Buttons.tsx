import { Button } from '@material-tailwind/react';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

const Buttons: React.FC<ButtonProps> = ({
    className = String,
    onClick,
    disabled = false,
    children,
    type,
    ...rest
}) => {
    return (
        <Button
            type={type === null ? "submit" : type}
            onClick={onClick}
            disabled={disabled}
            className={`font-[LINESeedKR-Rg] font-light shadow-sm bg-gray1 py-3 px-4 flex items-center justify-center hover:shadow-none hover:bg-gray2 ${className}`}
            {...rest}
        >
            {children}
        </Button>
    );
};

export default Buttons;
