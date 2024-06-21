import React, { useEffect, useState } from 'react'
import H1 from '../tag/H1'
import instance from './../../../services/instance';
import InputText from '../forms/InputText';
import Buttons from '../forms/Buttons';
import Pagination from '../pagination/Pagination';
import useDialogStore from '../../../stores/dialogStore';

export default function Comments({ className, boardIdx }) {
    const [commentList, setCommentList] = useState([]);
    const [currentComment, setCurrentComment] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { openDialog } = useDialogStore();

    const handleCommentChange = (e) => {
        setCurrentComment(e.target.value)
    }

    // 댓글 리스트
    const getReplyList = async () => {
        if (boardIdx) {
            try {
                const _res = await instance.get("/user/board/reply/info", {
                    params: {
                        boardIdx: boardIdx,
                        // searchStr: "Dsa",
                        pageNo: page,
                        row: 5
                        // searchStr: searchStr,
                        // pageNo:page,
                        // row: row
                    }
                })
                if (_res.status === 200) {
                    const _data = await _res.data;
                    setCommentList(_data.list);
                    setTotalPages(Math.ceil(_data.total / 10))
                }
            } catch (e) {
                console.log(e)
            }
        }
    }

    // 댓글 추가
    const addComment = async (e) => {
        e.preventDefault();
        if (currentComment !== "") {
            try {
                const _res = await instance.post("/user/board/reply/info", {
                    boardIdx: boardIdx,
                    contents: currentComment
                })
                if (_res.status === 200) {
                    setCurrentComment("");
                    getReplyList();
                }
            } catch (e) {
                console.log(e)
            }
        }
        openDialog("댓글을 입력☀️")
    }
    useEffect(() => {
        getReplyList();
    }, [boardIdx, page])

    return (
        <div className={`${className}`}>
            <H1 className="text-[1.2rem]">글 댓글</H1>
            <table className="table-auto w-full text-center text-sm">
                <thead className='bg-gray2 text-white'>
                    <tr>
                        <th className='border border-gray3 p-0.5 pt-1'>작성자</th>
                        <th className='border border-gray3 p-0.5 pt-1'>제목</th>
                        <th className='border border-gray3 p-0.5 pt-1'>등록일</th>
                    </tr>
                </thead>
                {commentList.length > 0 ?
                    <>
                        {commentList.map((el, i) => (
                            <tbody key={i}>
                                <tr>
                                    <td className='border border-gray3 p-0.5 pt-1'>{el.writerNm}</td>
                                    <td className='border border-gray3 p-0.5 pt-1'>{el.contents}</td>
                                    <td className='border border-gray3 p-0.5 pt-1'>{el.regDt}</td>
                                </tr>
                            </tbody>
                        ))}
                    </>
                    :
                    <tbody>
                        <tr>
                            <td colSpan={3} className='border border-gray3 p-0.5 pt-1'>댓글이없습니다.</td>
                        </tr>
                    </tbody>
                }
            </table>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            <form onSubmit={addComment} className='flex mt-4'>
                <InputText onChange={handleCommentChange} value={currentComment} />
                <Buttons type="button" className='rounded-none' onClick={addComment}>등록</Buttons>
            </form>
        </div >
    )
}
