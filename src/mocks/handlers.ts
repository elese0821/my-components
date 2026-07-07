import { http, HttpResponse } from 'msw'

interface MockUser {
    id: string
    pw: string
    username: string
    USR_IDX: string
}

interface BoardItem {
    boardIdx: number
    title: string
    usrNm: string
    usrIdx: string
    contents: string
    replyCnt: number
    views: number
    regDt: string
    files: string
}

interface ReplyItem {
    replyIdx: number
    boardIdx: number
    writerNm: string
    contents: string
    regDt: string
}

interface SurveyItem {
    surveyIdx: number
    title: string
    contents: string
    finishSurvey: string
}

interface SurveyQuestion {
    surveyIdx: number
    questIdx: number
    questOrderNo: number
    questTitle: string
    questDesc: string
    questType: string
    userAnswer: string | number
    selIdx: number
    answerTitle: string
    answerWeight: number
    answerOrderNo: number
}

interface ScheduleItem {
    scheduleIdx: number
    scheduleTitle: string
    color: string
    fromDt: string
    toDt: string
    contents: string
}

interface ChatRoom {
    channelId: string
    chatNm: string
    lastChat: string
    regDt: string
    usrNm: string
}

interface ChatMessage {
    usrIdx: string
    usrNm: string
    contents: string
    chatType: string
    regDt: string
    fileName?: string
}

// ── Users ──────────────────────────────────────────────────────────────────
const users: MockUser[] = [
    { id: 'test', pw: 'Test1234!', username: '테스트유저', USR_IDX: '1' },
    { id: 'admin', pw: 'Admin1234!', username: '관리자', USR_IDX: '2' },
]

// ── Board ──────────────────────────────────────────────────────────────────
let boardList: BoardItem[] = Array.from({ length: 15 }, (_, i) => ({
    boardIdx: i + 1,
    title: `샘플 게시물 ${i + 1}번`,
    usrNm: i % 3 === 0 ? '관리자' : '테스트유저',
    usrIdx: i % 3 === 0 ? '2' : '1',
    contents: `<p>샘플 게시물 ${i + 1}번의 내용입니다. 포트폴리오 데모용 게시물입니다.</p><p>두 번째 문단입니다.</p>`,
    replyCnt: Math.floor(Math.random() * 5),
    views: Math.floor(Math.random() * 100),
    regDt: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
    files: '',
}))

// ── Replies (Comments) ─────────────────────────────────────────────────────
let replyList: ReplyItem[] = [
    { replyIdx: 1, boardIdx: 1, writerNm: '관리자', contents: '좋은 글 감사합니다!', regDt: '2026-05-01' },
    { replyIdx: 2, boardIdx: 1, writerNm: '테스트유저', contents: '저도 동의합니다.', regDt: '2026-05-02' },
    { replyIdx: 3, boardIdx: 2, writerNm: '관리자', contents: '두 번째 게시물 댓글입니다.', regDt: '2026-05-03' },
]

// ── Survey ─────────────────────────────────────────────────────────────────
const surveyList: SurveyItem[] = [
    { surveyIdx: 1, title: '고객 만족도 설문', contents: '서비스 이용에 대한 만족도를 알려주세요. 솔직한 의견이 서비스 개선에 큰 도움이 됩니다.', finishSurvey: 'N' },
    { surveyIdx: 2, title: '제품 품질 설문 (완료)', contents: '제품 품질에 대해 평가해주세요.', finishSurvey: 'Y' },
    { surveyIdx: 3, title: '직원 만족도 설문', contents: '근무 환경 및 복지에 대한 의견을 알려주세요.', finishSurvey: 'N' },
]

