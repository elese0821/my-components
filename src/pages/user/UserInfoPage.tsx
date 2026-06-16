import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    UserCircleIcon,
    PencilSquareIcon,
    CheckIcon,
    XMarkIcon,
    KeyIcon,
    DocumentTextIcon,
    ChatBubbleLeftRightIcon,
    EyeIcon,
    ChatBubbleLeftIcon,
    CalendarDaysIcon,
    ArrowRightOnRectangleIcon,
    CameraIcon,
} from '@heroicons/react/24/outline';
import instance from '../../services/instance';
import useUserStore from '../../stores/userStore';
import useDialogStore from '../../stores/dialogStore';
import Pagination from '../../components/common/pagination/Pagination';
import { hiResAvatar } from '../../utils/avatar';

// ── 타입 ──────────────────────────────────────────────────────────────────────
interface UserInfo { usrIdx: string; userId: string; username: string; email: string; regDt: string; profileImage?: string | null; provider?: string | null; }
interface PostItem  { boardIdx: number; title: string; replyCnt: number; views: number; regDt: string; }
interface ReplyItem { replyIdx: number; boardIdx: number; contents: string; regDt: string; boardTitle: string; }

// ── 섹션 카드 래퍼 ─────────────────────────────────────────────────────────────
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${className}`}>
            {children}
        </div>
    );
}

// ── 메인 ──────────────────────────────────────────────────────────────────────
export default function UserInfoPage() {
    const { userId, usrIdx, logout, profileImage: storeProfileImage, setProfileImage } = useUserStore();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [imgUploading, setImgUploading] = useState(false);
    const { openDialog } = useDialogStore();
    const navigate = useNavigate();

    /* ---------- 유저 정보 ---------- */
    const [info, setInfo] = useState<UserInfo | null>(null);
    const [editing, setEditing] = useState(false);
    const [editName, setEditName]   = useState('');
    const [editEmail, setEditEmail] = useState('');

    /* ---------- 비밀번호 ---------- */
    const [pwOpen, setPwOpen]     = useState(false);
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw]       = useState('');
    const [newPw2, setNewPw2]     = useState('');

    /* ---------- 게시물 ---------- */
    const [posts, setPosts]           = useState<PostItem[]>([]);
    const [postPage, setPostPage]     = useState(1);
    const [postTotal, setPostTotal]   = useState(0);

    /* ---------- 댓글 ---------- */
    const [replies, setReplies]         = useState<ReplyItem[]>([]);
    const [replyPage, setReplyPage]     = useState(1);
    const [replyTotal, setReplyTotal]   = useState(0);

    /* ---------- 탭 ---------- */
    const [tab, setTab] = useState<'posts' | 'replies'>('posts');

    // 비로그인 → 홈으로
    useEffect(() => {
        if (!userId) { navigate('/'); return; }
        loadInfo();
    }, [userId]);

    useEffect(() => { loadPosts(); }, [postPage]);
    useEffect(() => { loadReplies(); }, [replyPage]);

    /* ── API 호출 ── */
    const loadInfo = async () => {
        try {
            const res = await instance.get('/user/my/info');
            if (res.status === 200) {
                setInfo(res.data.user);
                setEditName(res.data.user.username);
                setEditEmail(res.data.user.email ?? '');
            }
        } catch {}
    };

    const loadPosts = async () => {
        try {
            const res = await instance.get('/user/my/board', { params: { pageNo: postPage, row: 8 } });
            if (res.status === 200) { setPosts(res.data.list ?? []); setPostTotal(res.data.total ?? 0); }
        } catch {}
    };

    const loadReplies = async () => {
        try {
            const res = await instance.get('/user/my/reply', { params: { pageNo: replyPage, row: 10 } });
            if (res.status === 200) { setReplies(res.data.list ?? []); setReplyTotal(res.data.total ?? 0); }
        } catch {}
    };

    /* ── 정보 수정 ── */
    const handleSaveInfo = async () => {
        if (!editName.trim()) { openDialog('닉네임을 입력해주세요.'); return; }
        try {
            const res = await instance.patch('/user/my/info', { username: editName, email: editEmail });
            if (res.status === 200) {
                openDialog('수정되었습니다.');
                setEditing(false);
                loadInfo();
            }
        } catch {}
    };

    /* ── 비밀번호 변경 ── */
    const handleChangePw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPw || !newPw) { openDialog('비밀번호를 입력해주세요.'); return; }
        if (newPw !== newPw2) { openDialog('새 비밀번호가 일치하지 않습니다.'); return; }
        if (newPw.length < 8) { openDialog('비밀번호는 8자 이상이어야 합니다.'); return; }
        try {
            const res = await instance.patch('/user/my/pw', { currentPw, newPw });
            if (res.status === 200) {
                openDialog('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
                logout();
                navigate('/login');
            } else {
                openDialog(res.data?.message ?? '비밀번호 변경에 실패했습니다.');
            }
        } catch (err: any) {
            openDialog(err?.response?.data?.message ?? '비밀번호 변경에 실패했습니다.');
        }
    };

    /* ── 프로필 이미지 변경 ── */
    const handlePickImage = () => fileInputRef.current?.click();

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = ''; // 같은 파일 재선택 허용
        if (!file) return;
        if (!file.type.startsWith('image/')) { openDialog('이미지 파일만 업로드할 수 있습니다.'); return; }
        if (file.size > 5 * 1024 * 1024)     { openDialog('이미지는 5MB 이하만 가능합니다.'); return; }

        const form = new FormData();
        form.append('file', file);
        setImgUploading(true);
        try {
            const res = await instance.patch('/user/my/profile-image', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.data?.result === 'success') {
                const url = res.data.profileImage as string;
                setProfileImage(url);                                   // 헤더 즉시 반영
                setInfo(prev => prev ? { ...prev, profileImage: url } : prev);
                openDialog('프로필 사진이 변경되었습니다.');
            } else {
                openDialog(res.data?.message ?? '변경에 실패했습니다.');
            }
        } catch (err: any) {
            openDialog(err?.response?.data?.message ?? '업로드에 실패했습니다.');
        } finally {
            setImgUploading(false);
        }
    };

    const handleRemoveImage = async () => {
        setImgUploading(true);
        try {
            const res = await instance.delete('/user/my/profile-image');
            if (res.data?.result === 'success') {
                setProfileImage(null);
                setInfo(prev => prev ? { ...prev, profileImage: null } : prev);
                openDialog('기본 이미지로 변경되었습니다.');
            }
        } catch {
            openDialog('변경에 실패했습니다.');
        } finally {
            setImgUploading(false);
        }
    };

    /* ── 로그아웃 ── */
    const handleLogout = () => { logout(); navigate('/login'); };

    return (
        <div className='section_wrap'>
            {/* ── 페이지 헤더 ── */}
            <div className='flex items-center justify-between mb-6'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-900'>마이페이지</h1>
                    <p className='text-sm text-gray-400 mt-0.5'>내 계정과 활동을 관리합니다.</p>
                </div>
                <button
                    onClick={handleLogout}
                    className='flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors'
                >
                    <ArrowRightOnRectangleIcon className='h-4 w-4' />
                    로그아웃
                </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>

                {/* ── 왼쪽: 프로필 카드 ── */}
                <div className='lg:col-span-1 flex flex-col gap-4'>

                    {/* 프로필 */}
                    <Card>
                        <div className='flex flex-col items-center gap-3 pb-4 border-b border-gray-100'>
                            {/* 아바타 + 카메라 오버레이 */}
                            <div className='relative group'>
                                {(info?.profileImage ?? storeProfileImage) ? (
                                    <img
                                        src={hiResAvatar(info?.profileImage ?? storeProfileImage, 256) ?? undefined}
                                        alt={info?.username ?? '프로필'}
                                        className='w-20 h-20 rounded-full object-cover shadow-md border border-gray-100'
                                    />
                                ) : (
                                    <div className='w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-md'>
                                        <span className='text-3xl font-bold text-white'>
                                            {info?.username?.[0]?.toUpperCase() ?? '?'}
                                        </span>
                                    </div>
                                )}
                                {/* 카메라 버튼 */}
                                <button
                                    onClick={handlePickImage}
                                    disabled={imgUploading}
                                    title='프로필 사진 변경'
                                    className='absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-60'
                                >
                                    {imgUploading
                                        ? <span className='w-3.5 h-3.5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin' />
                                        : <CameraIcon className='h-4 w-4 text-gray-500' />}
                                </button>
                                {/* 숨김 파일 input */}
                                <input
                                    ref={fileInputRef}
                                    type='file'
                                    accept='image/*'
                                    onChange={handleImageChange}
                                    className='hidden'
                                />
                            </div>

                            {/* 변경 / 삭제 텍스트 버튼 */}
                            <div className='flex items-center gap-2 text-xs'>
                                <button
                                    onClick={handlePickImage}
                                    disabled={imgUploading}
                                    className='text-blue-500 hover:text-blue-600 font-medium disabled:opacity-60'
                                >
                                    사진 변경
                                </button>
                                {(info?.profileImage ?? storeProfileImage) && (
                                    <>
                                        <span className='text-gray-200'>|</span>
                                        <button
                                            onClick={handleRemoveImage}
                                            disabled={imgUploading}
                                            className='text-gray-400 hover:text-red-500 disabled:opacity-60'
                                        >
                                            삭제
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className='text-center'>
                                <p className='font-semibold text-gray-900'>{info?.username ?? '-'}</p>
                                <p className='text-xs text-gray-400 mt-0.5'>{info?.userId}</p>
                                {info?.provider && info.provider !== 'NORMAL' && (
                                    <span className='inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium'
                                        style={{
                                            backgroundColor: info.provider === 'KAKAO' ? 'rgba(254,229,0,0.18)'
                                                : info.provider === 'NAVER' ? 'rgba(3,199,90,0.12)'
                                                : 'rgba(66,133,244,0.12)',
                                            color: info.provider === 'KAKAO' ? '#a07800'
                                                : info.provider === 'NAVER' ? '#03c75a'
                                                : '#4285f4',
                                        }}>
                                        {info.provider === 'KAKAO' ? '카카오' : info.provider === 'NAVER' ? '네이버' : 'Google'} 연동
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* 상세 정보 */}
                        <div className='pt-4 space-y-3'>
                            {/* 닉네임 */}
                            <div>
                                <label className='text-xs text-gray-400 font-medium'>닉네임</label>
                                {editing ? (
                                    <input
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        className='mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 transition-colors'
                                    />
                                ) : (
                                    <p className='text-sm text-gray-800 mt-1'>{info?.username ?? '-'}</p>
                                )}
                            </div>
                            {/* 이메일 */}
                            <div>
                                <label className='text-xs text-gray-400 font-medium'>이메일</label>
                                {editing ? (
                                    <input
                                        type='email'
                                        value={editEmail}
                                        onChange={e => setEditEmail(e.target.value)}
                                        placeholder='이메일 (선택)'
                                        className='mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 transition-colors'
                                    />
                                ) : (
                                    <p className='text-sm text-gray-800 mt-1'>{info?.email || '-'}</p>
                                )}
                            </div>
                            {/* 가입일 */}
                            {info?.regDt && (
                                <div className='flex items-center gap-1.5 text-xs text-gray-400'>
                                    <CalendarDaysIcon className='h-3.5 w-3.5' />
                                    <span>가입일 {info.regDt}</span>
                                </div>
                            )}

                            {/* 수정 버튼 */}
                            {editing ? (
                                <div className='flex gap-2 pt-2'>
                                    <button
                                        onClick={handleSaveInfo}
                                        className='flex-1 flex items-center justify-center gap-1 py-2 bg-blue-500 text-white text-sm rounded-lg font-medium hover:bg-blue-600 transition-colors'
                                    >
                                        <CheckIcon className='h-4 w-4' /> 저장
                                    </button>
                                    <button
                                        onClick={() => setEditing(false)}
                                        className='flex-1 flex items-center justify-center gap-1 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg font-medium hover:bg-gray-200 transition-colors'
                                    >
                                        <XMarkIcon className='h-4 w-4' /> 취소
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setEditing(true)}
                                    className='w-full flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors mt-2'
                                >
                                    <PencilSquareIcon className='h-4 w-4' /> 정보 수정
                                </button>
                            )}
                        </div>
                    </Card>

                    {/* 비밀번호 변경 (일반 계정만) */}
                    {(!info?.provider || info.provider === 'NORMAL') && (
                    <Card>
                        <button
                            onClick={() => setPwOpen(v => !v)}
                            className='w-full flex items-center justify-between text-sm font-medium text-gray-700'
                        >
                            <span className='flex items-center gap-2'>
                                <KeyIcon className='h-4 w-4 text-gray-400' />
                                비밀번호 변경
                            </span>
                            <span className='text-gray-300'>{pwOpen ? '▲' : '▼'}</span>
                        </button>

                        {pwOpen && (
                            <form onSubmit={handleChangePw} className='mt-4 space-y-3'>
                                <input
                                    type='password'
                                    placeholder='현재 비밀번호'
                                    value={currentPw}
                                    onChange={e => setCurrentPw(e.target.value)}
                                    className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 transition-colors'
                                />
                                <input
                                    type='password'
                                    placeholder='새 비밀번호 (8자 이상)'
                                    value={newPw}
                                    onChange={e => setNewPw(e.target.value)}
                                    className='w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 transition-colors'
                                />
                                <input
                                    type='password'
                                    placeholder='새 비밀번호 확인'
                                    value={newPw2}
                                    onChange={e => setNewPw2(e.target.value)}
                                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${
                                        newPw2 && newPw !== newPw2 ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-blue-400'
                                    }`}
                                />
                                {newPw2 && newPw !== newPw2 && (
                                    <p className='text-xs text-red-400'>비밀번호가 일치하지 않습니다.</p>
                                )}
                                <button
                                    type='submit'
                                    className='w-full py-2 bg-gray-800 text-white text-sm rounded-lg font-medium hover:bg-gray-700 transition-colors'
                                >
                                    변경하기
                                </button>
                            </form>
                        )}
                    </Card>
                    )}

                    {/* 활동 요약 */}
                    <Card>
                        <p className='text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider'>활동 요약</p>
                        <div className='grid grid-cols-2 gap-3'>
                            <div className='bg-blue-50 rounded-xl p-3 text-center'>
                                <p className='text-2xl font-bold text-blue-600'>{postTotal}</p>
                                <p className='text-xs text-gray-500 mt-0.5'>게시물</p>
                            </div>
                            <div className='bg-indigo-50 rounded-xl p-3 text-center'>
                                <p className='text-2xl font-bold text-indigo-600'>{replyTotal}</p>
                                <p className='text-xs text-gray-500 mt-0.5'>댓글</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* ── 오른쪽: 게시물 / 댓글 ── */}
                <div className='lg:col-span-2'>
                    <Card className='min-h-[400px]'>
                        {/* 탭 */}
                        <div className='flex gap-1 border-b border-gray-100 pb-1 mb-4'>
                            <button
                                onClick={() => setTab('posts')}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    tab === 'posts'
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <DocumentTextIcon className='h-4 w-4' />
                                내 게시물 <span className='text-xs ml-0.5 opacity-70'>({postTotal})</span>
                            </button>
                            <button
                                onClick={() => setTab('replies')}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    tab === 'replies'
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <ChatBubbleLeftRightIcon className='h-4 w-4' />
                                내 댓글 <span className='text-xs ml-0.5 opacity-70'>({replyTotal})</span>
                            </button>
                        </div>

                        {/* ── 게시물 탭 ── */}
                        {tab === 'posts' && (
                            <>
                                {posts.length === 0 ? (
                                    <EmptyState icon={<DocumentTextIcon className='h-10 w-10 text-gray-200' />} text='작성한 게시물이 없습니다.' />
                                ) : (
                                    <div className='flex flex-col divide-y divide-gray-50'>
                                        {posts.map((post) => (
                                            <Link
                                                key={post.boardIdx}
                                                to={`/board/basic`}
                                                className='flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors group'
                                            >
                                                <div className='flex-1 min-w-0 pr-4'>
                                                    <p className='text-sm text-gray-800 group-hover:text-blue-600 transition-colors truncate font-medium'>
                                                        {post.title}
                                                    </p>
                                                    <p className='text-xs text-gray-400 mt-0.5'>{post.regDt}</p>
                                                </div>
                                                <div className='flex items-center gap-3 text-xs text-gray-400 shrink-0'>
                                                    <span className='flex items-center gap-1'>
                                                        <ChatBubbleLeftIcon className='h-3.5 w-3.5' />{post.replyCnt}
                                                    </span>
                                                    <span className='flex items-center gap-1'>
                                                        <EyeIcon className='h-3.5 w-3.5' />{post.views}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                                {postTotal > 8 && (
                                    <Pagination
                                        page={postPage}
                                        totalPages={Math.ceil(postTotal / 8)}
                                        setPage={setPostPage}
                                    />
                                )}
                            </>
                        )}

                        {/* ── 댓글 탭 ── */}
                        {tab === 'replies' && (
                            <>
                                {replies.length === 0 ? (
                                    <EmptyState icon={<ChatBubbleLeftRightIcon className='h-10 w-10 text-gray-200' />} text='작성한 댓글이 없습니다.' />
                                ) : (
                                    <div className='flex flex-col divide-y divide-gray-50'>
                                        {replies.map((reply) => (
                                            <div key={reply.replyIdx} className='py-3 px-2'>
                                                {/* 원문 게시물 제목 */}
                                                <div className='flex items-center gap-1.5 mb-1'>
                                                    <DocumentTextIcon className='h-3.5 w-3.5 text-gray-300' />
                                                    <span className='text-xs text-gray-400 truncate'>
                                                        {reply.boardTitle || '게시물'}
                                                    </span>
                                                </div>
                                                {/* 댓글 내용 */}
                                                <p className='text-sm text-gray-700 leading-relaxed line-clamp-2'>
                                                    {reply.contents}
                                                </p>
                                                <p className='text-xs text-gray-400 mt-1'>{reply.regDt}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {replyTotal > 10 && (
                                    <Pagination
                                        page={replyPage}
                                        totalPages={Math.ceil(replyTotal / 10)}
                                        setPage={setReplyPage}
                                    />
                                )}
                            </>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}

// ── 빈 상태 컴포넌트 ──────────────────────────────────────────────────────────
function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className='flex flex-col items-center justify-center py-16 gap-3'>
            {icon}
            <p className='text-sm text-gray-400'>{text}</p>
        </div>
    );
}
