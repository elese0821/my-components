import React from 'react'
import Login from '../../components/auth/Login'

export default function LoginPage() {
    return (
        <div className='section_wrap flex items-center justify-center py-12 px-4'>
            <div className='w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-8'>
                <Login />
            </div>
        </div>
    )
}
