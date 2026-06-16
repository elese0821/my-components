import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import instance from '../../services/instance';
import {
    PlusIcon, TrashIcon,
    ChevronUpIcon, ChevronDownIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

// ── 초기값 헬퍼 ──────────────────────────────────────────────
const emptyOption = (orderNo) => ({ answerTitle: '', answerWeight: 1, orderNo });
const emptyQuestion = (orderNo) => ({
    _id: Date.now() + Math.random(),
    questTitle: '',
    questDesc: '',
    questType: 'S',
    orderNo,
    options: [emptyOption(1), emptyOption(2)],
});

// ── 미리보기 ─────────────────────────────────────────────────
function Preview({ title, contents, questions }) {
    const [answers, setAnswers] = useState({});

    return (
        <div className='flex flex-col gap-4'>
            {/* 설문 헤더 */}
            <div className='rounded-xl p-4 text-white' style={{ background: 'linear-gradient(135deg,#4f46e5,#3b82f6)' }}>
                <p className='text-xs font-medium opacity-70 mb-1'>미리보기</p>
                <h2 className='text-base font-bold leading-snug'>{title || '(제목 없음)'}</h2>
                {contents && <p className='text-xs opacity-80 mt-1.5'>{contents}</p>}
            </div>

            {questions.length === 0 ? (
                <div className='text-center py-6 text-gray-300 text-xs'>질문을 추가하면 여기에 표시됩니다.</div>
            ) : (
                questions.map((q, i) => (
                    <div key={q._id} className='bg-white border border-gray-200 rounded-xl p-3.5'>
                        <div className='flex items-center gap-1.5 mb-2'>
                            <span className='text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full'>Q{i + 1}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${q.questType === 'S' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                                {q.questType === 'S' ? '객관식' : '주관식'}
                            </span>
                        </div>
                        <p className='text-sm font-medium text-gray-800 mb-1'>{q.questTitle || '(질문 없음)'}</p>
                        {q.questDesc && <p className='text-xs text-gray-400 mb-2'>{q.questDesc}</p>}

                        {q.questType === 'S' ? (
                            <div className='flex flex-col gap-1.5'>
                                {q.options.map((opt, oi) => (
                                    <label key={oi} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors text-xs ${
                                        answers[q._id] === oi ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-gray-200 text-gray-600'
                                    }`}>
                                        <input type='radio' name={`prev_${q._id}`} className='accent-blue-500'
                                            checked={answers[q._id] === oi}
                                            onChange={() => setAnswers(a => ({ ...a, [q._id]: oi }))} />
                                        <span className='flex-1'>{opt.answerTitle || `선택지 ${oi + 1}`}</span>
                                        <span className='text-gray-300 text-[10px]'>{opt.answerWeight}점</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <textarea rows={2} placeholder='응답자가 직접 입력합니다.' disabled
                                className='w-full border border-gray-100 rounded-lg px-2.5 py-2 text-xs text-gray-400 resize-none bg-gray-50' />
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────
export default function SurveyCreatePage() {
    const navigate = useNavigate();
    const ctx = useOutletContext();
    const reload = ctx?.reload;

    const [title,    setTitle]    = useState('');
    const [contents, setContents] = useState('');
    const [questions, setQuestions] = useState([emptyQuestion(1)]);
    const [loading,  setLoading]  = useState(false);
    const [errors,   setErrors]   = useState({});
    const [tab,      setTab]      = useState('edit'); // mobile: 'edit' | 'preview'
    const [submitErr, setSubmitErr] = useState('');

    // ── 질문 CRUD ─────────────────────────────────────────
    const addQuestion = () =>
        setQuestions(p => [...p, emptyQuestion(p.length + 1)]);

    const removeQuestion = (idx) =>
        setQuestions(p => p.filter((_, i) => i !== idx).map((q, i) => ({ ...q, orderNo: i + 1 })));

    const updQ = (idx, key, val) =>
        setQuestions(p => p.map((q, i) => i === idx ? { ...q, [key]: val } : q));

    const moveQ = (idx, dir) => {
        const next = idx + dir;
        if (next < 0 || next >= questions.length) return;
        const arr = [...questions];
        [arr[idx], arr[next]] = [arr[next], arr[idx]];
        setQuestions(arr.map((q, i) => ({ ...q, orderNo: i + 1 })));
    };

    // ── 선택지 CRUD ───────────────────────────────────────
    const addOpt = (qi) =>
        setQuestions(p => p.map((q, i) =>
            i === qi ? { ...q, options: [...q.options, emptyOption(q.options.length + 1)] } : q
        ));

    const removeOpt = (qi, oi) =>
        setQuestions(p => p.map((q, i) =>
            i === qi ? {
                ...q,
                options: q.options.filter((_, j) => j !== oi).map((o, j) => ({ ...o, orderNo: j + 1 }))
            } : q
        ));

    const updOpt = (qi, oi, key, val) =>
        setQuestions(p => p.map((q, i) =>
            i === qi ? {
                ...q,
                options: q.options.map((o, j) => j === oi ? { ...o, [key]: val } : o)
            } : q
        ));

    // ── 유효성 검사 ───────────────────────────────────────
    const validate = () => {
        const e = {};
        if (!title.trim()) e.title = '설문 제목을 입력해주세요.';
        if (!questions.length) e.questions = '질문을 1개 이상 추가해주세요.';
        questions.forEach((q, i) => {
            if (!q.questTitle.trim()) e[`q${i}`] = '질문 제목 필요';
            if (q.questType === 'S' && q.options.filter(o => o.answerTitle.trim()).length < 2)
                e[`o${i}`] = '선택지 2개 이상 필요';
        });
        setErrors(e);
        return !Object.keys(e).length;
    };

    // ── 제출 ─────────────────────────────────────────────
    const handleSubmit = async () => {
        setSubmitErr('');
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await instance.post('/user/survey/create', { title, contents, questions });
            if (res.data.result === 'success') {
                reload?.();
                navigate('/survey');
            } else {
                setSubmitErr('설문 저장에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (e) {
            setSubmitErr('네트워크 오류가 발생했습니다.');
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const inp = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white transition-colors';
    const hasErrors = Object.keys(errors).length > 0;

    return (
        <div className='max-w-5xl mx-auto flex flex-col gap-5'>

            {/* ── 상단 헤더 ── */}
            <div className='flex items-center justify-between gap-3 flex-wrap'>
                <div className='flex items-center gap-2.5'>
                    <button
                        onClick={() => navigate('/survey')}
                        className='p-1.5 rounded-lg hover:bg-gray-100 transition-colors'
                        aria-label='뒤로 가기'
                    >
                        <ArrowLeftIcon className='h-5 w-5 text-gray-500' />
                    </button>
                    <div>
                        <h1 className='text-xl font-bold text-gray-900 leading-tight'>설문 만들기</h1>
                        <p className='text-xs text-gray-400'>질문 {questions.length}개</p>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    {/* 모바일 탭 */}
                    <div className='flex bg-gray-100 rounded-lg p-0.5 md:hidden'>
                        {[{ k: 'edit', l: '편집' }, { k: 'preview', l: '미리보기' }].map(t => (
                            <button key={t.k} onClick={() => setTab(t.k)}
                                className={`px-3 py-1 text-xs rounded-md transition-colors ${tab === t.k ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-400'}`}>
                                {t.l}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => navigate('/survey')}
                        className='hidden sm:inline-flex px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors'
                    >
                        취소
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className='inline-flex items-center gap-1.5 px-5 py-2 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors'
                    >
                        <CheckCircleIcon className='h-4 w-4' />
                        {loading ? '저장 중…' : '설문 만들기'}
                    </button>
                </div>
            </div>

            {/* 제출 오류 */}
            {submitErr && (
                <div className='px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm'>
                    {submitErr}
                </div>
            )}

            {/* ── 본문: 편집 + 미리보기 ── */}
            <div className='flex gap-6 items-start'>

                {/* 편집 영역 */}
                <div className={`flex-1 min-w-0 flex flex-col gap-4 ${tab === 'preview' ? 'hidden md:flex' : 'flex'}`}>

                    {/* 기본 정보 */}
                    <div className='bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3'>
                        <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>기본 정보</p>
                        <div>
                            <input
                                placeholder='설문 제목 *'
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className={`${inp} text-base font-medium ${errors.title ? 'border-red-400' : ''}`}
                            />
                            {errors.title && <p className='text-xs text-red-500 mt-1'>{errors.title}</p>}
                        </div>
                        <textarea
                            placeholder='설문 설명 (선택)'
                            value={contents}
                            onChange={e => setContents(e.target.value)}
                            rows={2}
                            className={`${inp} resize-none`}
                        />
                    </div>

                    {/* 질문 목록 */}
                    <div className='flex flex-col gap-3'>
                        {errors.questions && <p className='text-xs text-red-500 px-1'>{errors.questions}</p>}

                        {questions.map((q, qi) => (
                            <div
                                key={q._id}
                                className={`bg-white rounded-xl border p-4 flex flex-col gap-3 ${
                                    errors[`q${qi}`] || errors[`o${qi}`] ? 'border-red-300' : 'border-gray-200'
                                }`}
                            >
                                {/* 질문 헤더 행 */}
                                <div className='flex items-center gap-2'>
                                    <span className='text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full shrink-0'>
                                        Q{q.orderNo}
                                    </span>
                                    <div className='flex gap-1 ml-auto'>
                                        <button onClick={() => moveQ(qi, -1)} disabled={qi === 0}
                                            className='p-1 rounded hover:bg-gray-100 disabled:opacity-30'>
                                            <ChevronUpIcon className='h-3.5 w-3.5 text-gray-400' />
                                        </button>
                                        <button onClick={() => moveQ(qi, 1)} disabled={qi === questions.length - 1}
                                            className='p-1 rounded hover:bg-gray-100 disabled:opacity-30'>
                                            <ChevronDownIcon className='h-3.5 w-3.5 text-gray-400' />
                                        </button>
                                        <button onClick={() => removeQuestion(qi)}
                                            className='p-1 rounded hover:bg-red-50'>
                                            <TrashIcon className='h-3.5 w-3.5 text-red-400' />
                                        </button>
                                    </div>
                                </div>

                                {/* 질문 제목 */}
                                <input
                                    placeholder='질문을 입력하세요 *'
                                    value={q.questTitle}
                                    onChange={e => updQ(qi, 'questTitle', e.target.value)}
                                    className={`${inp} ${errors[`q${qi}`] ? 'border-red-300' : ''}`}
                                />
                                {errors[`q${qi}`] && <p className='text-xs text-red-500 -mt-2'>{errors[`q${qi}`]}</p>}

                                {/* 부가 설명 */}
                                <input
                                    placeholder='부가 설명 (선택)'
                                    value={q.questDesc}
                                    onChange={e => updQ(qi, 'questDesc', e.target.value)}
                                    className={`${inp} text-xs text-gray-500`}
                                />

                                {/* 유형 선택 */}
                                <div className='flex gap-1.5'>
                                    {[{ v: 'S', l: '객관식' }, { v: 'T', l: '주관식' }].map(t => (
                                        <label key={t.v} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                                            q.questType === t.v
                                                ? 'border-blue-400 bg-blue-50 text-blue-700 font-semibold'
                                                : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                        }`}>
                                            <input type='radio' name={`type_${q._id}`} value={t.v}
                                                checked={q.questType === t.v}
                                                onChange={() => updQ(qi, 'questType', t.v)}
                                                className='hidden' />
                                            {t.l}
                                        </label>
                                    ))}
                                </div>

                                {/* 선택지 (객관식) */}
                                {q.questType === 'S' && (
                                    <div className='flex flex-col gap-2'>
                                        {errors[`o${qi}`] && <p className='text-xs text-red-500'>{errors[`o${qi}`]}</p>}

                                        {/* 컬럼 헤더 */}
                                        <div className='grid gap-2 px-0.5 text-[10px] text-gray-400 font-medium' style={{ gridTemplateColumns: '1.5rem 1fr 4.5rem 1.5rem' }}>
                                            <span className='text-center'>#</span>
                                            <span>선택지 내용</span>
                                            <span className='text-center'>점수</span>
                                            <span />
                                        </div>

                                        {q.options.map((opt, oi) => (
                                            <div key={oi} className='grid gap-2 items-center' style={{ gridTemplateColumns: '1.5rem 1fr 4.5rem 1.5rem' }}>
                                                <span className='text-xs text-gray-400 text-center'>{oi + 1}</span>
                                                <input
                                                    placeholder={`선택지 ${oi + 1}`}
                                                    value={opt.answerTitle}
                                                    onChange={e => updOpt(qi, oi, 'answerTitle', e.target.value)}
                                                    className={`${inp} text-xs`}
                                                />
                                                <input
                                                    type='number'
                                                    min={0}
                                                    max={99}
                                                    value={opt.answerWeight}
                                                    onChange={e => updOpt(qi, oi, 'answerWeight', Number(e.target.value))}
                                                    className='rounded-lg border border-gray-200 px-2 py-2 text-xs text-center w-full outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white'
                                                />
                                                {q.options.length > 2 ? (
                                                    <button onClick={() => removeOpt(qi, oi)}
                                                        className='p-0.5 hover:bg-red-50 rounded flex justify-center'>
                                                        <XMarkIcon className='h-3.5 w-3.5 text-red-400' />
                                                    </button>
                                                ) : (
                                                    <span />
                                                )}
                                            </div>
                                        ))}

                                        <button onClick={() => addOpt(qi)}
                                            className='self-start text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 mt-0.5'>
                                            <PlusIcon className='h-3.5 w-3.5' />선택지 추가
                                        </button>
                                    </div>
                                )}

                                {/* 주관식 안내 */}
                                {q.questType === 'T' && (
                                    <div className='rounded-lg border border-dashed border-gray-200 px-3 py-2 text-xs text-gray-400 bg-gray-50'>
                                        응답자가 직접 입력합니다.
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* 질문 추가 버튼 */}
                        <button
                            onClick={addQuestion}
                            className='flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/30 transition-all'
                        >
                            <PlusIcon className='h-4 w-4' />질문 추가
                        </button>
                    </div>

                    {hasErrors && (
                        <p className='text-xs text-red-500 text-right'>입력 오류를 확인하고 다시 시도해주세요.</p>
                    )}
                </div>

                {/* ── 오른쪽: 미리보기 (데스크탑 고정 패널) ── */}
                <div className={`w-72 shrink-0 ${tab === 'edit' ? 'hidden md:block' : 'block'}`}>
                    <div className='sticky top-4 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden'>
                        <div className='px-4 py-3 border-b border-gray-100 bg-white'>
                            <p className='text-xs font-semibold text-gray-500'>실시간 미리보기</p>
                        </div>
                        <div className='p-4 overflow-y-auto' style={{ maxHeight: 'calc(100vh - 200px)' }}>
                            <Preview title={title} contents={contents} questions={questions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
