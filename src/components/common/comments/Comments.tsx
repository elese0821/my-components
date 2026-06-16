import React, { useEffect, useRef, useState } from 'react';
import instance from '../../../services/instance';
import Pagination from '../pagination/Pagination';
import useDialogStore from '../../../stores/dialogStore';
import useUserStore from '../../../stores/userStore';
import { SERVER_API_BASE_URL } from '../../../services/endpoint';
import {
    PaperAirplaneIcon,
    PhotoIcon,
    PencilIcon,
    TrashIcon,
    CheckIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

// ── 날짜 포맷 ────────────────────────────────────────────
function fmtDt(s?: string): string {
    if (!s) return ''
    try {
        const d = new Date(s)
        if (isNaN(d.getTime())) return s
        const diff = Date.now() - d.getTime()
        if (diff < 60_000)           return '방금 전'
        if (diff < 3_600_000)        return `${Math.floor(diff / 60_000)}분 전`
        if (diff < 86_400_000)       return `${Math.floor(diff / 3_600_000)}시간 전`
        if (diff < 86_400_000 * 7)   return `${Math.floor(diff / 86_400_000)}일 전`
        return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch { return s }
}

// 이미지 URL 정규화 (숫자 fileIdx 또는 상대경로도 처리)
function resolveImgUrl(raw?: string, base?: string): string {
    if (!raw) return ''
    if (/^https?:\/\//.test(raw)) return raw
    return `${base ?? ''}/file/download/${raw}`
}

// ── 타입 ─────────────────────────────────────────────────
interface ReplyItem {
    replyIdx: number;
    boardIdx: number;
    writerNm: string;
    usrIdx: string;
    contents: string;
    imgUrl?: string;
    regDt: string;
}

// ── 아바타 (이니셜) ───────────────────────────────────────
function Avatar({ name }: { name: string }) {
    const colors = ['#6366f1','#ec4899','#10b981','#f59e0b','#3b82f6','#8b5cf6','#ef4444','#06b6d4'];
    const color = colors[(name?.charCodeAt(0) ?? 0) % colors.length];
    return (
        <div style={{
            width: 30, height: 30, borderRadius: '50%',
            backgroundColor: color, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 12, fontWeight: 700,
            color: '#fff', flexShrink: 0,
        }}>
            {(name ?? '?')[0]}
        </div>
    );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────
export default function Comments({ className = '', boardIdx }: { className?: string; boardIdx?: number | string }) {
    const [commentList, setCommentList] = useState<ReplyItem[]>([]);
    const [inputText, setInputText]     = useState('');
    const [imgFile, setImgFile]         = useState<File | null>(null);
    const [imgPreview, setImgPreview]   = useState<string>('');
    const [page, setPage]               = useState(1);
    const [totalPages, setTotalPages]   = useState(1);
    const [editId, setEditId]           = useState<number | null>(null);
    const [editText, setEditText]       = useState('');
    const [uploading, setUploading]     = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const { openDialog }  = useDialogStore();
    const { userId, usrIdx } = useUserStore();

    // ── 목록 조회 ──────────────────────────────────────
    const load = async () => {
        if (!boardIdx) return;
        try {
            const res = await instance.get('/user/board/reply/info', {
                params: { boardIdx, pageNo: page, row: 5 },
            });
            if (res.status === 200) {
                setCommentList(res.data.list ?? []);
                setTotalPages(Math.ceil((res.data.total ?? 0) / 5));
            }
        } catch {}
    };

    useEffect(() => { load(); }, [boardIdx, page]);

    // ── 이미지 선택 ────────────────────────────────────
    const handleImgSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { openDialog('이미지는 5MB 이하만 가능합니다.'); return; }
        setImgFile(file);
        setImgPreview(URL.createObjectURL(file));
        e.target.value = '';
    };

    const clearImg = () => {
        setImgFile(null);
        setImgPreview('');
    };

    // ── 이미지 업로드 → URL 반환 ────────────────────────
    const uploadImg = async (): Promise<string | null> => {
        if (!imgFile) return null;
        const formData = new FormData();
        formData.append('file[]', imgFile);
        try {
            const res = await instance.post('/file/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.status === 200 && res.data.fileIdxList?.[0]) {
                return `${SERVER_API_BASE_URL}/file/download/${res.data.fileIdxList[0]}`;
            }
        } catch {}
        return null;
    };

    // ── 댓글 등록 ──────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() && !imgFile) { openDialog('내용을 입력해주세요.'); return; }
        setUploading(true);
        try {
            const imgUrl = await uploadImg();
            const res = await instance.post('/user/board/reply/info', {
                boardIdx, contents: inputText, imgUrl,
            });
            if (res.status === 200) {
                setInputText(''); clearImg();
                setPage(1); load();
            }
        } finally { setUploading(false); }
    };

    // ── 댓글 수정 ──────────────────────────────────────
    const startEdit = (item: ReplyItem) => {
        setEditId(item.replyIdx);
        setEditText(item.contents);
    };
    const cancelEdit = () => { setEditId(null); setEditText(''); };
    const submitEdit = async (replyIdx: number) => {
        if (!editText.trim()) return;
        try {
            const res = await instance.patch('/user/board/reply/info', {
                replyIdx, contents: editText,
            });
            if (res.status === 200) { cancelEdit(); load(); }
        } catch {}
    };

    // ── 댓글 삭제 ──────────────────────────────────────
    const handleDelete = async (replyIdx: number) => {
        try {
            const res = await instance.delete('/user/board/reply/info', {
                params: { replyIdx },
            });
            if (res.status === 200) { load(); openDialog('삭제되었습니다.'); }
        } catch {}
    };

    // ── 렌더 ──────────────────────────────────────────
    return (
        <div className={className} style={{ color: '#1f2937' }}>
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '20px' }}>

                {/* 헤더 */}
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '16px' }}>
                    댓글 <span style={{ color: '#3b82f6', fontWeight: 700 }}>{commentList.length}</span>
                </p>

                {/* 목록 */}
                {commentList.length === 0 ? (
                    <p style={{ fontSize: '13px', color: '#9ca3af', textAlign: 'center', padding: '24px 0' }}>
                        첫 댓글을 남겨보세요.
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                        {commentList.map((item) => {
                            const isOwn = String(item.usrIdx) === String(usrIdx);
                            const isEditing = editId === item.replyIdx;

                            return (
                                <div key={item.replyIdx} style={{
                                    display: 'flex', gap: '10px',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    backgroundColor: '#f9fafb',
                                    border: '1px solid #f3f4f6',
                                }}>
                                    <Avatar name={item.writerNm} />

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        {/* 작성자 + 날짜 */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{item.writerNm}</span>
                                                <span style={{ fontSize: 11, color: '#9ca3af' }}>{fmtDt(item.regDt)}</span>
                                            </div>
                                            {/* 수정/삭제 버튼 (본인만) */}
                                            {isOwn && !isEditing && (
                                                <div style={{ display: 'flex', gap: 4 }}>
                                                    <button
                                                        onClick={() => startEdit(item)}
                                                        style={btnStyle('#6b7280')}
                                                        title='수정'
                                                    >
                                                        <PencilIcon style={{ width: 13, height: 13 }} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.replyIdx)}
                                                        style={btnStyle('#ef4444')}
                                                        title='삭제'
                                                    >
                                                        <TrashIcon style={{ width: 13, height: 13 }} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* 내용 or 수정 폼 */}
                                        {isEditing ? (
                                            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                                                <input
                                                    value={editText}
                                                    onChange={e => setEditText(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && submitEdit(item.replyIdx)}
                                                    autoFocus
                                                    style={{
                                                        flex: 1, padding: '5px 10px', borderRadius: 6,
                                                        border: '1px solid #d1d5db', fontSize: 13, outline: 'none',
                                                    }}
                                                />
                                                <button onClick={() => submitEdit(item.replyIdx)} style={btnStyle('#3b82f6')} title='저장'>
                                                    <CheckIcon style={{ width: 14, height: 14 }} />
                                                </button>
                                                <button onClick={cancelEdit} style={btnStyle('#9ca3af')} title='취소'>
                                                    <XMarkIcon style={{ width: 14, height: 14 }} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, margin: 0, wordBreak: 'break-word' }}>
                                                    {item.contents}
                                                </p>
                                                {/* 이미지 — URL 이 절대경로가 아닌 경우도 처리 */}
                                                {item.imgUrl && (() => {
                                                    const url = resolveImgUrl(item.imgUrl, SERVER_API_BASE_URL)
                                                    return (
                                                        <img
                                                            src={url}
                                                            alt='첨부 이미지'
                                                            style={{
                                                                marginTop: 8, maxWidth: '100%', maxHeight: 260,
                                                                borderRadius: 8, objectFit: 'contain',
                                                                border: '1px solid #e5e7eb', cursor: 'pointer',
                                                            }}
                                                            onClick={() => window.open(url, '_blank')}
                                                        />
                                                    )
                                                })()}
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {totalPages > 1 && (
                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                )}

                {/* 이미지 미리보기 */}
                {imgPreview && (
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8 }}>
                        <img src={imgPreview} alt='미리보기' style={{
                            height: 80, borderRadius: 8, border: '1px solid #e5e7eb', objectFit: 'cover',
                        }} />
                        <button onClick={clearImg} style={{
                            position: 'absolute', top: -6, right: -6,
                            width: 18, height: 18, borderRadius: '50%',
                            background: '#ef4444', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <XMarkIcon style={{ width: 11, height: 11, color: '#fff' }} />
                        </button>
                    </div>
                )}

                {/* 입력 폼 */}
                {userId ? (
                    <form onSubmit={handleSubmit}>
                        <div style={{
                            display: 'flex', gap: 8, alignItems: 'center',
                            border: '1px solid #e5e7eb', borderRadius: 10,
                            padding: '10px 12px', backgroundColor: '#fff',
                        }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                {userId}
                            </span>
                            <input
                                type='text'
                                placeholder='댓글을 입력하세요...'
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, color: '#111827', backgroundColor: 'transparent' }}
                            />
                            {/* 이미지 첨부 버튼 */}
                            <button
                                type='button'
                                onClick={() => fileRef.current?.click()}
                                style={{
                                    flexShrink: 0, padding: '5px 8px', borderRadius: 6, border: 'none',
                                    backgroundColor: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    color: imgFile ? '#3b82f6' : '#9ca3af',
                                }}
                                title='이미지 첨부'
                            >
                                <PhotoIcon style={{ width: 16, height: 16 }} />
                            </button>
                            <input
                                ref={fileRef}
                                type='file'
                                accept='image/*'
                                style={{ display: 'none' }}
                                onChange={handleImgSelect}
                            />
                            {/* 등록 버튼 */}
                            <button
                                type='submit'
                                disabled={uploading || (!inputText.trim() && !imgFile)}
                                style={{
                                    flexShrink: 0, padding: '5px 12px', borderRadius: 6, border: 'none',
                                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 4,
                                    backgroundColor: (inputText.trim() || imgFile) && !uploading ? '#3b82f6' : '#e5e7eb',
                                    color: (inputText.trim() || imgFile) && !uploading ? '#fff' : '#9ca3af',
                                    transition: 'all 0.15s',
                                }}
                            >
                                <PaperAirplaneIcon style={{ width: 13, height: 13 }} />
                                {uploading ? '등록 중...' : '등록'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', padding: '12px 0', borderTop: '1px solid #f3f4f6' }}>
                        로그인 후 댓글을 작성할 수 있습니다.
                    </p>
                )}
            </div>
        </div>
    );
}

// 아이콘 버튼 공통 스타일
function btnStyle(color: string): React.CSSProperties {
    return {
        padding: '4px', borderRadius: 4, border: 'none',
        backgroundColor: 'transparent', cursor: 'pointer',
        display: 'flex', alignItems: 'center', color,
    };
}
