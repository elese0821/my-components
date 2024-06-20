import { MoonIcon } from '@heroicons/react/24/solid'
import React from 'react'

export default function H1({ children, className }) {
    return (
        <h1 className={`text-2xl flex items-center ${className}`}>
            <MoonIcon className='h-6  text-yellow-500' />
            <span className='pt-1'>{children}</span>
        </h1>
    )
}
