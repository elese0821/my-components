import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
    return (
        <section className='section_wrap flex items-center justify-center min-h-[60vh]'>
            <div className='flex flex-col items-center text-center gap-5'>
                {/* 숫자 */}
                <div className='relative select-none'>
                    <span className='text-[9rem] font-black text-gray-100 leading-none tracking-tighter'>404</span>
                    <span className='absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-400'>
                        Page Not Found
                    </span>
                </div>

                {/* 설명 */}
                <div className='flex flex-col gap-1.5'>
                    <p className='text-base font-semibold text-gray-700'>요청하신 페이지를 찾을 수 없습니다.</p>
                    <p className='text-sm text-gray-400'>
                        주소가 잘못되었거나 페이지가 이동 · 삭제되었습니다.
                    </p>
                </div>

                {/* 버튼 */}
                <div className='flex items-center gap-3 mt-2'>
                    <button
                        onClick={() => window.history.back()}
                        className='inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors'
                    >
                        <ArrowLeftIcon className='h-4 w-4' />
                        이전 페이지
                    </button>
                    <Link
                        to='/'
                        className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white text-sm hover:bg-gray-700 transition-colors'
                    >
                        <HomeIcon className='h-4 w-4' />
                        홈으로
                    </Link>
                </div>
            </div>
        </section>
    );
}
