import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

type MorePopupProps = {
    isOpen: boolean;
    onClose: () => void;
    usrIdx: string | null;
    item: any;
    handleBoardData: (action: string, boardIdx: string) => void;
};

const MorePopup: React.FC<MorePopupProps> = ({ isOpen, onClose, usrIdx, item, handleBoardData }) => {
    const popupListRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (popupListRef.current && !popupListRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // 서버가 usrIdx 를 number 로 내릴 수 있어 String() 으로 통일
    const isOwner = usrIdx != null && String(usrIdx) === String(item.usrIdx);

    // 각 메뉴 아이템 클릭: mousedown 버블링 차단 + 팝업 닫기 + 액션 실행
    const handleItem = (action: string) => (e: React.MouseEvent) => {
        e.stopPropagation();
        onClose();
        handleBoardData(action, item.boardIdx);
    };

    return (
        <motion.ul
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ ease: 'easeOut', duration: 0.15 }}
            className='absolute top-[calc(100%+4px)] right-0 min-w-[110px] rounded-xl z-20 overflow-hidden'
            style={{ background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', border: '1px solid #f3f4f6' }}
            ref={popupListRef}
        >
            <li
                className='flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors'
                onMouseDown={(e) => e.stopPropagation()}
                onClick={handleItem('view')}
            >
                <svg className='h-3.5 w-3.5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z' /><path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' /></svg>
                상세보기
            </li>
            {isOwner && (
                <>
                    <li
                        className='flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 cursor-pointer transition-colors border-t border-gray-50'
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={handleItem('modify')}
                    >
                        <svg className='h-3.5 w-3.5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z' /></svg>
                        수정
                    </li>
                    <li
                        className='flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 cursor-pointer transition-colors border-t border-gray-50'
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={handleItem('delete')}
                    >
                        <svg className='h-3.5 w-3.5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' d='m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0' /></svg>
                        삭제
                    </li>
                </>
            )}
        </motion.ul>
    );
};

export default MorePopup;
