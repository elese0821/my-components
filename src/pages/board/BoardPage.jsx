import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import instance from '../../services/instance'
export default function BoardPage() {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);

    const getBoardList = async () => {
        try {
            const _res = await instance.get('/user/board/info', {
                params: {
                    row: 10,
                    pageNo: page
                }
            });
            const _data = await _res.data;
            if (_data.result === "success") {
                setList(_data.list);
            } else {
                console.log("게시글 검색실패🤣");
            }
        } catch (e) {
            console.log(e)
        }
    };

    useEffect(() => {
        getBoardList();
    }, [page])

    return (
        <>
            <div className='section_wrap'>
                <Outlet setPage={setPage} list={list} />
            </div>
        </>
    )
}
