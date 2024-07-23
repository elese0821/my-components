import { useOutletContext } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useUserStore from '../../stores/userStore.ts';
import BoardSearch from './BoardSearch';
import BoardTabPage from './BoardTabPage';
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/20/solid';
import MorePopup from './MorePopup';
import { ContextType } from './../../pages/board/@types/types.d';
import TableTag from './table/TableTag.tsx';

export default function BoardBasic() {
    const { list, handleBoardData } = useOutletContext<ContextType>();
    const [openPopupIndex, setOpenPopupIndex] = useState(null);
    const { usrIdx } = useUserStore();
    const popupRef = useRef(null);
    const popupListRef = useRef(null);

    const handleClick = (index) => {
        setOpenPopupIndex(openPopupIndex === index ? null : index);
    };

    const handleClickOutside = (event) => {
        // Open popup list가 아닌 영역을 클릭하면 팝업을 닫음
        if (popupRef.current !== null && !popupRef.current.contains(event.target) && popupListRef.current !== null && !popupListRef.current.contains(event.target)
        ) {
            setOpenPopupIndex(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const tableConfig = ['No', '제목', '작성자', '댓글', '조회수', '등록일', ' ']

    return (
        <table className='divide-y divide-gray-200 w-full'>
            <thead className='bg-gray1'>
                <TableTag type='tr'>
                    {tableConfig.map((el, i) => (
                        <TableTag type='td' key={i} className='text-center p-3 font-medium text-white uppercase tracking-wider border border-gray3'>{el}</TableTag>
                    ))}
                </TableTag>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
                {list.length > 0 ?
                    <>
                        {list.map((el, i) => (
                            <TableTag type='tr' key={i}>
                                <TableTag type='td' className='text-center p-3 whitespace-nowrap border border-gray3'>{el.boardIdx}</TableTag>
                                <TableTag type='td' className='text-center p-3 w-full whitespace-nowrap border border-gray3'>
                                    {el.title}
                                </TableTag>
                                <TableTag type='td' className='text-center p-3 whitespace-nowrap border border-gray3'>{el.usrNm}</TableTag>
                                <TableTag type='td' className='text-center p-3 whitespace-nowrap border border-gray3'>{el.replyCnt}</TableTag>
                                <TableTag type='td' className='text-center p-3 whitespace-nowrap border border-gray3'>{el.views ? el.views : 0}</TableTag>
                                <TableTag type='td' className='text-center p-3 whitespace-nowrap border border-gray3'>{el.regDt}</TableTag>
                                <TableTag type='td' ref={popupRef} className='text-center p-1 whitespace-nowrap text-right font-medium border border-gray3 relative'>
                                    <EllipsisHorizontalCircleIcon className="h-6 w-6 cursor-pointer" onClick={() => handleClick(i)} />
                                    <MorePopup
                                        isOpen={openPopupIndex === i}
                                        onClose={() => setOpenPopupIndex(null)}
                                        usrIdx={usrIdx}
                                        item={el}
                                        handleBoardData={handleBoardData}
                                    />
                                </TableTag>
                            </TableTag>
                        ))}
                    </> :
                    <TableTag type='tr'>
                        <TableTag type='td' colSpan={7} className='text-center p-4 text-md'>게시물이 없습니다.</TableTag>
                    </TableTag>
                }

            </tbody>
        </table>
    );
}
