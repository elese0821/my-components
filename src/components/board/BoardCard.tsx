import React, { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import MorePopup from './MorePopup';
import useUserStore from '../../stores/userStore';
import { ContextType } from '../../pages/board/@types/types';
import { EllipsisHorizontalCircleIcon, ChatBubbleLeftIcon, EyeIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { SERVER_API_BASE_URL } from '../../services/endpoint';

const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6'];
const isImageFile = (name?: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name ?? '');
const fileUrl = (idx?: number) => `${SERVER_API_BASE_URL}/file/download/${idx}`;

const SkeletonCard = () => (
    <div className='bg-white rounded-xl border border-gray-100 flex flex-col animate-pulse'>
        <div className='h-36 bg-gray-100 rounded-t-xl' />
        <div className='p-3 flex flex-col gap-2.5'>
            <div className='h-3 bg-gray-100 rounded w-3/4' />
            <div className='h-2.5 bg-gray-100 rounded w-full' />
            <div className='h-2.5 bg-gray-100 rounded w-2/3' />
            <div className='flex justify-between pt-2 border-t border-gray-50'>
                <div className='h-2.5 bg-gray-100 rounded w-10' />
                <div className='h-2.5 bg-gray-100 rounded w-12' />
            </div>
        </div>
    </div>
);

export default function BoardCard() {
    const { list, loading, handleBoardData } = useOutletContext<ContextType>();
    const [openPopupIndex, setOpenPopupIndex] = React.useState<number | null>(null);
    const { usrIdx } = useUserStore();
    const popupRef = useRef(null);

    const handleClickOutside = (e: MouseEvent) => {
        if (popupRef.current && !(popupRef.current as any).contains(e.target)) {
            setOpenPopupIndex(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, '') ?? '';

    return (
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3'>
            {loading ? (
                Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
            ) : list.length === 0 ? (
                <p className='col-span-5 text-center text-gray-400 py-10'>게시물이 없습니다.</p>
            ) : list.map((el, i) => (
                <motion.div
                    key={el.boardIdx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className='bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 cursor-pointer flex flex-col'
                    onClick={() => handleBoardData('view', el.boardIdx)}
                >
                    {/* 썸네일: 이미지 첨부 시 이미지, 아니면 컬러 */}
                    {el.fileIdx && isImageFile(el.fileOrgNm) ? (
                        <img
                            src={fileUrl(el.fileIdx)}
                            alt={el.fileOrgNm}
                            className='h-36 w-full object-cover rounded-t-xl'
                        />
                    ) : (
                        <div
                            className='h-36 flex items-center justify-center text-white text-3xl font-bold rounded-t-xl'
                            style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        >
                            {el.title?.charAt(0) ?? 'B'}
                        </div>
                    )}

                    <div className='p-3 flex flex-col gap-1 flex-1'>
                        <div className='flex justify-between items-start'>
                            <p className='font-semibold text-sm text-gray-800 line-clamp-2 flex-1'>{el.title}</p>
                            <div
                                className='relative ml-1 flex-shrink-0'
                                ref={popupRef}
                                onClick={e => e.stopPropagation()}
                            >
                                <EllipsisHorizontalCircleIcon
                                    className='h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600'
                                    onClick={() => setOpenPopupIndex(openPopupIndex === i ? null : i)}
                                />
                                <MorePopup
                                    isOpen={openPopupIndex === i}
                                    onClose={() => setOpenPopupIndex(null)}
                                    usrIdx={usrIdx}
                                    item={el}
                                    handleBoardData={handleBoardData}
                                />
                            </div>
                        </div>

                        <p className='text-xs text-gray-400 line-clamp-2 mt-1'>
                            {stripHtml(el.contents).slice(0, 60) || '내용 없음'}
                        </p>

                        <div className='flex items-center justify-between mt-auto pt-2 text-xs text-gray-400 border-t border-gray-50'>
                            <span className='text-gray-600 font-medium'>{el.usrNm}</span>
                            <div className='flex gap-2'>
                                <span className='flex items-center gap-0.5'>
                                    <ChatBubbleLeftIcon className='h-3 w-3' />{el.replyCnt ?? 0}
                                </span>
                                <span className='flex items-center gap-0.5'>
                                    <EyeIcon className='h-3 w-3' />{el.views ?? 0}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
