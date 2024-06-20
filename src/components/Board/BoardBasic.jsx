import { useOutletContext } from 'react-router-dom';
import H1 from '../common/tag/H1';
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/solid';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useUserStore from '../../stores/userStore';

export default function BoardBasic() {
    const { list, handleBoardData } = useOutletContext();
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
    }; console.log()

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <H1>일반게시판</H1>
            <div className='text-sm'>
                <div className='flex justify-between'>
                    <div>페이지 셀렉트 드롭다운박스</div>
                    <div>검색창</div>
                </div>
                <table className='divide-y divide-gray-200'>
                    <thead className='bg-gray1'>
                        <tr className='w-full'>
                            <th scope="col" className='text-center p-3 font-medium text-white uppercase tracking-wider border border-gray3'>No</th>
                            <th scope="col" className='text-center p-3 font-medium text-white uppercase tracking-wider border border-gray3'>제목</th>
                            <th scope="col" className='text-center p-3 font-medium text-white uppercase tracking-wider border border-gray3'>작성자</th>
                            <th scope="col" className='text-center p-3 font-medium text-white uppercase tracking-wider border border-gray3'>댓글</th>
                            <th scope="col" className='text-center p-3 font-medium text-white uppercase tracking-wider border border-gray3'>조회수</th>
                            <th scope="col" className='text-center p-3 font-medium text-white uppercase tracking-wider border border-gray3'>등록일</th>
                            <th scope="col" className='text-center p-3 font-medium text-white uppercase tracking-wider border border-gray3'> </th>
                        </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                        {list.map((item, index) => (
                            <tr key={index} className=''>
                                <td className='text-center p-3 whitespace-nowrap border border-gray3'>{item.boardIdx}</td>
                                <td className='text-center p-3 w-full whitespace-nowrap border border-gray3'>
                                    {item.title}
                                </td>
                                <td className='text-center p-3 whitespace-nowrap border border-gray3'>{item.usrNm}</td>
                                <td className='text-center p-3 whitespace-nowrap border border-gray3'>{item.replyCnt}</td>
                                <td className='text-center p-3 whitespace-nowrap border border-gray3'>{!item.views && 0}</td>
                                <td className='text-center p-3 whitespace-nowrap border border-gray3'>{item.regDt}</td>
                                <td ref={popupRef} className='text-center p-1 whitespace-nowrap text-right font-medium border border-gray3 relative'>
                                    <EllipsisHorizontalCircleIcon className="h-6 w-6 cursor-pointer" onClick={() => handleClick(index)} />
                                    {openPopupIndex === index && (
                                        <motion.ul
                                            initial={{ // 처음 마운트 될 때 상태, 
                                                opacity: 0,
                                            }}
                                            animate={{ // 애니메이션이 끝났을 때의 상태
                                                opacity: 1,
                                            }}
                                            transition={{
                                                ease: "easeOut",
                                                duration: 0.3,
                                            }}
                                            className="absolute top-[100%] left-[-4px] w-20 rounded-md z-[2] shadow-md bg-gray4 z-[1]"
                                            ref={popupListRef}
                                        >
                                            <li className="popup-triangle"></li>
                                            {usrIdx === item.usrIdx ?
                                                (
                                                    <>
                                                        <li className="block w-full px-4 py-2 text-left text-sm hover:text-gray2 transition cursor-pointer" onClick={() => handleBoardData("view", item.boardIdx)}>상세보기</li>
                                                        <li className="block w-full px-4 py-2 text-left text-sm hover:text-gray2 transition cursor-pointer" onClick={() => handleBoardData("modify", item.boardIdx)}>수정</li>
                                                        <li className="block w-full px-4 py-2 text-left text-sm hover:text-gray2 transition cursor-pointer" onClick={() => handleBoardData("delete", item.boardIdx)}>삭제</li>
                                                    </>
                                                ) : (
                                                    <li className="block w-full px-4 py-2 text-left text-sm hover:text-gray2 transition cursor-pointer" onClick={() => handleBoardData("view", item.boardIdx)}>상세보기</li>
                                                )
                                            }
                                        </motion.ul>
                                    )}
                                    {/* <Button className="text-red-600 hover:text-red-900 p-0 h-0" onClick={() => handleBoardData("view", item.boardIdx)}>상세보기</Button> */}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
