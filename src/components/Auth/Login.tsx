`1`
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../services/instance";
import useUserStore from "../../stores/userStore.ts";
import useDialogStore from "../../stores/dialogStore";
import Kakao from "./Kakao";
import Google from "./Google";
import Buttons from "../common/forms/Buttons";
import H1 from "../common/tag/H1.tsx";
import InputText from "../common/forms/InputText.tsx";
import useModalStore from "../../stores/modalStore.ts";

export default function Login({ handleHeader }) {
    // 변수 선언
    const [formData, setFormData] = useState({
        id: '',
        password: '',
    });
    const { setUser } = useUserStore();
    const navigate = useNavigate();
    // 모달
    const openDialog = useDialogStore(state => state.openDialog);
    const closeModal = useModalStore(state => state.closeModal);

    // 함수 선언
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };
    const LoginFunc = async (e) => {
        e.preventDefault();

        if (!(formData.id && formData.password)) {
            return openDialog("아이디 또는 비밀번호를 채워주세요!");
        }

        const _res = await instance.post("/login", {
            "id": formData.id,
            "pw": formData.password,
            "login_type": "NORMAL"
        });

        if (_res.data.result === "success") {
            setUser({
                userId: _res.data.username,
                token: _res.data.token,
                usrIdx: _res.data.USR_IDX
            });
            openDialog("로그인😎!");
            closeModal();
            navigate("/");
        } else {
            openDialog("로그인 실패🥲");
        }
    }

    return (
        <div className="w-full max-w-md rounded bg-white justify-center p-8 rounded m-auto">
            <H1>로그인</H1>
            <form className='w-full bg-white justify-center pt-8' onSubmit={LoginFunc}>
                <fieldset className="flex flex-col gap-8 items-center">
                    <legend className="sr-only blind">로그인</legend>
                    <InputText
                        label="아이디"
                        type="text"
                        id="id"
                        required
                        placeholder="아이디"
                        autoComplete='off'
                        value={formData.id}
                        onChange={handleChange}
                        autoFocus={true}
                    />
                    <InputText
                        label="비밀번호"
                        type="password"
                        id="password"
                        placeholder="비밀번호"
                        autoComplete="on"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <Buttons
                        className="w-full"
                        type="submit"
                    >로그인
                    </Buttons>
                </fieldset>
            </form>
            <ul className="flex justify-center my-4 gap-2">
                <li className="cursor-pointer hover:underline text-right">
                    아이디 찾기
                </li>
                <li>
                    |
                </li>
                <li className="cursor-pointer hover:underline text-left">
                    비밀번호 찾기
                </li>
            </ul>
            <div className="grid grid-cols-4 border border-gray3 p-2 gap-4 rounded-md">
                <Kakao />
                <Google />
            </div>
            <ul className="grid grid-cols-1 text-center mt-8 gap-6">
                <li onClick={() => handleHeader("join")} className="cursor-pointer hover:underline">
                    회원가입
                </li>
            </ul>
        </div>
    )
}
