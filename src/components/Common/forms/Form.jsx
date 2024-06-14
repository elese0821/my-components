import React from 'react'

export default function Form({ children, className }) {
    return (
        <form className={`p-4 bg-white rounded-lg flex flex-col gap-3 ${className}`}>
            {children}
        </form>
    )
}
