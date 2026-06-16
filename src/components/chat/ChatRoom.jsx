import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import useUserStore from '../../stores/userStore.ts';
import { SERVER_API_BASE_URL, WEB_SOCKET_API_BASE_URL } from "../../services/endpoint.ts";
import instance from "../../services/instance.ts";
import {
    PaperAirplaneIcon, PaperClipIcon, XMarkIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

// ── 날짜 포맷 ─────────────────────────────────────────────────────────
function fmtTime(regDt) {
    if (!regDt) return '';
    try {
        const d = new Date(regDt);
        if (isNaN(d.getTime())) return regDt.slice(11, 16) || '';
        return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch { return regDt.toString().slice(11, 16); }
}

function fmtDate(regDt) {
    if (!regDt) return '';
    try {
        const d = new Date(regDt);
        if (isNaN(d.getTime())) return regDt.toString().slice(0, 10);
        const now = new Date();
        if (d.toDateString() === now.toDateString()) return '오늘';
        if (new Date(now - 86_400_000).toDateString() === d.toDateString()) return '어제';
        return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' });
    } catch { return regDt.toString().slice(0, 10); }
}

function getDateKey(regDt) {
    if (!regDt) return '';
    try { return new Date(regDt).toDateString(); } catch { return regDt.toString().slice(0, 10); }
}

// ── 아바타 ────────────────────────────────────────────────────────────
const COLORS = ['#6366f1','#ec4899','#10b981','#f59e0b','#3b82f6','#8b5cf6','#ef4444','#06b6d4'];
function avatarBg(name) { return COLORS[(name ?? '').charCodeAt(0) % COLORS.length]; }
function initials(name) { return (name ?? '?')[0].toUpperCase(); }

function Avatar({ name, size = 34 }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: avatarBg(name), color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.38, fontWeight: 700, flexShrink: 0,
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
        }}>
            {initials(name)}
        </div>
    );
}

