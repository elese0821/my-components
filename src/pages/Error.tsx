import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Error() {
    return (
        <section className='section_wrap flex items-center justify-center min-h-[60vh]'>
            <div className='flex flex-col items-center text-center gap-5'>
                {/* 숫자 */}
                <div className='relative select-none'>
                    <span className='text-[9rem] font-black text-red-50 leading-none tracking-tighter'>500</span>
                    <span className='absolute inset-0 flex items-center justify-center text-2xl font-bold text-red-400'>
                        Server Error
                    </span>
                </div>

                {/* 설명 */}
                <div className='flex flex-col gap-1.5'>
                    <p className='text-base font-semibold text-gray-700'>서버에서 오류가 발생했습니다.</p>
                    <p className='text-sm text-gray-400'>
                        잠시 후 다시 시도하거나, 문제가 지속되면 관리자에게 문의해주세요.
                    </p>
                </div>

                {/* 가능한 원인 */}
                <div className='bg-red-50 border border-red-100 rounded-xl px-6 py-4 text-left max-w-sm w-full'>
                    <p className='text-xs font-semibold text-red-600 mb-2'>가능한 원인</p>
                    <ul className='flex flex-col gap-1'>
                        {[
                            '서버가 일시적으로 응답하지 않습니다.',
                            '유지보수 작업이 진행 중입니다.',
                            '서버 내부 프로그래밍 오류가 발생했습니다.',
                        ].map(item => (
                            <li key={item} className='text-xs text-red-500 flex items-center gap-1.5'>
                                <span className='w-1 h-1 rounded-full bg-red-400 flex-shrink-0' />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 버튼 */}
                <div className='flex items-center gap-3 mt-2'>
                    <button
                        onClick={() => window.location.reload()}
                        className='inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors'
                    >
                        <ArrowPathIcon className='h-4 w-4' />
                        새로고침
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
