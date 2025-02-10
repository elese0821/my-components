import React, { useEffect, useRef, useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon, EllipsisHorizontalCircleIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import MorePopup from './MorePopup';
import useUserStore from '../../stores/userStore';
import { ContextType } from '../../pages/board/@types/types';

export default function BoardFAQ() {
    const [selected, setSelected] = useState<number | null>(null);
    const { list, handleBoardData } = useOutletContext<ContextType>();

    const toggleFAQ = (index: number) => {
        setSelected(selected === index ? null : index);
    };

    const [openPopupIndex, setOpenPopupIndex] = React.useState(null);
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

    return (
        <div className='text-sm w-full flex flex-col'>
            <table className="border-collapse table">
                <thead className="block table-header-group">
                    <tr className="border border-gray3">
                        <th className="md:table-cell p-2 bg-gray1 text-white" colSpan={3}>제목</th>
                    </tr>
                </thead>
                <tbody className="block md:table-row-group">
                    {list.map((item, i) => (
                        <React.Fragment key={item.boardIdx}>
                            <tr
                                className="cursor-pointer border border-gray3"
                            >
                                <td className="p-2 flex justify-between"
                                    onClick={() => toggleFAQ(i)}
                                >
                                    <p className='block'>Q. {item.title}</p>
                                    <div>
                                        {selected === i ? (
                                            <ChevronUpIcon className="h-6 w-6" />
                                        ) : (
                                            <ChevronDownIcon className="h-6 w-6" />
                                        )}
                                    </div>
                                </td>
                                <td className="p-2 w-4 relative"
                                    onClick={() => handleClick(i)}
                                    ref={popupRef}
                                >
                                    <EllipsisHorizontalCircleIcon
                                        className="h-6 w-6 cursor-pointer"
                                    />
                                    <MorePopup
                                        isOpen={openPopupIndex === i}
                                        onClose={() => setOpenPopupIndex(null)}
                                        usrIdx={usrIdx}
                                        item={item}
                                        handleBoardData={handleBoardData}
                                    />
                                    {/* <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-xl">
                                            <button className="block w-full text-left px-4 py-2">수정</button>
                                            <button className="block w-full text-left px-4 py-2">삭제</button>
                                        </div> */}
                                </td>
                            </tr>
                            {selected === i && (
                                <tr className="p-2 w-full border border-gray3">
                                    <motion.td className="table-cell  bg-gray4" colSpan={2}>
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <p className='p-2'>A. {item.title}</p>
                                        </motion.div>
                                    </motion.td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}

                </tbody>
            </table>
        </div>
    )
}
