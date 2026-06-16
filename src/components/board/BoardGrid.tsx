import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import MorePopup from './MorePopup';
import useUserStore from '../../stores/userStore';
import { EllipsisHorizontalIcon, ChatBubbleLeftIcon, EyeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { ContextType } from '../../pages/board/@types/types';
import { motion } from 'framer-motion';
import { SERVER_API_BASE_URL } from '../../services/endpoint';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#a855f7'];
const isImageFile = (name?: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name ?? '');
const fileUrl = (idx?: number) => `${SERVER_API_BASE_URL}/file/download/${idx}`;
const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, '') ?? '';

// 카드마다 독립적인 popup 관리
function GridCard({ el, i, usrIdx, handleBoardData }) {
    const [open, setOpen] = useState(false);
    const color = COLORS[i % COLORS.length];
    const hasImage = el.fileIdx && isImageFile(el.fileOrgNm);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className='bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col cursor-pointer group'
            onClick={() => handleBoardData('view', el.boardIdx)}
        >
            {/* 상단 썸네일 또는 컬러 헤더 */}
            {hasImage ? (
                <img
                    src={fileUrl(el.fileIdx)}
                    alt={el.fileOrgNm}
                    className='h-36 w-full object-cover rounded-t-xl'
                />
            ) : (
                <div
                    className='h-36 w-full flex items-center justify-center relative overflow-hidden rounded-t-xl'
                    style={{ backgroundColor: color + '18' }}
                >
                    {/* 큰 이니셜 */}
                    <span
                        className='text-5xl font-black opacity-20 select-none'
                        style={{ color }}
                    >
                        {el.title?.charAt(0) ?? 'B'}
                    </span>
                    {/* 좌측 컬러 바 */}
                    <div className='absolute left-0 top-0 bottom-0 w-1' style={{ backgroundColor: color }} />
                </div>
            )}

            {/* 본문 */}
            <div className='p-3 flex flex-col gap-1.5 flex-1'>
                {/* 헤더 행 */}
                <div className='flex items-center justify-between'>
                    <span
                        className='text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white'
                        style={{ backgroundColor: color }}
                    >
                        #{el.boardIdx}
                    </span>
                    <div
                        className='relative opacity-0 group-hover:opacity-100 transition-opacity'
                        onClick={e => { e.stopPropagation(); setOpen(v => !v); }}
                    >
                        <EllipsisHorizontalIcon className='h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer' />
                        <MorePopup
                            isOpen={open}
                            onClose={() => setOpen(false)}
                            usrIdx={usrIdx}
                            item={el}
                            handleBoardData={handleBoardData}
                        />
                    </div>
                </div>

                {/* 제목 */}
                <h3 className='text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors'>
                    {el.title}
                </h3>

                {/* 미리보기 */}
                <p className='text-xs text-gray-400 line-clamp-2 flex-1 leading-relaxed'>
                    {stripHtml(el.contents).slice(0, 70) || '내용 없음'}
                </p>

                {/* 푸터 */}
                <div className='pt-2 mt-auto border-t border-gray-50 flex items-center justify-between'>
                    <div className='flex items-center gap-1.5'>
                        <div
                            className='w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0'
                            style={{ backgroundColor: color }}
                        >
                            {el.usrNm?.[0] ?? '?'}
                        </div>
                        <span className='text-xs text-gray-500 truncate max-w-[60px]'>{el.usrNm}</span>
                    </div>
                    <div className='flex items-center gap-2 text-[10px] text-gray-400'>
                        <span className='flex items-center gap-0.5'>
                            <ChatBubbleLeftIcon className='h-3 w-3' />{el.replyCnt ?? 0}
                        </span>
                        <span className='flex items-center gap-0.5'>
                            <EyeIcon className='h-3 w-3' />{el.views ?? 0}
                        </span>
                    </div>
                </div>
                {el.regDt && (
                    <p className='text-[10px] text-gray-300 flex items-center gap-1'>
                        <CalendarIcon className='h-3 w-3' />{el.regDt}
                    </p>
                )}
            </div>
        </motion.div>
    );
}

const SkeletonGridCard = () => (
    <div className='bg-white rounded-xl border border-gray-100 flex flex-col animate-pulse'>
        <div className='h-36 bg-gray-100 rounded-t-xl' />
        <div className='p-3 flex flex-col gap-2'>
            <div className='flex justify-between'>
                <div className='h-4 bg-gray-100 rounded w-8' />
            </div>
            <div className='h-3 bg-gray-100 rounded w-4/5' />
            <div className='h-2.5 bg-gray-100 rounded w-full' />
            <div className='h-2.5 bg-gray-100 rounded w-3/4' />
            <div className='flex justify-between pt-2 border-t border-gray-50 mt-1'>
                <div className='h-2.5 bg-gray-100 rounded w-10' />
                <div className='h-2.5 bg-gray-100 rounded w-12' />
            </div>
        </div>
    </div>
);

export default function BoardGrid() {
    const { list, loading, handleBoardData } = useOutletContext<ContextType>();
    const { usrIdx } = useUserStore();

    return (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
            {loading ? (
                Array.from({ length: 10 }).map((_, i) => <SkeletonGridCard key={i} />)
            ) : list.length === 0 ? (
                <p className='col-span-5 text-center text-gray-400 py-12'>게시물이 없습니다.</p>
            ) : list.map((el, i) => (
                <GridCard
                    key={el.boardIdx}
                    el={el}
                    i={i}
                    usrIdx={usrIdx}
                    handleBoardData={handleBoardData}
                />
            ))}
        </div>
    );
}
