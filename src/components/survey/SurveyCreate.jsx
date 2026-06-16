import React, { useState } from 'react';
import instance from '../../services/instance';
import {
    XMarkIcon, PlusIcon, TrashIcon,
    ChevronUpIcon, ChevronDownIcon,
    EyeIcon, PencilSquareIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const emptyOption = (orderNo) => ({ answerTitle: '', answerWeight: 0, orderNo });
const emptyQuestion = (orderNo) => ({
    _id: Date.now() + Math.random(),
    questTitle: '',
    questDesc: '',
    questType: 'S',
    orderNo,
    options: [emptyOption(1), emptyOption(2)],
});

// ── 미리보기 컴포넌트 ─────────────────────────────────────
function Preview({ title, contents, questions }) {
    const [answers, setAnswers] = useState({});

    return (
        <div className='flex flex-col gap-4'>
            {/* 설문 헤더 */}
            <div className='bg-blue-600 rounded-xl p-5 text-white'>
                <p className='text-xs font-medium opacity-70 mb-1'>설문 미리보기</p>
                <h2 className='text-lg font-bold leading-snug'>{title || '(제목 없음)'}</h2>
                {contents && <p className='text-sm opacity-80 mt-2'>{contents}</p>}
            </div>

            {/* 질문 목록 */}
            {questions.length === 0 ? (
                <div className='text-center py-8 text-gray-300 text-sm'>질문을 추가하면 여기에 표시됩니다.</div>
            ) : (
                questions.map((q, i) => (
                    <div key={q._id} className='bg-white border border-gray-200 rounded-xl p-4'>
                        <div className='flex items-start justify-between mb-3'>
                            <div>
                                <span className='text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mr-2'>Q{i + 1}</span>
                                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${q.questType === 'S' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                                    {q.questType === 'S' ? '객관식' : '주관식'}
                                </span>
                            </div>
                        </div>
                        <p className='text-sm font-medium text-gray-800 mb-1'>{q.questTitle || '(질문 없음)'}</p>
                        {q.questDesc && <p className='text-xs text-gray-400 mb-3'>{q.questDesc}</p>}

                        {q.questType === 'S' ? (
                            <div className='flex flex-col gap-2'>
                                {q.options.map((opt, oi) => (
                                    <label key={oi} className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-colors ${
                                        answers[q._id] === oi ? 'border-blue-400 bg-blue-50' : 'border-gray-100 hover:border-gray-200'
                                    }`}>
                                        <input type='radio' name={`prev_${q._id}`} className='accent-blue-500'
                                            checked={answers[q._id] === oi}
                                            onChange={() => setAnswers(a => ({ ...a, [q._id]: oi }))} />
                                        <span className='text-sm text-gray-700'>{opt.answerTitle || `선택지 ${oi + 1}`}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <textarea rows={2} placeholder='답변을 입력하세요.' disabled
                                className='w-full border border-gray-100 rounded-lg px-3 py-2 text-sm text-gray-400 resize-none bg-gray-50' />
                        )}
                    </div>
                ))
            )}

            {questions.length > 0 && (
                <button disabled className='w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium opacity-50 cursor-not-allowed'>
                    제출하기 (미리보기)
                </button>
            )}
        </div>
    );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────
export default function SurveyCreate({ onClose, onCreated }) {
    const [title, setTitle] = useState('');
    const [contents, setContents] = useState('');
    const [questions, setQuestions] = useState([emptyQuestion(1)]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [tab, setTab] = useState('edit'); // 'edit' | 'preview'

    // ── 질문 조작 ──────────────────────────────────────────
    const addQuestion = () => setQuestions(p => [...p, emptyQuestion(p.length + 1)]);
    const removeQuestion = (idx) => setQuestions(p => p.filter((_, i) => i !== idx).map((q, i) => ({ ...q, orderNo: i + 1 })));
    const updQ = (idx, key, val) => setQuestions(p => p.map((q, i) => i === idx ? { ...q, [key]: val } : q));
    const moveQ = (idx, dir) => {
        const next = idx + dir;
        if (next < 0 || next >= questions.length) return;
        const arr = [...questions];
        [arr[idx], arr[next]] = [arr[next], arr[idx]];
        setQuestions(arr.map((q, i) => ({ ...q, orderNo: i + 1 })));
    };

    // ── 선택지 조작 ──────────────────────────────────────────
    const addOpt = (qi) => setQuestions(p => p.map((q, i) => i === qi ? { ...q, options: [...q.options, emptyOption(q.options.length + 1)] } : q));
    const removeOpt = (qi, oi) => setQuestions(p => p.map((q, i) => i === qi ? { ...q, options: q.options.filter((_, j) => j !== oi).map((o, j) => ({ ...o, orderNo: j + 1 })) } : q));
    const updOpt = (qi, oi, val) => setQuestions(p => p.map((q, i) => i === qi ? { ...q, options: q.options.map((o, j) => j === oi ? { ...o, answerTitle: val } : o) } : q));

    // ── 유효성 ──────────────────────────────────────────
    const validate = () => {
        const e = {};
        if (!title.trim()) e.title = '설문 제목을 입력해주세요.';
        if (!questions.length) e.questions = '질문을 1개 이상 추가해주세요.';
        questions.forEach((q, i) => {
            if (!q.questTitle.trim()) e[`q${i}`] = '질문 제목 필요';
            if (q.questType === 'S' && q.options.filter(o => o.answerTitle.trim()).length < 2) e[`o${i}`] = '선택지 2개 이상 필요';
        });
        setErrors(e);
        return !Object.keys(e).length;
    };

    const handleSubmit = async () => {
        if (!validate()) { setTab('edit'); return; }
        setLoading(true);
        try {
            const res = await instance.post('/user/survey/create', { title, contents, questions });
            if (res.data.result === 'success') { onCreated?.(); onClose(); }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const inp = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-white transition-colors';
    const hasErrors = Object.keys(errors).length > 0;

    return (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4' onClick={onClose}>
            <div className='bg-gray-50 rounded-2xl shadow-2xl w-full flex overflow-hidden' style={{ maxWidth: '900px', height: '88vh' }} onClick={e => e.stopPropagation()}>

                {/* ── 왼쪽: 편집 영역 ── */}
                <div className='flex flex-col flex-1 min-w-0 border-r border-gray-200'>
                    {/* 헤더 */}
                    <div className='flex items-center justify-between px-5 py-3.5 bg-white border-b border-gray-100'>
                        <div className='flex items-center gap-3'>
                            <h2 className='text-base font-bold text-gray-800'>설문 만들기</h2>
                            <span className='text-xs text-gray-400'>질문 {questions.length}개</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            {/* 탭: 모바일용 - 데스크탑에선 side-by-side */}
                            <div className='flex bg-gray-100 rounded-lg p-0.5 md:hidden'>
                                {[{ k: 'edit', icon: PencilSquareIcon, label: '편집' }, { k: 'preview', icon: EyeIcon, label: '미리보기' }].map(t => (
                                    <button key={t.k} onClick={() => setTab(t.k)}
                                        className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${tab === t.k ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-400'}`}>
                                        <t.icon className='h-3.5 w-3.5' />{t.label}
                                    </button>
                                ))}
                            </div>
                            <button onClick={onClose} className='p-1.5 rounded-lg hover:bg-gray-100 transition-colors'>
                                <XMarkIcon className='h-5 w-5 text-gray-400' />
                            </button>
                        </div>
                    </div>

                    {/* 편집 본문 */}
                    <div className='flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4'>
                        {/* 기본 정보 */}
                        <div className='bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3'>
                            <p className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>기본 정보</p>
                            <div>
                                <input placeholder='설문 제목 *' value={title} onChange={e => setTitle(e.target.value)}
                                    className={`${inp} text-base font-medium ${errors.title ? 'border-red-400' : ''}`} />
                                {errors.title && <p className='text-xs text-red-500 mt-1'>{errors.title}</p>}
                            </div>
                            <textarea placeholder='설문 설명 (선택)' value={contents} onChange={e => setContents(e.target.value)}
                                rows={2} className={`${inp} resize-none`} />
                        </div>

                        {/* 질문 목록 */}
                        <div className='flex flex-col gap-3'>
                            {errors.questions && <p className='text-xs text-red-500 px-1'>{errors.questions}</p>}
                            {questions.map((q, qi) => (
                                <div key={q._id} className={`bg-white rounded-xl border p-4 flex flex-col gap-3 ${errors[`q${qi}`] || errors[`o${qi}`] ? 'border-red-300' : 'border-gray-200'}`}>
                                    {/* 질문 헤더 */}
                                    <div className='flex items-center gap-2'>
                                        <span className='text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex-shrink-0'>Q{q.orderNo}</span>
                                        <div className='flex gap-1 ml-auto'>
                                            <button onClick={() => moveQ(qi, -1)} disabled={qi === 0} className='p-1 rounded hover:bg-gray-100 disabled:opacity-30'><ChevronUpIcon className='h-3.5 w-3.5 text-gray-400' /></button>
                                            <button onClick={() => moveQ(qi, 1)} disabled={qi === questions.length - 1} className='p-1 rounded hover:bg-gray-100 disabled:opacity-30'><ChevronDownIcon className='h-3.5 w-3.5 text-gray-400' /></button>
                                            <button onClick={() => removeQuestion(qi)} className='p-1 rounded hover:bg-red-50'><TrashIcon className='h-3.5 w-3.5 text-red-400' /></button>
                                        </div>
                                    </div>

                                    <input placeholder='질문을 입력하세요 *' value={q.questTitle} onChange={e => updQ(qi, 'questTitle', e.target.value)} className={`${inp} ${errors[`q${qi}`] ? 'border-red-300' : ''}`} />
                                    <input placeholder='보충 설명 (선택)' value={q.questDesc} onChange={e => updQ(qi, 'questDesc', e.target.value)} className={`${inp} text-xs text-gray-500`} />

                                    {/* 유형 선택 */}
                                    <div className='flex gap-1.5'>
                                        {[{ v: 'S', l: '객관식' }, { v: 'T', l: '주관식' }].map(t => (
                                            <label key={t.v} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${q.questType === t.v ? 'border-blue-400 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                                                <input type='radio' name={`type_${q._id}`} value={t.v} checked={q.questType === t.v} onChange={() => updQ(qi, 'questType', t.v)} className='hidden' />
                                                {t.l}
                                            </label>
                                        ))}
                                    </div>

                                    {/* 선택지 */}
                                    {q.questType === 'S' && (
                                        <div className='flex flex-col gap-1.5'>
                                            {errors[`o${qi}`] && <p className='text-xs text-red-500'>{errors[`o${qi}`]}</p>}
                                            {q.options.map((opt, oi) => (
                                                <div key={oi} className='flex items-center gap-2'>
                                                    <span className='w-4 text-xs text-gray-400 text-center'>{oi + 1}</span>
                                                    <input placeholder={`선택지 ${oi + 1}`} value={opt.answerTitle} onChange={e => updOpt(qi, oi, e.target.value)} className={`${inp} flex-1 text-xs`} />
                                                    {q.options.length > 2 && (
                                                        <button onClick={() => removeOpt(qi, oi)} className='p-1 hover:bg-red-50 rounded'><XMarkIcon className='h-3.5 w-3.5 text-red-400' /></button>
                                                    )}
                                                </div>
                                            ))}
                                            <button onClick={() => addOpt(qi)} className='self-start text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1 py-0.5'>
                                                <PlusIcon className='h-3.5 w-3.5' />선택지 추가
                                            </button>
                                        </div>
                                    )}
                                    {q.questType === 'T' && (
                                        <div className='rounded-lg border border-dashed border-gray-200 px-3 py-2 text-xs text-gray-400 bg-gray-50'>응답자가 직접 입력</div>
                                    )}
                                </div>
                            ))}

                            <button onClick={addQuestion} className='flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/30 transition-all w-full'>
                                <PlusIcon className='h-4 w-4' />질문 추가
                            </button>
                        </div>
                    </div>

                    {/* 하단 버튼 */}
                    <div className='px-5 py-3.5 bg-white border-t border-gray-100 flex items-center justify-between'>
                        {hasErrors && <p className='text-xs text-red-500'>입력 오류를 확인해주세요.</p>}
                        <div className='flex gap-2 ml-auto'>
                            <button onClick={onClose} className='px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors'>취소</button>
                            <button onClick={handleSubmit} disabled={loading}
                                className='px-5 py-2 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2'>
                                {loading ? '저장 중...' : (
                                    <><CheckCircleIcon className='h-4 w-4' />설문 만들기</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── 오른쪽: 미리보기 (데스크탑) ── */}
                <div className='hidden md:flex flex-col w-80 flex-shrink-0 bg-gray-100'>
                    <div className='px-4 py-3.5 bg-white border-b border-gray-100 flex items-center gap-2'>
                        <EyeIcon className='h-4 w-4 text-gray-400' />
                        <p className='text-sm font-medium text-gray-600'>실시간 미리보기</p>
                    </div>
                    <div className='flex-1 overflow-y-auto p-4'>
                        <Preview title={title} contents={contents} questions={questions} />
                    </div>
                </div>
            </div>
        </div>
    );
}
