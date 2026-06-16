import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, EllipsisHorizontalCircleIcon } from '@heroicons/react/24/solid';
import { ChatBubbleLeftIcon, EyeIcon, PaperAirplaneIcon, TrashIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import MorePopup from './MorePopup';
import useUserStore from '../../stores/userStore';
import instance from '../../services/instance';
import { ContextType } from '../../pages/board/@types/types';

// ── 타입 ─────────────────────────────────────────────────────────────────────
interface ReplyItem {
    replyIdx: number;
    writerNm: string;
    usrIdx: string;
    contents: string;
    regDt: string;
}

// ── 개별 FAQ 아이템 ────────────────────────────────────────────────────────────
function FaqItem({
    item,
    index,
    isOpen,
    onToggle,
    handleBoardData,
    openPopupIndex,
    setOpenPopupIndex,
    usrIdx,
    userId,
}: any) {
    const [replies, setReplies]       = useState<ReplyItem[]>([]);
    const [answerText, setAnswerText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // 아코디언 열릴 때 답변 목록 로드
    useEffect(() => {
        if (!isOpen) return;
        loadReplies();
    }, [isOpen]);

    const loadReplies = async () => {
        try {
            const res = await instance.get('/user/board/reply/info', {
                params: { boardIdx: item.boardIdx, pageNo: 1, row: 50 },
            });
            if (res.status === 200) setReplies(res.data.list ?? []);
        } catch {}
    };

    // 답변 등록
    const handleSubmitAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!answerText.trim()) return;
        setSubmitting(true);
        try {
            const res = await instance.post('/user/board/reply/info', {
                boardIdx: item.boardIdx,
                contents: answerText,
            });
            if (res.status === 200) {
                setAnswerText('');
                loadReplies();
            }
        } finally { setSubmitting(false); }
    };

    // 답변 삭제
    const handleDeleteReply = async (replyIdx: number) => {
        try {
            const res = await instance.delete('/user/board/reply/info', {
                params: { replyIdx },
            });
            if (res.status === 200) loadReplies();
        } catch {}
    };

    return (
        // overflow-hidden 제거 → absolute 팝업이 잘리지 않음
        // 대신 아코디언 내부 섹션에 개별 overflow-hidden 적용
        <div className='border border-gray-200 rounded-xl bg-white shadow-sm' style={{ position: 'relative' }}>
            {/* ── 질문 헤더 ── */}
            <div
                className='flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-t-xl'
                onClick={onToggle}
            >
                <div className='flex items-center gap-3 flex-1 min-w-0'>
                    <span className='text-blue-500 font-bold text-base min-w-[24px]'>Q.</span>
                    <span className='font-medium text-gray-800 text-sm truncate'>{item.title}</span>
                </div>

                <div className='flex items-center gap-2 ml-2 shrink-0'>
                    <div className='flex items-center gap-3 text-xs text-gray-400'>
                        <span className='flex items-center gap-1'>
                            <ChatBubbleLeftIcon className='h-3.5 w-3.5' />{item.replyCnt ?? 0}
                        </span>
                        <span className='flex items-center gap-1'>
                            <EyeIcon className='h-3.5 w-3.5' />{item.views ?? 0}
                        </span>
                    </div>

                    <div
                        className='relative ml-1'
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        <EllipsisHorizontalCircleIcon
                            className='h-5 w-5 text-gray-400 cursor-pointer hover:text-gray-600'
                            onClick={() => setOpenPopupIndex(openPopupIndex === index ? null : index)}
                        />
                        <MorePopup
                            isOpen={openPopupIndex === index}
                            onClose={() => setOpenPopupIndex(null)}
                            usrIdx={usrIdx}
                            item={item}
                            handleBoardData={handleBoardData}
                        />
                    </div>

                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDownIcon className='h-5 w-5 text-gray-400' />
                    </motion.div>
                </div>
            </div>

            {/* ── 답변 영역 ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className='overflow-hidden rounded-b-xl'
                    >
                        {/* 질문 본문 (contents) */}
                        {item.contents && (
                            <div className='px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 leading-relaxed'
                                dangerouslySetInnerHTML={{ __html: item.contents }}
                            />
                        )}

                        {/* 등록된 답변 목록 */}
                        {replies.length > 0 && (
                            <div className='border-t border-blue-100'>
                                {replies.map((reply) => (
                                    <div
                                        key={reply.replyIdx}
                                        className='flex gap-3 px-5 py-4 bg-blue-50 border-b border-blue-100 last:border-b-0 group'
                                    >
                                        <span className='text-blue-500 font-bold text-base min-w-[24px] shrink-0'>A.</span>
                                        <div className='flex-1 min-w-0'>
                                            <p className='text-gray-700 text-sm leading-relaxed whitespace-pre-wrap'>
                                                {reply.contents}
                                            </p>
                                            <div className='flex items-center justify-between mt-2'>
                                                <div className='flex gap-3 text-xs text-gray-400'>
                                                    <span>{reply.writerNm}</span>
                                                    <span>{reply.regDt}</span>
                                                </div>
                                                {/* 본인 답변 삭제 */}
                                                {String(reply.usrIdx) === String(usrIdx) && (
                                                    <button
                                                        onClick={() => handleDeleteReply(reply.replyIdx)}
                                                        className='opacity-0 group-hover:opacity-100 transition-opacity'
                                                        style={{
                                                            padding: '2px 6px', border: 'none',
                                                            background: 'none', cursor: 'pointer',
                                                            color: '#ef4444', display: 'flex', alignItems: 'center', gap: 2,
                                                            fontSize: 11,
                                                        }}
                                                        title='삭제'
                                                    >
                                                        <TrashIcon style={{ width: 12, height: 12 }} />
                                                        삭제
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 답변 없음 */}
                        {replies.length === 0 && (
                            <div className='px-5 py-4 bg-blue-50 border-t border-blue-100 flex gap-3'>
                                <span className='text-blue-300 font-bold text-base min-w-[24px]'>A.</span>
                                <p className='text-gray-400 text-sm'>아직 등록된 답변이 없습니다.</p>
                            </div>
                        )}

                        {/* 답변 작성 폼 (로그인 시) */}
                        {userId && (
                            <form
                                onSubmit={handleSubmitAnswer}
                                className='border-t border-gray-100 bg-white px-5 py-3'
                            >
                                <div className='flex gap-2 items-center'>
                                    <span className='text-xs font-semibold text-gray-500 shrink-0'>{userId}</span>
                                    <input
                                        type='text'
                                        placeholder='답변을 입력하세요...'
                                        value={answerText}
                                        onChange={(e) => setAnswerText(e.target.value)}
                                        className='flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 transition-colors'
                                    />
                                    <button
                                        type='submit'
                                        disabled={submitting || !answerText.trim()}
                                        className='shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all'
                                        style={{
                                            backgroundColor: answerText.trim() && !submitting ? '#3b82f6' : '#e5e7eb',
                                            color: answerText.trim() && !submitting ? '#fff' : '#9ca3af',
                                            border: 'none', cursor: answerText.trim() ? 'pointer' : 'default',
                                        }}
                                    >
                                        <PaperAirplaneIcon className='h-3.5 w-3.5' />
                                        {submitting ? '등록 중...' : '답변 달기'}
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className='px-5 py-2 bg-white border-t border-gray-100 flex justify-between text-xs text-gray-400 rounded-b-xl'>
                            <span>{item.usrNm}</span>
                            <span>{item.regDt}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── 스켈레톤 ─────────────────────────────────────────────────────────────────
const SkeletonFaq = () => (
    <div className='border border-gray-100 rounded-xl bg-white shadow-sm animate-pulse'>
        <div className='flex items-center justify-between p-4'>
            <div className='flex items-center gap-3 flex-1'>
                <div className='h-4 bg-gray-100 rounded w-6 shrink-0' />
                <div className='h-3 bg-gray-100 rounded flex-1 max-w-sm' />
            </div>
            <div className='flex items-center gap-3 ml-2'>
                <div className='h-2.5 bg-gray-100 rounded w-8' />
                <div className='h-2.5 bg-gray-100 rounded w-8' />
                <div className='h-5 w-5 bg-gray-100 rounded' />
            </div>
        </div>
    </div>
);

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────────────
export default function BoardFAQ() {
    const [selected, setSelected]           = useState<number | null>(null);
    const [openPopupIndex, setOpenPopupIndex] = useState<number | null>(null);
    const { list, loading, handleBoardData } = useOutletContext<ContextType>();
    const { usrIdx, userId }                = useUserStore();

    return (
        <div className='flex flex-col gap-2'>
            {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonFaq key={i} />)
            ) : list.length === 0 ? (
                <p className='text-center text-gray-400 py-10 text-sm'>게시물이 없습니다.</p>
            ) : list.map((item, i) => (
                <FaqItem
                    key={item.boardIdx}
                    item={item}
                    index={i}
                    isOpen={selected === i}
                    onToggle={() => setSelected(selected === i ? null : i)}
                    handleBoardData={handleBoardData}
                    openPopupIndex={openPopupIndex}
                    setOpenPopupIndex={setOpenPopupIndex}
                    usrIdx={usrIdx}
                    userId={userId}
                />
            ))}
        </div>
    );
}
