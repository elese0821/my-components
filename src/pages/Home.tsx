import React from 'react';
import { Link } from 'react-router-dom';
import {
    TableCellsIcon,
    CalendarDaysIcon,
    ChartBarIcon,
    MapPinIcon,
    ChatBubbleLeftRightIcon,
    ClipboardDocumentListIcon,
    Squares2X2Icon,
    DocumentTextIcon,
    CodeBracketIcon,
    ServerIcon,
    BoltIcon,
    ShieldCheckIcon,
    CircleStackIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/outline';

// ── 피처 카드 데이터 ────────────────────────────────────────
const FEATURES = [
    {
        title: 'Board',
        path: '/board/basic',
        icon: DocumentTextIcon,
        color: 'bg-blue-50 text-blue-600',
        border: 'border-blue-100',
        badge: '6 types',
        desc: '게시판 · 카드형 · 블로그 · 갤러리 · 그리드 · FAQ — CRUD + 파일 첨부 + 댓글 + 페이지네이션',
    },
    {
        title: 'Calendar',
        path: '/calendar',
        icon: CalendarDaysIcon,
        color: 'bg-purple-50 text-purple-600',
        border: 'border-purple-100',
        badge: '4 views',
        desc: '월간 · 주간 · 일간 · 목록 뷰 — 일정 CRUD + 색상 커스텀 (프리셋 + 컬러피커)',
    },
    {
        title: 'Table',
        path: '/table',
        icon: TableCellsIcon,
        color: 'bg-green-50 text-green-600',
        border: 'border-green-100',
        badge: 'Full feature',
        desc: '정렬 · 검색 · 부서/상태 필터 · 다중 선택 · CSV 내보내기 · 페이지네이션',
    },
    {
        title: 'Chart',
        path: '/chart',
        icon: ChartBarIcon,
        color: 'bg-orange-50 text-orange-600',
        border: 'border-orange-100',
        badge: 'Dashboard',
        desc: 'KPI 카드 + SparkLine · 라인 차트 · 바 차트 · 파이 차트 · 복합 차트 (MUI X Charts)',
    },
    {
        title: 'Map',
        path: '/map',
        icon: MapPinIcon,
        color: 'bg-red-50 text-red-600',
        border: 'border-red-100',
        badge: 'Kakao SDK',
        desc: '카카오 지도 + 다음 주소 검색 — 마커 관리 · 즐겨찾기 · 선택 위치 상세 정보',
    },
    {
        title: 'Chat',
        path: '/chat',
        icon: ChatBubbleLeftRightIcon,
        color: 'bg-cyan-50 text-cyan-600',
        border: 'border-cyan-100',
        badge: 'Real-time',
        desc: 'Socket.IO 실시간 채팅 — 채팅방 생성 · 입장 · 메신저 스타일 UI · 날짜 구분선',
    },
    {
        title: 'Survey',
        path: '/survey',
        icon: ClipboardDocumentListIcon,
        color: 'bg-pink-50 text-pink-600',
        border: 'border-pink-100',
        badge: 'Full flow',
        desc: '설문 생성 (좌우 패널 실시간 미리보기) · 응답 제출 · 결과 확인 — 트랜잭션 처리',
    },
    {
        title: 'Forms',
        path: '/etc/forms',
        icon: Squares2X2Icon,
        color: 'bg-yellow-50 text-yellow-600',
        border: 'border-yellow-100',
        badge: 'UI Kit',
        desc: 'Input 타입 · 상태(기본/오류/성공/비활성) · Select · Radio · Checkbox · Range · 파일 업로드 + 유효성 검사',
    },
];

// ── 기술 스택 ───────────────────────────────────────────────
const STACK_FRONTEND = [
    { name: 'React 18', desc: 'Concurrent features, StrictMode' },
    { name: 'TypeScript', desc: '타입 안정성' },
    { name: 'Vite 5', desc: '빠른 HMR 빌드' },
    { name: 'Tailwind CSS', desc: 'JIT 유틸리티 클래스' },
    { name: 'Framer Motion', desc: '모달 / 리스트 애니메이션' },
    { name: 'Zustand', desc: '경량 전역 상태 (user, modal, dialog)' },
    { name: 'React Router v6', desc: 'Nested Routes + Outlet' },
    { name: 'Axios', desc: '인터셉터 기반 API 클라이언트' },
    { name: 'Socket.IO Client', desc: '실시간 채팅' },
    { name: 'FullCalendar 6', desc: '다중 뷰 캘린더' },
    { name: 'MUI X Charts', desc: '차트 대시보드' },
    { name: 'Kakao Maps SDK', desc: '지도 + 주소 검색' },
    { name: 'CKEditor 5', desc: '리치 텍스트 에디터' },
];

const STACK_BACKEND = [
    { name: 'Node.js + Express', desc: 'REST API 서버' },
    { name: 'Socket.IO', desc: '웹소켓 실시간 채팅' },
    { name: 'mysql2 (TiDB Cloud)', desc: 'MySQL 호환 클라우드 DB' },
    { name: 'JWT', desc: '헤더 기반 인증 (X-SKYAND-AUTH-TOKEN)' },
    { name: 'bcrypt', desc: '비밀번호 해싱' },
    { name: 'multer', desc: '파일 업로드' },
    { name: 'nodemon', desc: '개발 자동 재시작' },
];

// ── 컴포넌트 ───────────────────────────────────────────────
const Tag = ({ children, color = 'bg-gray-100 text-gray-600' }: { children: React.ReactNode; color?: string }) => (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{children}</span>
);

export default function Home() {
    return (
        <div className='section_wrap flex flex-col gap-12'>

            {/* ── 히어로 ── */}
            <div className='flex flex-col gap-3 pt-2'>
                <div className='flex items-center gap-2 flex-wrap'>
                    <Tag color='bg-blue-100 text-blue-700'>React 18</Tag>
                    <Tag color='bg-gray-100 text-gray-600'>TypeScript</Tag>
                    <Tag color='bg-purple-100 text-purple-700'>Vite 5</Tag>
                    <Tag color='bg-cyan-100 text-cyan-700'>Tailwind CSS</Tag>
                    <Tag color='bg-green-100 text-green-700'>Node.js</Tag>
                    <Tag color='bg-orange-100 text-orange-700'>TiDB Cloud</Tag>
                </div>
                <h1 className='text-3xl font-bold text-gray-900 leading-tight'>
                    WY Components
                </h1>
                <p className='text-base text-gray-500 max-w-2xl leading-relaxed'>
                    실무에 바로 복붙해서 쓸 수 있는 컴포넌트 모음집입니다.
                    게시판 6종, 캘린더, 테이블, 차트, 지도, 실시간 채팅, 설문 시스템, 폼 UI까지
                    <strong className='text-gray-700'> React + TypeScript</strong>로 구현되어 있으며
                    <strong className='text-gray-700'> Node.js 백엔드 + TiDB Cloud</strong>와 연동됩니다.
                </p>
                <div className='flex items-center gap-3 flex-wrap mt-1'>
                    <div className='bg-gray-800 text-white rounded-lg px-4 py-2 text-sm font-mono flex items-center gap-2'>
                        <span className='text-gray-400'>Demo</span>
                        <span className='text-yellow-300'>test</span>
                        <span className='text-gray-500'>/</span>
                        <span className='text-green-300'>Test1234!</span>
                    </div>
                    <p className='text-xs text-gray-400'>위 계정으로 로그인하면 글쓰기·채팅·설문 등 모든 기능 테스트 가능</p>
                </div>
            </div>

            {/* ── 기능 카드 그리드 ── */}
            <div>
                <h2 className='text-lg font-bold text-gray-800 mb-4'>주요 기능</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                    {FEATURES.map(feat => (
                        <Link
                            key={feat.path}
                            to={feat.path}
                            className={`group flex flex-col gap-3 p-4 rounded-xl border ${feat.border} bg-white hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
                        >
                            <div className='flex items-center justify-between'>
                                <div className={`w-9 h-9 rounded-lg ${feat.color} flex items-center justify-center`}>
                                    <feat.icon className='h-5 w-5' />
                                </div>
                                <span className='text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full'>
                                    {feat.badge}
                                </span>
                            </div>
                            <div className='flex flex-col gap-1 flex-1'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='text-sm font-bold text-gray-800'>{feat.title}</h3>
                                    <ArrowRightIcon className='h-3.5 w-3.5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all' />
                                </div>
                                <p className='text-xs text-gray-500 leading-relaxed'>{feat.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── 기술 스택 ── */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* 프론트엔드 */}
                <div className='bg-white rounded-xl border border-gray-200 overflow-hidden'>
                    <div className='px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2'>
                        <CodeBracketIcon className='h-4 w-4 text-blue-500' />
                        <h2 className='text-sm font-semibold text-gray-700'>Frontend Stack</h2>
                    </div>
                    <div className='p-4 grid grid-cols-1 gap-2'>
                        {STACK_FRONTEND.map(s => (
                            <div key={s.name} className='flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0'>
                                <span className='text-xs font-semibold text-gray-800'>{s.name}</span>
                                <span className='text-xs text-gray-400'>{s.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 백엔드 + 아키텍처 */}
                <div className='flex flex-col gap-4'>
                    <div className='bg-white rounded-xl border border-gray-200 overflow-hidden'>
                        <div className='px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2'>
                            <ServerIcon className='h-4 w-4 text-green-500' />
                            <h2 className='text-sm font-semibold text-gray-700'>Backend Stack</h2>
                        </div>
                        <div className='p-4 grid grid-cols-1 gap-2'>
                            {STACK_BACKEND.map(s => (
                                <div key={s.name} className='flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0'>
                                    <span className='text-xs font-semibold text-gray-800'>{s.name}</span>
                                    <span className='text-xs text-gray-400'>{s.desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 주요 포인트 */}
                    <div className='bg-white rounded-xl border border-gray-200 overflow-hidden'>
                        <div className='px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-2'>
                            <BoltIcon className='h-4 w-4 text-yellow-500' />
                            <h2 className='text-sm font-semibold text-gray-700'>구현 포인트</h2>
                        </div>
                        <div className='p-4 flex flex-col gap-2.5'>
                            {[
                                { icon: ShieldCheckIcon, color: 'text-blue-500', title: 'JWT 인증', desc: '커스텀 헤더 X-SKYAND-AUTH-TOKEN + Axios 인터셉터' },
                                { icon: BoltIcon, color: 'text-yellow-500', title: 'StrictMode 안전 소켓', desc: 'cancelled 플래그로 이중 연결 방지 (React 18 StrictMode)' },
                                { icon: CircleStackIcon, color: 'text-green-500', title: 'snake_case → camelCase', desc: '서버 SQL 별칭으로 camelCase 변환, 프론트 일관성 유지' },
                                { icon: ShieldCheckIcon, color: 'text-purple-500', title: 'Tailwind 커스텀 색상', desc: 'flat값 대신 shade 객체로 bg-blue-600 등 표준 클래스 유지' },
                            ].map(p => (
                                <div key={p.title} className='flex items-start gap-2.5'>
                                    <p.icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${p.color}`} />
                                    <div>
                                        <p className='text-xs font-semibold text-gray-800'>{p.title}</p>
                                        <p className='text-xs text-gray-400 leading-relaxed'>{p.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 게시판 타입 미리보기 ── */}
            <div>
                <h2 className='text-lg font-bold text-gray-800 mb-1'>Board 컴포넌트 — 6가지 레이아웃</h2>
                <p className='text-sm text-gray-400 mb-4'>하나의 BoardPage(공통 CRUD 로직)에 Outlet으로 다양한 레이아웃 교체</p>
                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3'>
                    {[
                        { label: '기본 게시판', path: '/board/basic', desc: '테이블형' },
                        { label: '카드형', path: '/board/card', desc: '카드 그리드' },
                        { label: 'FAQ', path: '/board/faq', desc: '아코디언' },
                        { label: '블로그형', path: '/board/blog', desc: '이미지 + 썸네일' },
                        { label: '갤러리', path: '/board/gallery', desc: 'Lightbox' },
                        { label: '그리드형', path: '/board/grid', desc: 'Pinterest식' },
                    ].map(b => (
                        <Link
                            key={b.path}
                            to={b.path}
                            className='flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 transition-all text-center group'
                        >
                            <DocumentTextIcon className='h-6 w-6 text-gray-300 group-hover:text-blue-400 transition-colors' />
                            <p className='text-xs font-semibold text-gray-700'>{b.label}</p>
                            <p className='text-xs text-gray-400'>{b.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── 프로젝트 구조 ── */}
            <div className='bg-gray-900 rounded-xl overflow-hidden'>
                <div className='px-5 py-3 border-b border-gray-700 flex items-center gap-2'>
                    <span className='w-3 h-3 rounded-full bg-red-500'/>
                    <span className='w-3 h-3 rounded-full bg-yellow-500'/>
                    <span className='w-3 h-3 rounded-full bg-green-500'/>
                    <span className='ml-2 text-xs text-gray-400 font-mono'>project structure</span>
                </div>
                <pre className='p-5 text-xs text-gray-300 font-mono overflow-x-auto leading-relaxed'>{`
my-components/               ← Vite + React + TS
├── src/
│   ├── components/
│   │   ├── board/           BoardBasic · Blog · Card · FAQ · Gallery · Grid
│   │   ├── calendar/        CalendarComponent (FullCalendar + color picker)
│   │   ├── chat/            ChatRoom (Socket.IO)  ChatList
│   │   ├── survey/          SurveyCreate · SurveyList · SurveyDetail
│   │   └── common/          Header · Footer · Pagination · Comments · Forms
│   ├── pages/
│   │   ├── board/           BoardPage (공통 CRUD 로직) + WritePage + ViewPage
│   │   ├── chart/           ChartPage (KPI + Line + Bar + Pie)
│   │   ├── map/             MapPage (Kakao Maps + Daum Postcode)
│   │   ├── table/           TablePage (정렬 · 필터 · CSV)
│   │   └── Etc/             FormsPage · PdfPage · PromptPage
│   ├── stores/              Zustand: userStore · dialogStore · modalStore
│   ├── services/            Axios instance (인터셉터) · calendarService
│   └── utils/               system_config.json (메뉴 구조)

my-components-server/        ← Express + Socket.IO
└── src/
    ├── routes/              auth · board · reply · chat · survey · schedule · file
    ├── middleware/          authMiddleware (JWT 검증)
    ├── socket.js            Socket.IO (채팅 메시지 저장 + 브로드캐스트)
    └── db.js                mysql2 Pool (TiDB Cloud SSL)
`.trim()}</pre>
            </div>

        </div>
    );
}
