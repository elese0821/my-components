import { useEffect, useRef, useState } from "react";
import useDialogStore from "../../stores/dialogStore";
import instance from "../../services/instance";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";


const Register = () => {
    const openDialog = useDialogStore(state => state.openDialog);
    const navigate = useNavigate();
    const [selectedValue, setSelectedValue] = useState('')

    useEffect(() => {
        console.log(selectedValue)
    }, [selectedValue])

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
    const [disable, setDisable] = useState(true)

    // selectBox
    const selectOptions = [
        { value: "naver.com", label: "naver.com", color: "#0854A0" },
        { value: "google.com", label: "google.com", color: "#0854A0" },
    ];

    const customTheme = (theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
            ...theme.colors,
            // primary25: 'lightblue',
            // primary: 'darkblue',
        },
        alignItems: 'center',
        display: 'flex',
    });

    const idRef = useRef(null);
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passRef = useRef(null);
    const passCRef = useRef(null);

    const idRegex = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+$/;
    const emailRegex = /^[^\s@]+$/;
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const nameRegex = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]{2,}$/;

    const validateInput = (name, value) => {
        switch (name) {
            case 'id':
                return idRegex.test(value) ? '' : "dsad";
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

    const handleSelectValue = (e) => {
        setSelectedValue(e)
    }

    const JoinFunc = async (e) => {
        e.preventDefault();
        try {
            const _res = await instance.post("/regist", {
                "id": formData.id,
                "usrNm": formData.name,
                "email": formData.email + selectedValue,
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
    const customStyles = {
        control: provided => ({
            ...provided,
            padding: '0.2rem',
            borderRadius: '0.25rem',
        }),
        menu: provided => ({
            ...provided,
            borderRadius: '0.5rem',
        }),
    };
    return (
        <section className='flex justify-center items-center'>
            <form className='w-full max-w-md rounded bg-white justify-center p-8 rounded'>
                <fieldset className="flex items-center flex-col gap-8">
                    <legend className="sr-only blind">회원가입</legend>
                    <div className="w-full">
                        <label htmlFor="name" className="required blind">아이디</label>
                        <input
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
                        {formErrors.name && <span className="text-red-400 text-sm">{formErrors.name}</span>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="name" className="required blind">이름</label>
                        <input
                            type="text"
                            id="youName"
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
                    </div>

                    <div className="w-full">
                        <label htmlFor="email" className="required blind">이메일</label>
                        <div className="w-full flex gap-2 justify-between">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="이메일"
                                autoComplete='off'
                                required
                                className="p-2 w-2/4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                minLength={8}
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                ref={emailRef}
                            />
                            <span className="flex align-center">@</span>
                            <Select
                                className="w-full"
                                styles={customStyles}
                                options={selectOptions}
                                theme={customTheme}
                                placeholder="google.com"
                                isClearable={true}
                                onChange={handleSelectValue}
                                defaultValue="google.com"
                                required
                                value={selectedValue}
                            // defaultValue={dd}
                            />
                        </div>
                        {formErrors.email && <span className="text-red-400 text-sm">{formErrors.email}</span>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="password" className="required blind">비밀번호</label>
                        <input
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
                        {formErrors.pass && <span className="text-red-400 text-sm">{formErrors.pass}</span>}
                    </div>
                    <div className="w-full">
                        <label htmlFor="password" className="required blind">비밀번호 확인</label>
                        <input
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
                    </div>
                    <button
                        type="submit"
                        className="btn black w-full rounded disabled:opacity-75 text-white"
                        onClick={(e) => JoinFunc(e)}
                        disabled={disable}
                    >회원가입</button>
                </fieldset>
            </form>
        </section>
    )
}

export default Register
