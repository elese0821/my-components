import React from 'react'

export default function Button({ type, children, style, onClick }) {
    return (
        <button
            type={!type && "button"}
            className={`bg-green-500 py-2 px-4 rounded text-white block mx-auto ${style}`}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
