import { useState } from 'react'

const Etc = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        birthDate: '',
        selectOption: '', // 라디오 버튼 선택을 위한 상태
        occupation: '', // 드롭다운 선택을 위한 상태
        selectedOptions: [], // 중복선택
        file: null,
    });
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const value = e.target.value;
        setSelectedOptions(
            e.target.checked
                ? [...selectedOptions, value]
                : selectedOptions.filter(option => option !== value)
        );
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            file: e.target.files[0], // 파일 입력에서 첫 번째 파일을 상태에 설정합니다.
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 폼 제출 로직 추가

        const dataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            dataToSend.append(key, value);
        });

        console.log(formData);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <div>
                        <label htmlFor="name">이름</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            autoComplete='off'
                        />
                    </div>
                    <div>
                        <label htmlFor="age">나이</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            required
                            autoComplete='off'
                        />
                    </div>
                    <div>
                        <label htmlFor="birthDate">생년월일</label>
                        <input
                            type="date"
                            id="birthDate"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            required
                            autoComplete='off'
                        />
                    </div>
                </fieldset>
                {/* 추가 필드가 있다면 여기에 정의합니다. */}
                <button type="submit">등록</button>
            </form>

            <form onSubmit={handleSubmit}>
                {/* 드롭다운 메뉴 */}
                <fieldset>
                    <label htmlFor="occupation">선택</label>
                    <select
                        name="occupation"
                        id="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                        required
                        autoComplete='off'
                    >
                        <option value="">(선택)</option>
                        <option value="developer">선택1</option>
                        <option value="designer">선택2</option>
                        <option value="manager">선택3</option>
                        {/* 여기에 더 많은 옵션을 추가할 수 있습니다. */}
                    </select>
                </fieldset>
                <button type="submit">등록</button>
            </form>

            {/* 옵션 선택 (단일) */}
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>옵션 선택 (단일)</legend>
                    <div>
                        <input
                            type="radio"
                            id="selectOne"
                            name="selectOption"
                            value="one"
                            checked={formData.selectOption === 'one'}
                            onChange={handleChange}
                        />
                        <label htmlFor="selectOne">선택1</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="selectTwo"
                            name="selectOption"
                            value="two"
                            checked={formData.selectOption === 'two'}
                            onChange={handleChange}
                        />
                        <label htmlFor="selectTwo">선택2</label>
                    </div>
                </fieldset>
                <button type="submit">등록</button>
            </form>

            {/* 복수 선택 체크박스 */}
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>옵션 선택(복수)</legend>
                    <label>
                        <input
                            type="checkbox"
                            value="option1"
                            checked={selectedOptions.includes('option1')}
                            onChange={handleCheckboxChange}
                        />
                        옵션1
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="option2"
                            checked={selectedOptions.includes('option2')}
                            onChange={handleCheckboxChange}
                        />
                        옵션2
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="option3"
                            checked={selectedOptions.includes('option3')}
                            onChange={handleCheckboxChange}
                        />
                        옵션3
                    </label>
                </fieldset>
                <button type="submit">등록</button>
            </form>

            {/* 파일올리기 */}
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>파일 올리기</legend>
                    <div>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            onChange={handleFileChange}
                        />
                    </div>
                </fieldset>
                <button type="submit">등록</button>
            </form>
        </>
    )
}

export default Etc
