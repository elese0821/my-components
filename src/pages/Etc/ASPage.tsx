import React from 'react'

const list = [
    "사람1",
    "사람2",
    "사람3",
    "사람4",
    "사람5",
]
export default function ASPage() {
    return (
        <div className='grid grid-cols-9'>
            <div className='border-gray4 border p-3 col-span-4'>
                {list.map((el, i) => {
                    return <div key={i}>{el}</div>
                })}
            </div>
            <ul className='flex flex-col items-center justify-center gap-4'>
                <li className='cursor-pointer bg-gray3 p-2 rounded-lg'>추가</li>
                <li className='cursor-pointer bg-gray3 p-2 rounded-lg'>삭제</li>
            </ul>
            <div className='border-gray4 border p-3 col-span-4'>
                {list.map((el, i) => {

                    return <div key={i}>{el}</div>
                })}
            </div>
        </div>
    )
}
