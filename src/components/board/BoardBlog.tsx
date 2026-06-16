import React, { useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import MorePopup from './MorePopup';
import useUserStore from '../../stores/userStore';
import { ContextType } from '../../pages/board/@types/types';
import { EllipsisHorizontalCircleIcon, ChatBubbleLeftIcon, EyeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { SERVER_API_BASE_URL } from '../../services/endpoint';

const isImageFile = (name?: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name ?? '');
const fileUrl = (idx?: number) => `${SERVER_API_BASE_URL}/file/download/${idx}`;

const SkeletonBlog = () => (
    <div className='bg-white border border-gray-100 rounded-xl shadow-sm animate-pulse'>
        <div className='p-5'>
            <div className='h-5 bg-gray-100 rounded w-3/4 mb-3' />
            <div className='h-3 bg-gray-100 rounded w-full mb-1.5' />
            <div className='h-3 bg-gray-100 rounded w-4/5 mb-1.5' />
            <div className='h-3 bg-gray-100 rounded w-2/3' />
            <div className='flex gap-4 mt-4 pt-3 border-t border-gray-50'>
                <div className='h-2.5 bg-gray-100 rounded w-12' />
                <div className='h-2.5 bg-gray-100 rounded w-20' />
                <div className='h-2.5 bg-gray-100 rounded w-8' />
            </div>
        </div>
    </div>
);

export default function BoardBlog() {
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
        <div className='flex flex-col gap-4'>
            {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonBlog key={i} />)
            ) : list.length === 0 ? (
                <p className='text-center text-gray-400 py-10'>게시물이 없습니다.</p>
            ) : list.map((el, i) => (
                <motion.div
                    key={el.boardIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className='bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow'
                >
                    {/* 이미지 첨부 시 썸네일 */}
                    {el.fileIdx && isImageFile(el.fileOrgNm) && (
                        <div className='w-full bg-gray-50 flex items-center justify-center overflow-hidden rounded-t-xl' style={{ maxHeight: '280px' }}>
                            <img
                                src={fileUrl(el.fileIdx)}
                                alt={el.fileOrgNm}
                                className='w-full h-auto object-contain'
                                style={{ maxHeight: '280px' }}
                            />
                        </div>
                    )}
                    <div className='p-5'>
                        <div className='flex justify-between items-start'>
                            <h2
                                className='text-lg font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors flex-1 pr-4'
                                onClick={() => handleBoardData('view', el.boardIdx)}
                            >
                                {el.title}
                            </h2>
                            <div className='relative flex-shrink-0' ref={popupRef}>
                                <EllipsisHorizontalCircleIcon
                                    className='h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-600'
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

                        <p
                            className='text-gray-500 text-sm mt-2 line-clamp-2 cursor-pointer'
                            onClick={() => handleBoardData('view', el.boardIdx)}
                        >
                            {stripHtml(el.contents).slice(0, 120) || '내용 없음'}
                        </p>

                        <div className='flex items-center gap-4 mt-4 text-xs text-gray-400 border-t border-gray-50 pt-3'>
                            <span className='font-medium text-gray-600'>{el.usrNm}</span>
                            <span className='flex items-center gap-1'>
                                <CalendarIcon className='h-3.5 w-3.5' />
                                {el.regDt}
                            </span>
                            <span className='flex items-center gap-1'>
                                <ChatBubbleLeftIcon className='h-3.5 w-3.5' />
                                {el.replyCnt ?? 0}
                            </span>
                            <span className='flex items-center gap-1'>
                                <EyeIcon className='h-3.5 w-3.5' />
                                {el.views ?? 0}
                            </span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
