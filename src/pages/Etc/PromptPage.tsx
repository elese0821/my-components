import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PaperAirplaneIcon, SparklesIcon, UserIcon,
    ClipboardDocumentIcon, ClipboardDocumentCheckIcon,
    ArrowPathIcon, StopIcon,
} from '@heroicons/react/24/outline';

/**
 * ChatComponent — 갖다 붙여 쓰는 AI 대화창 컴포넌트
 *
 *  · 메시지 버블(유저/어시스턴트) · 스트리밍 타이핑 · 타이핑 인디케이터
 *  · auto-grow 입력창 (Enter 전송 / Shift+Enter 줄바꿈) · 빠른 제안 칩
 *  · 메시지 복사 · 새 대화 · 자동 스크롤
 *
 *  ▶ 실제 LLM 연결: sendToAssistant() 안의 mock 부분만 fetch 로 교체하면 됩니다.
 */

// ── 타입 ──────────────────────────────────────────────────────
interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    time: string;
}

const now = () => new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
const uid = () => Math.random().toString(36).slice(2);

const WELCOME: Message = {
    id: 'welcome', role: 'assistant', time: now(),
    content: '안녕하세요! 무엇이든 물어보세요. 아래 추천 질문을 눌러보거나 직접 입력해 주세요. ✨',
};

const QUICK_PROMPTS = [
    '리액트 컴포넌트 최적화 방법 알려줘',
    '이 코드의 버그를 찾아줘',
    '회의록을 요약해줘',
    '영어 문장을 자연스럽게 다듬어줘',
];

// ── mock 응답 (데모용) — 입력 키워드에 따라 반응 ────────────────
const MOCK_REPLIES = [
    '좋은 질문이에요! 핵심부터 짚어드리면, 먼저 문제를 작은 단위로 나누는 것이 중요합니다. 각 단계를 명확히 정의하면 훨씬 다루기 쉬워져요.',
    '네, 가능합니다. 몇 가지 접근 방식이 있는데 상황에 따라 트레이드오프가 달라요. 더 구체적인 맥락을 알려주시면 가장 적합한 방법을 추천해 드릴게요!',
];
function mockReply(userText: string): string {
    const t = userText.toLowerCase();
    if (/버그|에러|오류|bug|error/.test(t))
        return '버그를 찾을 때는 이렇게 접근해 보세요.\n\n1. 재현 조건을 명확히 합니다.\n2. 입력과 기대 출력을 비교합니다.\n3. 의심 구간에 로그를 찍어 좁혀갑니다.\n\n코드를 붙여주시면 구체적으로 짚어드릴게요.';
    if (/요약|정리|summary/.test(t))
        return '요약해 드릴게요.\n\n• 핵심 주제\n• 주요 논점 2~3가지\n• 결론 및 다음 액션\n\n원문을 붙여주시면 위 형식으로 정리해 드리겠습니다.';
    if (/최적화|성능|리팩|optimi|perf/.test(t))
        return '핵심은 "가독성"과 "성능"의 균형입니다. 불필요한 리렌더링을 줄이고(useMemo/useCallback), 관심사를 분리하면 유지보수가 훨씬 쉬워집니다. 대상 코드를 보여주세요!';
    if (/번역|다듬|영어|translate/.test(t))
        return '자연스럽게 다듬어 드릴게요. 원문을 보내주시면 ① 매끄러운 표현 ② 핵심 뉘앙스 유지 ③ 대체 표현 제안을 함께 드리겠습니다.';
    return MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
}

// ── 타이핑 인디케이터 ──────────────────────────────────────────
function TypingDots() {
    return (
        <div className='flex items-center gap-1 py-1'>
            {[0, 1, 2].map(i => (
                <motion.span
                    key={i}
                    className='w-1.5 h-1.5 rounded-full bg-gray-400'
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                />
            ))}
        </div>
    );
}

// ── 아바타 ────────────────────────────────────────────────────
function Avatar({ role }: { role: 'user' | 'assistant' }) {
    if (role === 'assistant') {
        return (
            <div className='w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm'
                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                <SparklesIcon className='h-4.5 w-4.5 text-white' style={{ width: 18, height: 18 }} />
            </div>
        );
    }
    return (
        <div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0'>
            <UserIcon className='h-4.5 w-4.5 text-gray-500' style={{ width: 18, height: 18 }} />
        </div>
    );
}

