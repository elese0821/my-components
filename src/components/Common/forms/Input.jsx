import React from 'react';

export default function Input(props) {
    const {
        defaultValue,
        value,
        type = 'text',
        className = '',
        placeholder,
        autoComplete,
        name,
        onChange,
        ...rest
    } = props;

    return (
        <input
            className={`p-2 bg-gray-100 rounded focus:border-peach ${className}`}
            type={type}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            autoComplete={autoComplete}
            name={name}
            onChange={onChange}
            {...rest}
        />
    );
}
