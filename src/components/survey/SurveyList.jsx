import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import List from './List';
import { ClipboardDocumentListIcon, PlusIcon, SparklesIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import instance from '../../services/instance';
import useUserStore from '../../stores/userStore';
import useDialogStore from '../../stores/dialogStore';

// ── 포트폴리오 자가 진단 20문항 샘플 ──────────────────────
const PORTFOLIO_SURVEY = {
    title: '포트폴리오 완성도 자가 진단 체크리스트',
    contents: '개발 포트폴리오의 완성도를 스스로 점검하는 설문입니다. 각 항목에 솔직하게 답변해주세요. 결과는 포트폴리오 개선 방향을 파악하는 데 활용됩니다.',
    questions: [
        {
            questTitle: '프로젝트의 핵심 기능이 실제로 모두 동작하나요?',
            questDesc: '로그인/CRUD/API 연동 등 주요 기능이 에러 없이 작동하는지 확인',
            questType: 'S', orderNo: 1,
            options: [
                { answerTitle: '모든 기능이 완벽하게 동작함', answerWeight: 4, orderNo: 1 },
                { answerTitle: '대부분 동작하나 일부 버그 있음', answerWeight: 3, orderNo: 2 },
                { answerTitle: '핵심 기능만 동작하고 나머지는 미완성', answerWeight: 2, orderNo: 3 },
                { answerTitle: '기능 구현이 아직 많이 부족함', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: 'UI/UX 디자인의 완성도는 어느 정도인가요?',
            questDesc: '레이아웃 일관성, 색상 사용, 반응형 디자인 포함',
            questType: 'S', orderNo: 2,
            options: [
                { answerTitle: '실무 수준의 세련된 디자인', answerWeight: 4, orderNo: 1 },
                { answerTitle: '깔끔하지만 아쉬운 부분이 있음', answerWeight: 3, orderNo: 2 },
                { answerTitle: '기능 위주로 디자인은 기본 수준', answerWeight: 2, orderNo: 3 },
                { answerTitle: '디자인 작업이 거의 되지 않음', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: '코드 구조와 파일 분리가 잘 되어 있나요?',
            questDesc: '컴포넌트 분리, 유틸 함수 분리, 폴더 구조 등',
            questType: 'S', orderNo: 3,
            options: [
                { answerTitle: '관심사 분리가 명확하고 재사용성이 높음', answerWeight: 4, orderNo: 1 },
                { answerTitle: '어느 정도 분리되어 있으나 개선 여지 있음', answerWeight: 3, orderNo: 2 },
                { answerTitle: '분리는 했지만 일관성이 부족함', answerWeight: 2, orderNo: 3 },
                { answerTitle: '한 파일에 모든 코드가 몰려 있음', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: '반응형 웹 디자인이 적용되어 있나요?',
            questDesc: '모바일/태블릿/데스크탑 화면 대응 여부',
            questType: 'S', orderNo: 4,
            options: [
                { answerTitle: '모든 해상도에서 완벽하게 작동', answerWeight: 4, orderNo: 1 },
                { answerTitle: '대부분 화면에서 잘 작동함', answerWeight: 3, orderNo: 2 },
                { answerTitle: '데스크탑만 제대로 대응됨', answerWeight: 2, orderNo: 3 },
                { answerTitle: '반응형이 적용되지 않음', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: 'README 또는 프로젝트 문서화가 잘 되어 있나요?',
            questDesc: '설치 방법, 기능 설명, 기술 스택, 스크린샷 포함 여부',
            questType: 'S', orderNo: 5,
            options: [
                { answerTitle: '상세한 README와 스크린샷이 있음', answerWeight: 4, orderNo: 1 },
                { answerTitle: 'README는 있으나 내용이 간략함', answerWeight: 3, orderNo: 2 },
                { answerTitle: 'README가 있으나 내용이 거의 없음', answerWeight: 2, orderNo: 3 },
                { answerTitle: '문서화가 되어 있지 않음', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: '사용자 인증 기능(로그인/회원가입)이 구현되어 있나요?',
            questType: 'S', orderNo: 6,
            options: [
                { answerTitle: 'JWT/세션 등 보안을 고려한 인증 구현', answerWeight: 4, orderNo: 1 },
                { answerTitle: '기본 로그인/회원가입 기능 구현', answerWeight: 3, orderNo: 2 },
                { answerTitle: '클라이언트 사이드만 구현됨', answerWeight: 2, orderNo: 3 },
                { answerTitle: '인증 기능 없음', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: 'REST API 또는 백엔드 연동이 되어 있나요?',
            questType: 'S', orderNo: 7,
            options: [
                { answerTitle: '직접 백엔드 서버를 구현하고 연동함', answerWeight: 4, orderNo: 1 },
                { answerTitle: '외부 API(공공 API 등)와 연동함', answerWeight: 3, orderNo: 2 },
                { answerTitle: 'Mock 데이터 또는 json-server 사용', answerWeight: 2, orderNo: 3 },
                { answerTitle: '백엔드 연동 없이 프론트만 구현', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: '데이터베이스가 연결되어 있나요?',
            questType: 'S', orderNo: 8,
            options: [
                { answerTitle: '클라우드 DB(RDS, TiDB 등)와 연결됨', answerWeight: 4, orderNo: 1 },
                { answerTitle: '로컬 DB(MySQL, PostgreSQL 등) 사용', answerWeight: 3, orderNo: 2 },
                { answerTitle: 'Firebase 등 BaaS 사용', answerWeight: 2, orderNo: 3 },
                { answerTitle: 'DB 연결 없이 메모리/파일 저장', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: '실시간 기능(채팅, 알림 등)이 구현되어 있나요?',
            questType: 'S', orderNo: 9,
            options: [
                { answerTitle: 'WebSocket/Socket.IO 기반 실시간 기능 구현', answerWeight: 4, orderNo: 1 },
                { answerTitle: 'Polling 방식으로 실시간 흉내냄', answerWeight: 3, orderNo: 2 },
                { answerTitle: '계획만 있고 구현 안됨', answerWeight: 2, orderNo: 3 },
                { answerTitle: '실시간 기능 없음', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: '오류 처리 및 예외 상황이 적절히 다루어지나요?',
            questDesc: 'API 실패, 빈 데이터, 로딩 상태 처리 등',
            questType: 'S', orderNo: 10,
            options: [
                { answerTitle: '모든 케이스에 에러/로딩/빈 상태 처리', answerWeight: 4, orderNo: 1 },
                { answerTitle: '주요 케이스는 처리됨', answerWeight: 3, orderNo: 2 },
                { answerTitle: '일부만 처리됨', answerWeight: 2, orderNo: 3 },
                { answerTitle: '에러 처리 없음', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: 'Git 커밋 히스토리가 깔끔하게 관리되나요?',
            questDesc: '커밋 메시지 컨벤션, 작업 단위 분리 등',
            questType: 'S', orderNo: 11,
            options: [
                { answerTitle: '컨벤셔널 커밋, 일관된 메시지 사용', answerWeight: 4, orderNo: 1 },
                { answerTitle: '대체로 명확한 커밋 메시지 사용', answerWeight: 3, orderNo: 2 },
                { answerTitle: '커밋 메시지가 불명확하거나 덩어리 커밋', answerWeight: 2, orderNo: 3 },
                { answerTitle: '커밋이 거의 없거나 관리 안됨', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: '프로젝트가 실제로 배포되어 있나요?',
            questDesc: 'Vercel, Netlify, AWS, Heroku 등 라이브 URL 존재 여부',
            questType: 'S', orderNo: 12,
            options: [
                { answerTitle: '커스텀 도메인으로 배포됨', answerWeight: 4, orderNo: 1 },
                { answerTitle: '무료 호스팅(Vercel 등)으로 배포됨', answerWeight: 3, orderNo: 2 },
                { answerTitle: '로컬에서만 실행 가능', answerWeight: 2, orderNo: 3 },
                { answerTitle: '빌드도 확인 안됨', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: '타입스크립트 또는 코드 품질 도구가 사용되나요?',
            questType: 'S', orderNo: 13,
            options: [
                { answerTitle: 'TypeScript + ESLint + Prettier 모두 적용', answerWeight: 4, orderNo: 1 },
                { answerTitle: 'TypeScript 또는 린터 중 하나 적용', answerWeight: 3, orderNo: 2 },
                { answerTitle: 'JavaScript로 작성, 린터 없음', answerWeight: 2, orderNo: 3 },
                { answerTitle: '코드 품질 도구 미사용', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: '상태 관리가 적절히 구현되어 있나요?',
            questDesc: 'Redux, Zustand, Recoil, Context API 등',
            questType: 'S', orderNo: 14,
            options: [
                { answerTitle: '전역 상태 관리 라이브러리 적절히 활용', answerWeight: 4, orderNo: 1 },
                { answerTitle: 'Context API 또는 간단한 상태 관리 사용', answerWeight: 3, orderNo: 2 },
                { answerTitle: 'props drilling으로 상태 전달', answerWeight: 2, orderNo: 3 },
                { answerTitle: '상태 관리 없이 구현', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: '성능 최적화가 고려되었나요?',
            questDesc: 'lazy loading, useMemo/useCallback, 이미지 최적화 등',
            questType: 'S', orderNo: 15,
            options: [
                { answerTitle: '다양한 최적화 기법을 적용함', answerWeight: 4, orderNo: 1 },
                { answerTitle: '일부 최적화 적용됨', answerWeight: 3, orderNo: 2 },
                { answerTitle: '성능 문제를 인지하나 적용 안함', answerWeight: 2, orderNo: 3 },
                { answerTitle: '최적화를 고려하지 않음', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: '파일 업로드/다운로드 기능이 구현되어 있나요?',
            questType: 'S', orderNo: 16,
            options: [
                { answerTitle: '다양한 파일 형식 지원 + 미리보기 기능', answerWeight: 4, orderNo: 1 },
                { answerTitle: '기본 파일 업로드/다운로드 구현', answerWeight: 3, orderNo: 2 },
                { answerTitle: '파일 업로드만 구현', answerWeight: 2, orderNo: 3 },
                { answerTitle: '파일 기능 없음', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: '프로젝트의 기술적 도전 과제와 해결 과정을 설명할 수 있나요?',
            questType: 'S', orderNo: 17,
            options: [
                { answerTitle: '구체적인 문제와 해결 방법을 명확히 설명 가능', answerWeight: 4, orderNo: 1 },
                { answerTitle: '대략적으로 설명할 수 있음', answerWeight: 3, orderNo: 2 },
                { answerTitle: '기억이 잘 나지 않아 설명하기 어려움', answerWeight: 2, orderNo: 3 },
                { answerTitle: '설명하기 어려움', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: '프로젝트에서 사용한 기술 스택을 선택한 이유를 설명할 수 있나요?',
            questType: 'S', orderNo: 18,
            options: [
                { answerTitle: '각 기술의 장단점 비교 후 선택 이유 설명 가능', answerWeight: 4, orderNo: 1 },
                { answerTitle: '사용 이유를 대략 설명할 수 있음', answerWeight: 3, orderNo: 2 },
                { answerTitle: '트렌드 또는 강의에서 사용해서 선택', answerWeight: 2, orderNo: 3 },
                { answerTitle: '이유를 설명하기 어려움', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: '포트폴리오를 처음 보는 면접관이 이해하기 쉽게 구성되어 있나요?',
            questDesc: '프로젝트 소개, 역할, 성과 등이 명확히 정리되어 있는지',
            questType: 'S', orderNo: 19,
            options: [
                { answerTitle: '누구나 쉽게 이해할 수 있게 구성됨', answerWeight: 4, orderNo: 1 },
                { answerTitle: '어느 정도 이해 가능하나 설명이 더 필요', answerWeight: 3, orderNo: 2 },
                { answerTitle: '코드만 있고 설명이 부족함', answerWeight: 2, orderNo: 3 },
                { answerTitle: '구성이 혼란스러움', answerWeight: 1, orderNo: 4 },
            ],
        },
        {
            questTitle: '포트폴리오에서 가장 개선이 필요하다고 생각하는 부분은?',
            questType: 'T', orderNo: 20,
            options: [],
        },
    ],
};

// ── 메인 컴포넌트 ──────────────────────────────────────
export default function SurveyList() {
    const { surveyList, loading, reload } = useOutletContext();
    const navigate = useNavigate();
    const [seeding, setSeeding] = useState(false);
    const [seedMsg, setSeedMsg] = useState(null); // { type: 'ok'|'err', text: string }

    const { userId } = useUserStore();
    const openDialog = useDialogStore(state => state.openDialog);

    const handleSeedSurvey = async () => {
        // 로그인 상태 먼저 확인
        if (!userId) {
            openDialog('로그인이 필요합니다. 포폴 진단 샘플을 추가하려면 먼저 로그인해주세요.');
            return;
        }
        setSeeding(true);
        setSeedMsg(null);
        try {
            const res = await instance.post('/user/survey/create', PORTFOLIO_SURVEY);
            if (res.data.result === 'success') {
                reload?.();
                setSeedMsg({ type: 'ok', text: '포폴 진단 20문항 설문이 추가됐습니다!' });
                setTimeout(() => setSeedMsg(null), 4000);
            } else {
                setSeedMsg({ type: 'err', text: '설문 추가에 실패했습니다. 다시 시도해주세요.' });
            }
        } catch (e) {
            // 401/500은 instance.ts 인터셉터가 처리 — 그 외 에러만 표시
            if (e?.response?.status !== 401 && e?.response?.status !== 500) {
                setSeedMsg({ type: 'err', text: '네트워크 오류가 발생했습니다.' });
                setTimeout(() => setSeedMsg(null), 4000);
            }
            console.error(e);
        } finally {
            setSeeding(false);
        }
    };

    return (
        <div className='flex flex-col gap-4'>
            {/* 헤더 */}
            <div className='flex items-center justify-between flex-wrap gap-3'>
                <div>
                    <div className='flex items-center gap-2.5'>
                        <span className='shrink-0 rounded-full inline-block' style={{
                            width: 4, height: 22,
                            background: 'linear-gradient(180deg, #6366f1 0%, #3b82f6 100%)',
                        }} />
                        <h2 className='font-bold text-gray-900 text-lg leading-tight'>설문 목록</h2>
                    </div>
                    <p className='text-sm text-gray-400 mt-0.5 pl-[18px]'>{surveyList.length}개의 설문</p>
                </div>

                <div className='flex items-center gap-2'>
                    {/* 샘플 설문 추가 */}
                    <button
                        onClick={handleSeedSurvey}
                        disabled={seeding}
                        className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-indigo-200 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition-colors disabled:opacity-50'
                    >
                        <SparklesIcon className='h-4 w-4' />
                        {seeding ? '추가 중…' : '포폴 진단 샘플 추가'}
                    </button>

                    <button
                        onClick={() => navigate('/survey/create')}
                        className='inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm'
                    >
                        <PlusIcon className='h-4 w-4' />
                        설문 만들기
                    </button>
                </div>
            </div>

            {/* 시드 결과 메시지 */}
            {seedMsg && (
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${
                    seedMsg.type === 'ok'
                        ? 'bg-green-50 border border-green-200 text-green-700'
                        : 'bg-red-50 border border-red-200 text-red-600'
                }`}>
                    {seedMsg.type === 'ok'
                        ? <CheckCircleIcon className='h-4 w-4 shrink-0' />
                        : <ExclamationCircleIcon className='h-4 w-4 shrink-0' />
                    }
                    {seedMsg.text}
                </div>
            )}

            {/* 목록 */}
            {loading ? (
                <div className='flex flex-col gap-2'>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className='bg-white border border-gray-100 rounded-xl p-4 animate-pulse'>
                            <div className='flex items-start justify-between gap-3'>
                                <div className='flex-1 flex flex-col gap-2.5'>
                                    <div className='h-4 bg-gray-100 rounded w-2/3' />
                                    <div className='h-3 bg-gray-100 rounded w-full' />
                                    <div className='h-3 bg-gray-100 rounded w-4/5' />
                                </div>
                                <div className='h-7 w-16 bg-gray-100 rounded-lg shrink-0' />
                            </div>
                            <div className='flex gap-3 mt-3 pt-3 border-t border-gray-50'>
                                <div className='h-2.5 bg-gray-100 rounded w-16' />
                                <div className='h-2.5 bg-gray-100 rounded w-12' />
                            </div>
                        </div>
                    ))}
                </div>
            ) : surveyList.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-20 text-gray-300'>
                    <ClipboardDocumentListIcon className='h-14 w-14 mb-3' />
                    <p className='text-sm font-medium text-gray-400'>등록된 설문이 없습니다.</p>
                    <p className='text-xs text-gray-300 mt-1 mb-5'>샘플 설문을 추가하거나 직접 만들어보세요.</p>
                    <div className='flex gap-2'>
                        <button
                            onClick={handleSeedSurvey}
                            disabled={seeding}
                            className='inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-indigo-200 text-indigo-600 text-sm hover:bg-indigo-50 transition-colors'
                        >
                            <SparklesIcon className='h-4 w-4' />
                            {seeding ? '추가 중…' : '포폴 진단 20문항 추가'}
                        </button>
                        <button
                            onClick={() => navigate('/survey/create')}
                            className='inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors'
                        >
                            <PlusIcon className='h-4 w-4' />
                            직접 만들기
                        </button>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col gap-2'>
                    {surveyList.map(el => (
                        <List key={el.surveyIdx} surveyList={el} />
                    ))}
                </div>
            )}

        </div>
    );
}