const surveyQuestions: SurveyQuestion[] = [
    // Survey 1 — 고객 만족도
    { surveyIdx: 1, questIdx: 1, questOrderNo: 1, questTitle: '전반적인 서비스 만족도는?', questDesc: '이용하신 서비스 전반에 대해 평가해 주세요.', questType: 'S', userAnswer: '', selIdx: 1, answerTitle: '매우 만족', answerWeight: 5, answerOrderNo: 1 },
    { surveyIdx: 1, questIdx: 1, questOrderNo: 1, questTitle: '전반적인 서비스 만족도는?', questDesc: '이용하신 서비스 전반에 대해 평가해 주세요.', questType: 'S', userAnswer: '', selIdx: 2, answerTitle: '만족', answerWeight: 4, answerOrderNo: 2 },
    { surveyIdx: 1, questIdx: 1, questOrderNo: 1, questTitle: '전반적인 서비스 만족도는?', questDesc: '이용하신 서비스 전반에 대해 평가해 주세요.', questType: 'S', userAnswer: '', selIdx: 3, answerTitle: '보통', answerWeight: 3, answerOrderNo: 3 },
    { surveyIdx: 1, questIdx: 1, questOrderNo: 1, questTitle: '전반적인 서비스 만족도는?', questDesc: '이용하신 서비스 전반에 대해 평가해 주세요.', questType: 'S', userAnswer: '', selIdx: 4, answerTitle: '불만족', answerWeight: 2, answerOrderNo: 4 },
    { surveyIdx: 1, questIdx: 2, questOrderNo: 2, questTitle: '다시 이용하실 의향이 있으신가요?', questDesc: '', questType: 'S', userAnswer: '', selIdx: 5, answerTitle: '예, 이용할 것입니다', answerWeight: 1, answerOrderNo: 1 },
    { surveyIdx: 1, questIdx: 2, questOrderNo: 2, questTitle: '다시 이용하실 의향이 있으신가요?', questDesc: '', questType: 'S', userAnswer: '', selIdx: 6, answerTitle: '아니오', answerWeight: 0, answerOrderNo: 2 },
    { surveyIdx: 1, questIdx: 3, questOrderNo: 3, questTitle: '개선이 필요한 사항을 자유롭게 작성해 주세요.', questDesc: '구체적으로 작성해 주시면 개선에 큰 도움이 됩니다.', questType: 'T', userAnswer: '', selIdx: 7, answerTitle: '', answerWeight: 0, answerOrderNo: 1 },

    // Survey 2 — 완료된 설문 (user answers included)
    { surveyIdx: 2, questIdx: 4, questOrderNo: 1, questTitle: '제품 품질에 대해 어떻게 생각하시나요?', questDesc: '', questType: 'S', userAnswer: 8, selIdx: 8, answerTitle: '매우 우수', answerWeight: 5, answerOrderNo: 1 },
    { surveyIdx: 2, questIdx: 4, questOrderNo: 1, questTitle: '제품 품질에 대해 어떻게 생각하시나요?', questDesc: '', questType: 'S', userAnswer: 8, selIdx: 9, answerTitle: '우수', answerWeight: 4, answerOrderNo: 2 },
    { surveyIdx: 2, questIdx: 4, questOrderNo: 1, questTitle: '제품 품질에 대해 어떻게 생각하시나요?', questDesc: '', questType: 'S', userAnswer: 8, selIdx: 10, answerTitle: '보통', answerWeight: 3, answerOrderNo: 3 },
    { surveyIdx: 2, questIdx: 5, questOrderNo: 2, questTitle: '가격 대비 품질은 만족스럽습니까?', questDesc: '', questType: 'S', userAnswer: 11, selIdx: 11, answerTitle: '매우 만족', answerWeight: 5, answerOrderNo: 1 },
    { surveyIdx: 2, questIdx: 5, questOrderNo: 2, questTitle: '가격 대비 품질은 만족스럽습니까?', questDesc: '', questType: 'S', userAnswer: 11, selIdx: 12, answerTitle: '만족', answerWeight: 4, answerOrderNo: 2 },
    { surveyIdx: 2, questIdx: 5, questOrderNo: 2, questTitle: '가격 대비 품질은 만족스럽습니까?', questDesc: '', questType: 'S', userAnswer: 11, selIdx: 13, answerTitle: '불만족', answerWeight: 2, answerOrderNo: 3 },

    // Survey 3 — 직원 만족도
    { surveyIdx: 3, questIdx: 6, questOrderNo: 1, questTitle: '전반적인 근무 환경 만족도는?', questDesc: '', questType: 'S', userAnswer: '', selIdx: 14, answerTitle: '매우 좋음', answerWeight: 5, answerOrderNo: 1 },
    { surveyIdx: 3, questIdx: 6, questOrderNo: 1, questTitle: '전반적인 근무 환경 만족도는?', questDesc: '', questType: 'S', userAnswer: '', selIdx: 15, answerTitle: '좋음', answerWeight: 4, answerOrderNo: 2 },
    { surveyIdx: 3, questIdx: 6, questOrderNo: 1, questTitle: '전반적인 근무 환경 만족도는?', questDesc: '', questType: 'S', userAnswer: '', selIdx: 16, answerTitle: '보통', answerWeight: 3, answerOrderNo: 3 },
    { surveyIdx: 3, questIdx: 6, questOrderNo: 1, questTitle: '전반적인 근무 환경 만족도는?', questDesc: '', questType: 'S', userAnswer: '', selIdx: 17, answerTitle: '나쁨', answerWeight: 2, answerOrderNo: 4 },
    { surveyIdx: 3, questIdx: 7, questOrderNo: 2, questTitle: '복지 제도에 대한 의견을 작성해 주세요.', questDesc: '개선 사항이나 희망하는 복지를 알려주세요.', questType: 'T', userAnswer: '', selIdx: 18, answerTitle: '', answerWeight: 0, answerOrderNo: 1 },
]

