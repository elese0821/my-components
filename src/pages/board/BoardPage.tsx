import React, { FormEvent, Suspense, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, Outlet, useParams } from 'react-router-dom';
import instance from '../../services/instance';
import WritePage from './WritePage';
import BoardViewPage from './BoardViewPage';
import Pagination from '../../components/common/pagination/Pagination';
import H1 from './../../components/common/tag/H1';
import Buttons from '../../components/common/forms/Buttons';
import useDialogStore from '../../stores/dialogStore';
import BoardTabPage from '../../components/board/BoardTabPage';
import BoardSearch from '../../components/board/BoardSearch';
import systemConfig from '../../utils/config/system_config.json'
import { ContextType, BoardItem, ModalState } from './@types/types';
import useUserStore from '../../stores/userStore';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';


export default function BoardPage() {
    const [list, setList] = useState<BoardItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [row, setRow] = useState<number>(10);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { openDialog, isOpen: isDialogOpen } = useDialogStore();
    const [searchStr, setSearchStr] = useState<string>('');
    const [modalState, setModalState] = useState<ModalState>(null);
    const { userId, usrIdx } = useUserStore();
    const modalRef = useRef<HTMLDivElement>(null);

    const openModal = () => setIsOpen(true);
    const closeModal = () => { setIsOpen(false); setModalState(null); };

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (!isDialogOpen && modalRef.current && !modalRef.current.contains(e.target as Node)) {
                closeModal();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, isDialogOpen]);

    // 게시판 타이틀 동적변환
    const params = useParams<Record<string, string>>();
    const id = Object.values(params)[0];

    const [pageNow, setPageNow] = useState<string>('board');

    // 게시판 팝업데이터 관리
    const [boardCurrentData, setBoardCurrentData] = useState({})

    // 게시글 팝업 데이터 관리 함수
    const handleBoardData = async (flag: string, boardIdx: string): Promise<void> => {
        if (flag === "view" || flag === "modify") {
            try {
                const _res = await instance.get('/user/board/info', {
                    params: { boardIdx }
                });
                if (_res?.status === 200) {
                    // 데이터 준비 후 한 번에 state 업데이트 → React가 단일 렌더로 처리
                    setBoardCurrentData(_res.data.one);
                    setModalState(flag);
                    setIsOpen(true);
                }
            } catch (e) {
                console.log(e);
            }
            return;
        }
        if (flag === "write") {
            setModalState("write");
            setBoardCurrentData({});
            setIsOpen(true);
            return;
        }
        if (flag === "delete") {
            const ok = await deleteBoard(boardIdx);
            setBoardCurrentData({});
            if (isOpen) closeModal();
            openDialog(ok ? "삭제되었습니다." : "삭제에 실패했습니다.");
            return;
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
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    // 게시판검색
    const getBoardSearch = async (search: string): Promise<void> => {
        setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    // 검색어 조회 클릭시 
    const handleSearch = (search: string) => (e: React.FormEvent<HTMLInputElement>): void => {
        e.preventDefault();
        getBoardSearch(search);
        setSearchStr("");
    };

    // 게시물 삭제 → 성공 여부 반환
    const deleteBoard = async (boardIdx: string): Promise<boolean> => {
        try {
            const _res = await instance.delete('/user/board/info', {
                params: { boardIdx }
            });
            if (_res?.status === 200) {
                getBoardList(); // 삭제 후 목록 갱신
                return true;
            }
            return false;
        } catch (e) {
            console.log(e);
            return false;
        }
    };

    const handleBoardTitle = () => {
        const { menu } = systemConfig;
        // /board 경로의 submenu만 참조 — 다른 메뉴의 cateId 충돌 방지
        const boardMenu = (menu as any[]).find(item => item.path === '/board');
        if (boardMenu?.submenu) {
            const match = boardMenu.submenu.find(({ cateId }: { cateId: string }) => cateId === id);
            if (match) setPageNow(match.name);
        }
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
                        loading: loading,
                        handleBoardData: handleBoardData,
                        handleRow: handleRow,
                        handleSearch: handleSearch,
                    } satisfies ContextType}
                />

                <Pagination totalPages={totalPages} page={page} setPage={setPage} />
            </div>
            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            key="board-modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[200]"
                        >
                            <motion.div
                                key={`board-modal-${(boardCurrentData as any)?.boardIdx ?? modalState}`}
                                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                ref={modalRef}
                                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full relative flex flex-col"
                                style={
                                    (modalState === 'write' || modalState === 'modify')
                                        ? { height: '90vh', maxHeight: '90vh' }
                                        : { maxHeight: '90vh', overflowY: 'auto' as const }
                                }
                            >
                                <button
                                    className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600 z-10 transition-colors"
                                    onClick={closeModal}
                                >
                                    <XCircleIcon className="h-6 w-6" />
                                </button>
                                {modalState === "view" && (
                                    <BoardViewPage
                                        data={boardCurrentData}
                                        handleBoardData={handleBoardData}
                                        currentUsrIdx={usrIdx}
                                    />
                                )}
                                {(modalState === "modify" || modalState === "write") && (
                                    userId
                                        ? <WritePage data={boardCurrentData} handleBoardData={handleBoardData} getBoardList={getBoardList} closeModal={closeModal} />
                                        : <div className="p-10 text-center text-gray-600">
                                            <p className="text-lg font-semibold mb-2">로그인이 필요합니다</p>
                                            <p className="text-sm text-gray-400">test / Test1234! 로 로그인하세요</p>
                                          </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
