import React, { useState } from 'react';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
        <div className='px-5 py-3 bg-gray-50 border-b border-gray-200'>
            <h2 className='text-sm font-semibold text-gray-700 uppercase tracking-wider'>{title}</h2>
        </div>
        <div className='p-5'>{children}</div>
    </div>
);

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <label className='block text-sm font-medium text-gray-700 mb-1'>
        {children}
        {required && <span className='text-red-500 ml-0.5'>*</span>}
    </label>
);

const inputBase = 'w-full rounded-lg border px-3 py-2 text-sm text-gray-800 outline-none transition-colors focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500';
const inputDefault = `${inputBase} border-gray-300`;
const inputError = `${inputBase} border-red-400 bg-red-50 focus:ring-red-400/30 focus:border-red-400`;
const inputSuccess = `${inputBase} border-green-400 bg-green-50`;
const inputDisabled = `${inputBase} border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed`;

export default function FormsPage() {
    const [contact, setContact] = useState({ name: '', email: '', phone: '', message: '', agree: false });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);

    const [radioVal, setRadioVal] = useState('');
    const [checkVals, setCheckVals] = useState<string[]>([]);
    const [selectVal, setSelectVal] = useState('');
    const [rangeVal, setRangeVal] = useState(50);
    const [date, setDate] = useState('');

    const validate = () => {
        const e: Record<string, string> = {};
        if (!contact.name.trim()) e.name = '이름을 입력해주세요.';
        if (!contact.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = '올바른 이메일 형식이 아닙니다.';
        if (!contact.phone.match(/^01[016789]-?\d{3,4}-?\d{4}$/)) e.phone = '올바른 전화번호 형식이 아닙니다.';
        if (contact.message.length < 10) e.message = '10자 이상 입력해주세요.';
        if (!contact.agree) e.agree = '이용약관에 동의해주세요.';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) setSubmitted(true);
    };

    const toggleCheck = (v: string) =>
        setCheckVals(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

    return (
        <div className='section_wrap flex flex-col gap-6'>
            <h1 className='text-xl font-bold text-gray-800'>Forms 컴포넌트</h1>

            {/* 기본 인풋 타입 */}
            <Section title="기본 Input 타입">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {[
                        { label: '텍스트', type: 'text', placeholder: '이름 입력' },
                        { label: '이메일', type: 'email', placeholder: 'example@email.com' },
                        { label: '비밀번호', type: 'password', placeholder: '비밀번호 입력' },
                        { label: '전화번호', type: 'tel', placeholder: '010-0000-0000' },
                        { label: '숫자', type: 'number', placeholder: '숫자 입력' },
                        { label: 'URL', type: 'url', placeholder: 'https://' },
                        { label: '날짜', type: 'date', placeholder: '' },
                        { label: '시간', type: 'time', placeholder: '' },
                    ].map(({ label, type, placeholder }) => (
                        <div key={type}>
                            <Label>{label}</Label>
                            <input type={type} placeholder={placeholder} className={inputDefault} />
                        </div>
                    ))}
                </div>
            </Section>

            {/* 상태별 인풋 */}
            <Section title="Input 상태">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <Label>기본</Label>
                        <input type='text' placeholder='기본 입력' className={inputDefault} />
                    </div>
                    <div>
                        <Label>포커스 (클릭해보세요)</Label>
                        <input type='text' placeholder='클릭시 파란 테두리' className={inputDefault} />
                    </div>
                    <div>
                        <Label>오류 상태</Label>
                        <input type='text' defaultValue='잘못된 입력' className={inputError} />
                        <p className='text-xs text-red-500 mt-1'>올바른 형식으로 입력해주세요.</p>
                    </div>
                    <div>
                        <Label>성공 상태</Label>
                        <input type='text' defaultValue='올바른 입력' className={inputSuccess} />
                        <p className='text-xs text-green-600 mt-1'>사용 가능한 아이디입니다.</p>
                    </div>
                    <div>
                        <Label>비활성화</Label>
                        <input type='text' defaultValue='수정 불가' className={inputDisabled} disabled />
                    </div>
                    <div>
                        <Label>읽기 전용</Label>
                        <input type='text' defaultValue='읽기만 가능' className={inputDefault} readOnly />
                    </div>
                </div>
            </Section>

            {/* Select */}
            <Section title="Select / Dropdown">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <Label required>부서 선택</Label>
                        <select
                            value={selectVal}
                            onChange={e => setSelectVal(e.target.value)}
                            className={`${inputDefault} bg-white cursor-pointer`}
                        >
                            <option value=''>선택해주세요</option>
                            <option value='dev'>개발팀</option>
                            <option value='design'>디자인팀</option>
                            <option value='pm'>기획팀</option>
                            <option value='qa'>QA팀</option>
                        </select>
                        {selectVal && (
                            <p className='text-xs text-blue-600 mt-1'>선택됨: {selectVal}</p>
                        )}
                    </div>
                    <div>
                        <Label>다중 선택 (Ctrl+클릭)</Label>
                        <select multiple className={`${inputDefault} h-28`}>
                            <option>JavaScript</option>
                            <option>TypeScript</option>
                            <option>React</option>
                            <option>Vue</option>
                            <option>Next.js</option>
                        </select>
                    </div>
                </div>
            </Section>

            {/* Textarea */}
            <Section title="Textarea">
                <Label required>메모</Label>
                <textarea
                    placeholder='내용을 입력해주세요. (최대 500자)'
                    maxLength={500}
                    rows={4}
                    className={`${inputDefault} resize-none`}
                    onChange={e => setContact(prev => ({ ...prev, message: e.target.value }))}
                />
                <p className='text-xs text-gray-400 mt-1 text-right'>{contact.message.length} / 500</p>
            </Section>

            {/* Radio */}
            <Section title="Radio 버튼">
                <Label required>배송 방법</Label>
                <div className='flex flex-wrap gap-3 mt-2'>
                    {[
                        { value: 'standard', label: '일반 배송 (2~3일)', desc: '무료' },
                        { value: 'express', label: '빠른 배송 (1일)', desc: '3,000원' },
                        { value: 'sameday', label: '당일 배송', desc: '5,000원' },
                    ].map(opt => (
                        <label
                            key={opt.value}
                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                radioVal === opt.value
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            <input
                                type='radio'
                                name='delivery'
                                value={opt.value}
                                checked={radioVal === opt.value}
                                onChange={() => setRadioVal(opt.value)}
                                className='mt-0.5 accent-blue-600'
                            />
                            <div>
                                <p className='text-sm font-medium text-gray-800'>{opt.label}</p>
                                <p className='text-xs text-gray-400'>{opt.desc}</p>
                            </div>
                        </label>
                    ))}
                </div>
            </Section>

            {/* Checkbox */}
            <Section title="Checkbox">
                <Label>관심 기술 스택 (복수 선택)</Label>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-2 mt-2'>
                    {['React', 'Vue', 'Angular', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Java'].map(tech => (
                        <label key={tech} className='flex items-center gap-2 cursor-pointer group'>
                            <input
                                type='checkbox'
                                checked={checkVals.includes(tech)}
                                onChange={() => toggleCheck(tech)}
                                className='w-4 h-4 rounded accent-blue-600'
                            />
                            <span className={`text-sm transition-colors ${checkVals.includes(tech) ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                                {tech}
                            </span>
                        </label>
                    ))}
                </div>
                {checkVals.length > 0 && (
                    <div className='mt-3 flex flex-wrap gap-1.5'>
                        {checkVals.map(v => (
                            <span key={v} className='px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium'>
                                {v}
                            </span>
                        ))}
                    </div>
                )}
            </Section>

            {/* Range */}
            <Section title="Range Slider">
                <Label>예산 설정</Label>
                <input
                    type='range'
                    min={0} max={100} value={rangeVal}
                    onChange={e => setRangeVal(Number(e.target.value))}
                    className='w-full accent-blue-600 mt-2'
                />
                <div className='flex justify-between text-xs text-gray-400 mt-1'>
                    <span>0만원</span>
                    <span className='text-blue-600 font-semibold'>{rangeVal}만원</span>
                    <span>100만원</span>
                </div>
            </Section>

            {/* 파일 업로드 */}
            <Section title="파일 업로드">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <Label>기본 파일 선택</Label>
                        <input type='file' className='w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer' />
                    </div>
                    <div>
                        <Label>이미지만 선택</Label>
                        <input type='file' accept='image/*' className='w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer' />
                    </div>
                </div>
            </Section>

            {/* 완성된 폼 예제 */}
            <Section title="완성 예제 — 문의 폼 (유효성 검사 포함)">
                {submitted ? (
                    <div className='py-10 text-center'>
                        <div className='mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-green-50'>
                            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor' className='w-7 h-7 text-green-500'>
                                <path strokeLinecap='round' strokeLinejoin='round' d='m4.5 12.75 6 6 9-13.5' />
                            </svg>
                        </div>
                        <p className='text-lg font-semibold text-gray-800'>문의가 접수되었습니다.</p>
                        <p className='text-sm text-gray-500 mt-1'>빠른 시일 내에 답변 드리겠습니다.</p>
                        <button onClick={() => { setSubmitted(false); setContact({ name: '', email: '', phone: '', message: '', agree: false }); setErrors({}); }} className='mt-4 text-sm text-blue-600 underline'>다시 작성하기</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                            <Label required>이름</Label>
                            <input
                                type='text' placeholder='홍길동'
                                value={contact.name}
                                onChange={e => setContact(p => ({ ...p, name: e.target.value }))}
                                className={errors.name ? inputError : inputDefault}
                            />
                            {errors.name && <p className='text-xs text-red-500 mt-1'>{errors.name}</p>}
                        </div>
                        <div>
                            <Label required>이메일</Label>
                            <input
                                type='email' placeholder='example@email.com'
                                value={contact.email}
                                onChange={e => setContact(p => ({ ...p, email: e.target.value }))}
                                className={errors.email ? inputError : inputDefault}
                            />
                            {errors.email && <p className='text-xs text-red-500 mt-1'>{errors.email}</p>}
                        </div>
                        <div>
                            <Label required>전화번호</Label>
                            <input
                                type='tel' placeholder='010-0000-0000'
                                value={contact.phone}
                                onChange={e => setContact(p => ({ ...p, phone: e.target.value }))}
                                className={errors.phone ? inputError : inputDefault}
                            />
                            {errors.phone && <p className='text-xs text-red-500 mt-1'>{errors.phone}</p>}
                        </div>
                        <div className='md:col-span-2'>
                            <Label required>문의 내용</Label>
                            <textarea
                                placeholder='문의하실 내용을 입력해주세요. (10자 이상)'
                                rows={4}
                                value={contact.message}
                                onChange={e => setContact(p => ({ ...p, message: e.target.value }))}
                                className={`${errors.message ? inputError : inputDefault} resize-none`}
                            />
                            {errors.message && <p className='text-xs text-red-500 mt-1'>{errors.message}</p>}
                        </div>
                        <div className='md:col-span-2'>
                            <label className='flex items-start gap-2 cursor-pointer'>
                                <input
                                    type='checkbox'
                                    checked={contact.agree}
                                    onChange={e => setContact(p => ({ ...p, agree: e.target.checked }))}
                                    className='w-4 h-4 mt-0.5 accent-blue-600'
                                />
                                <span className='text-sm text-gray-600'>
                                    <span className='text-blue-600 underline cursor-pointer'>이용약관</span> 및{' '}
                                    <span className='text-blue-600 underline cursor-pointer'>개인정보처리방침</span>에 동의합니다.
                                </span>
                            </label>
                            {errors.agree && <p className='text-xs text-red-500 mt-1'>{errors.agree}</p>}
                        </div>
                        <div className='md:col-span-2 flex justify-end gap-2'>
                            <button type='button' onClick={() => { setContact({ name: '', email: '', phone: '', message: '', agree: false }); setErrors({}); }} className='px-5 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors'>
                                초기화
                            </button>
                            <button type='submit' className='px-6 py-2 text-sm rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors font-medium'>
                                제출하기
                            </button>
                        </div>
                    </form>
                )}
            </Section>
        </div>
    );
}
