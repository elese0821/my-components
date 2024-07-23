import React from 'react'
import { Outlet } from 'react-router-dom'

export default function EtcPage() {
    return (
        <section className='section_wrap'>
            <Outlet />
        </section>
    )
}
