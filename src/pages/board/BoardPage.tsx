import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import instance from '../../services/instance';
import Button from '../../components/common/forms/Button';
import Modal from './../../components/modal/Modal';
import useModalStore from '../../stores/modalStore';
import Dialog from '../../components/modal/Dialog';
import useDialogStore from '../../stores/dialogStore';
import WritePage from './WritePage';
import useUserStore from '../../stores/userStore';
import BoardViewPage from './BoardViewPage';
import Pagination from '../../components/common/pagination/Pagination';

export default function BoardPage() {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 상태 추가
    const { isOpen, openModal, closeModal } = useModalStore(state => state);
    const { openDialog } = useDialogStore();
    // modal state
    const [modalState, setModalState] = useState("write")

    // 게시판 팝업데이터 관리
    const [boardCurrentData, setBoardCurrentData] = useState({})

    // 게시글 팝업 데이터 관리 함수
    const handleBoardData = (flag, boardIdx) => {
        if (flag === "view") {
            getBoardView(boardIdx)
            setModalState("view")
            openModal()
            return
        }
        if (flag === "modify") {
            getBoardView(boardIdx)
            setModalState("write")
            openModal()
            return
        }
        if (flag === "delete") {
            deleteBoard(boardIdx);
            setBoardCurrentData({});
            console.log("dsads")
            if (isOpen) {
                closeModal()
            }
            openDialog("삭제완료😎");
        }
    }

    // 게시판 데이터
    const getBoardView = async (boardIdx) => {
        try {
            const _res = await instance.get('/user/board/info', {
                params: {
                    boardIdx: boardIdx
                }
            });
            if (_res.status === 200) {
                const _data = await _res.data;
                setBoardCurrentData(_data.one);
            } else {
                console.log("게시글 보기실패🤣");
            }
        } catch (e) {
            console.log(e);
        }
    };

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
                setTotalPages(Math.ceil(_data.total / 10));
            } else {
                console.log("게시글 검색실패🤣");
            }
        } catch (e) {
            console.log(e);
        }
    };

    // 게시물 삭제
    const deleteBoard = async (boardIdx) => {
        try {
            const _res = await instance.delete('/user/board/info', {
                params: { boardIdx }
            });
            if (_res.status === 200) {
                console.log('삭제성공');
                getBoardList(); // 삭제 후 목록 갱신
            } else {
                console.log('삭제실패');
            }
        } catch (e) {
            console.log(e);
        }
    };

    // 글쓰기 팝업열기
    const handleIsOpen = () => {
        setModalState("write");
        setBoardCurrentData({})
        openModal();
    }

    useEffect(() => {
        getBoardList();
    }, [page]);

    useEffect(() => {
    }, [boardCurrentData])

    return (
        <>
            <div className='section_wrap flex flex-col gap-4'>
                <Outlet
                    context={{
                        list: list,
                        handleBoardData: handleBoardData,
                        setPage: setPage,
                    }}
                />
                <Pagination totalPages={totalPages} page={page} setPage={setPage} />
                <div
                    className='col-start-3 flex items-center justify-end'>
                    <Button className="mx-0" onClick={handleIsOpen}>글쓰기</Button>
                </div>
            </div>
            {isOpen &&
                <Modal>
                    {modalState === "view" ? (
                        <BoardViewPage data={boardCurrentData} />
                    ) : modalState === "modify" ? (
                        <WritePage data={boardCurrentData} handleBoardData={handleBoardData} />
                    ) : modalState === "write" ? (
                        <WritePage data={boardCurrentData} handleBoardData={handleBoardData} />
                    ) : null}
                </Modal>
            }
        </>
    );
}
