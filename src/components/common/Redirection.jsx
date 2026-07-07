import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import instance from '../../services/instance';
import useDialogStore from '../../stores/dialogStore';
import useUserStore from '../../stores/userStore.ts';
import Loading from './Loading';

/**
 * 소셜 로그인 콜백 처리
 *  /auth/google?code=XXX → 구글
 */

// ── 에러 헬퍼 ────────────────────────────────────────────────────
// instance interceptor(401/500)가 이미 처리한 에러는 dialog 중복 방지
function isAlreadyHandled(e) {
    const s = e?.response?.status;
    return s === 401 || s === 500;
}
function extractMsg(e) {
    return e?.response?.data?.message
        ?? e?.response?.data?.msg
        ?? e?.response?.data?.error
        ?? e?.message
        ?? '알 수 없는 오류';
}

// ── 공통 성공 처리 ───────────────────────────────────────────────
function loginSuccess({ res, setUser, openDialog, navigate, profileImage, nickname, provider }) {
    if (res?.result === 'success') {
        setUser({
            userId:       res.username,
            token:        res.token,
            usrIdx:       res.USR_IDX,
            profileImage: profileImage ?? res.profileImage ?? null,
            nickname:     nickname     ?? res.nickname     ?? null,
            provider,
        });
        openDialog('로그인 되었습니다.');
        navigate('/');
    } else {
        // 백엔드가 200이지만 result != 'success'
        const reason = res?.message ?? res?.msg ?? '로그인에 실패했습니다.';
        openDialog(reason);
        navigate('/');
    }
}

// ── 구글 ────────────────────────────────────────────────────────
async function handleGoogle({ code, setUser, openDialog, navigate }) {
    const codeVerifier = sessionStorage.getItem('google_code_verifier');
    sessionStorage.removeItem('google_code_verifier');

    let accessToken  = null;
    let profileImage = null;
    let nickname     = null;

    // ① PKCE 토큰 교환 (Web Application 타입은 client_secret 필요 → 실패할 수 있음)
    if (codeVerifier) {
        try {
            const body = new URLSearchParams({
                grant_type:    'authorization_code',
                client_id:     import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
                redirect_uri:  import.meta.env.VITE_APP_GOOGLE_REDIRECT_URL,
                code,
                code_verifier: codeVerifier,
            });
            const r = await axios.post(
                'https://oauth2.googleapis.com/token',
                body.toString(),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );
            accessToken = r.data.access_token ?? null;
            console.log('[Google] ① PKCE 토큰 교환 성공');
        } catch (pe) {
            console.warn('[Google] ① PKCE 교환 실패 → code 폴백',
                pe?.response?.data?.error ?? pe.message);
        }
    }

    // ② 프로필 (accessToken 확보된 경우만)
    if (accessToken) {
        try {
            const r = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            profileImage = r.data.picture ?? null;
            nickname     = r.data.name    ?? r.data.email ?? null;
            console.log('[Google] ② 프로필 획득', { profileImage, nickname });
        } catch { /* 무시 */ }
    }

    // ③ 백엔드 로그인
    //    PKCE 교환 실패 시: code + code_verifier + redirect_uri 를 백엔드로 → 백엔드가 client_secret 으로 교환
    const payload = accessToken
        ? { access_token: accessToken, login_type: 'GOOGLE' }
        : { code, code_verifier: codeVerifier ?? undefined,
            redirect_uri: import.meta.env.VITE_APP_GOOGLE_REDIRECT_URL, login_type: 'GOOGLE' };

    try {
        console.log('[Google] ③ 백엔드 로그인 요청', payload);
        const res = await instance.post('/login', payload);
        console.log('[Google] ③ 백엔드 응답', res.data);
        loginSuccess({
            res:          res.data,
            setUser,
            openDialog,
            navigate,
            profileImage: profileImage ?? res.data.profileImage ?? null,
            nickname:     nickname     ?? res.data.nickname     ?? null,
            provider:     'GOOGLE',
        });
    } catch (e) {
        console.error('[Google] ③ 백엔드 로그인 실패', e?.response?.data ?? e.message);
        if (!isAlreadyHandled(e)) {
            openDialog(`구글 로그인 실패: ${extractMsg(e)}`);
        }
        navigate('/');
    }
}

// ── 컴포넌트 ────────────────────────────────────────────────────
const Redirection = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');

    const navigate   = useNavigate();
    const openDialog = useDialogStore(s => s.openDialog);
    const { setUser } = useUserStore();

    // ⚠ StrictMode(dev)는 effect를 2번 실행 → 인가코드 2번 소비 → 400.
    //    useState 가드는 비동기라 막지 못함. useRef(동기) + 코드값 기록으로 차단.
    const processedCode = useRef(null);

    useEffect(() => {
        if (!code) return;
        if (processedCode.current === code) return; // 동일 코드 재처리 차단
        processedCode.current = code;

        handleGoogle({ code, setUser, openDialog, navigate });
    }, [code]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className='section_wrap flex flex-col items-center justify-center gap-3'>
            {code ? (
                <>
                    <Loading />
                    <p className='text-gray-400 text-sm'>Google 로그인 처리 중입니다…</p>
                    <p className='text-gray-300 text-xs'>잠시만 기다려 주세요</p>
                </>
            ) : (
                <p className='text-gray-400 text-sm'>인증 코드가 없습니다. 다시 시도해 주세요.</p>
            )}
        </div>
    );
};

export default Redirection;
