import React from 'react'
import { Link } from 'react-router-dom'

export default function CateList(props) {
    const { id, name } = props
    return (
        <li>
            <Link to={id}>{name}</Link>
        </li>
    )
}
