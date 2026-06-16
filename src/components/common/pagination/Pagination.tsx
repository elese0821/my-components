import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
    totalPages: number;
    page: number;
    setPage: (page: number) => void;
    size?: 'sm' | 'md';
}

export default function Pagination({ totalPages, page, setPage, size = 'md' }: PaginationProps) {
    if (totalPages <= 1) return null;

    const go = (p: number) => setPage(Math.max(1, Math.min(totalPages, p)));

    // 스마트 페이지 번호 (null = 말줄임)
    const pages = (): (number | null)[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (page <= 4)       return [1, 2, 3, 4, 5, null, totalPages];
        if (page >= totalPages - 3) return [1, null, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, null, page - 1, page, page + 1, null, totalPages];
    };

    const isSmall = size === 'sm';
    const dim = isSmall ? 'w-7 h-7 text-xs' : 'w-8 h-8 text-sm';

    return (
        <div className='inline-flex items-center gap-0.5 select-none'>
            {/* 이전 버튼 */}
            <button
                onClick={() => go(page - 1)}
                disabled={page === 1}
                aria-label='이전 페이지'
                className={`${dim} inline-flex items-center justify-center rounded-lg transition-all
                    ${page === 1
                        ? 'text-gray-200 cursor-not-allowed'
                        : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700 active:scale-95'
                    }`}
            >
                <ChevronLeftIcon className='h-3.5 w-3.5 stroke-2' />
            </button>

            {/* 페이지 번호 */}
            {pages().map((n, i) =>
                n === null ? (
                    <span key={`e${i}`} className={`${dim} inline-flex items-center justify-center text-gray-300 tracking-widest text-xs`}>
                        ···
                    </span>
                ) : (
                    <button
                        key={n}
                        onClick={() => go(n)}
                        aria-label={`${n}페이지`}
                        aria-current={n === page ? 'page' : undefined}
                        className={`${dim} inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95
                            ${n === page
                                ? 'text-white shadow-sm'
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                        style={n === page ? {
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.32)',
                        } : {}}
                    >
                        {n}
                    </button>
                )
            )}

            {/* 다음 버튼 */}
            <button
                onClick={() => go(page + 1)}
                disabled={page === totalPages}
                aria-label='다음 페이지'
                className={`${dim} inline-flex items-center justify-center rounded-lg transition-all
                    ${page === totalPages
                        ? 'text-gray-200 cursor-not-allowed'
                        : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700 active:scale-95'
                    }`}
            >
                <ChevronRightIcon className='h-3.5 w-3.5 stroke-2' />
            </button>
        </div>
    );
}
