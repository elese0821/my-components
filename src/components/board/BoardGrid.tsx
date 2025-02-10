import React, { useEffect, useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import MorePopup from './MorePopup';
import useUserStore from '../../stores/userStore';
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/solid';
import { ContextType } from '../../pages/board/@types/types';

export default function BoardGrid() {
    const { list, handleBoardData } = useOutletContext<ContextType>();
    const [openPopupIndex, setOpenPopupIndex] = React.useState(null);
    const { usrIdx } = useUserStore();
    const popupRef = useRef(null);
    const popupListRef = useRef(null);

    const handleClick = (index: any) => {
        setOpenPopupIndex(openPopupIndex === index ? null : index);
    };

    const handleClickOutside = (event: any) => {
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
        <div className='grid grid-cols-5 gap-4'>
            {list.map((el: { contents: any; }, i: React.Key | null | undefined) => {

                return (
                    <div
                        className='border border-gray3 min-h-40 relative'
                        key={i}
                    >
                        <div className="absolute top-2 right-2"
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
                                item={el}
                                handleBoardData={handleBoardData}
                            />
                        </div>
                        <div
                            dangerouslySetInnerHTML={{ __html: el.contents }}
                        />
                    </div>
                )
            })}
        </div>
    )
}
