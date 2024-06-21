
import { Description, Field, Input, Label } from '@headlessui/react'
import clsx from 'clsx'
import React, { useEffect } from 'react'

export default function InputText(props) {
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
        <Input
            className={clsx(
                'block w-full rounded-sm  py-1.5 px-3 text-sm/6 text-black border border-gray4',
                'focus:outline-none data-[focus]:outline-1 data-[focus]:-outline-offset-1 data-[focus]:outline-black/25'
            )}
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

