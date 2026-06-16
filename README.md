# WY Components — Frontend

> 실무에 바로 붙여넣을 수 있는 React 컴포넌트 모음집  
> **Vite + React 18 + TypeScript + Tailwind CSS + Node.js 백엔드 연동**

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [프로젝트 구조](#3-프로젝트-구조)
4. [설치 및 실행](#4-설치-및-실행)
5. [환경변수](#5-환경변수)
6. [페이지별 기능 상세](#6-페이지별-기능-상세)
7. [공통 컴포넌트](#7-공통-컴포넌트)
8. [상태 관리 (Zustand)](#8-상태-관리-zustand)
9. [API 통신 (Axios 인스턴스)](#9-api-통신-axios-인스턴스)
10. [Tailwind 커스텀 색상 구성](#10-tailwind-커스텀-색상-구성)
11. [주요 구현 포인트 & 해결한 이슈](#11-주요-구현-포인트--해결한-이슈)
12. [데모 계정](#12-데모-계정)

---

## 1. 프로젝트 개요

WY Components는 실무 프로젝트에서 반복적으로 쓰이는 UI 패턴을 한 곳에 모아 **복붙만으로 즉시 사용 가능한 수준**으로 완성도를 높인 포트폴리오 프로젝트입니다.

- **프론트엔드**: Vite 5 · React 18 · TypeScript · Tailwind CSS 3
- **백엔드**: Node.js · Express · Socket.IO (`my-components-server`)
- **DB**: TiDB Cloud (MySQL 호환 서버리스 클라우드 DB)
- **인증**: JWT — 커스텀 헤더 `X-SKYAND-AUTH-TOKEN`
- **실시간**: Socket.IO (채팅)

**구현된 주요 기능**

| 카테고리 | 내용 |
|---|---|
| Board | 게시판 6종 (기본·카드·블로그·갤러리·그리드·FAQ) + CRUD + 댓글 + 파일 첨부 |
| Calendar | FullCalendar 월간/주간/일간/목록 뷰 + 일정 CRUD + 색상 커스텀 |
| Table | 정렬·검색·필터·다중선택·CSV 내보내기·페이지네이션 |
| Chart | KPI 카드 + 라인·바·파이·복합 차트 대시보드 |
| Map | 카카오 지도 + 다음 주소 검색 + 마커 관리 |
| Chat | Socket.IO 실시간 채팅 (채팅방 생성·입장·메신저 UI) |
| Survey | 설문 생성(미리보기 패널)·응답 제출·결과 확인 |
| Forms | Input 타입 전체·상태 표현·라디오·체크박스·파일 업로드·유효성 검사 |

---

## 2. 기술 스택

### Frontend

| 라이브러리 | 버전 | 용도 |
|---|---|---|
| React | 18.2 | UI 렌더링, Concurrent 기능 |
| TypeScript | 5.4 | 정적 타입 |
| Vite | 5.2 | 빌드 도구 / HMR |
| Tailwind CSS | 3.4 | 유틸리티 퍼스트 CSS (JIT) |
| @material-tailwind/react | 2.1 | 버튼 등 일부 UI 컴포넌트 |
| React Router DOM | 6.23 | SPA 라우팅 (Nested Routes + Outlet) |
| Zustand | 4.5 | 경량 전역 상태 관리 |
| Axios | 1.6 | HTTP 클라이언트 (인터셉터 포함) |
| Framer Motion | 11.2 | 모달·리스트 진입 애니메이션 |
| Socket.IO Client | 4.8 | 실시간 채팅 웹소켓 |
| @fullcalendar/react | 6.1 | 캘린더 (월간/주간/일간/목록) |
| @mui/x-charts | 7.7 | 차트 (Line · Bar · Pie · Sparkline) |
| react-kakao-maps-sdk | 1.1 | 카카오 지도 |
| react-daum-postcode | 3.1 | 다음 주소 검색 |
| @ckeditor/ckeditor5-react | 7.0 | 리치 텍스트 에디터 (게시글 작성) |
| dayjs | 1.11 | 날짜 유틸리티 |
| @heroicons/react | 2.1 | SVG 아이콘 |
| sass | 1.77 | SCSS 전처리기 |

> `@tanstack/react-query`는 의존성에 설치되어 있으나 현재 미사용 상태.  
> 서버 통신은 **Axios + useState/useEffect** 직접 호출 방식으로 구현됨.

---

## 3. 프로젝트 구조

```
my-components/
├── public/                       # 정적 파일 (배경 이미지 등)
├── src/
│   ├── App.tsx                   # 전체 라우트 정의
│   ├── main.tsx                  # 앱 진입점 (React 18 StrictMode)
│   │
│   ├── assets/
│   │   ├── fonts/                # 커스텀 폰트 (LINESeedKR, OneShinhan)
│   │   └── scss/setting/
│   │       ├── _common.scss      # 전역 공통 스타일 + CSS 변수
│   │       ├── _mixin.scss       # SCSS 믹스인
│   │       └── _vars.scss        # SCSS 변수
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.tsx         # 로그인 폼 (모달 내 렌더링)
│   │   │   └── Join.tsx          # 회원가입 폼 (모달 내 렌더링)
│   │   │
│   │   ├── board/                # 게시판 6종 + 서브 컴포넌트
│   │   │   ├── BoardBasic.tsx    # 테이블형 게시판
│   │   │   ├── BoardBlog.tsx     # 블로그형 (이미지 + 썸네일)
│   │   │   ├── BoardCard.tsx     # 카드형 그리드
│   │   │   ├── BoardFAQ.tsx      # FAQ 아코디언
│   │   │   ├── BoardGallery.tsx  # 갤러리 + Lightbox
│   │   │   ├── BoardGrid.tsx     # Pinterest 그리드 (GridCard 분리)
│   │   │   ├── BoardSearch.tsx   # 검색 입력 컴포넌트
│   │   │   ├── BoardTabPage.tsx  # 행 수 탭 (5/10/20/50)
│   │   │   └── MorePopup.tsx     # 수정/삭제 팝업
│   │   │
│   │   ├── calendar/
│   │   │   └── CalendarComponent.tsx  # FullCalendar + EventModal + ColorPicker
│   │   │
│   │   ├── chat/
│   │   │   ├── ChatList.tsx      # 채팅방 목록 + 생성
│   │   │   └── ChatRoom.jsx      # 실시간 채팅 (Socket.IO)
│   │   │
│   │   ├── survey/
│   │   │   ├── SurveyCreate.jsx  # 설문 생성 (좌우 패널 미리보기)
│   │   │   ├── SurveyList.jsx    # 설문 목록
│   │   │   ├── SurveyDetail.jsx  # 설문 응답 + 결과 보기
│   │   │   └── Quest.jsx         # 개별 질문 렌더러
│   │   │
│   │   └── common/
│   │       ├── Header.tsx        # 상단 내비게이션 (로그인/로그아웃)
│   │       ├── Footer.jsx        # 하단 푸터
│   │       ├── Main.jsx          # 레이아웃 (섹션 헤더 + 카테고리 메뉴)
│   │       ├── Category.jsx      # 상단 카테고리 메뉴
│   │       ├── Loading.jsx       # 로딩 스피너
│   │       ├── Redirection.jsx   # 카카오 OAuth 리다이렉트 처리
│   │       ├── comments/
│   │       │   └── Comments.tsx  # 댓글 CRUD
│   │       ├── forms/
│   │       │   ├── Buttons.tsx   # Material Tailwind 버튼 래퍼
│   │       │   ├── InputText.tsx
│   │       │   ├── Radio.tsx / RadioGroups.jsx
│   │       │   ├── TextArea.jsx
│   │       │   └── AddressForm.jsx
│   │       ├── pagination/
│   │       │   └── Pagination.tsx   # 범용 페이지네이션
│   │       └── tag/
│   │           └── H1.tsx        # 랜덤 아이콘 + 제목 컴포넌트
│   │
│   ├── pages/
│   │   ├── Home.tsx              # 랜딩 페이지
│   │   ├── NotFound.tsx          # 404 페이지
│   │   ├── Error.tsx             # 500 에러 페이지
│   │   ├── auth/                 # LoginPage · JoinPage
│   │   ├── board/
│   │   │   ├── BoardPage.tsx     # 공통 CRUD 로직 (Outlet 컨테이너)
│   │   │   ├── BoardViewPage.tsx # 게시글 상세 보기 (댓글 포함)
│   │   │   └── WritePage.tsx     # 글쓰기·수정 (CKEditor 5)
│   │   ├── calendar/CalendarPage.tsx
│   │   ├── chart/ChartPage.tsx   # KPI + 4종 차트 대시보드
│   │   ├── chat/ChatPage.tsx     # Outlet: 목록 + ChatRoom
│   │   ├── map/MapPage.tsx       # 카카오 지도 + 주소 검색 패널
│   │   ├── survey/SurveyPage.tsx # Outlet: 목록 + 상세
│   │   ├── table/TablePage.tsx   # 직원 관리 테이블
│   │   └── Etc/
│   │       ├── EtcPage.tsx       # Etc 섹션 Outlet 컨테이너
│   │       ├── FormsPage.tsx     # 폼 UI 쇼케이스
│   │       ├── PdfPage.tsx       # PDF 뷰어
│   │       ├── PromptPage.tsx    # AI 프롬프트 UI
│   │       ├── MSPage.tsx        # Master-Slave 패턴
│   │       └── ASPage.tsx        # Add-Subtract 패턴
│   │
│   ├── services/
│   │   ├── instance.ts           # Axios 인스턴스 + 요청/응답 인터셉터
│   │   ├── endpoint.ts           # API · WebSocket URL 상수
│   │   └── calendar/
│   │       └── calendarService.ts   # 캘린더 CRUD API 래퍼
│   │
│   ├── stores/                   # Zustand 전역 스토어
│   │   ├── userStore.ts          # 로그인 사용자 정보 · JWT 토큰
│   │   ├── dialogStore.ts        # 전역 알림 다이얼로그
│   │   ├── modalStore.ts         # 로그인/회원가입 모달 상태
│   │   └── statusStore.ts        # HTTP 에러 상태 (500 → /error 리다이렉트)
│   │
│   └── utils/config/
│       └── system_config.json    # 메뉴 트리 (라우트 ↔ 이름 매핑)
│
├── tailwind.config.js            # Tailwind 커스텀 색상 · 그림자
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. 설치 및 실행

### 사전 요구사항

- Node.js 18 이상
- 백엔드 서버 실행 중 (`my-components-server`, 기본 포트 4000)

### 설치

```bash
cd my-components
npm install
```

### 개발 서버 실행

```bash
npm run dev
# → http://localhost:5173 (Vite가 포트 충돌 시 5174로 자동 전환)
```

### 프로덕션 빌드

```bash
npm run build   # dist/ 폴더 생성
npm run preview # 빌드 결과 로컬 미리보기
```

---

## 5. 환경변수

프로젝트 루트에 `.env` 파일 생성:

```env
# 백엔드 REST API 서버 주소 (endpoint.ts: VITE_API_BASE_URL)
VITE_API_BASE_URL=http://localhost:4000

# Socket.IO 웹소켓 서버 주소 (endpoint.ts: VITE_WS_URL)
VITE_WS_URL=http://localhost:4000

# 카카오맵 JavaScript 앱 키
# 발급: https://developers.kakao.com → 내 애플리케이션 → 앱 키 → JavaScript 키
VITE_APP_KAKAO_JS_KEY=your_kakao_javascript_key

# 카카오 소셜 로그인 (OAuth) — 소셜 로그인 사용 시
VITE_APP_REST_API_KEY=your_kakao_rest_api_key
VITE_APP_REDIRECT_URL=http://localhost:5173/auth/kakao
```

> 카카오맵 키 미설정 시 MapPage에 안내 UI가 표시됩니다. 나머지 기능은 정상 동작합니다.

---

## 6. 페이지별 기능 상세

### 6-1. Board (게시판 6종)

**경로**: `/board/*`

모든 게시판 타입은 `BoardPage.tsx`가 공통 CRUD 로직(API 통신, 모달, 검색, 페이지네이션)을 담당하고, React Router `<Outlet>`으로 레이아웃 컴포넌트만 교체하는 구조입니다.

```
BoardPage (공통 CRUD 컨테이너 + 모달)
└── <Outlet>
    ├── /board/basic   → BoardBasic   (테이블형)
    ├── /board/card    → BoardCard    (카드형 그리드)
    ├── /board/faq     → BoardFAQ     (아코디언)
    ├── /board/blog    → BoardBlog    (이미지 썸네일)
    ├── /board/gallery → BoardGallery (Lightbox 갤러리)
    └── /board/grid    → BoardGrid    (Pinterest 그리드)
```

**공통 기능**

| 기능 | 구현 방식 |
|---|---|
| 목록 조회 | `GET /user/board/info` — 페이지·행수·검색어 파라미터 |
| 단건 조회 | `GET /user/board/info?boardIdx=n` — 조회수 자동 증가 |
| 글쓰기·수정 | CKEditor 5 리치 텍스트 에디터 + 파일 첨부 (multer) |
| 삭제 | 로그인한 작성자만 가능, 확인 다이얼로그 표시 |
| 검색 | 제목 + 내용 `LIKE` 검색 |
| 페이지네이션 | 행 수 5/10/20/50 선택, 공통 `<Pagination>` 컴포넌트 |
| 댓글 | `GET/POST/DELETE /user/reply` |
| 모달 애니메이션 | Framer Motion `AnimatePresence` + `scale + opacity + y` |

**BoardGallery 특이사항**
- `isImageFile(name)` 로 이미지 파일만 필터링 후 렌더
- Lightbox: 클릭 시 오버레이 전체화면 뷰

**BoardGrid 특이사항**
- `GridCard` 서브 컴포넌트로 분리 → 카드마다 독립 `useState` 로 팝업 관리  
  (단일 shared ref 사용 시 발생하는 버그 해결)

---

### 6-2. Calendar

**경로**: `/calendar`

```
CalendarPage
└── CalendarComponent
    ├── 뷰 전환 탭: 월간 / 주간 / 일간 / 목록
    ├── FullCalendar
    │   ├── dayGridPlugin   (월간)
    │   ├── timeGridPlugin  (주간 · 일간)
    │   ├── listPlugin      (목록)
    │   └── interactionPlugin (날짜 클릭 · 드래그 선택)
    └── EventModal (추가 / 수정)
        ├── 제목 입력
        ├── 시작 · 종료 날짜
        ├── 메모 (선택)
        └── ColorPicker
            ├── 프리셋 8색 버튼
            └── 네이티브 color input (커스텀 색상)
```

**API**: `GET / POST / PATCH / DELETE /user/schedule`

**구현 포인트**
- `calRef.current?.getApi().changeView(v)` 로 외부 탭에서 뷰 프로그래밍 전환
- `getContrastYIQ(hex)` 함수로 이벤트 배경색에 맞는 텍스트 색(흰/검) 자동 결정

---

### 6-3. Table

**경로**: `/table`

직원 관리 테이블 (15명 샘플 데이터, 프론트 standalone).

| 기능 | 설명 |
|---|---|
| 컬럼 정렬 | 클릭마다 `asc → desc → 해제` 순환 |
| 실시간 검색 | 이름·직무·이메일 동시 검색 |
| 부서 필터 | 개발팀 / 디자인팀 / 기획팀 / QA팀 드롭다운 |
| 상태 필터 | 재직중 / 휴직중 / 퇴직 |
| 다중 선택 | 체크박스, 현재 페이지 전체 선택 지원 |
| CSV 내보내기 | BOM 포함 UTF-8 → 엑셀 한글 깨짐 없음 |
| 페이지네이션 | 5개씩, 필터·검색 변경 시 1페이지 자동 리셋 |
| 행 상태 배지 | 재직중(초록) / 휴직중(노랑) / 퇴직(회색) |
| 부서 배지 | 부서별 색상 구분 (파랑·보라·주황·빨강) |

---

### 6-4. Chart

**경로**: `/chart`

MUI X Charts 기반 통계 대시보드.

| 차트 컴포넌트 | 설명 |
|---|---|
| `SparkLineChart` | KPI 카드 4개 (총 매출·주문·신규 회원·전환율) + 미니 추세선 |
| `LineChart` | 월별 매출 & 방문자 추이 — 6개월/12개월 범위 토글 |
| `BarChart` | 요일별 주문수 / 매출액 — 지표 토글 |
| `PieChart` | 카테고리별 매출 비율 (도넛형 + 커스텀 범례) |
| `BarChart` (복합) | 주문수(막대) + 반품(선) 오버레이 |

---

### 6-5. Map

**경로**: `/map`

| 기능 | 설명 |
|---|---|
| 카카오 지도 | `ZoomControl` · `MapTypeControl` |
| 주소 검색 | 다음 주소 검색 팝업 → 좌표 변환 (Kakao Geocoder) |
| 마커 관리 | 검색 결과 마커 추가 · 클릭 시 `isPanto` 부드러운 이동 |
| 즐겨찾기 | 별(★) 토글 → 목록 상단 자동 정렬 |
| 위치 삭제 | 마우스 오버 시 trash 버튼 노출 |
| 위치 정보 카드 | 마커/목록 선택 시 지도 하단 카드: 도로명·지번·우편번호·GPS 좌표 |
| API 키 미설정 | `VITE_APP_KAKAO_JS_KEY` 없을 때 안내 UI 오버레이 표시 |

---

### 6-6. Chat

**경로**: `/chat` · `/chat/chatRoom/:roomId`

```
ChatPage (Outlet 컨테이너)
├── ChatList  → 채팅방 목록 · 생성 (POST /user/chat)
└── ChatRoom  → 실시간 채팅 (Socket.IO)
```

| 기능 | 설명 |
|---|---|
| 채팅방 생성 | 방 이름 입력 → 서버에서 UUID 채널 ID 발급 |
| 채팅방 목록 | 마지막 메시지 · 생성일 표시 |
| 실시간 메시지 | `join` 이벤트로 룸 입장 → `message` 이벤트 송수신 |
| 메신저 UI | 내 메시지: 파란 버블 (오른쪽) / 상대: 흰 버블 (왼쪽) |
| 날짜 구분선 | 날짜 바뀔 때 자동 구분선 삽입 |
| 아바타 | 이름 첫 글자 이니셜 원형 아바타 |
| 기록 로드 | 입장 시 `GET /user/chat/:channelId` 로 이전 메시지 로드 |

**StrictMode 이중 소켓 방지 패턴**:
```js
useEffect(() => {
    let cancelled = false;
    let socket = null;

    import('socket.io-client').then(({ io }) => {
        if (cancelled) return;   // 두 번째 실행 무시
        socket = io(WS_URL, { transports: ['websocket'] });
        socketRef.current = socket;
        socket.emit('join', { channelId: roomId });
        socket.on('message', (msg) => setMessages(prev => [...prev, msg]));
    });

    return () => {
        cancelled = true;
        socket?.disconnect();
        socketRef.current = null;
    };
}, [roomId]);
```

---

### 6-7. Survey

**경로**: `/survey` · `/survey/:id`

```
SurveyPage (Outlet)
├── SurveyList   → 설문 목록 + 「설문 만들기」 버튼
│   └── SurveyCreate (모달 오버레이)
│       ├── 좌 패널: 편집 폼 (제목·설명, 질문 추가/삭제/순서변경)
│       └── 우 패널: 실시간 미리보기
└── SurveyDetail → 설문 응답 / 완료 후 결과 보기
```

**설문 생성 흐름**
1. 모달 오픈 → 좌패널 작성 → 우패널 실시간 반영
2. 질문 타입: `S` (단일선택 라디오) / `T` (주관식 텍스트)
3. `POST /user/survey/create` — 트랜잭션: survey → quest → quest_sel 순차 INSERT

**설문 응답 흐름**
1. `GET /user/survey/info?surveyIdx=n` → 질문+선택지 로드
2. 사용자 응답 입력
3. `POST /user/survey/info` → `ON DUPLICATE KEY UPDATE` 로 재응답 허용
4. `finishSurvey === 'Y'` 이면 결과 보기 모드 자동 전환

---

### 6-8. Forms

**경로**: `/etc/forms`

실무 폼 컴포넌트 쇼케이스 (백엔드 연동 없음, standalone).

| 섹션 | 내용 |
|---|---|
| 기본 Input 타입 | text · email · password · tel · number · url · date · time |
| Input 상태 | 기본 · 포커스 · 오류 (빨간 테두리 + 메시지) · 성공 (초록) · 비활성 · 읽기전용 |
| Select | 단일 선택 · 다중 선택 (Ctrl + 클릭) |
| Textarea | 글자 수 카운터 실시간 표시 |
| Radio | 카드형 라디오 버튼 (배송 방법 예제) |
| Checkbox | 기술 스택 복수 선택 + 선택된 항목 태그 표시 |
| Range Slider | 예산 설정 슬라이더 + 현재값 표시 |
| 파일 업로드 | 기본 파일 선택 · 이미지 전용 (`accept="image/*"`) |
| 완성 예제 | 문의 폼 — 이름·이메일·전화·내용·약관동의 + 실시간 유효성 검사 + 제출 성공 UI |

---

## 7. 공통 컴포넌트

### `<Pagination>`

```tsx
<Pagination
    totalPages={totalPages}  // 전체 페이지 수
    page={page}              // 현재 페이지 (1-based)
    setPage={setPage}        // 페이지 변경 핸들러
/>
```

- 현재 페이지 앞뒤 2페이지 번호 표시
- 처음 / 이전 / 다음 / 마지막 이동 버튼 (Heroicons 아이콘)
- 첫/마지막 페이지에서 비활성 처리

---

### `<H1>`

```tsx
<H1 className="...">페이지 제목</H1>
```

- `useMemo`로 고정된 랜덤 Heroicon 아이콘 + 제목 텍스트

---

### `<Buttons>`

```tsx
<Buttons onClick={fn} disabled={false} type="button">
    버튼 텍스트
</Buttons>
```

- Material Tailwind `<Button>` 래퍼
- `bg-gray1` 배경, hover 시 `bg-gray2`
- `className` prop으로 추가 스타일 병합 가능

---

### `<Dialog>` (전역 알림)

어디서든 `useDialogStore`로 호출:

```ts
const { openDialog } = useDialogStore();
openDialog("저장 완료 😎");
```

`App.tsx`에 `{isOpen && <Dialog />}` 하나만 등록되어 있음.

---

### `<Comments>`

```tsx
<Comments boardIdx={boardIdx} />
```

- 댓글 목록 조회 · 작성 · 삭제
- API: `GET / POST / DELETE /user/reply`
- Material Tailwind 글로벌 CSS 충돌을 피하기 위해 **인라인 스타일** 사용

---

## 8. 상태 관리 (Zustand)

### userStore

```ts
interface UserStore {
    userId: string;     // 로그인 아이디 (화면 표시용)
    usrIdx: string;     // DB 사용자 인덱스
    token: string;      // JWT 토큰
    login(userId: string, usrIdx: string, token: string): void;
    logout(): void;
}
```

- `localStorage` persist 적용 → 새로고침 후에도 로그인 유지
- Axios 인터셉터에서 `useUserStore.getState().token` 을 읽어 헤더 자동 주입

---

### dialogStore

```ts
openDialog("메시지");  // 알림창 열기
```

---

### modalStore

로그인·회원가입 모달 열기/닫기 상태 관리.  
`Header.tsx`에서 `openModal()`, `isModalOpen` 구독.

---

### statusStore

```ts
setStatus(500, "/error");
// App.tsx의 useEffect → navigate("/error") 실행
```

Axios 응답 인터셉터에서 500 에러 발생 시 자동 호출.

---

## 9. API 통신 (Axios 인스턴스)

### 인스턴스 생성 (`src/services/instance.ts`)

```ts
const instance = axios.create({
    baseURL: SERVER_API_BASE_URL,
    headers: { "Content-Type": "application/json" },
});
```

### 요청 인터셉터

```ts
instance.interceptors.request.use(config => {
    const { token } = useUserStore.getState();
    if (config.url !== '/login') {
        config.headers["X-SKYAND-AUTH-TOKEN"] = token;
    }
    return config;
});
```

### 응답 인터셉터

```ts
instance.interceptors.response.use(
    res => res,
    error => {
        if (error.response?.status === 500) {
            setStatus(500, "/error");  // 에러 페이지로 이동
        }
        if (error.response?.status === 401) {
            logout();
            openDialog("세션이 만료되었습니다. 다시 로그인해주세요🥲");
            setStatus(401, "/");
        }
        return Promise.reject(error);
    }
);
```

### 주요 API 엔드포인트

| Method | 경로 | 인증 필요 | 설명 |
|---|---|:---:|---|
| POST | `/login` | ✗ | 로그인 → JWT 발급 |
| POST | `/regist` | ✗ | 회원가입 |
| GET | `/user/board/info` | ✗ | 게시판 목록·단건 조회 |
| POST | `/user/board/info` | ✓ | 게시글 작성 |
| PATCH | `/user/board/info` | ✓ | 게시글 수정 |
| DELETE | `/user/board/info` | ✓ | 게시글 삭제 |
| GET | `/user/reply` | ✗ | 댓글 목록 |
| POST | `/user/reply` | ✓ | 댓글 작성 |
| DELETE | `/user/reply` | ✓ | 댓글 삭제 |
| GET | `/user/schedule` | ✓ | 캘린더 일정 목록 |
| POST | `/user/schedule` | ✓ | 일정 생성 |
| PATCH | `/user/schedule` | ✓ | 일정 수정 |
| DELETE | `/user/schedule` | ✓ | 일정 삭제 |
| GET | `/user/chat` | ✓ | 채팅방 목록 |
| POST | `/user/chat` | ✓ | 채팅방 생성 |
| GET | `/user/chat/:channelId` | ✓ | 채팅 기록 조회 |
| GET | `/user/survey/info` | ✗ | 설문 목록·단건 조회 |
| POST | `/user/survey/create` | ✓ | 설문 생성 (트랜잭션) |
| POST | `/user/survey/info` | ✓ | 설문 응답 제출 |
| DELETE | `/user/survey/info` | ✓ | 설문 삭제 |
| POST | `/user/file/upload` | ✓ | 파일 업로드 |

---

## 10. Tailwind 커스텀 색상 구성

> **중요**: `extend.colors`에 `blue: '#4c88e9'` 처럼 flat 문자열을 넣으면
> 해당 색상의 **shade 스케일 전체가 CSS 출력에서 사라집니다.**
> `bg-blue-600`, `text-blue-500` 등이 먹히지 않는 원인이 됩니다.

### 올바른 설정 — shade 객체 + DEFAULT

```js
// tailwind.config.js
colors: {
    blue: {
        DEFAULT: '#4c88e9',  // bg-blue (shade 없이 사용)
        50:  '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',      // bg-blue-600 ✓
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
    },
    // purple, pink, green, orange, red 동일 패턴
}
```

### 커스텀 단색 (shade 불필요한 경우)

```js
gray1: '#3b424b',   // bg-gray1
gray2: '#68707d',   // bg-gray2
purpler: 'rgb(44 29 83 / 88%)',
```

---

## 11. 주요 구현 포인트 & 해결한 이슈

### ① 모달 애니메이션 "타닥" 현상

**문제**: `{isOpen && <motion.div>}` 패턴은 `AnimatePresence` 없이 쓰면
첫 번째 마운트 시 `initial` 값이 적용되지 않아 팝업이 갑자기 등장(타닥)합니다.

**해결**: `AnimatePresence` 래퍼 추가 + 모달 카드에 고유 `key` 부여.

```tsx
<AnimatePresence>
    {isOpen && (
        <motion.div
            key="board-modal-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
        >
            <motion.div
                key={`board-modal-${boardCurrentData?.boardIdx ?? modalState}`}
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
```

---

### ② React 18 StrictMode 이중 소켓

**문제**: StrictMode에서 `useEffect`가 mount → unmount → mount 순서로 두 번 실행.
두 번째 실행에서 소켓이 하나 더 생성되어 메시지가 2회 수신됩니다.

**해결**: `cancelled` 클로저 플래그로 두 번째 실행 차단.

```js
let cancelled = false;
import('socket.io-client').then(({ io }) => {
    if (cancelled) return;
    socket = io(WS_URL, { transports: ['websocket'] });
});
return () => { cancelled = true; socket?.disconnect(); };
```

---

### ③ snake_case → camelCase 변환

TiDB(MySQL)는 `snake_case` 컬럼명 사용.  
프론트 코드 일관성을 위해 **SQL 별칭**으로 변환 (ORM 없이 직접 SQL 작성).

```sql
SELECT
    board_idx  AS boardIdx,
    usr_nm     AS usrNm,
    reply_cnt  AS replyCnt,
    COALESCE(DATE_FORMAT(reg_dt, '%Y-%m-%d'), DATE_FORMAT(NOW(), '%Y-%m-%d')) AS regDt
FROM board
```

---

### ④ 기존 레코드 등록일 NULL 처리

레거시 레코드의 `reg_dt = NULL` 을 `COALESCE`로 오늘 날짜 fallback.

```sql
COALESCE(
    DATE_FORMAT(b.reg_dt, '%Y-%m-%d'),
    DATE_FORMAT(NOW(), '%Y-%m-%d')
) AS regDt
```

---

### ⑤ Material Tailwind CSS 충돌

`@material-tailwind/react` 글로벌 CSS가 `button { background-color: transparent }` 를 강제.  
Tailwind 유틸리티 클래스가 덮어씌워지는 경우 **인라인 스타일** 또는
`!important` 클래스(`!bg-blue-600`)로 해결.

```tsx
// Comments.tsx 예시
<div style={{ backgroundColor: '#f8fafc', color: '#1e293b', padding: '12px' }}>
```

---

### ⑥ 모달 state 배칭

`async` 함수 안에서 state를 여러 번 `set` 하면 React 17 이하에서는 각각 렌더가 발생하지만,
React 18에서는 자동 배칭이 됩니다. 단, `await` 이후 동기 블록에서 연속 호출해야 합니다.

```tsx
// ✓ await 후 동기 블록 → 단일 렌더
const _res = await instance.get('/user/board/info', { params: { boardIdx } });
if (_res?.status === 200) {
    setBoardCurrentData(_res.data.one);  // 1차
    setModalState(flag);                 // 2차  → React 18 자동 배칭으로 단일 렌더
    setIsOpen(true);                     // 3차
}
```

---

## 12. 데모 계정

```
아이디 : test
비밀번호 : Test1234!
```

로그인 후 테스트 가능한 기능:

- 게시글 작성 · 수정 · 삭제 (CKEditor + 파일 첨부)
- 댓글 작성 · 삭제
- 캘린더 일정 추가 · 수정 · 삭제
- 채팅방 생성 및 실시간 채팅
- 설문 생성 · 응답 제출

---

## 라이선스

개인 포트폴리오 프로젝트입니다. 참고·학습 목적의 코드 활용은 자유롭게 하셔도 됩니다.
