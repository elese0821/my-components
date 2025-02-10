import React, { forwardRef } from 'react';
import { Input } from '@material-tailwind/react';

interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    wrapStyle?: string;
    variant?: "standard" | "outlined" | "static";
}

const InputText = forwardRef<HTMLInputElement, InputTextProps>((
    {
        defaultValue,
        value,
        type,
        className = '',
        placeholder,
        autoComplete,
        name,
        onChange,
        onClick,
        label,
        required,
        variant,
        ...rest
    },
    ref,
) => {
    return (
        <Input
            className={`disabled:bg-gray4 p-2 ${className}`}
            label={label}
            type={type}
            value={value}
            color="deep-purple"
            defaultValue={defaultValue}
            placeholder={placeholder}
            autoComplete={autoComplete}
            name={name}
            ref={ref}
            onChange={onChange}
            onClick={onClick}
            variant={!variant ? "standard" : variant}
            required={required}
            {...rest}
        />
    );
});

InputText.displayName = 'InputText';

export default InputText;