// ── Schedule (Calendar) ────────────────────────────────────────────────────
let scheduleList: ScheduleItem[] = [
    { scheduleIdx: 1, scheduleTitle: '팀 미팅', color: '#3788d8', fromDt: '2026-06-02', toDt: '2026-06-02', contents: '월간 팀 미팅' },
    { scheduleIdx: 2, scheduleTitle: '프로젝트 마감', color: '#d80000', fromDt: '2026-06-15', toDt: '2026-06-15', contents: '프로젝트 A 마감일' },
    { scheduleIdx: 3, scheduleTitle: '워크샵', color: '#28a745', fromDt: '2026-06-20', toDt: '2026-06-23', contents: '여름 워크샵' },
    { scheduleIdx: 4, scheduleTitle: '정기 점검', color: '#fd7e14', fromDt: '2026-06-05', toDt: '2026-06-05', contents: '서버 정기 점검' },
]

// ── Chat ───────────────────────────────────────────────────────────────────
let chatRooms: ChatRoom[] = [
    { channelId: 'room-1', chatNm: '일반 채팅방', lastChat: '안녕하세요!', regDt: '2026-06-05 10:30', usrNm: '관리자' },
    { channelId: 'room-2', chatNm: '개발팀 채팅', lastChat: '배포 완료했습니다', regDt: '2026-06-04 15:00', usrNm: '테스트유저' },
    { channelId: 'room-3', chatNm: '공지사항', lastChat: '', regDt: '2026-06-01 09:00', usrNm: '관리자' },
]

const chatMessages: Record<string, ChatMessage[]> = {
    'room-1': [
        { usrIdx: '2', usrNm: '관리자', contents: '안녕하세요!', chatType: 'C', regDt: '2026-06-05 10:30' },
        { usrIdx: '1', usrNm: '테스트유저', contents: '반갑습니다', chatType: 'C', regDt: '2026-06-05 10:31' },
    ],
    'room-2': [
        { usrIdx: '1', usrNm: '테스트유저', contents: '배포 완료했습니다', chatType: 'C', regDt: '2026-06-04 15:00' },
    ],
    'room-3': [],
}

// ── In-memory file store ───────────────────────────────────────────────────
interface StoredFile {
    orgNm: string
    bytes: Uint8Array
    mimeType: string
}
let fileCounter = 100
const fileStore = new Map<number, StoredFile>()

// ── Auth helper ────────────────────────────────────────────────────────────
function getAuthUser(request: Request): MockUser | null {
    const token = request.headers.get('X-AUTH-TOKEN')
    if (!token || token === 'null' || token === 'undefined') return null
    const match = token.match(/^mock-token-(.+)-\d+$/)
    if (!match) return null
    return users.find(u => u.id === match[1]) ?? null
}

const UNAUTHORIZED = () => new HttpResponse(null, { status: 401 })

