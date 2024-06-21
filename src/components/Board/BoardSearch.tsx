import React from 'react'
import Buttons from '../common/forms/Buttons'

export default function BoardSearch({ handleSearch }) {
    const [search, setSearch] = React.useState('')
    const handleSearchChange = (e) => {
        setSearch(e.target.value)
    }
    return (
        <form onSubmit={handleSearch(search)} className='relative rounded-md shadow-sm flex justify-between gap-2'>
            <input
                type="text"
                name="search"
                id="search"
                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                placeholder="검색어"
                onChange={handleSearchChange}
                value={search}
            />
            <Buttons
                className="rounded bg-gray-600 px-4 text-sm text-white data-[hover]:bg-gray-700 data-[active]:bg-gray-900"
                onClick={handleSearch(search)}
            >
                조회
            </Buttons>
        </form>
    )
}

