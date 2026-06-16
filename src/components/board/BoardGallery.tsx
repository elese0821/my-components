import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useOutletContext } from 'react-router-dom';
import { ContextType } from '../../pages/board/@types/types';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeftIcon, ChevronRightIcon, XMarkIcon,
    EyeIcon, ChatBubbleLeftIcon, ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';
import { SERVER_API_BASE_URL } from '../../services/endpoint';

const COLORS = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6','#ef4444','#14b8a6','#f97316','#a855f7'];
const isImageFile = (name?: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name ?? '');
const fileUrl = (idx?: number) => `${SERVER_API_BASE_URL}/file/download/${idx}`;
const stripHtml = (html: string) => html?.replace(/<[^>]*>/g, '') ?? '';

export default function BoardGallery() {
    const { list, handleBoardData } = useOutletContext<ContextType>();
    const [lightbox, setLightbox] = useState<number | null>(null);

    const isOpen = lightbox !== null;

    const imageList = list.filter(el => el.fileIdx && isImageFile(el.fileOrgNm));

    const prev = useCallback(() => {
        setLightbox(v => (v! > 0 ? v! - 1 : imageList.length - 1));
    }, [imageList.length]);

    const next = useCallback(() => {
        setLightbox(v => (v! < imageList.length - 1 ? v! + 1 : 0));
    }, [imageList.length]);

    // 키보드 네비게이션
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
            if (e.key === 'Escape') setLightbox(null);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isOpen, prev, next]);

    // 스크롤 잠금
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <>
            {/* ── 갤러리 그리드 ── */}
            <div className='columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3'>
                {imageList.length === 0 && (
                    <div className='col-span-4 flex flex-col items-center justify-center py-16 text-gray-300'>
                        <svg className='h-12 w-12 mb-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                        </svg>
                        <p className='text-sm text-gray-400'>이미지가 첨부된 게시물이 없습니다.</p>
                    </div>
                )}
                {imageList.map((el, i) => (
                    <motion.div
                        key={el.boardIdx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className='break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300'
                        onClick={() => setLightbox(i)}
                    >
                        {el.fileIdx && isImageFile(el.fileOrgNm) ? (
                            <img
                                src={fileUrl(el.fileIdx)}
                                alt={el.fileOrgNm}
                                className='w-full object-cover block'
                            />
                        ) : (
                            <div
                                className='w-full flex items-center justify-center text-white/30 text-6xl font-bold'
                                style={{
                                    backgroundColor: COLORS[i % COLORS.length],
                                    minHeight: `${140 + (i % 3) * 60}px`
                                }}
                            >
                                {el.title?.charAt(0) ?? 'B'}
                            </div>
                        )}

                        {/* 호버 오버레이 */}
                        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3'>
                            <p className='text-white font-semibold text-sm line-clamp-1'>{el.title}</p>
                            <div className='flex gap-3 text-white/70 text-xs mt-1'>
                                <span className='flex items-center gap-1'>
                                    <EyeIcon className='h-3 w-3' />{el.views ?? 0}
                                </span>
                                <span className='flex items-center gap-1'>
                                    <ChatBubbleLeftIcon className='h-3 w-3' />{el.replyCnt ?? 0}
                                </span>
                                <span>{el.usrNm}</span>
                            </div>
                        </div>

                        {/* 풀스크린 아이콘 */}
                        <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                            <ArrowsPointingOutIcon className='h-5 w-5 text-white drop-shadow' />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ── 라이트박스 (영화관 모드) — body에 포탈로 렌더링해서 z-index 충돌 방지 ── */}
            {createPortal(<AnimatePresence>
                {lightbox !== null && imageList[lightbox] && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className='fixed inset-0 bg-black/95 z-[300] flex flex-col'
                    >
                        {/* 상단 바 */}
                        <div className='flex items-center justify-between px-6 py-4 flex-shrink-0'>
                            <div>
                                <p className='text-white font-semibold text-lg'>{imageList[lightbox].title}</p>
                                <p className='text-white/50 text-sm'>
                                    {imageList[lightbox].usrNm} · {imageList[lightbox].regDt} · {lightbox + 1} / {imageList.length}
                                </p>
                            </div>
                            <button
                                className='text-white/70 hover:text-white transition'
                                onClick={() => setLightbox(null)}
                            >
                                <XMarkIcon className='h-8 w-8' />
                            </button>
                        </div>

                        {/* 이미지 영역 */}
                        <div className='flex-1 flex items-center justify-center relative px-16 min-h-0'>
                            {/* 이전 버튼 */}
                            <button
                                className='absolute left-4 text-white/60 hover:text-white transition z-10 p-2 rounded-full hover:bg-white/10'
                                onClick={prev}
                            >
                                <ChevronLeftIcon className='h-10 w-10' />
                            </button>

                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={lightbox}
                                    initial={{ opacity: 0, x: 40 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -40 }}
                                    transition={{ duration: 0.2 }}
                                    className='flex items-center justify-center w-full h-full'
                                >
                                    {imageList[lightbox].fileIdx && isImageFile(imageList[lightbox].fileOrgNm) ? (
                                        <img
                                            src={fileUrl(imageList[lightbox].fileIdx)}
                                            alt={imageList[lightbox].fileOrgNm}
                                            className='max-w-full max-h-[60vh] object-contain rounded-lg shadow-2xl'
                                        />
                                    ) : (
                                        <div
                                            className='rounded-2xl flex items-center justify-center text-white/20 text-9xl font-bold shadow-2xl'
                                            style={{
                                                backgroundColor: COLORS[lightbox % COLORS.length],
                                                width: '400px',
                                                height: '300px'
                                            }}
                                        >
                                            {imageList[lightbox].title?.charAt(0)}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* 다음 버튼 */}
                            <button
                                className='absolute right-4 text-white/60 hover:text-white transition z-10 p-2 rounded-full hover:bg-white/10'
                                onClick={next}
                            >
                                <ChevronRightIcon className='h-10 w-10' />
                            </button>
                        </div>

                        {/* 하단 바 */}
                        <div className='flex-shrink-0 pb-6 pt-4 flex flex-col items-center gap-3'>
                            {/* 설명 */}
                            {imageList[lightbox].contents && (
                                <p className='text-white/50 text-sm max-w-lg text-center line-clamp-2'>
                                    {stripHtml(imageList[lightbox].contents).slice(0, 120)}
                                </p>
                            )}

                            {/* 자세히 보기 버튼 */}
                            <button
                                className='text-white/70 hover:text-white border border-white/30 hover:border-white/60 rounded-full px-4 py-1.5 text-sm transition'
                                onClick={() => { handleBoardData('view', imageList[lightbox!].boardIdx); setLightbox(null); }}
                            >
                                자세히 보기 →
                            </button>

                            {/* 인디케이터 */}
                            <div className='flex gap-1.5 mt-1'>
                                {imageList.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setLightbox(i)}
                                        className={`rounded-full transition-all duration-300 ${
                                            i === lightbox
                                                ? 'bg-white w-5 h-2'
                                                : 'bg-white/30 w-2 h-2 hover:bg-white/60'
                                        }`}
                                    />
                                ))}
                            </div>

                            {/* 키보드 힌트 */}
                            <p className='text-white/25 text-xs'>← → 키로 이동 · ESC 닫기</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>, document.body)}
        </>
    );
}
