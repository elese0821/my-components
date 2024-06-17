import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import instance from '../../services/instance'
import Button from '../../components/common/forms/Button';
export default function BoardPage() {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태 추가

    // 게시판 데이터
    const getBoardList = async () => {
        try {
            const _res = await instance.get('/user/board/info', {
                params: {
                    row: 10,
                    pageNo: page
                }
            });
            if (_res.status === 200) {
                const _data = await _res.data;
                setList(_data.list);
                setTotalPages(_data.total / 10);
            } else {
                console.log("게시글 검색실패🤣");
            }
        } catch (e) {
            console.log(e)
        }
    };

    // 게시물 삭제
    const deleteBoard = async (boardIdx) => {
        console.log(boardIdx)
        try {
            const _res = await instance.delete('/user/board/info', {
                params: { boardIdx }
            })
            if (_res.status === 200) {
                console.log('삭제성공');
                getBoardList(); // 삭제 후 목록 갱신
            } else {
                console.log('삭제실패');
            }
        } catch (e) {
            console.log(e)
        }
    }

    // [TODO] 게시판 삭제
    const handleDeleteBoard = (boardIdx) => {
        if (boardIdx) {
            deleteBoard(boardIdx)
            console.log(boardIdx)
        }
    }

    useEffect(() => {
        getBoardList();
    }, [page])

    return (
        <>
            <div className='section_wrap flex flex-col gap-4'>
                <Outlet
                    context={{
                        list: list,
                        handleDeleteBoard: handleDeleteBoard
                    }}
                    setPage={setPage} list={list}
                />
                <div className='grid grid-cols-3'>
                    <div className='flex gap-4 my-4 justify-center col-start-2'>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => setPage(index + 1)}
                                className={`px-3 py-1 rounded ${page === index + 1 ? 'bg-gray-500 text-white' : 'bg-gray-200 text-black'}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <Link to="/boardWrite"
                        className='col-start-3 flex items-center justify-end'>
                        <Button className="mx-0">글쓰기</Button>
                    </Link>
                </div>
            </div>
        </>
    )
}
