import React, { useEffect, useRef, useState } from "react";
import instance from "../../services/instance";
import { useNavigate } from "react-router-dom";
import InputText from "../common/forms/InputText";
import H1 from "../common/tag/H1";
import Buttons from "../common/forms/Buttons";
import useDialogStore from "../../stores/dialogStore";
import useModalStore from "../../stores/modalStore";
// import { useNavigate } from "react-router-dom";


const Join = ({ handleHeader }) => {
    const openDialog = useDialogStore(state => state.openDialog);
    const navigate = useNavigate();
    const { closeModal } = useModalStore();

    const [formData, setFormData] = useState({
        userId: '',
        name: '',
        email: '',
        pass: '',
        passC: ''
    });
    const [formErrors, setFormErrors] = useState({
        userId: '',
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

    const idRegex = /^[A-Za-z0-9][A-Za-z0-9]{4,8}$/;
    const nameRegex = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{2,}$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    const validateInput = (name: string, value: string) => {
        switch (name) {
            case 'userId':
                return idRegex.test(value) ? '' : "8글자 이하 영어"; //FIXME: span안나옴
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

    const handleBlur = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        // console.log(`handleBlur - name: ${name}, value: ${value}`); // 디버깅 로그
        if (value == '') {
            return;
        } else {
            const error = validateInput(name, value);
            console.log(`handleBlur - error: ${error}`);
            setFormErrors(prevErrors => ({
                ...prevErrors,
                [name]: error
            }));
        }
    };

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        // console.log(`handleChange - name: ${name}, value: ${value}`);
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const JoinFunc = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            const _res = await instance.post("/regist", {
                "id": formData.userId,
                "usrNm": formData.name,
                "email": formData.email,
                "pw": formData.pass,
            }
            );
            if (_res.data.result === "success") {
                openDialog(_res.data.msg);
                closeModal();
            } else {
                openDialog(_res.data.msg);
            }
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <form className='w-full max-w-md rounded bg-white justify-center p-8 rounded m-auto' onSubmit={JoinFunc}>
            <H1 className="text-md">회원가입</H1>
            <fieldset className="flex items-center flex-col gap-4 py-4 w-full">
                <legend className="sr-only">회원가입</legend>
                <InputText
                    label="아이디"
                    type="text"
                    id="userId"
                    name="userId"
                    placeholder="아이디"
                    autoComplete='off'
                    required
                    minLength={8}
                    value={formData.userId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={idRef}
                    wrapStyle="w-full"
                    autoFocus={true}
                />
                {formErrors.userId && <span className="text-pink text-sm">{formErrors.userId}</span>}
                <InputText
                    label="비밀번호"
                    type="password"
                    id="pass"
                    name="pass"
                    placeholder="비밀번호"
                    autoComplete="off"
                    required
                    minLength={8}
                    value={formData.pass}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={passRef}
                    wrapStyle="w-full"
                />
                {formErrors.pass && <span className="text-pink text-sm">{formErrors.pass}</span>}
                <InputText
                    label="확인 비밀번호"
                    type="password"
                    id="passC"
                    name="passC"
                    placeholder="확인 비밀번호"
                    autoComplete="off"
                    required
                    minLength={8}
                    value={formData.passC}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={passCRef}
                    wrapStyle="w-full"
                />
                {formErrors.passC && <span className="text-pink text-sm">{formErrors.passC}</span>}
                <InputText
                    label="이름"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="이름"
                    autoComplete='off'
                    required
                    minLength={8}
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={nameRef}
                    wrapStyle="w-full"
                />
                {formErrors.name && <span className="text-pink text-sm">{formErrors.name}</span>}
                <InputText
                    label="이메일"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example1234@example.com"
                    autoComplete='off'
                    required
                    minLength={8}
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={emailRef}
                    wrapStyle="w-full"
                />
                {formErrors.email && <span className="text-pink text-sm">{formErrors.email}</span>}
                <Buttons
                    type="submit"
                    onClick={JoinFunc}
                    disabled={disable}
                    className="w-full"
                >회원가입</Buttons>
            </fieldset>
        </form>
    )
}

export default Join
