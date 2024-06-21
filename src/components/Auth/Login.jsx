`1`
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../services/instance";
import useUserStore from "../../stores/userStore";
import useDialogStore from "../../stores/dialogStore";
import Kakao from "./Kakao";
import Google from "./Google";
import InputText from './../common/forms/InputText';

const Login = () => {
    // 변수 선언
    const [formData, setFormData] = useState({
        id: '',
        Pass: '',
    });
    const { setUser, usrIdx, userId, token } = useUserStore();
    const navigate = useNavigate();
    // 모달
    const openDialog = useDialogStore(state => state.openDialog);

    // 함수 선언
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const LoginFunc = async (e) => {
        e.preventDefault();

        if (!(formData.id && formData.Pass)) {
            return openDialog("아이디 또는 비밀번호를 채워주세요!");
        }

        const _res = await instance.post("/login", {
            "id": formData.id,
            "pw": formData.Pass,
            "login_type": "NORMAL"
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
    }

    return (
        <div className="section_wrap">
            <section className="flex justify-center items-center flex-col">
                <form className='w-full max-w-md rounded bg-white justify-center p-8 rounded' onSubmit={LoginFunc}>
                    <fieldset className="flex flex-col gap-8 items-center">
                        <legend className="sr-only blind">로그인</legend>
                        <div className="w-full">
                            <InputText
                                htmlFor="email"
                                required="required"
                                type="text"
                                id="youId"
                                name="id"
                                placeholder="아이디"
                                className="p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                autoComplete='off'
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="w-full">
                            <label htmlFor="Pass" className="required blind">비밀번호</label>
                            <InputText
                                type="password"
                                id="Pass"
                                name="Pass"
                                placeholder="비밀번호"
                                className="p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                autoComplete="off"
                                required
                                value={formData.Pass}
                                onChange={handleChange}
                            />
                        </div>
                        <button
                            className="btn black w-full rounded disabled:opacity-75 bg-blue-600 p-3 text-white hover:bg-blue-700"
                            type="submit"
                            onClick={(e) => LoginFunc(e)}
                        >로그인</button>
                    </fieldset>
                </form>
                <Kakao />
                <Google />
            </section>
        </div>
    )
}

export default Login
