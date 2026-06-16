import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Outlet, useNavigate } from 'react-router-dom';
import instance from '../../services/instance';
import useUserStore from '../../stores/userStore';
import useDialogStore from '../../stores/dialogStore';
import { listType } from './@types/listType';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlusIcon, LockClosedIcon, ArrowRightIcon,
    ChatBubbleLeftRightIcon, XMarkIcon,
    EyeIcon, EyeSlashIcon, MagnifyingGlassIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import { ChatBubbleLeftEllipsisIcon, SparklesIcon } from '@heroicons/react/24/solid';

// ── 색상 팔레트 ─────────────────────────────────────────────────────
const ROOM_COLORS = [
    '#6366f1', '#ec4899', '#10b981', '#f59e0b',
    '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4',
];
function roomColor(name: string) {
    return ROOM_COLORS[(name ?? '').charCodeAt(0) % ROOM_COLORS.length];
}

// ── 시간 포맷 ────────────────────────────────────────────────────────
function fmtTime(raw?: string) {
    if (!raw) return '';
    try {
        const d = new Date(raw);
        if (isNaN(d.getTime())) return raw.slice(0, 10);
        const diff = Date.now() - d.getTime();
        if (diff < 60_000)          return '방금 전';
        if (diff < 3_600_000)       return `${Math.floor(diff / 60_000)}분 전`;
        if (diff < 86_400_000)      return `${Math.floor(diff / 3_600_000)}시간 전`;
        if (diff < 86_400_000 * 7)  return `${Math.floor(diff / 86_400_000)}일 전`;
        return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
    } catch { return ''; }
}

