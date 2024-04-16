import { useState } from "react";

import instance from "../../services/instance";
// import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        Email: '',
        Pass: '',
        PassC: ''
    });
    const [flag, setFlag] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // let navigate = useNavigate();

    const JoinFunc = async (e) => {
        e.preventDefault();

        if (!(formData.name && formData.Email && formData.Pass && formData.PassC)) {
            return alert("모든 항목을 입력하셔야 회원가입이 가능합니다.");
        }
        if (formData.Pass !== formData.PassC) {
            return alert("비밀번호가 일치하지 않습니다.")
        }

        const _res = await instance.post("/regist",
            {
                "id": formData.Email,
                "usrNm": formData.name,
                "pw": formData.Pass,
                "email": formData.PassC
            }
        )

        if (_res.data.result === "success") {
            alert("회원가입이 완료되었습니다.");
        } else {
            alert("회원가입에 실패하였습니다.");
        }
    }

    return (
        <section className='login__wrap'>
            <form className='login__form'>
                <fieldset>
                    <legend className="blind">로그인 영역</legend>
                    <div>
                        <label htmlFor="name" className="required blind">이름</label>
                        <input
                            type="text"
                            id="youName"
                            name="name"
                            placeholder="닉네임"
                            className="input__style"
                            autoComplete='off'
                            required
                            minLength={8}
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="Email" className="required blind">이메일</label>
                        <input
                            type="email"
                            id="Email"
                            name="Email"
                            placeholder="이메일"
                            autoComplete='off'
                            required
                            minLength={8}
                            value={formData.Email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="Pass" className="required blind">비밀번호</label>
                        <input
                            type="text"
                            id="Pass"
                            name="Pass"
                            placeholder="비밀번호"
                            autoComplete="off"
                            required
                            minLength={8}
                            value={formData.Pass}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="PassC" className="required blind">확인 비밀번호</label>
                        <input
                            type="text"
                            id="PassC"
                            name="PassC"
                            placeholder="확인 비밀번호"
                            autoComplete="off"
                            required
                            minLength={8}
                            value={formData.PassC}
                            onChange={handleChange}
                        />
                    </div>
                    <button disabled={flag} type="submit" className="btn black" onClick={(e) => JoinFunc(e)}>회원가입</button>
                </fieldset>
            </form>
        </section>
    )
}

export default Register
