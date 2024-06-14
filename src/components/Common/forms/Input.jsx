import React from 'react'

export default function Input(props) {
    const { children, defaultValue, value, type, className, placeholder, autoComplete } = props
    return (
        <input
            className={`p-2 bg-gray-100 rounded ${className}`}
            type={type}
            value={value}
            defaultValue={defaultValue}
            placeholder={placeholder}
            autoComplete={autoComplete}
        >{children}</input>
    )
}
