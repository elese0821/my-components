import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import instance from '../../services/instance'
import Quest from './Quest'
import Buttons from '../common/forms/Buttons'
import Back from '../common/Back'
import {
    ExclamationCircleIcon,
    TrophyIcon,
} from '@heroicons/react/24/outline'

// ── 점수별 등급 ────────────────────────────────────────────────
function getGrade(pct) {
    if (pct >= 90) return { label: 'S', color: '#6366f1', bg: '#eef2ff', text: '최우수' }
    if (pct >= 75) return { label: 'A', color: '#3b82f6', bg: '#eff6ff', text: '우수' }
    if (pct >= 55) return { label: 'B', color: '#10b981', bg: '#f0fdf4', text: '양호' }
    if (pct >= 35) return { label: 'C', color: '#f59e0b', bg: '#fffbeb', text: '보통' }
    return            { label: 'D', color: '#ef4444', bg: '#fef2f2', text: '개선 필요' }
}

// ── 원형 게이지 ────────────────────────────────────────────────
function ScoreGauge({ pct, grade }) {
    const r = 54
    const circ = 2 * Math.PI * r
    const dash = (pct / 100) * circ

    return (
        <svg width='140' height='140' viewBox='0 0 140 140'>
            {/* 배경 트랙 */}
            <circle cx='70' cy='70' r={r} fill='none' stroke='#f3f4f6' strokeWidth='10' />
            {/* 진행 */}
            <circle
                cx='70' cy='70' r={r} fill='none'
                stroke={grade.color} strokeWidth='10'
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap='round'
                transform='rotate(-90 70 70)'
                style={{ transition: 'stroke-dasharray 0.8s ease' }}
            />
            {/* 등급 텍스트 */}
            <text x='70' y='64' textAnchor='middle' fontSize='28' fontWeight='700' fill={grade.color}>{grade.label}</text>
            <text x='70' y='82' textAnchor='middle' fontSize='12' fill='#9ca3af'>{Math.round(pct)}점</text>
        </svg>
    )
}