// ── 메시지 그룹 ──────────────────────────────────────────────────────
function isFirst(msgs, i) {
    if (i === 0) return true;
    const c = msgs[i], p = msgs[i - 1];
    if (c.usrNm !== p.usrNm) return true;
    if (getDateKey(c.regDt) !== getDateKey(p.regDt)) return true;
    try { return new Date(c.regDt) - new Date(p.regDt) > 5 * 60_000; } catch { return true; }
}
function isLast(msgs, i) {
    if (i === msgs.length - 1) return true;
    const c = msgs[i], n = msgs[i + 1];
    if (c.usrNm !== n.usrNm) return true;
    if (getDateKey(c.regDt) !== getDateKey(n.regDt)) return true;
    try { return new Date(n.regDt) - new Date(c.regDt) > 5 * 60_000; } catch { return true; }
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────
export default function ChatRoom() {
    const location = useLocation();
    const { channelId, chatName } = location.state || {};
    const [messages, setMessages] = useState([]);
    const { usrIdx, userId: usrNm } = useUserStore(s => s);
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [atBottom, setAtBottom] = useState(true);
    const [newCount, setNewCount] = useState(0);

    const msgAreaRef    = useRef(null);
    const messagesEndRef = useRef(null);
    const socketRef      = useRef(null);
    const fileInputRef   = useRef(null);
    const inputRef       = useRef(null);

    // 스크롤 끝 유지
    const scrollToBottom = (smooth = true) => {
        messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant' });
        setNewCount(0);
    };

    useEffect(() => {
        if (atBottom) scrollToBottom();
        else setNewCount(p => p + 1);
    }, [messages]);

    // 스크롤 감지
    const handleScroll = () => {
        if (!msgAreaRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = msgAreaRef.current;
        const bottom = scrollHeight - scrollTop - clientHeight < 60;
        setAtBottom(bottom);
        if (bottom) setNewCount(0);
    };

    // ── 소켓 + 메시지 로드 ─────────────────────────────────────────
    useEffect(() => {
        if (!channelId) return;
        let cancelled = false;

        instance.get(`/user/chat/${channelId}`).then(res => {
            if (!cancelled && res.data.result === 'success') {
                setMessages(res.data.list ?? []);
                setTimeout(() => scrollToBottom(false), 50);
            }
        }).catch(console.error);

        if (WEB_SOCKET_API_BASE_URL) {
            import('socket.io-client').then(({ io }) => {
                if (cancelled) return;
                const socket = io(WEB_SOCKET_API_BASE_URL, { transports: ['websocket'] });
                socketRef.current = socket;
                socket.emit('join', { channelId });
                socket.on('message', msg => setMessages(prev => [...prev, msg]));
            }).catch(() => {});
        }

        return () => {
            cancelled = true;
            socketRef.current?.disconnect();
            socketRef.current = null;
        };
    }, [channelId]);

    // ── 전송 ───────────────────────────────────────────────────────
    const sendMessage = (e) => {
        e?.preventDefault();
        if (!message.trim() || sending) return;
        const regDt = new Date().toISOString();
        const msgData = { channelId, usrIdx, usrNm, contents: message, chatType: 'C', regDt };
        setMessages(prev => [...prev, msgData]);
        socketRef.current?.connected && socketRef.current.emit('message', msgData);
        setMessage('');
        // 높이 리셋
        if (inputRef.current) { inputRef.current.style.height = 'auto'; }
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    // ── 파일 전송 ──────────────────────────────────────────────────
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('file[]', file);
        try {
            const res = await instance.post('/file/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            const fileIdx = res.data.fileIdxList?.[0];
            if (!fileIdx) return;
            const regDt = new Date().toISOString();
            const msgData = { channelId, usrIdx, usrNm, contents: String(fileIdx), chatType: 'F', fileName: file.name, regDt };
            setMessages(prev => [...prev, msgData]);
            socketRef.current?.connected && socketRef.current.emit('message', msgData);
        } catch (err) { console.error(err); }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const roomBg = avatarBg(chatName);

    return createPortal(
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: 'rgba(15,15,25,0.52)', backdropFilter: 'blur(6px)' }}
            onClick={() => navigate('/chat')}
        >
            <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.97 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col w-full h-[100dvh] sm:w-[600px] sm:h-[86vh] sm:rounded-2xl overflow-hidden"
                style={{ background: '#fff', boxShadow: '0 32px 80px rgba(0,0,0,0.32)' }}
                onClick={e => e.stopPropagation()}
            >
                {/* ── 헤더 ────────────────────────────────────────────── */}
                <Header chatName={chatName} roomBg={roomBg} onBack={() => navigate('/chat')} />

                {/* ── 메시지 영역 ─────────────────────────────────────── */}
                <div
                    ref={msgAreaRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto px-4 py-5 relative"
                    style={{ background: 'linear-gradient(180deg,#f4f5fb 0%,#f0f1f8 100%)' }}
                >
                    {messages.length === 0 ? (
                        <EmptyChat chatName={chatName} roomBg={roomBg} />
                    ) : (
                        messages.map((el, i) => {
                            const isMe   = String(usrIdx) === String(el.usrIdx);
                            const isFile = el.chatType === 'F';
                            const fileUrl = el.contents?.startsWith('http')
                                ? el.contents
                                : `${SERVER_API_BASE_URL}/file/download/${el.contents}`;
                            const isImg  = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(el.fileName ?? '');
                            const first  = isFirst(messages, i);
                            const last   = isLast(messages, i);
                            const showDate = i === 0 || getDateKey(el.regDt) !== getDateKey(messages[i - 1].regDt);

                            return (
                                <div key={i}>
                                    {/* 날짜 구분 */}
                                    {showDate && <DateDivider label={fmtDate(el.regDt)} />}

                                    {/* 메시지 행 */}
                                    <div
                                        ref={i === messages.length - 1 ? messagesEndRef : null}
                                        className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'} ${last ? 'mb-3.5' : 'mb-0.5'}`}
                                    >
                                        {/* 상대 아바타 */}
                                        {!isMe && (
                                            <div style={{ width: 34, flexShrink: 0 }}>
                                                {last && <Avatar name={el.usrNm} size={34} />}
                                            </div>
                                        )}

                                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                            {/* 발신자 이름 */}
                                            {!isMe && first && (
                                                <p className="text-[11px] font-semibold text-gray-500 mb-1 ml-1">{el.usrNm}</p>
                                            )}

                                            <div className={`flex items-end gap-1.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                                {/* 버블 or 파일 */}
                                                <Bubble
                                                    el={el} isMe={isMe} isFile={isFile}
                                                    fileUrl={fileUrl} isImg={isImg}
                                                    first={first} last={last}
                                                />

                                                {/* 시간 */}
                                                {last && (
                                                    <span className="text-[10px] text-gray-400 mb-0.5 shrink-0 select-none">
                                                        {fmtTime(el.regDt)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* 스크롤 다운 FAB */}
                <AnimatePresence>
                    {!atBottom && (
                        <motion.button
                            key="fab"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => scrollToBottom()}
                            className="absolute bottom-[72px] right-4 z-10 flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg"
                            style={{ background: roomBg, boxShadow: `0 4px 14px ${roomBg}66` }}
                        >
                            {newCount > 0 && <span>{newCount}개의 새 메시지</span>}
                            <ChevronDownIcon className="h-3.5 w-3.5" />
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* ── 입력 영역 ───────────────────────────────────────── */}
                <InputArea
                    message={message}
                    setMessage={setMessage}
                    sending={sending}
                    inputRef={inputRef}
                    fileInputRef={fileInputRef}
                    onSend={sendMessage}
                    onKeyDown={handleKeyDown}
                    onFileChange={handleFileChange}
                    roomBg={roomBg}
                />
            </motion.div>
        </div>,
        document.body
    );
}

// ── 헤더 ─────────────────────────────────────────────────────────────
function Header({ chatName, roomBg, onBack }) {
    return (
        <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0 select-none"
            style={{ background: roomBg }}
        >
            {/* 방 아바타 */}
            <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0 text-sm"
                style={{ background: 'rgba(255,255,255,0.22)' }}
            >
                {initials(chatName)}
            </div>

            {/* 방 이름 */}
            <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight truncate">{chatName}</p>
                <p className="text-white/55 text-[11px] mt-0.5">채팅방</p>
            </div>

            {/* X 닫기 — 다른 팝업과 동일한 우측 위치 */}
            <button
                onClick={onBack}
                className="p-1.5 rounded-xl flex-shrink-0 transition-colors hover:bg-white/20"
                style={{ background: 'rgba(255,255,255,0.15)' }}
            >
                <XMarkIcon style={{ width: 18, height: 18, color: '#fff' }} />
            </button>
        </div>
    );
}

// ── 날짜 구분선 ───────────────────────────────────────────────────────
function DateDivider({ label }) {
    return (
        <div className="flex items-center gap-2 my-4 select-none">
            <div className="flex-1 h-px bg-white/60" />
            <span className="text-[11px] text-gray-400 font-medium bg-white/80 backdrop-blur-sm px-3 py-0.5 rounded-full shadow-sm border border-gray-100">
                {label}
            </span>
            <div className="flex-1 h-px bg-white/60" />
        </div>
    );
}

// ── 빈 채팅 안내 ──────────────────────────────────────────────────────
function EmptyChat({ chatName, roomBg }) {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 select-none">
            <div
                className="w-16 h-16 rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-md"
                style={{ background: roomBg }}
            >
                {initials(chatName)}
            </div>
            <div className="text-center">
                <p className="text-sm font-semibold text-gray-600">{chatName}</p>
                <p className="text-xs text-gray-400 mt-1">아직 메시지가 없습니다.</p>
                <p className="text-xs text-gray-300 mt-0.5">첫 메시지를 보내보세요 ✨</p>
            </div>
        </div>
    );
}

// ── 말풍선 ────────────────────────────────────────────────────────────
function Bubble({ el, isMe, isFile, fileUrl, isImg, first, last }) {
    const radius = isMe
        ? `18px ${last ? '4px' : '18px'} 18px 18px`
        : `${first ? '4px' : '18px'} 18px 18px 18px`;

    if (isFile) {
        return (
            <div style={{ borderRadius: isMe ? '18px 4px 18px 18px' : '4px 18px 18px 18px', overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.10)' }}>
                {isImg ? (
                    <img
                        src={fileUrl}
                        alt={el.fileName}
                        style={{ maxWidth: 220, maxHeight: 180, objectFit: 'cover', display: 'block', cursor: 'zoom-in' }}
                        onClick={() => window.open(fileUrl, '_blank')}
                    />
                ) : (
                    <a
                        href={fileUrl}
                        download={el.fileName}
                        className="flex items-center gap-2 px-3.5 py-2.5 text-sm no-underline"
                        style={{
                            background: isMe ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#fff',
                            color: isMe ? '#fff' : '#374151',
                        }}
                    >
                        <PaperClipIcon style={{ width: 16, height: 16, flexShrink: 0 }} />
                        <span style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {el.fileName}
                        </span>
                    </a>
                )}
            </div>
        );
    }

    return (
        <div
            className="px-3.5 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap"
            style={{
                borderRadius: radius,
                background: isMe
                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                    : '#ffffff',
                color: isMe ? '#fff' : '#1f2937',
                boxShadow: isMe
                    ? '0 2px 10px rgba(99,102,241,0.28)'
                    : '0 1px 4px rgba(0,0,0,0.08)',
                maxWidth: '100%',
            }}
        >
            {el.contents}
        </div>
    );
}

// ── 입력창 ────────────────────────────────────────────────────────────
function InputArea({ message, setMessage, sending, inputRef, fileInputRef, onSend, onKeyDown, onFileChange, roomBg }) {
    const canSend = !!message.trim() && !sending;

    return (
        <div className="flex-shrink-0 bg-white border-t border-gray-100 px-3 pt-2.5 pb-3">
            <div
                className="flex items-end gap-2 rounded-2xl px-2 py-2 transition-shadow"
                style={{ background: '#f4f5fb', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' }}
            >
                {/* 파일 */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 rounded-xl hover:bg-gray-200 transition-colors flex-shrink-0 mb-0.5"
                >
                    <PaperClipIcon style={{ width: 18, height: 18, color: '#9ca3af' }} />
                </button>
                <input type="file" className="hidden" onChange={onFileChange} ref={fileInputRef} />

                {/* 텍스트 */}
                <textarea
                    ref={inputRef}
                    rows={1}
                    placeholder="메시지를 입력하세요..."
                    value={message}
                    onChange={e => {
                        setMessage(e.target.value);
                        e.target.style.height = 'auto';
                        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                    onKeyDown={onKeyDown}
                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none resize-none leading-relaxed py-1"
                    style={{ minHeight: 24, maxHeight: 120 }}
                />

                {/* 전송 */}
                <motion.button
                    onClick={onSend}
                    disabled={!canSend}
                    animate={{ scale: canSend ? 1 : 0.88, opacity: canSend ? 1 : 0.5 }}
                    transition={{ duration: 0.12 }}
                    className="p-2 rounded-xl flex-shrink-0 mb-0.5 transition-colors"
                    style={{
                        background: canSend ? roomBg : '#e5e7eb',
                        boxShadow: canSend ? `0 3px 10px ${roomBg}55` : 'none',
                    }}
                >
                    <PaperAirplaneIcon style={{ width: 16, height: 16, color: canSend ? '#fff' : '#d1d5db' }} />
                </motion.button>
            </div>
            <p className="text-center text-[10px] text-gray-300 mt-1.5 select-none">
                Enter 전송 · Shift+Enter 줄바꿈
            </p>
        </div>
    );
}
