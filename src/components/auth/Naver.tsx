import React from 'react';

/** 네이버 로그인 버튼
 *  .env  →  VITE_APP_NAVER_CLIENT_ID, VITE_APP_NAVER_REDIRECT_URL
 */
export default function Naver({ className = '' }: { className?: string }) {
    const loginHandler = () => {
        const clientId   = import.meta.env.VITE_APP_NAVER_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_APP_NAVER_REDIRECT_URL;
        // CSRF 방지용 state (랜덤 문자열)
        const state = Math.random().toString(36).slice(2);
        sessionStorage.setItem('naver_state', state);

        const url = [
            'https://nid.naver.com/oauth2.0/authorize',
            `?response_type=code`,
            `&client_id=${clientId}`,
            `&redirect_uri=${encodeURIComponent(redirectUri)}`,
            `&state=${state}`,
        ].join('');

        window.location.href = url;
    };

    return (
        <button type='button' onClick={loginHandler} className={className}
            aria-label='네이버로 로그인'>
            {/* 네이버 공식 초록 */}
            <svg viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
                <rect width='24' height='24' rx='4' fill='#03C75A'/>
                <path d='M13.63 12.22L10.2 7H7v10h3.37v-5.22L14.18 17H17V7h-3.37v5.22z' fill='white'/>
            </svg>
        </button>
    );
}