// ── Handlers ───────────────────────────────────────────────────────────────
export const handlers = [
    // 로그인
    http.post('/login', async ({ request }) => {
        const body = await request.json() as { id: string; pw: string }
        const user = users.find(u => u.id === body.id && u.pw === body.pw)
        if (user) {
            return HttpResponse.json({
                result: 'success',
                username: user.username,
                token: `mock-token-${user.id}-${Date.now()}`,
                USR_IDX: user.USR_IDX,
            })
        }
        return HttpResponse.json({ result: 'fail', message: '아이디 또는 비밀번호가 틀렸습니다.' })
    }),

    // 회원가입
    http.post('/regist', async ({ request }) => {
        const body = await request.json() as { id: string; pw: string; usrNm: string; email: string }
        if (users.find(u => u.id === body.id)) {
            return HttpResponse.json({ result: 'fail', msg: '이미 사용 중인 아이디입니다.' })
        }
        users.push({ id: body.id, pw: body.pw, username: body.usrNm, USR_IDX: String(users.length + 1) })
        return HttpResponse.json({ result: 'success', msg: '회원가입이 완료되었습니다.' })
    }),

    // 게시판 목록 / 단건 조회
    http.get('/user/board/info', ({ request }) => {
        const url = new URL(request.url)
        const boardIdx = url.searchParams.get('boardIdx')

        if (boardIdx) {
            const item = boardList.find(b => b.boardIdx === Number(boardIdx))
            return HttpResponse.json({ result: 'success', one: item ?? null })
        }

        const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
        const row = Number(url.searchParams.get('row') ?? 10)
        const searchStr = url.searchParams.get('searchStr')

        let filtered = searchStr
            ? boardList.filter(b => b.title.includes(searchStr) || b.contents.includes(searchStr))
            : [...boardList]

        filtered.sort((a, b) => b.boardIdx - a.boardIdx)

        const start = (pageNo - 1) * row
        const list = filtered.slice(start, start + row)

        return HttpResponse.json({ result: 'success', list, total: filtered.length })
    }),

    // 게시물 작성
    http.post('/user/board/info', async ({ request }) => {
        const user = getAuthUser(request)
        if (!user) return UNAUTHORIZED()
        const body = await request.json() as { title: string; contents: string; fileIdx: string }
        const newItem: BoardItem = {
            boardIdx: boardList.length > 0 ? Math.max(...boardList.map(b => b.boardIdx)) + 1 : 1,
            title: body.title,
            usrNm: user.username,
            usrIdx: user.USR_IDX,
            contents: body.contents,
            replyCnt: 0,
            views: 0,
            regDt: new Date().toISOString().slice(0, 10),
            files: body.fileIdx ?? '',
        }
        boardList.unshift(newItem)
        return HttpResponse.json({ result: 'success' })
    }),

    // 게시물 수정
    http.patch('/user/board/info', async ({ request }) => {
        const user = getAuthUser(request)
        if (!user) return UNAUTHORIZED()
        const body = await request.json() as { boardIdx: number; title: string; contents: string }
        const idx = boardList.findIndex(b => b.boardIdx === body.boardIdx)
        if (idx !== -1) {
            boardList[idx] = { ...boardList[idx], title: body.title, contents: body.contents }
        }
        return HttpResponse.json({ result: 'success' })
    }),

    // 게시물 삭제
    http.delete('/user/board/info', ({ request }) => {
        const user = getAuthUser(request)
        if (!user) return UNAUTHORIZED()
        const url = new URL(request.url)
        const boardIdx = Number(url.searchParams.get('boardIdx'))
        boardList = boardList.filter(b => b.boardIdx !== boardIdx)
        return HttpResponse.json({ result: 'success' })
    }),

    // 댓글 목록
    http.get('/user/board/reply/info', ({ request }) => {
        const url = new URL(request.url)
        const boardIdx = Number(url.searchParams.get('boardIdx'))
        const pageNo = Number(url.searchParams.get('pageNo') ?? 1)
        const row = Number(url.searchParams.get('row') ?? 5)

        const filtered = replyList.filter(r => r.boardIdx === boardIdx)
        const start = (pageNo - 1) * row
        const list = filtered.slice(start, start + row)

        return HttpResponse.json({ result: 'success', list, total: filtered.length })
    }),

    // 댓글 작성
    http.post('/user/board/reply/info', async ({ request }) => {
        const user = getAuthUser(request)
        if (!user) return UNAUTHORIZED()
        const body = await request.json() as { boardIdx: number; contents: string }
        const newReply: ReplyItem = {
            replyIdx: replyList.length > 0 ? Math.max(...replyList.map(r => r.replyIdx)) + 1 : 1,
            boardIdx: body.boardIdx,
            writerNm: user.username,
            contents: body.contents,
            regDt: new Date().toISOString().slice(0, 10),
        }
        replyList.push(newReply)
        const boardIdx = boardList.findIndex(b => b.boardIdx === body.boardIdx)
        if (boardIdx !== -1) boardList[boardIdx].replyCnt += 1
        return HttpResponse.json({ result: 'success' })
    }),

    // 설문 목록 / 단건 조회
    http.get('/user/survey/info', ({ request }) => {
        const url = new URL(request.url)
        const surveyIdx = url.searchParams.get('surveyIdx')

        if (surveyIdx) {
            const questions = surveyQuestions.filter(q => q.surveyIdx === Number(surveyIdx))
            return HttpResponse.json({ result: 'success', one: questions })
        }

        return HttpResponse.json({ result: 'success', list: surveyList })
    }),

    // 설문 결과 조회 (완료된 설문)
    http.get('/user/survey/info/result', ({ request }) => {
        const url = new URL(request.url)
        const surveyIdx = Number(url.searchParams.get('surveyIdx'))
        const questions = surveyQuestions.filter(q => q.surveyIdx === surveyIdx)
        return HttpResponse.json({ result: 'success', one: questions })
    }),

    // 설문 답변 제출
    http.post('/user/survey/info', async ({ request }) => {
        const user = getAuthUser(request)
        if (!user) return UNAUTHORIZED()
        const body = await request.json() as { surveyIdx: number; contents: any[] }
        const survey = surveyList.find(s => s.surveyIdx === body.surveyIdx)
        if (survey) survey.finishSurvey = 'Y'
        return HttpResponse.json({ result: 'success' })
    }),

    // 일정(캘린더) 목록
    http.get('/user/schedule/info', () => {
        return HttpResponse.json({ result: 'success', list: scheduleList })
    }),

    // 일정 추가
    http.post('/user/schedule/info', async ({ request }) => {
        const body = await request.json() as { title: string; color: string; fromDt: string; toDt: string; contents: string }
        const newSchedule: ScheduleItem = {
            scheduleIdx: scheduleList.length > 0 ? Math.max(...scheduleList.map(s => s.scheduleIdx)) + 1 : 1,
            scheduleTitle: body.title,
            color: body.color || '#3788d8',
            fromDt: body.fromDt,
            toDt: body.toDt,
            contents: body.contents || '',
        }
        scheduleList.push(newSchedule)
        return HttpResponse.json({ result: 'success', scheduleIdx: newSchedule.scheduleIdx })
    }),

    // 일정 수정
    http.patch('/user/schedule/info', async ({ request }) => {
        const body = await request.json() as { scheduleIdx: number; title: string; color: string; fromDt: string; toDt: string; contents: string }
        const idx = scheduleList.findIndex(s => s.scheduleIdx === body.scheduleIdx)
        if (idx !== -1) {
            scheduleList[idx] = {
                ...scheduleList[idx],
                scheduleTitle: body.title ?? scheduleList[idx].scheduleTitle,
                color: body.color ?? scheduleList[idx].color,
                fromDt: body.fromDt ?? scheduleList[idx].fromDt,
                toDt: body.toDt ?? scheduleList[idx].toDt,
                contents: body.contents ?? scheduleList[idx].contents,
            }
        }
        return HttpResponse.json({ result: 'success' })
    }),

    // 일정 삭제
    http.delete('/user/schedule/info', async ({ request }) => {
        const body = await request.json() as { scheduleIdx: number }
        scheduleList = scheduleList.filter(s => s.scheduleIdx !== body.scheduleIdx)
        return HttpResponse.json({ result: 'success' })
    }),

    // 채팅방 목록
    http.get('/user/chat', ({ request }) => {
        const user = getAuthUser(request)
        if (!user) return UNAUTHORIZED()
        return HttpResponse.json({ result: 'success', list: chatRooms })
    }),

    // 채팅방 생성
    http.post('/user/chat', async ({ request }) => {
        const user = getAuthUser(request)
        if (!user) return UNAUTHORIZED()
        const body = await request.json() as { chatNm: string; pw: string }
        const newRoom: ChatRoom = {
            channelId: `room-${Date.now()}`,
            chatNm: body.chatNm,
            lastChat: '',
            regDt: new Date().toISOString().slice(0, 16).replace('T', ' '),
            usrNm: user.username,
        }
        chatRooms.unshift(newRoom)
        chatMessages[newRoom.channelId] = []
        return HttpResponse.json({ result: 'success', channelId: newRoom.channelId })
    }),

    // 채팅방 입장 / 채팅 기록 조회
    http.get('/user/chat/:channelId', ({ request, params }) => {
        const user = getAuthUser(request)
        if (!user) return UNAUTHORIZED()
        const { channelId } = params as { channelId: string }
        const messages = chatMessages[channelId] ?? []
        return HttpResponse.json({ result: 'success', list: messages })
    }),

    // 파일 업로드
    http.post('/file/upload', async ({ request }) => {
        const formData = await request.formData()
        const files = formData.getAll('file[]') as File[]
        const fileIdxList: number[] = []
        for (const file of files) {
            const buffer = await file.arrayBuffer()
            fileStore.set(fileCounter, {
                orgNm: file.name,
                bytes: new Uint8Array(buffer),
                mimeType: file.type,
            })
            fileIdxList.push(fileCounter++)
        }
        return HttpResponse.json({ result: 'success', fileIdxList })
    }),

    // 파일 다운로드
    http.get('/file/download/:fileIdx', ({ params }) => {
        const { fileIdx } = params as { fileIdx: string }
        const file = fileStore.get(Number(fileIdx))
        if (!file) return new HttpResponse(null, { status: 404 })
        return new HttpResponse(file.bytes, {
            headers: {
                'Content-Type': file.mimeType,
                'Content-Disposition': `inline; filename="${encodeURIComponent(file.orgNm)}"`,
            },
        })
    }),
]
