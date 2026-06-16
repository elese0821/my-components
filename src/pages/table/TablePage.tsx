import React from 'react';
import { Outlet } from 'react-router-dom';

export default function TablePage() {
    return (
        <section className='section_wrap'>
            <Outlet />
        </section>
    );
}
