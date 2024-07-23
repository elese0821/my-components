import React from 'react'

interface Props {
    className?: string;
    children?: React.ReactNode;
    type: string;
    colSpan?: number;
}
export default function TableTag({ children, className, type, colSpan }: Props) {
    if (type === "tr") {
        return (
            <tr className={`w-full ${className}`}>
                {children}
            </tr>
        )
    }
    if (type === "td") {
        return (
            <th scope="col" className={` ${className}`}>
                {children}
            </th>
        )
    }
}
