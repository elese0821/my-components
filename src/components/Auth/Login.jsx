
import { useState } from "react";
import instance from "../../services/instance";
import useUserStore from "../../stores/useUserStore";
// import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        Email: '',
        Pass: '',
    });

    const { user, setUser } = useUserStore();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const [errorMsg, setErrorMsg] = useState("");
    // const navigate = useNavigate();

    const LoginFunc = async (e) => {
        e.preventDefault();

        if (!(formData.Email && formData.Pass)) {
            return alert("이메일 또는 비밀번호를 채워주세요!");
        }

        const _res = await instance.post("/login", {
            "id": formData.Email,
            "pw": formData.Pass,
        }
        )

        if (_res.data.result === "success") {
            setUser(formData.Email);
            alert("환영합니다.");
        } else {
            alert("로그인에 실패하였습니다.");
        }
    }

    return (
        <section className='login__wrap'>
            <form className='login__form'>
                <fieldset>
                    <legend className="blind">로그인 영역</legend>
                    <div>
                        <label htmlFor="Email" className="required blind">이메일</label>
                        <input
                            type="email"
                            id="Email"
                            name="Email"
                            placeholder="이메일"
                            className="input__style"
                            autoComplete='off'
                            required
                            value={formData.Email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="Pass" className="required blind">비밀번호</label>
                        <input
                            type="password"
                            id="Pass"
                            name="Pass"
                            placeholder="비밀번호"
                            className="input__style"
                            autoComplete="off"
                            required
                            value={formData.Pass}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        {errorMsg !== "" && <p>{errorMsg}</p>}
                    </div>
                    <button type="submit" onClick={(e) => LoginFunc(e)} className="btn black">로그인</button>
                </fieldset>
            </form>

        </section>
    )
}

export default Login
