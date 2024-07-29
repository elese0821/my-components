import React, { FormEvent, Suspense, useEffect, useState } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import instance from '../../services/instance';
import Modal from './../../components/modal/Modal';
import WritePage from './WritePage';
import BoardViewPage from './BoardViewPage';
import Pagination from '../../components/common/pagination/Pagination';
import H1 from './../../components/common/tag/H1';
import Buttons from '../../components/common/forms/Buttons';
import useDialogStore from '../../stores/dialogStore';
import useModalStore from '../../stores/modalStore';
import BoardTabPage from '../../components/board/BoardTabPage';
import BoardSearch from '../../components/board/BoardSearch';
import systemConfig from '../../utils/config/system_config.json'
import { ContextType, BoardItem, ModalState } from './@types/types';
import useUserStore from '../../stores/userStore';


export default function BoardPage() {
    const [list, setList] = useState<BoardItem[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1); // 총 페이지 수 상태 추가
    const [row, setRow] = useState<number>(10); // 총 페이지 수 상태 추가
    const { isOpen, openModal, closeModal } = useModalStore(state => state);
    const { openDialog } = useDialogStore();
    const [searchStr, setSearchStr] = useState<string>(''); // 게시판 검색
    // modal state
    const [modalState, setModalState] = useState<ModalState>(null);
    const { userId } = useUserStore();

    // 게시판 타이틀 동적변환
    const params = useParams<Record<string, string>>();
    const id = Object.values(params)[0];

    const [pageNow, setPageNow] = useState<string>('board');

    // 게시판 팝업데이터 관리
    const [boardCurrentData, setBoardCurrentData] = useState({})

    // 게시글 팝업 데이터 관리 함수
    const handleBoardData = (flag: string, boardIdx: string): void => {
        if (flag === "view" || flag === "write" || flag === "modify") {
            setModalState(flag);
            getBoardView(boardIdx);
            openModal();
            return
        }
        if (flag === "delete") {
            deleteBoard(boardIdx);
            setBoardCurrentData({});
            if (isOpen) {
                closeModal();
            }
            openDialog("삭제완료😎");
        }
    }

    // row 제어
    const handleRow = (row: number) => {
        setRow(row);
        setPage(1);
        getBoardList();
    }

    // 게시판 단건조회
    const getBoardView = async (boardIdx: string): Promise<void> => {
        try {
            const _res = await instance.get('/user/board/info', {
                params: {
                    boardIdx: boardIdx
                }
            });
            if (_res?.status === 200) {
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
    const getBoardList = async (): Promise<void> => {
        try {
            const _res = await instance.get('/user/board/info', {
                params: {
                    row: row,
                    pageNo: page,
                    searchStr: searchStr ? searchStr : null
                }
            });
            if (_res?.status === 200) {
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

    // 게시판검색
    const getBoardSearch = async (search: string): Promise<void> => {
        try {
            const _res = await instance.get('/user/board/info', {
                params: {
                    row: row,
                    pageNo: page,
                    searchStr: search !== "" ? search : null
                }
            });
            if (_res?.status === 200) {
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

    // 검색어 조회 클릭시 
    const handleSearch = (search: string) => (e: React.FormEvent<HTMLInputElement>): void => {
        e.preventDefault();
        getBoardSearch(search);
        setSearchStr("");
    };

    // 게시물 삭제
    const deleteBoard = async (boardIdx: string): Promise<void> => {
        try {
            const _res = await instance.delete('/user/board/info', {
                params: { boardIdx }
            });
            if (_res?.status === 200) {
                console.log('삭제성공');
                getBoardList(); // 삭제 후 목록 갱신
            } else {
                console.log('삭제실패');
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleBoardTitle = () => {
        const { menu } = systemConfig;
        menu.forEach(item => {
            if (item.submenu) {
                item.submenu.forEach(({ cateId, name }) => {
                    if (id === cateId) {
                        setPageNow(name);
                    }
                });
            }
        });
    };

    // 글쓰기 팝업열기
    const handleIsOpen = (): void => {
        setModalState("write");
        setBoardCurrentData({})
        openModal();
    }

    // 게시판 행, 페이지 변경시
    useEffect(() => {
        getBoardList();
    }, [page, row]);

    // path 변경시
    useEffect(() => {
        handleBoardTitle()
    }, [params])

    return (
        <>
            <div className='section_wrap flex flex-col gap-2 relative'>
                <div className='flex flex-col gap-2'>
                    <div className='flex justify-between'>
                        <H1>{pageNow}</H1>
                        <Buttons className="mx-0 text-sm" onClick={handleIsOpen}>글쓰기</Buttons>
                    </div>
                    <div className='flex justify-between'>
                        <BoardTabPage handleRow={handleRow} />
                        <BoardSearch handleSearch={handleSearch} />
                    </div>
                </div>
                <Outlet
                    context={{
                        list: list,
                        handleBoardData: handleBoardData,
                        handleRow: handleRow,
                        handleSearch: handleSearch,
                    } satisfies ContextType}
                />

                <Pagination totalPages={totalPages} page={page} setPage={setPage} />
            </div>
            {isOpen && userId &&
                <Modal>
                    {modalState === "view" ? (
                        <BoardViewPage data={boardCurrentData} />
                    ) : modalState === "modify" ? (
                        <WritePage data={boardCurrentData} handleBoardData={handleBoardData} getBoardList={getBoardList} />
                    ) : modalState === "write" ? (
                        <WritePage data={boardCurrentData} handleBoardData={handleBoardData} getBoardList={getBoardList} />
                    ) : null}
                </Modal>
            }
        </>
    );
}
