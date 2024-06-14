import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import instance from '../../services/instance';
import axios from 'axios';
import useDialogStore from '../../stores/dialogStore';
import useUserStore from '../../stores/userStore';
import Loading from './Loading';

const Redirection = () => {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');
    const [data, setData] = useState();
    const navigate = useNavigate();
    const { openDialog } = useDialogStore();
    const { setUser } = useUserStore();

    const kakaoLogin = async () => {
        try {
            //input 인가코드 (ie:code)
            const _res = await axios.post('https://kauth.kakao.com/oauth/token', {
                code: code,
                client_id: import.meta.env.VITE_APP_REST_API_KEY,
                redirect_uri: import.meta.env.VITE_APP_REDIRECT_URL,
                grant_type: "authorization_code"
            }, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            })
            const _data = await _res.data;
            setData(_data);
        } catch (e) {
            console.log(e);
        }
    }

    const handlekakaoLogin = async () => {
        try {
            const _res = await instance.post("/login", {
                "access_token": data.access_token,
                "login_type": "KAKAO"
            });

            if (_res.data.result === "success") {
                setUser({
                    userId: _res.data.username,
                    token: _res.data.token,
                    usrIdx: _res.data.USR_IDX
                });
                openDialog("로그인😎!");
                navigate("/");
            } else {
                openDialog("로그인 실패🥲");
            }
        } catch (e) {
            console.log(e)
        }
    };

    useEffect(() => {
        if (code) {
            kakaoLogin();
        }
    }, [code]);

    useEffect(() => {
        if (data) {
            handlekakaoLogin();
        }
    }, [data])

    return (
        <div>
            {code ? (
                <Loading />
            ) : (
                <p>인증 코드를 불러오는 중입니다...</p>
            )}
        </div>
    );
};

export default Redirection;