// ── 타입 ─────────────────────────────────────────────────────────────
type ModalMode = null | 'create' | 'enter';

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────
export default function ChatList() {
    const { userId }              = useUserStore();
    const [chatList, setChatList] = useState<listType[]>([]);
    const [search,   setSearch]   = useState('');
    const { openDialog }          = useDialogStore();
    const navigate                = useNavigate();

    // 모달 상태
    const [modal,        setModal]        = useState<ModalMode>(null);
    const [selRoom,      setSelRoom]      = useState<listType | null>(null);
    const [chatName,     setChatName]     = useState('');
    const [password,     setPassword]     = useState('');
    const [showPw,       setShowPw]       = useState(false);
    const [loading,      setLoading]      = useState(false);
    const [listLoading,  setListLoading]  = useState(true);
    const nameInputRef   = useRef<HTMLInputElement>(null);

    // ── 데이터 로드 ─────────────────────────────────────────────────
    const getChatList = async () => {
        setListLoading(true);
        try {
            const res = await instance.get('/user/chat', { params: { row: 20, pageNo: 1 } });
            if (res.data.result === 'success') setChatList(res.data.list ?? []);
        } catch (e) { console.error(e); }
        finally { setListLoading(false); }
    };

    useEffect(() => { getChatList(); }, []);

    // 모달 열기
    const openCreate = () => {
        setChatName(''); setPassword(''); setShowPw(false);
        setModal('create');
        setTimeout(() => nameInputRef.current?.focus(), 80);
    };
    const openEnter = (room: listType) => {
        setSelRoom(room); setPassword(''); setShowPw(false);
        setModal('enter');
    };
    const closeModal = () => { setModal(null); setSelRoom(null); };

    // ── 방 만들기 ─────────────────────────────────────────────────────
    const handleCreate = async () => {
        if (!chatName.trim()) { openDialog('채팅방 이름을 입력해주세요.'); return; }
        setLoading(true);
        try {
            const res = await instance.post('/user/chat', { chatNm: chatName, pw: password });
            if (res.data.result === 'success') {
                await getChatList();
                closeModal();
                openDialog('채팅방이 생성되었습니다.');
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    // ── 입장 ──────────────────────────────────────────────────────────
    const handleEnter = async () => {
        if (!selRoom) return;
        setLoading(true);
        try {
            const res = await instance.get(`/user/chat/${selRoom.channelId}`, {
                params: { chatNm: selRoom.chatNm, pw: password },
            });
            if (res.data.result === 'success') {
                navigate(`chatRoom/${selRoom.channelId}`, {
                    state: { chatName: selRoom.chatNm, channelId: selRoom.channelId },
                });
                closeModal();
            } else {
                openDialog('비밀번호가 올바르지 않습니다.');
            }
        } catch (e) { console.error(e); openDialog('입장에 실패했습니다.'); }
        finally { setLoading(false); }
    };

    // Enter 키
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') modal === 'create' ? handleCreate() : handleEnter();
    };

    const filtered = chatList.filter(r =>
        (r.chatNm ?? '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {/* ── 페이지 본문 ────────────────────────────────────────── */}
            <div className='flex flex-col gap-5'>

                {/* 상단 헤더 */}
                <div className='flex items-center justify-between'>
                    <div>
                        <h2 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
                            <ChatBubbleLeftRightIcon className='h-5 w-5 text-indigo-500' />
                            채팅방
                        </h2>
                        {userId && (
                            <div className='flex items-center gap-1.5 mt-1'>
                                <UserCircleIcon className='h-3.5 w-3.5 text-gray-400' />
                                <span className='text-xs text-gray-400'>{userId}</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={openCreate}
                        className='flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow-sm'
                        style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
                    >
                        <PlusIcon className='h-4 w-4' />
                        채팅방 만들기
                    </button>
                </div>

                {/* 검색 바 */}
                <div className='flex items-center gap-2.5 border border-gray-200 rounded-xl px-3.5 py-2.5 bg-white shadow-sm focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-500/15 transition-all'>
                    <MagnifyingGlassIcon className='h-4 w-4 text-gray-400 shrink-0' />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder='채팅방 검색...'
                        className='flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400'
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className='text-gray-300 hover:text-gray-500 transition-colors'>
                            <XMarkIcon className='h-3.5 w-3.5' />
                        </button>
                    )}
                </div>

                {/* 목록 */}
                {listLoading ? (
                    <div className='flex flex-col gap-2'>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className='flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 animate-pulse'>
                                <div className='w-11 h-11 rounded-full bg-gray-100 shrink-0' />
                                <div className='flex-1 min-w-0 flex flex-col gap-2'>
                                    <div className='h-3 bg-gray-100 rounded w-1/3' />
                                    <div className='h-2.5 bg-gray-100 rounded w-2/3' />
                                </div>
                                <div className='h-2.5 bg-gray-100 rounded w-10 shrink-0' />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState hasSearch={!!search} onCreate={openCreate} />
                ) : (
                    <div className='flex flex-col gap-2'>
                        {filtered.map((room, i) => (
                            <RoomCard key={room.channelId ?? i} room={room} index={i} onClick={() => openEnter(room)} />
                        ))}
                    </div>
                )}
            </div>

            {/* Outlet (ChatRoom 오버레이용) */}
            <Outlet />

            {/* ── 모달 (portal → 헤더 위) ─────────────────────────── */}
            {createPortal(
                <AnimatePresence>
                    {modal && (
                        <ChatModal
                            mode={modal}
                            room={selRoom}
                            chatName={chatName}
                            setChatName={setChatName}
                            password={password}
                            setPassword={setPassword}
                            showPw={showPw}
                            setShowPw={setShowPw}
                            loading={loading}
                            onClose={closeModal}
                            onSubmit={modal === 'create' ? handleCreate : handleEnter}
                            nameInputRef={nameInputRef}
                            onKeyDown={onKeyDown}
                        />
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}

// ── 빈 상태 ─────────────────────────────────────────────────────────
function EmptyState({ hasSearch, onCreate }: { hasSearch: boolean; onCreate: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex flex-col items-center justify-center py-20 gap-4'
        >
            <div className='w-16 h-16 rounded-2xl flex items-center justify-center'
                style={{ background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)' }}>
                <ChatBubbleLeftRightIcon className='h-8 w-8 text-indigo-300' />
            </div>
            <div className='text-center'>
                <p className='text-sm font-semibold text-gray-600'>
                    {hasSearch ? '검색 결과가 없습니다' : '채팅방이 없습니다'}
                </p>
                <p className='text-xs text-gray-400 mt-1'>
                    {hasSearch ? '다른 이름으로 검색해보세요.' : '새 채팅방을 만들어 대화를 시작해보세요.'}
                </p>
            </div>
            {!hasSearch && (
                <button
                    onClick={onCreate}
                    className='flex items-center gap-1.5 text-sm font-semibold text-indigo-500 hover:text-indigo-700 transition-colors'
                >
                    <SparklesIcon className='h-4 w-4' />
                    첫 채팅방 만들기
                </button>
            )}
        </motion.div>
    );
}

// ── 채팅방 카드 ──────────────────────────────────────────────────────
function RoomCard({ room, index, onClick }: { room: listType; index: number; onClick: () => void }) {
    const bg = roomColor(room.chatNm ?? '');
    const initial = (room.chatNm ?? '?')[0]?.toUpperCase();
    const hasLock = !!room.chatPw;
    const time = room.lastChatDatetime ? fmtTime(room.lastChatDatetime) : fmtTime(room.regDt);

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, ease: 'easeOut' }}
            onClick={onClick}
            className='group flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm cursor-pointer
                       hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200'
        >
            {/* 아바타 */}
            <div className='relative shrink-0'>
                <div
                    className='w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-sm'
                    style={{ background: bg }}
                >
                    {initial}
                </div>
                {/* 잠금 뱃지 */}
                {hasLock && (
                    <div className='absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border border-gray-200 flex items-center justify-center'>
                        <LockClosedIcon className='h-2.5 w-2.5 text-gray-500' />
                    </div>
                )}
            </div>

            {/* 정보 */}
            <div className='flex-1 min-w-0'>
                <p className='text-sm font-semibold text-gray-800 truncate'>{room.chatNm}</p>
                {room.lastChat ? (
                    <p className='text-xs text-gray-400 truncate mt-0.5'>{room.lastChat}</p>
                ) : (
                    <p className='text-xs text-gray-300 mt-0.5 italic'>아직 메시지가 없습니다</p>
                )}
            </div>

            {/* 우측 */}
            <div className='flex flex-col items-end gap-2 shrink-0'>
                {time && <span className='text-[10px] text-gray-400'>{time}</span>}
                <span
                    className='inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-indigo-600 bg-indigo-50
                               opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-200'
                >
                    입장 <ArrowRightIcon className='h-3 w-3' />
                </span>
            </div>
        </motion.div>
    );
}

// ── 모달 ─────────────────────────────────────────────────────────────
interface ModalProps {
    mode: 'create' | 'enter';
    room: listType | null;
    chatName: string;
    setChatName: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
    showPw: boolean;
    setShowPw: (v: boolean) => void;
    loading: boolean;
    onClose: () => void;
    onSubmit: () => void;
    nameInputRef: React.RefObject<HTMLInputElement>;
    onKeyDown: (e: React.KeyboardEvent) => void;
}

function ChatModal({
    mode, room, chatName, setChatName, password, setPassword,
    showPw, setShowPw, loading, onClose, onSubmit, nameInputRef, onKeyDown,
}: ModalProps) {
    const isCreate = mode === 'create';
    const bg = isCreate ? '#6366f1' : roomColor(room?.chatNm ?? '');
    const label = isCreate ? '새 채팅방 만들기' : (room?.chatNm ?? '채팅방 입장');

    return (
        /* 오버레이 + 중앙 정렬 컨테이너 — flex로 centering, Framer Motion transform 충돌 없음 */
        <motion.div
            key='modal-wrapper'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-[200] flex items-end sm:items-center justify-center'
            style={{ background: 'rgba(15,15,25,0.48)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            {/* 모달 패널 */}
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 16 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className='w-full sm:w-[400px] bg-white shadow-2xl overflow-hidden rounded-t-2xl sm:rounded-2xl'
                onClick={e => e.stopPropagation()}
            >
                {/* 상단 컬러 스트라이프 */}
                <div className='h-1 w-full' style={{ background: `linear-gradient(90deg,${bg},${bg}99)` }} />

                {/* 헤더 */}
                <div className='flex items-center justify-between px-5 py-4'>
                    <div className='flex items-center gap-3'>
                        <div className='w-9 h-9 rounded-xl flex items-center justify-center text-white text-base font-bold shadow-sm'
                            style={{ background: bg }}>
                            {isCreate ? <ChatBubbleLeftEllipsisIcon className='h-5 w-5' /> : (room?.chatNm ?? '?')[0]?.toUpperCase()}
                        </div>
                        <div>
                            <p className='text-sm font-bold text-gray-800'>{label}</p>
                            <p className='text-xs text-gray-400'>{isCreate ? '채팅방 정보를 입력하세요' : '입장 정보를 확인하세요'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className='p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors'>
                        <XMarkIcon className='h-4 w-4' />
                    </button>
                </div>

                {/* 폼 */}
                <div className='px-5 pb-6 flex flex-col gap-3.5'>
                    {/* 방 이름 (생성 모드만) */}
                    {isCreate && (
                        <div className='flex flex-col gap-1.5'>
                            <label className='text-xs font-semibold text-gray-500'>
                                채팅방 이름 <span className='text-red-400'>*</span>
                            </label>
                            <input
                                ref={nameInputRef}
                                type='text'
                                value={chatName}
                                onChange={e => setChatName(e.target.value)}
                                onKeyDown={onKeyDown}
                                placeholder='ex. 디자인팀 채널'
                                className='w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none
                                           focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all'
                            />
                        </div>
                    )}

                    {/* 비밀번호 */}
                    <div className='flex flex-col gap-1.5'>
                        <label className='text-xs font-semibold text-gray-500'>
                            {isCreate ? '비밀번호 (선택 — 없으면 공개방)' : '비밀번호'}
                        </label>
                        <div className='flex items-center border border-gray-200 rounded-xl overflow-hidden
                                        focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all'>
                            <input
                                type={showPw ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={onKeyDown}
                                placeholder={isCreate ? '비밀번호 설정 (선택)' : '채팅방 비밀번호 입력'}
                                className='flex-1 px-3.5 py-2.5 text-sm outline-none bg-transparent'
                            />
                            <button
                                type='button'
                                onClick={() => setShowPw(p => !p)}
                                className='px-3.5 text-gray-400 hover:text-gray-600 transition-colors'
                            >
                                {showPw
                                    ? <EyeSlashIcon className='h-4 w-4' />
                                    : <EyeIcon className='h-4 w-4' />}
                            </button>
                        </div>
                    </div>

                    {/* 제출 버튼 */}
                    <button
                        onClick={onSubmit}
                        disabled={loading || (isCreate && !chatName.trim())}
                        className='w-full mt-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-[0.98]'
                        style={{
                            background: (loading || (isCreate && !chatName.trim()))
                                ? '#e5e7eb'
                                : `linear-gradient(135deg,${bg},${bg}cc)`,
                            color: (loading || (isCreate && !chatName.trim())) ? '#9ca3af' : '#fff',
                            boxShadow: (loading || (isCreate && !chatName.trim())) ? 'none' : `0 4px 14px ${bg}44`,
                        }}
                    >
                        {loading
                            ? '처리 중...'
                            : isCreate ? '채팅방 생성하기' : '입장하기 →'}
                    </button>
                </div>

                {/* safe-area (모바일 bottom) */}
                <div className='sm:hidden' style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
            </motion.div>
        </motion.div>
    );
}
