import React from 'react'

export default function TextArea({ type, children, className, rows, cols }) {
    return (
        <label>
            <textarea
                type={type}
                className={` ${className}`}
                rows={rows ? rows : "5"}
                cols={cols ? cols : "5"}
            >{children}</textarea>
        </label>
    )
}
