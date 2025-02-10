import React, { useState } from 'react'
import Buttons from '../common/forms/Buttons'
import InputText from './../common/forms/InputText';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function BoardSearch({ handleSearch }) {
    const [search, setSearch] = useState('')
    const handleSearchChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearch(e.target.value)
    }
    return (
        <div className='w-1/2 max-w-[350px]'>
            <form onSubmit={handleSearch(search)} className='relative rounded-md shadow-sm flex justify-between gap-2'>
                <InputText
                    label='검색'
                    type="text"
                    name="search"
                    placeholder="검색어"
                    autoComplete='true'
                    onChange={handleSearchChange}
                    value={search}
                />
                <MagnifyingGlassIcon
                    onClick={handleSearch(search)}
                    className='w-5 absolute right-2.5 bottom-2.5 cursor-pointer'
                />
            </form>
        </div>
    )
}

