import React from 'react'

export default function Radio({ children, value, name, defaultChecked, disabled, onChange }) {


    return (
        <label
            className='flex gap-2 p-2 border rounded-md my-2'
        >
            <input
                type="radio"
                value={value}
                name={name}
                defaultChecked={defaultChecked}
                disabled={disabled}
                onChange={onChange}
            />
            {children}
        </label>
    )
}
