import React from 'react'

export default function RadioGroups({ label, children }) {
    return (
        <fieldset className='flex flex-col'>
            <legend className='blind'>{label}</legend>
            {children}
        </fieldset>
    )
}