// ── 결과 화면 ──────────────────────────────────────────────────
function SurveyResult({ title, contents, groupedData }) {
    // 점수 계산 (객관식만)
    const objQuestions = Object.values(groupedData).filter(q => q.questType === 'S')
    const totalScore = objQuestions.reduce((sum, q) => {
        const chosen = q.answers.find(a => a.selIdx === q.userAnswer)
        return sum + (chosen?.answerWeight ?? 0)
    }, 0)
    const maxScore = objQuestions.reduce((sum, q) => {
        const maxW = Math.max(...q.answers.map(a => a.answerWeight ?? 0))
        return sum + maxW
    }, 0)
    const pct = maxScore > 0 ? (totalScore / maxScore) * 100 : 0
    const grade = getGrade(pct)

    const allQuestions = Object.values(groupedData).sort((a, b) => a.questOrderNo - b.questOrderNo)

    return (
        <div className='flex flex-col gap-6'>
            {/* 상단 요약 카드 */}
            <div
                className='rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6'
                style={{ background: grade.bg, border: `1px solid ${grade.color}22` }}
            >
                <ScoreGauge pct={pct} grade={grade} />

                <div className='flex-1 text-center sm:text-left'>
                    <div className='flex items-center gap-2 justify-center sm:justify-start mb-1'>
                        <TrophyIcon className='h-5 w-5' style={{ color: grade.color }} />
                        <span className='font-bold text-lg' style={{ color: grade.color }}>{grade.text}</span>
                    </div>
                    <h2 className='font-bold text-gray-800 text-xl mb-1'>{title}</h2>
                    <p className='text-sm text-gray-500 mb-3 line-clamp-2'>{contents}</p>
                    <div className='flex flex-wrap gap-4 justify-center sm:justify-start'>
                        <div className='text-center'>
                            <p className='text-2xl font-bold' style={{ color: grade.color }}>{totalScore}</p>
                            <p className='text-xs text-gray-400'>획득 점수</p>
                        </div>
                        <div className='w-px bg-gray-200' />
                        <div className='text-center'>
                            <p className='text-2xl font-bold text-gray-400'>{maxScore}</p>
                            <p className='text-xs text-gray-400'>만점</p>
                        </div>
                        <div className='w-px bg-gray-200' />
                        <div className='text-center'>
                            <p className='text-2xl font-bold text-gray-600'>{objQuestions.length}</p>
                            <p className='text-xs text-gray-400'>객관식 문항</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 등급 기준 안내 */}
            <div className='bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3 flex-wrap'>
                <span className='text-xs text-gray-400 shrink-0'>등급 기준</span>
                {[
                    { l: 'S', c: '#6366f1', r: '90% 이상' },
                    { l: 'A', c: '#3b82f6', r: '75% 이상' },
                    { l: 'B', c: '#10b981', r: '55% 이상' },
                    { l: 'C', c: '#f59e0b', r: '35% 이상' },
                    { l: 'D', c: '#ef4444', r: '35% 미만' },
                ].map(g => (
                    <span
                        key={g.l}
                        className='text-[11px] px-2.5 py-0.5 rounded-full font-medium'
                        style={{
                            background: grade.label === g.l ? g.c : '#f3f4f6',
                            color:      grade.label === g.l ? '#fff' : '#9ca3af',
                        }}
                    >
                        {g.l} {g.r}
                    </span>
                ))}
            </div>

            {/* 문항별 결과 */}
            <div className='flex flex-col gap-3'>
                <h3 className='font-semibold text-gray-800 text-sm'>문항별 답변</h3>
                {allQuestions.map(q => {
                    const chosen = q.questType === 'S'
                        ? q.answers.find(a => a.selIdx === q.userAnswer)
                        : null
                    const maxW = q.questType === 'S'
                        ? Math.max(...q.answers.map(a => a.answerWeight ?? 0))
                        : 0

                    return (
                        <div key={q.questIdx} className='bg-white rounded-xl border border-gray-200 p-4'>
                            <div className='flex items-start justify-between gap-2 mb-3'>
                                <div className='flex-1'>
                                    <span className='text-xs font-bold text-gray-400 mr-2'>Q{q.questOrderNo}.</span>
                                    <span className='text-sm font-medium text-gray-800'>{q.questTitle}</span>
                                </div>
                                {q.questType === 'S' && chosen && (
                                    <span
                                        className='shrink-0 text-xs font-bold px-2 py-0.5 rounded-full'
                                        style={{
                                            background: chosen.answerWeight === maxW ? '#dcfce7' : '#f3f4f6',
                                            color:      chosen.answerWeight === maxW ? '#16a34a' : '#6b7280',
                                        }}
                                    >
                                        {chosen.answerWeight}/{maxW}점
                                    </span>
                                )}
                            </div>

                            {q.questType === 'S' ? (
                                <div className='flex flex-col gap-1.5'>
                                    {q.answers
                                        .slice()
                                        .sort((a, b) => a.answerOrderNo - b.answerOrderNo)
                                        .map(a => {
                                            const isChosen = a.selIdx === q.userAnswer
                                            return (
                                                <div
                                                    key={a.selIdx}
                                                    className='flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm'
                                                    style={{
                                                        background: isChosen ? '#eff6ff' : '#fafafa',
                                                        border: `1px solid ${isChosen ? '#3b82f6' : '#f3f4f6'}`,
                                                        color: isChosen ? '#1d4ed8' : '#6b7280',
                                                        fontWeight: isChosen ? 600 : 400,
                                                    }}
                                                >
                                                    <div
                                                        className='w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0'
                                                        style={{ borderColor: isChosen ? '#3b82f6' : '#d1d5db' }}
                                                    >
                                                        {isChosen && (
                                                            <div className='w-2 h-2 rounded-full bg-blue-500' />
                                                        )}
                                                    </div>
                                                    <span className='flex-1'>{a.answerTitle}</span>
                                                    <span className='text-xs' style={{ color: isChosen ? '#3b82f6' : '#d1d5db' }}>
                                                        {a.answerWeight}점
                                                    </span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            ) : (
                                <div className='bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-700 border border-gray-100'>
                                    {q.userAnswer || <span className='text-gray-300 italic'>미응답</span>}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────
export default function SurveyDetail() {
    const location = useLocation()
    const navigate = useNavigate()
    const params = location.pathname.split('/').slice(-1)[0]
    const { contents, title, finishSurvey: initFinish } = location.state

    const [surveyData,   setSurveyData]   = useState([])
    const [answer,       setAnswer]       = useState([])
    const [finishSurvey, setFinishSurvey] = useState(initFinish)
    const [submitting,   setSubmitting]   = useState(false)
    const [submitErr,    setSubmitErr]    = useState('')

    const handleAnswer = (questIdx, questType, questAnswer) => {
        setAnswer(prev => {
            const next = [...prev]
            const idx  = next.findIndex(item => item.questIdx === questIdx)
            if (idx !== -1) next[idx] = { questIdx, questType, answers: questAnswer }
            else next.push({ questIdx, questType, answers: questAnswer })
            return next
        })
    }

    const fetchDetail = async (done) => {
        try {
            const url    = done ? '/user/survey/info/result' : '/user/survey/info'
            const params2 = done
                ? { surveyIdx: params, finishSurvey: 'Y' }
                : { surveyIdx: params }
            const res = await instance.get(url, { params: params2 })
            if (res.status === 200) setSurveyData(res.data.one)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => { fetchDetail(finishSurvey === 'Y') }, [params, finishSurvey])

    // 데이터 그룹화
    const groupedData = surveyData.reduce((acc, cur) => {
        const { questIdx, questOrderNo, questTitle, questDesc, questType,
                userAnswer, selIdx, answerTitle, answerWeight, answerOrderNo } = cur
        if (!acc[questIdx]) {
            acc[questIdx] = {
                questIdx, questTitle, questDesc, questType,
                questOrderNo,
                // 객관식(S)의 userAnswer 는 selIdx 와 비교하므로 항상 Number 로 정규화
                userAnswer: questType === 'S' && userAnswer != null ? Number(userAnswer) : userAnswer,
                finishSurvey,
                answers: [],
            }
        }
        // selIdx 도 Number 로 통일 → a.selIdx === q.userAnswer 비교 항상 성립
        acc[questIdx].answers.push({
            selIdx: selIdx != null ? Number(selIdx) : selIdx,
            answerTitle, answerWeight, answerOrderNo,
        })
        return acc
    }, {})

    const handleSubmit = async () => {
        const answeredIds = answer.map(item => String(item.questIdx))
        const allIds      = Object.keys(groupedData)
        const missing     = allIds.filter(key => !answeredIds.includes(key))

        if (missing.length > 0) {
            setSubmitErr(`미응답 항목이 ${missing.length}개 있습니다. 모두 응답해주세요.`)
            return
        }
        setSubmitting(true)
        setSubmitErr('')
        try {
            const res = await instance.post('/user/survey/info', {
                surveyIdx: params,
                contents:  answer,
            })
            if (res.status === 200) {
                // 결과 화면으로 전환
                setFinishSurvey('Y')
            } else {
                setSubmitErr('제출에 실패했습니다. 다시 시도해주세요.')
            }
        } catch (e) {
            setSubmitErr('네트워크 오류가 발생했습니다.')
            console.error(e)
        } finally {
            setSubmitting(false)
        }
    }

    const isFinished = finishSurvey === 'Y'

    return (
        <div className='flex flex-col gap-4 max-w-2xl mx-auto'>
            <Back />

            {/* 타이틀 바 */}
            <div className='flex items-center justify-between gap-3'>
                <h1 className='text-xl font-bold text-gray-800 leading-tight'>{title}</h1>
                <span className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full ${
                    isFinished
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                }`}>
                    {isFinished ? '✓ 응시완료' : '응시 중'}
                </span>
            </div>

            {/* 결과 or 설문 */}
            {isFinished ? (
                <SurveyResult
                    title={title}
                    contents={contents}
                    groupedData={groupedData}
                />
            ) : (
                <>
                    {/* 설명 */}
                    {contents && (
                        <div className='bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600 border border-gray-100'>
                            {contents}
                        </div>
                    )}

                    {/* 문항 */}
                    <div className='flex flex-col gap-4'>
                        {Object.keys(groupedData).map(questIdx => (
                            <Quest
                                key={questIdx}
                                questData={groupedData[questIdx]}
                                handleAnswer={handleAnswer}
                                finishSurvey={finishSurvey}
                            />
                        ))}
                    </div>

                    {/* 에러 메시지 */}
                    {submitErr && (
                        <div className='flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm'>
                            <ExclamationCircleIcon className='h-4 w-4 shrink-0' />
                            {submitErr}
                        </div>
                    )}

                    {/* 제출 버튼 */}
                    <Buttons
                        onClick={handleSubmit}
                        disabled={submitting}
                        className='m-auto mt-2 text-md'
                    >
                        {submitting ? '제출 중…' : '제출하기'}
                    </Buttons>
                </>
            )}
        </div>
    )
}
