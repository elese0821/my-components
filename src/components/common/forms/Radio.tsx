import React, { InputHTMLAttributes, ReactNode } from 'react'

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
    children?: ReactNode;
}

export default function Radio({ children, value, name, defaultChecked, disabled, onChange, checked }: RadioProps) {
    return (
        <label
            className='flex gap-2 p-2 rounded-md my-2 w-full'
        >
            <input
                type="radio"
                value={value}
                name={name}
                defaultChecked={defaultChecked}
                disabled={disabled}
                onChange={onChange}
                checked={checked}
            />
            {children}
        </label>
    )
}
