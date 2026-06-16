import React from 'react'

export default function Kakao() {
    const link = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_APP_REST_API_KEY}&redirect_uri=${import.meta.env.VITE_APP_REDIRECT_URL}&response_type=code`;
    const loginHandler = () => {
        window.location.href = link;
    };
    return (
        <button
            onClick={loginHandler}
            className=""
        >카카오 로그인</button>
    )
}
