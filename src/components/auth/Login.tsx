import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../../services/instance';
import useUserStore from '../../stores/userStore.ts';
import useDialogStore from '../../stores/dialogStore';
import useModalStore from '../../stores/modalStore.ts';

// ── Google PKCE 헬퍼 ────────────────────────────────────────────
function generateCodeVerifier(): string {
    const arr = new Uint8Array(32);
    window.crypto.getRandomValues(arr);
    return btoa(String.fromCharCode(...arr)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
}
async function generateCodeChallenge(verifier: string): Promise<string> {
    const data   = new TextEncoder().encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
}

// ── 소셜 로그인 핸들러 ──────────────────────────────────────────
async function openKakao() {
    const url = new URL('https://kauth.kakao.com/oauth/authorize');
    url.searchParams.set('client_id',    import.meta.env.VITE_APP_REST_API_KEY);
    url.searchParams.set('redirect_uri', import.meta.env.VITE_APP_REDIRECT_URL);
    url.searchParams.set('response_type','code');
    // 닉네임·프로필사진 동의 요청 (콘솔에서 동의항목 활성화 필요)
    url.searchParams.set('scope', 'profile_nickname,profile_image');
    window.location.href = url.toString();
}

async function openNaver() {
    const state = Math.random().toString(36).slice(2);
    sessionStorage.setItem('naver_state', state);
    const url = new URL('https://nid.naver.com/oauth2.0/authorize');
    url.searchParams.set('response_type','code');
    url.searchParams.set('client_id',    import.meta.env.VITE_APP_NAVER_CLIENT_ID);
    url.searchParams.set('redirect_uri', import.meta.env.VITE_APP_NAVER_REDIRECT_URL);
    url.searchParams.set('state',        state);
    window.location.href = url.toString();
}

async function openGoogle() {
    const verifier   = generateCodeVerifier();
    const challenge  = await generateCodeChallenge(verifier);
    sessionStorage.setItem('google_code_verifier', verifier);
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.set('client_id',             import.meta.env.VITE_APP_GOOGLE_CLIENT_ID);
    url.searchParams.set('redirect_uri',          import.meta.env.VITE_APP_GOOGLE_REDIRECT_URL);
    url.searchParams.set('response_type',         'code');
    url.searchParams.set('scope',                 'openid email profile');
    url.searchParams.set('code_challenge',        challenge);
    url.searchParams.set('code_challenge_method', 'S256');
    url.searchParams.set('access_type',           'online');
    window.location.href = url.toString();
}

// ── SVG 아이콘 ──────────────────────────────────────────────────
const GoogleIcon = () => (
    <svg viewBox='0 0 24 24' className='w-5 h-5 shrink-0'>
        <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' fill='#4285F4'/>
        <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853'/>
        <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z' fill='#FBBC05'/>
        <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335'/>
    </svg>
);

const KakaoIcon = () => (
    <svg viewBox='0 0 24 24' className='w-5 h-5 shrink-0' fill='none'>
        <path d='M12 3C6.48 3 2 6.58 2 11c0 2.77 1.68 5.2 4.24 6.67l-.96 3.56c-.08.3.26.54.52.37L10.1 19.1c.61.12 1.25.19 1.9.19 5.52 0 10-3.58 10-8s-4.48-8-10-8z' fill='#3C1E1E'/>
    </svg>
);

const NaverIcon = () => (
    <svg viewBox='0 0 24 24' className='w-5 h-5 shrink-0' fill='none'>
        <path d='M13.6 12.6l-3.78-5.6H5.25v14h4.04v-5.6l4.04 5.6H18.75V7H14.71v5.6z' fill='white'/>
    </svg>
);

// ── 소셜 버튼 컴포넌트 ──────────────────────────────────────────
function SocialBtn({
    icon, label, onClick,
    bg, text, border,
}: {
    icon: React.ReactNode; label: string; onClick: () => void;
    bg: string; text: string; border?: string;
}) {
    return (
        <button type='button' onClick={onClick}
            className='flex items-center gap-3 w-full h-12 px-4 rounded-xl font-semibold text-sm transition-all active:scale-[.98] hover:opacity-90'
            style={{ backgroundColor: bg, color: text, border: border ? `1.5px solid ${border}` : undefined }}>
            <span className='shrink-0 w-6 flex items-center justify-center'>{icon}</span>
            <span className='flex-1 text-center'>{label}</span>
            <span className='w-6'/>
        </button>
    );
}

// ── 메인 Login 컴포넌트 ─────────────────────────────────────────
export default function Login({ handleHeader }: { handleHeader?: (v: string) => void }) {
    const [formData, setFormData] = useState({ id: '', password: '' });
    const [loading,  setLoading]  = useState(false);
    const { setUser }  = useUserStore();
    const navigate     = useNavigate();
    const openDialog   = useDialogStore(s => s.openDialog);
    const closeModal   = useModalStore(s => s.closeModal);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(p => ({ ...p, [id]: value }));
    };

    const LoginFunc = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.id || !formData.password)
            return openDialog('아이디 또는 비밀번호를 채워주세요!');
        setLoading(true);
        try {
            const res = await instance.post('/login', {
                id: formData.id, pw: formData.password, login_type: 'NORMAL',
            });
            if (res.data.result === 'success') {
                setUser({ userId: res.data.username, token: res.data.token, usrIdx: res.data.USR_IDX, provider: 'NORMAL' });
                openDialog('로그인 되었습니다.');
                closeModal?.();
                navigate('/');
            } else {
                openDialog('아이디 또는 비밀번호를 확인해주세요.');
            }
        } catch { openDialog('로그인 중 오류가 발생했습니다.'); }
        finally { setLoading(false); }
    };

    const ipt = [
        'w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-800',
        'placeholder-gray-400 outline-none transition-all',
        'border-gray-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/10',
    ].join(' ');

    return (
        <div className='w-full p-6 sm:p-8'>
            {/* 브랜드 */}
            <div className='text-center mb-5'>
                <div className='inline-flex items-center justify-center w-11 h-11 rounded-2xl mb-3'
                    style={{background:'linear-gradient(135deg,#6366f1,#8b5cf6)'}}>
                    <span className='text-white text-lg font-bold'>W</span>
                </div>
                <h1 className='text-xl font-bold text-gray-900'>로그인</h1>
                <p className='text-xs text-gray-400 mt-0.5'>계정에 로그인하거나 소셜 로그인을 사용하세요</p>
            </div>

            {/* 이메일/비밀번호 폼 */}
            <form onSubmit={LoginFunc} className='flex flex-col gap-2.5'>
                <input id='id' type='text' placeholder='아이디' value={formData.id}
                    onChange={handleChange} autoComplete='username' autoFocus className={ipt}/>
                <input id='password' type='password' placeholder='비밀번호' value={formData.password}
                    onChange={handleChange} autoComplete='current-password' className={ipt}/>
                <button type='submit' disabled={loading}
                    className='h-12 rounded-xl text-sm font-semibold text-white transition-all active:scale-[.98] disabled:opacity-60 mt-1'
                    style={{background:'linear-gradient(135deg,#6366f1,#4f46e5)'}}>
                    {loading ? '로그인 중…' : '로그인'}
                </button>
            </form>

            {/* 링크 */}
            <div className='flex items-center justify-center gap-3 mt-3 text-xs text-gray-400'>
                <button className='hover:text-gray-600 transition-colors'>아이디 찾기</button>
                <span className='text-gray-200'>|</span>
                <button className='hover:text-gray-600 transition-colors'>비밀번호 찾기</button>
                <span className='text-gray-200'>|</span>
                <button onClick={()=>handleHeader?.('join')}
                    className='text-indigo-500 font-semibold hover:text-indigo-600 transition-colors'>
                    회원가입
                </button>
            </div>

            {/* 소셜 구분선 */}
            <div className='flex items-center gap-3 my-4'>
                <div className='flex-1 h-px bg-gray-100'/>
                <span className='text-[11px] text-gray-300 font-medium tracking-wide'>소셜 로그인</span>
                <div className='flex-1 h-px bg-gray-100'/>
            </div>

            {/* 소셜 버튼 3종 */}
            <div className='flex flex-col gap-2.5'>
                <SocialBtn icon={<KakaoIcon/>} label='카카오로 계속하기'
                    onClick={openKakao} bg='#FEE500' text='#3C1E1E'/>
                <SocialBtn icon={<NaverIcon/>} label='네이버로 계속하기'
                    onClick={openNaver} bg='#03C75A' text='#ffffff'/>
                <SocialBtn icon={<GoogleIcon/>} label='Google로 계속하기'
                    onClick={openGoogle} bg='#ffffff' text='#3c4043' border='#dadce0'/>
            </div>

            {/* 소셜 키 미설정 안내 (개발 환경) */}
            {import.meta.env.DEV && !import.meta.env.VITE_APP_REST_API_KEY && (
                <p className='mt-4 text-center text-[10px] text-amber-500'>
                    ⚠ .env에 소셜 로그인 키가 설정되지 않았습니다
                </p>
            )}
        </div>
    );
}
