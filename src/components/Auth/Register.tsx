import React, { useEffect, useRef, useState } from "react";
import useDialogStore from "../../stores/dialogStore";
import instance from "../../services/instance";
import { useNavigate } from "react-router-dom";
import InputText from "../common/forms/InputText";
import H1 from "../common/tag/H1";
import Buttons from "../common/forms/Buttons";
// import { useNavigate } from "react-router-dom";


const Register = () => {
    const openDialog = useDialogStore(state => state.openDialog);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        pass: '',
        passC: ''
    });
    const [formErrors, setFormErrors] = useState({
        id: '',
        name: '',
        email: '',
        pass: '',
        passC: ''
    });
    const [disable, setDisable] = useState(false);

    const idRef = useRef(null);
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passRef = useRef(null);
    const passCRef = useRef(null);

    const idRegex = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const nameRegex = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{2,}$/;

    const validateInput = (name, value) => {
        switch (name) {
            case 'id':
                return idRegex.test(value) ? '' : "아이디"; //FIXME: span안나옴
            case 'name':
                return nameRegex.test(value) ? '' : "한글2글자이상 입력하세요.";
            case 'email':
                return emailRegex.test(value) ? '' : "유효하지 않은 이메일 형식입니다!";
            case 'pass':
                return passRegex.test(value) ? '' : "비밀번호는 8자 이상이며, 숫자와 특수 문자를 포함해야 합니다!";
            case 'passC':
                return value === formData.pass ? '' : "비밀번호가 일치하지 않습니다.";
            default:
                return '';
        }
    };

    const handleDisabled = () => {
        const allFieldsFilled = Object.values(formData).every(value => value.trim() !== '');
        // formErrors의 모든 항목이 빈 문자열인지 확인
        const noErrors = Object.values(formErrors).every(error => error === '');

        // 모든 필드가 채워져 있고 오류 메시지가 없으면 버튼을 활성화
        setDisable(!(allFieldsFilled && noErrors));
    }

    useEffect(() => {
        handleDisabled();
    }, [formData, formErrors]);

    const handleBlur = (e) => {
        const { name, value } = e.target;
        if (value == '') {
            return;
        } else {
            const error = validateInput(name, value);
            setFormErrors(prevErrors => ({
                ...prevErrors,
                [name]: error
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const JoinFunc = async (e) => {
        e.preventDefault();
        try {
            const _res = await instance.post("/regist", {
                "id": formData.id,
                "usrNm": formData.name,
                "email": formData.email,
                "pw": formData.pass,
            }
            );
            if (_res.data.result === "success") {
                openDialog("회원가입이 완료되었습니다.");
                navigate("/")
            } else {
                openDialog("회원가입에 실패하였습니다.");
            }
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <section className='flex justify-center items-center'>
            <form className='w-full max-w-md rounded bg-white justify-center p-8 rounded'>
                <H1 className="text-md">회원가입</H1>
                <fieldset className="flex items-center flex-col gap-4 py-4 w-full">
                    <legend className="sr-only">회원가입</legend>
                    <InputText
                        type="text"
                        id="id"
                        name="id"
                        placeholder="아이디"
                        className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoComplete='off'
                        required
                        minLength={8}
                        value={formData.id}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        ref={idRef}
                    />
                    {formErrors.name && <span className="text-pink text-sm">{formErrors.name}</span>}
                    <InputText
                        type="password"
                        id="pass"
                        name="pass"
                        placeholder="비밀번호"
                        autoComplete="off"
                        required
                        className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        minLength={8}
                        value={formData.pass}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        ref={passRef}
                    />
                    {formErrors.pass && <span className="text-pink text-sm">{formErrors.pass}</span>}
                    <InputText
                        type="password"
                        id="passC"
                        name="passC"
                        placeholder="확인 비밀번호"
                        autoComplete="off"
                        required
                        className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        minLength={8}
                        value={formData.passC}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        ref={passCRef}
                    />
                    {formErrors.passC && <span className="text-red-400 text-sm">{formErrors.passC}</span>}
                    <InputText
                        type="text"
                        id="name"
                        name="name"
                        placeholder="이름"
                        className="p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoComplete='off'
                        required
                        minLength={8}
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        ref={nameRef}
                    />
                    {formErrors.name && <span className="text-red-400 text-sm">{formErrors.name}</span>}

                    <InputText
                        type="email"
                        id="email"
                        name="email"
                        placeholder="example1234@example.com"
                        autoComplete='off'
                        required
                        className="p-2 w-2/4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        minLength={8}
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        ref={emailRef}
                    />

                    {formErrors.email && <span className="text-red-400 text-sm">{formErrors.email}</span>}
                    <Buttons
                        type="submit"
                        className="w-full justify-center"
                        onClick={JoinFunc}
                        disabled={disable}
                    >회원가입</Buttons>
                </fieldset>
            </form>
        </section>
    )
}

export default Register
