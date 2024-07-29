import React from 'react'

export default function NotFound() {
    return (
        <section className='section_wrap'>
            <div className='flex justify-between mb-4 border-b border-gray3 items-end'>
                <h1 className='text-3xl'>페이지를 표시할 수 없습니다.</h1>
                <span className='text-gray3 text-xs'>HTTP 404</span>
            </div>

            <ul className='text-lg grid grid-cols-1 gap-2'>
                <li>지금 입력하신 주소의 페이지는 사라졌거나 다른 페이지로 변경되었습니다.</li>
                <li>주소를 다시 확인해주세요.</li>
            </ul>
            <img src='/kakao4.png' />
        </section>
    )
}
