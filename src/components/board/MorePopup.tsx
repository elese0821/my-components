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
    const popupListRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupListRef.current && !popupListRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            className="absolute top-[100%] left-[-40px] w-15 rounded-md z-[2] shadow-md bg-gray4 z-[1] "
            ref={popupListRef}
        >
            <li className="popup-triangle"></li>
            {usrIdx === item.usrIdx ? (
                <>
                    <li className="block w-full px-4 py-2 text-left text-sm hover:text-gray2 transition cursor-pointer" onClick={() => handleBoardData("view", item.boardIdx)}>상세보기</li>
                    <li className="block w-full px-4 py-2 text-left text-sm hover:text-gray2 transition cursor-pointer" onClick={() => handleBoardData("modify", item.boardIdx)}>수정</li>
                    <li className="block w-full px-4 py-2 text-left text-sm hover:text-gray2 transition cursor-pointer" onClick={() => handleBoardData("delete", item.boardIdx)}>삭제</li>
                </>
            ) : (
                <li className="block w-full px-4 py-2 text-left text-sm hover:text-gray2 transition cursor-pointer" onClick={() => handleBoardData("view", item.boardIdx)}>상세보기</li>
            )}
        </motion.ul>
    );
};

export default MorePopup;
