import { BackspaceIcon } from '@heroicons/react/24/solid';
import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Back() {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(-1)}
        >
            <BackspaceIcon className='h-8' />
        </button>
    )
}
