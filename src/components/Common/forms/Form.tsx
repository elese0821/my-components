import React, { ReactNode } from 'react';

interface FormProps {
    className?: string;
    children?: ReactNode;
}

const Form = ({ className, children }: FormProps) => {
    return (
        <form className={`p-4 bg-white rounded-lg flex flex-col gap-3 ${className}`}>
            {children}
        </form>
    );
};

export default Form;
