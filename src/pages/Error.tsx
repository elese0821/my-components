import React from 'react'

export default function Error() {
    return (
        <section className='section_wrap'>
            <div className='flex justify-between mb-4 border-b border-gray3 items-end'>
                <h1 className='text-3xl'>페이지를 표시할 수 없습니다.</h1>
                <span className='text-gray3 text-xs'>HTTP 500</span>
            </div>

            <ul className='text-lg grid grid-cols-1 gap-2'>
                <li>가능성이 높은 원인:</li>
                <li>- 웹 사이트는 유지 관리 중입니다.</li>
                <li>- 웹 사이트에 프로그래밍 오류가 있습니다.</li>
            </ul>
            <img src='/kakao4.png' />
        </section>
    )
}
