import { useOutletContext } from 'react-router-dom';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useUserStore from '../../stores/userStore.ts';
import { EllipsisHorizontalIcon, ChatBubbleLeftIcon, EyeIcon } from '@heroicons/react/24/outline';
import MorePopup from './MorePopup';
import { ContextType } from './../../pages/board/@types/types.d';

const SkeletonRow = () => (
    <div className='grid grid-cols-[60px_1fr_100px_70px_70px_110px_44px] items-center border-b border-gray-100 animate-pulse'>
        <div className='px-4 py-[17px]'><div className='h-2.5 bg-gray-100 rounded w-7 mx-auto' /></div>
        <div className='px-4 py-[17px] flex gap-2 items-center'>
            <div className='h-2.5 bg-gray-100 rounded flex-1' />
        </div>
        <div className='px-4 py-[17px]'><div className='h-2.5 bg-gray-100 rounded w-14 mx-auto' /></div>
        <div className='px-4 py-[17px]'><div className='h-2.5 bg-gray-100 rounded w-6 mx-auto' /></div>
        <div className='px-4 py-[17px]'><div className='h-2.5 bg-gray-100 rounded w-6 mx-auto' /></div>
        <div className='px-4 py-[17px]'><div className='h-2.5 bg-gray-100 rounded w-20 mx-auto' /></div>
        <div className='px-4 py-[17px]'><div className='h-2.5 bg-gray-100 rounded w-4 mx-auto' /></div>
    </div>
);

export default function BoardBasic() {
    const { list, loading, handleBoardData } = useOutletContext<ContextType>();
    const [openPopupIndex, setOpenPopupIndex] = useState<number | null>(null);
    const { usrIdx } = useUserStore();

    const cols = ['No', '제목', '작성자', '댓글', '조회', '등록일', ''];

    return (
        <div className='w-full bg-white rounded-xl border border-gray-200 shadow-sm'>
            {/* 헤더 */}
            <div className='grid grid-cols-[60px_1fr_100px_70px_70px_110px_44px] text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200 rounded-t-xl overflow-hidden'>
                {cols.map((col, i) => (
                    <div key={i} className={`px-4 py-3 ${i === 1 ? 'text-left' : 'text-center'}`}>{col}</div>
                ))}
            </div>

            {/* 바디 */}
            {loading ? (
                Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
            ) : list.length === 0 ? (
                <div className='py-16 text-center text-sm text-gray-400'>등록된 게시물이 없습니다.</div>
            ) : (
                list.map((el, i) => (
                    <motion.div
                        key={el.boardIdx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className='grid grid-cols-[60px_1fr_100px_70px_70px_110px_44px] items-center border-b border-gray-100 hover:bg-blue-50/40 transition-colors group'
                    >
                        {/* No */}
                        <div className='px-4 py-3.5 text-center'>
                            <span className='text-xs text-gray-400'>{el.boardIdx}</span>
                        </div>

                        {/* 제목 */}
                        <div className='px-4 py-3.5 min-w-0'>
                            <span
                                className='text-sm text-gray-800 font-medium cursor-pointer hover:text-blue-600 transition-colors truncate block'
                                onClick={() => handleBoardData('view', el.boardIdx)}
                            >
                                {el.title}
                            </span>
                        </div>

                        {/* 작성자 */}
                        <div className='px-4 py-3.5 text-center'>
                            <span className='text-xs text-gray-500'>{el.usrNm}</span>
                        </div>

                        {/* 댓글 */}
                        <div className='px-4 py-3.5 text-center'>
                            <span className='inline-flex items-center gap-1 text-xs text-gray-400'>
                                <ChatBubbleLeftIcon className='h-3.5 w-3.5' />
                                {el.replyCnt ?? 0}
                            </span>
                        </div>

                        {/* 조회 */}
                        <div className='px-4 py-3.5 text-center'>
                            <span className='inline-flex items-center gap-1 text-xs text-gray-400'>
                                <EyeIcon className='h-3.5 w-3.5' />
                                {el.views ?? 0}
                            </span>
                        </div>

                        {/* 등록일 */}
                        <div className='px-4 py-3.5 text-center'>
                            <span className='text-xs text-gray-400'>{el.regDt}</span>
                        </div>

                        {/* 액션 */}
                        <div className='px-1 py-3.5 text-center relative'>
                            <button
                                className='p-1.5 rounded-md text-gray-300 hover:text-gray-500 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all'
                                onClick={() => setOpenPopupIndex(openPopupIndex === i ? null : i)}
                            >
                                <EllipsisHorizontalIcon className='h-4 w-4' />
                            </button>
                            <MorePopup
                                isOpen={openPopupIndex === i}
                                onClose={() => setOpenPopupIndex(null)}
                                usrIdx={usrIdx}
                                item={el}
                                handleBoardData={handleBoardData}
                            />
                        </div>
                    </motion.div>
                ))
            )}
        </div>
    );
}