// ── 메시지 버블 ───────────────────────────────────────────────
function Bubble({ msg }: { msg: Message }) {
    const isUser = msg.role === 'user';
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(msg.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            <Avatar role={msg.role} />
            <div className={`group flex flex-col gap-1 max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                    className={`px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
                        isUser
                            ? 'text-white rounded-2xl rounded-tr-md'
                            : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-md'
                    }`}
                    style={isUser ? { background: 'linear-gradient(135deg,#6366f1,#7c5cf0)' } : undefined}
                >
                    {msg.content || <TypingDots />}
                </div>
                {/* 메타: 시간 + 복사 */}
                <div className={`flex items-center gap-2 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
                    <span className='text-[10px] text-gray-300'>{msg.time}</span>
                    {!isUser && msg.content && (
                        <button
                            onClick={copy}
                            className='opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-indigo-500'
                            title='복사'
                        >
                            {copied
                                ? <ClipboardDocumentCheckIcon className='h-3.5 w-3.5 text-green-500' />
                                : <ClipboardDocumentIcon className='h-3.5 w-3.5' />}
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ── 메인 ──────────────────────────────────────────────────────
export default function PromptPage() {
    const [messages, setMessages] = useState<Message[]>([WELCOME]);
    const [input, setInput]       = useState('');
    const [streaming, setStreaming] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const taRef     = useRef<HTMLTextAreaElement>(null);
    const stopRef   = useRef(false);

    // 자동 스크롤 (맨 아래)
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    // textarea auto-grow
    const autoGrow = () => {
        const ta = taRef.current;
        if (!ta) return;
        ta.style.height = 'auto';
        ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
    };
    useEffect(autoGrow, [input]);

    // ── 어시스턴트 응답 (스트리밍 타이핑) ──────────────────────
    const sendToAssistant = useCallback(async (userText: string) => {
        setStreaming(true);
        stopRef.current = false;

        // 타이핑 인디케이터용 빈 메시지
        const aId = uid();
        setMessages(prev => [...prev, { id: aId, role: 'assistant', content: '', time: now() }]);

        // ▼▼▼ 실제 LLM 연결 지점 — 이 블록만 교체하면 됩니다 ▼▼▼
        //   const res = await fetch('/api/chat', { method:'POST', body: JSON.stringify({ message: userText }) });
        //   const reader = res.body.getReader(); ... 스트림을 읽어 setMessages 로 누적
        // ▲▲▲ 아래는 데모용 mock 스트리밍 ▲▲▲
        await new Promise(r => setTimeout(r, 500)); // "생각 중" 딜레이
        const reply = mockReply(userText);

        for (let i = 0; i < reply.length; i++) {
            if (stopRef.current) break;
            await new Promise(r => setTimeout(r, 12 + Math.random() * 18));
            const slice = reply.slice(0, i + 1);
            setMessages(prev => prev.map(m => m.id === aId ? { ...m, content: slice } : m));
        }
        // 중단 시 현재까지 내용 유지
        setStreaming(false);
    }, []);

    // ── 전송 ──────────────────────────────────────────────────
    const send = (text?: string) => {
        const value = (text ?? input).trim();
        if (!value || streaming) return;
        setMessages(prev => [...prev, { id: uid(), role: 'user', content: value, time: now() }]);
        setInput('');
        requestAnimationFrame(() => { if (taRef.current) taRef.current.style.height = 'auto'; });
        sendToAssistant(value);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    const stop      = () => { stopRef.current = true; };
    const resetChat = () => { setStreaming(false); stopRef.current = true; setMessages([{ ...WELCOME, time: now() }]); };

    const showQuick = messages.length <= 1;

    return (
        <div className='section_wrap'>
            <div className='mx-auto w-full max-w-2xl flex flex-col bg-gradient-to-b from-gray-50 to-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'
                style={{ height: 'calc(100vh - 200px)', minHeight: 480 }}>

                {/* ── 헤더 ── */}
                <div className='flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white/80 backdrop-blur'>
                    <div className='flex items-center gap-2.5'>
                        <div className='relative'>
                            <Avatar role='assistant' />
                            <span className='absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white' />
                        </div>
                        <div>
                            <p className='text-sm font-semibold text-gray-800 leading-tight'>AI 어시스턴트</p>
                            <p className='text-[11px] text-green-500 leading-tight'>
                                {streaming ? '입력 중…' : '온라인'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={resetChat}
                        className='flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors'
                        title='새 대화'
                    >
                        <ArrowPathIcon className='h-3.5 w-3.5' />
                        새 대화
                    </button>
                </div>

                {/* ── 메시지 영역 ── */}
                <div ref={scrollRef} className='flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4'>
                    <AnimatePresence initial={false}>
                        {messages.map(m => <Bubble key={m.id} msg={m} />)}
                    </AnimatePresence>

                    {/* 빠른 제안 칩 (대화 시작 전) */}
                    {showQuick && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                            className='flex flex-wrap gap-2 pl-10 mt-1'
                        >
                            {QUICK_PROMPTS.map(q => (
                                <button
                                    key={q}
                                    onClick={() => send(q)}
                                    className='text-xs px-3 py-1.5 rounded-full border border-indigo-200 text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 transition-colors'
                                >
                                    {q}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* ── 입력창 ── */}
                <div className='px-3 py-3 border-t border-gray-100 bg-white'>
                    <div className='flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/20 transition-all'>
                        <textarea
                            ref={taRef}
                            rows={1}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={onKeyDown}
                            placeholder='메시지를 입력하세요…  (Enter 전송 · Shift+Enter 줄바꿈)'
                            className='flex-1 bg-transparent outline-none resize-none text-sm text-gray-800 placeholder-gray-400 py-1 leading-relaxed max-h-40'
                        />
                        {streaming ? (
                            <button
                                onClick={stop}
                                className='shrink-0 w-9 h-9 rounded-xl bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors'
                                title='생성 중지'
                            >
                                <StopIcon className='h-4 w-4 text-gray-600' />
                            </button>
                        ) : (
                            <button
                                onClick={() => send()}
                                disabled={!input.trim()}
                                className='shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed'
                                style={{ background: input.trim() ? 'linear-gradient(135deg,#6366f1,#7c5cf0)' : '#e5e7eb' }}
                                title='전송'
                            >
                                <PaperAirplaneIcon className='h-4 w-4 text-white' />
                            </button>
                        )}
                    </div>
                    <p className='text-[10px] text-gray-300 text-center mt-2'>
                        AI 어시스턴트는 실수를 할 수 있습니다. 중요한 정보는 확인하세요.
                    </p>
                </div>
            </div>
        </div>
    );
}
