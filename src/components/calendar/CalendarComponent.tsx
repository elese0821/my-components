import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import calendarService from '../../services/calendar/calendarService';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import {
    XMarkIcon, PlusIcon, MagnifyingGlassIcon,
    ChevronLeftIcon, ChevronRightIcon,
    LinkIcon, ArrowPathIcon, PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

// ── 상수 ────────────────────────────────────────────────────────
const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const CATEGORIES = [
    { id: 'work',     label: '업무', color: '#6366f1', bg: '#eef2ff', emoji: '💼' },
    { id: 'personal', label: '개인', color: '#10b981', bg: '#ecfdf5', emoji: '🏠' },
    { id: 'health',   label: '건강', color: '#ef4444', bg: '#fef2f2', emoji: '❤️' },
    { id: 'meet',     label: '약속', color: '#f59e0b', bg: '#fffbeb', emoji: '👥' },
    { id: 'memo',     label: '메모', color: '#8b5cf6', bg: '#f5f3ff', emoji: '📝' },
] as const;

const PRIORITIES = [
    { id: 'high',   label: '높음', color: '#ef4444', bg: '#fef2f2', dot: '🔴' },
    { id: 'medium', label: '보통', color: '#f59e0b', bg: '#fffbeb', dot: '🟡' },
    { id: 'low',    label: '낮음', color: '#10b981', bg: '#ecfdf5', dot: '🔵' },
] as const;

const REPEATS = [
    { id: 'none', label: '없음' }, { id: 'daily', label: '매일' },
    { id: 'weekly', label: '매주' }, { id: 'monthly', label: '매월' },
    { id: 'yearly', label: '매년' },
] as const;

type CatId    = typeof CATEGORIES[number]['id'] | '';
type Priority = typeof PRIORITIES[number]['id'] | '';
type Repeat   = typeof REPEATS[number]['id'];
type ViewKey  = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';

const KO_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** 이 일수 이상이면 "장기 일정"으로 처리 → 배경 밴드 + 라벨 칩 */
const LONG_DAYS = 5;

/** 한국 공휴일 — MM-DD(매년 고정) | YYYY-MM-DD(가변) */
const HOLIDAYS: Record<string, string> = {
    // ── 고정 공휴일 ──
    '01-01':'신정',   '03-01':'삼일절',   '05-05':'어린이날',
    '06-06':'현충일', '08-15':'광복절',   '10-03':'개천절',
    '10-09':'한글날', '12-25':'성탄절',
    // ── 2024 가변 ──
    '2024-02-09':'설날 전날', '2024-02-10':'설날', '2024-02-11':'설날 다음날', '2024-02-12':'대체공휴일',
    '2024-05-15':'부처님오신날',
    '2024-09-16':'추석 전날', '2024-09-17':'추석', '2024-09-18':'추석 다음날',
    // ── 2025 가변 ──
    '2025-01-28':'설날 전날', '2025-01-29':'설날', '2025-01-30':'설날 다음날',
    '2025-05-05':'어린이날/부처님오신날',
    '2025-10-05':'추석 전날', '2025-10-06':'추석', '2025-10-07':'추석 다음날',
    // ── 2026 가변 ──
    '2026-02-16':'설날 전날', '2026-02-17':'설날', '2026-02-18':'설날 다음날',
    '2026-05-24':'부처님오신날',
    '2026-09-23':'추석 전날', '2026-09-24':'추석', '2026-09-25':'추석 다음날',
    // ── 2027 가변 ──
    '2027-02-06':'설날 전날', '2027-02-07':'설날', '2027-02-08':'설날 다음날',
    '2027-05-13':'부처님오신날',
    '2027-09-14':'추석 전날', '2027-09-15':'추석', '2027-09-16':'추석 다음날',
};
/** YYYY-MM-DD 날짜가 공휴일이면 이름 반환, 아니면 null */
function getHoliday(dateStr: string): string | null {
    return HOLIDAYS[dateStr] ?? HOLIDAYS[dateStr.slice(5)] ?? null;
}

// ── 헬퍼 ────────────────────────────────────────────────────────
function getContrastYIQ(hex: string) {
    const r = parseInt(hex.substr(1,2),16), g = parseInt(hex.substr(3,2),16), b = parseInt(hex.substr(5,2),16);
    return (r*299+g*587+b*114)/1000 >= 128 ? '#1e293b' : '#ffffff';
}
function toLocal(s: string): string {
    if (!s) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return `${s}T00:00`;
    if (s.includes('T')) return s.substring(0, 16);
    return s;
}
function fmtUpcoming(dt: string, allDay?: boolean): string {
    if (!dt) return '';
    const d = new Date(dt);
    const today = new Date(); today.setHours(0,0,0,0);
    const evDay = new Date(d); evDay.setHours(0,0,0,0);
    const diff = Math.round((evDay.getTime() - today.getTime()) / 86400000);
    const day = diff === 0 ? '오늘' : diff === 1 ? '내일' : diff === 2 ? '모레'
        : d.toLocaleDateString('ko-KR', { month:'short', day:'numeric' });
    if (allDay || !dt.includes('T')) return day;
    return `${day} ${d.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit',hour12:false})}`;
}
/** 두 날짜 사이의 달력 일수 */
function getSpanDays(start: string, end?: string): number {
    if (!start) return 1;
    const s = new Date(start.split('T')[0]).getTime();
    const e = end ? new Date(end.split('T')[0]).getTime() : s;
    return Math.max(1, Math.round((e - s) / 86400000));
}
/** 날짜에 n일 추가 → 'YYYY-MM-DD' */
function addDays(dateStr: string, n = 1): string {
    const d = new Date(dateStr.split('T')[0]);
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().split('T')[0];
}
/** hex → rgba */
function hexToRgba(hex: string, alpha: number): string {
    if (!hex || hex.length < 7) return `rgba(99,102,241,${alpha})`;
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${alpha})`;
}

// ── FC 스타일 ────────────────────────────────────────────────────
const FC_STYLES = `
.cal-wrap .fc .fc-scrollgrid,.cal-wrap .fc .fc-scrollgrid-section>*,.cal-wrap .fc th{border:none!important}
.cal-wrap .fc .fc-toolbar{padding:14px 16px 10px;margin:0}
.cal-wrap .fc .fc-toolbar-title{font-size:15px!important;font-weight:700!important;color:#1e293b!important;letter-spacing:-.01em}
.cal-wrap .fc .fc-button{background:transparent!important;border:1px solid #e2e8f0!important;color:#64748b!important;font-size:12px!important;font-weight:500!important;border-radius:8px!important;padding:5px 11px!important;box-shadow:none!important;transition:all .15s!important}
.cal-wrap .fc .fc-button:hover{background:#f8fafc!important;border-color:#cbd5e1!important;color:#334155!important}
.cal-wrap .fc .fc-button:focus{box-shadow:none!important}
.cal-wrap .fc .fc-prev-button,.cal-wrap .fc .fc-next-button{padding:5px 8px!important}
.cal-wrap .fc .fc-today-button{background:#6366f1!important;border-color:#6366f1!important;color:#fff!important;font-weight:600!important}
.cal-wrap .fc .fc-today-button:hover{background:#4f46e5!important;border-color:#4f46e5!important}
.cal-wrap .fc .fc-today-button:disabled{opacity:.4!important}
.cal-wrap .fc .fc-button-group{gap:4px!important}
.cal-wrap .fc .fc-col-header-cell{padding:10px 0 8px!important;background:transparent!important;border-bottom:1px solid #f1f5f9!important}
.cal-wrap .fc .fc-col-header-cell-cushion{font-size:11px!important;font-weight:600!important;text-transform:uppercase!important;letter-spacing:.06em!important;color:#94a3b8!important;padding:0!important;text-decoration:none!important}
.cal-wrap .fc .fc-col-header-cell.fc-day-sat .fc-col-header-cell-cushion{color:#93c5fd!important}
.cal-wrap .fc .fc-col-header-cell.fc-day-sun .fc-col-header-cell-cushion{color:#fca5a5!important}
.cal-wrap .fc .fc-daygrid-day{border-color:#f1f5f9!important}
.cal-wrap .fc .fc-daygrid-day-frame{min-height:78px;padding:2px}
.cal-wrap .fc .fc-daygrid-day-number{font-size:12px!important;font-weight:500!important;color:#475569!important;padding:6px 8px!important;text-decoration:none!important;line-height:1!important;width:26px;height:26px;display:flex!important;align-items:center!important;justify-content:center!important;border-radius:50%!important;transition:background .15s!important}
.cal-wrap .fc .fc-daygrid-day-number:hover{background:#f1f5f9!important}
.cal-wrap .fc .fc-day-today{background:#fafaff!important}
.cal-wrap .fc .fc-day-today .fc-daygrid-day-number{background:#6366f1!important;color:#fff!important;font-weight:700!important}
.cal-wrap .fc .fc-day-other .fc-daygrid-day-number{color:#cbd5e1!important}
.cal-wrap .fc .fc-day-sat .fc-daygrid-day-number{color:#93c5fd!important}
.cal-wrap .fc .fc-day-sun .fc-daygrid-day-number{color:#fca5a5!important}
.cal-wrap .fc .fc-day-today.fc-day-sat .fc-daygrid-day-number,.cal-wrap .fc .fc-day-today.fc-day-sun .fc-daygrid-day-number{color:#fff!important}
.cal-wrap .fc .fc-daygrid-event{border:none!important;border-radius:4px!important;font-size:11px!important;font-weight:500!important;padding:1px 5px!important;margin:1px 2px!important;cursor:pointer!important}
.cal-wrap .fc .fc-daygrid-event:hover{opacity:.82!important}
.cal-wrap .fc .fc-more-link{font-size:10px!important;color:#94a3b8!important;font-weight:600!important;padding:0 6px!important}
.cal-wrap .fc .fc-more-link:hover{color:#6366f1!important;text-decoration:none!important}
.cal-wrap .fc .fc-timegrid-slot{height:36px!important;border-color:#f8fafc!important}
.cal-wrap .fc .fc-timegrid-slot-label{font-size:10px!important;color:#cbd5e1!important;font-weight:500!important}
.cal-wrap .fc .fc-timegrid-event{border:none!important;border-radius:6px!important;cursor:pointer!important}
.cal-wrap .fc .fc-now-indicator-line{border-color:#ef4444!important;border-width:1.5px!important}
.cal-wrap .fc .fc-now-indicator-arrow{border-top-color:#ef4444!important}
.cal-wrap .fc .fc-list{border:none!important}
.cal-wrap .fc .fc-list-table{border:none!important}
.cal-wrap .fc .fc-list-day th{padding:8px 14px!important;background:#f8fafc!important;border:none!important;border-top:1px solid #f1f5f9!important;border-bottom:1px solid #f1f5f9!important}
.cal-wrap .fc .fc-list-day-cushion{background:transparent!important}
.cal-wrap .fc .fc-list-day-text,.cal-wrap .fc .fc-list-day-side-text{font-size:12px!important;font-weight:600!important;color:#64748b!important;text-decoration:none!important}
.cal-wrap .fc .fc-list-event td{border:none!important;padding:8px 14px!important}
.cal-wrap .fc .fc-list-event:hover td{background:#f8fafc!important;cursor:pointer}
.cal-wrap .fc .fc-list-event-title a{font-size:13px!important;color:#334155!important;text-decoration:none!important;font-weight:500!important}
.cal-wrap .fc .fc-list-event-time{font-size:11px!important;color:#94a3b8!important}
.cal-wrap .fc .fc-list-empty{background:transparent!important;color:#94a3b8!important;font-size:13px!important}
.cal-wrap .fc .fc-popover{border:1px solid #e2e8f0!important;border-radius:12px!important;box-shadow:0 8px 24px rgba(0,0,0,.1)!important;overflow:hidden!important}
.cal-wrap .fc .fc-popover-header{background:#f8fafc!important;padding:8px 12px!important;font-size:12px!important;font-weight:600!important;color:#475569!important;border-bottom:1px solid #f1f5f9!important}
.cal-wrap .fc .fc-highlight{background:#eef2ff!important}
.cal-wrap .fc .event-done{opacity:.45!important}
.cal-wrap .fc .event-done .cal-evt-title{text-decoration:line-through!important}
.cal-wrap .fc .event-dragging{opacity:.65!important;box-shadow:0 8px 20px rgba(0,0,0,.15)!important}

/* ── 장기 일정 전용 스타일 ── */
/* 배경 밴드: 투명도 그대로 (rgba로 제어) */
.cal-wrap .fc .fc-bg-event{border-radius:0!important;opacity:1!important}
/* 라벨 칩: 배경 제거 후 커스텀 렌더로만 표현 */
.cal-wrap .fc .event-long-label.fc-daygrid-event{
  background:transparent!important;border:none!important;box-shadow:none!important;
  padding:1px 2px!important;margin:1px 2px!important;cursor:pointer!important
}
.cal-wrap .fc .event-long-label .fc-event-main{padding:0!important}

/* 배경 밴드 최대 3개 겹침까지만, mix-blend-mode로 자연스럽게 혼합 */
.cal-wrap .fc .fc-bg-event{border-radius:0!important;opacity:1!important;mix-blend-mode:multiply!important}

/* ── 공휴일 ── */
.cal-wrap .fc .is-holiday .fc-daygrid-day-number{color:#fca5a5!important}
.cal-wrap .fc .is-holiday.fc-day-today .fc-daygrid-day-number{color:#fff!important}
.cal-wrap .fc .holiday-event.fc-daygrid-event{
  background:transparent!important;border:none!important;box-shadow:none!important;
  pointer-events:none!important;padding:0 2px!important;margin:0 1px!important;
}
.cal-wrap .fc .holiday-event .fc-event-main{padding:0!important}
`;

// ── 색상 선택기 ──────────────────────────────────────────────────
function ColorDot({ value, onChange }: { value: string; onChange:(c:string)=>void }) {
    const ref = React.useRef<HTMLInputElement>(null);
    const isPreset = COLORS.includes(value);
    return (
        <div className='flex items-center gap-2'>
            {COLORS.map(c => (
                <button key={c} type='button' onClick={() => onChange(c)}
                    className='w-5 h-5 rounded-full transition-all shrink-0'
                    style={{ backgroundColor:c, transform:value===c?'scale(1.25)':'scale(1)', boxShadow:value===c?`0 0 0 2px #fff,0 0 0 3.5px ${c}`:'none' }}
                />
            ))}
            <button type='button' onClick={() => ref.current?.click()}
                className='w-5 h-5 rounded-full border-[1.5px] border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors shrink-0'
                style={!isPreset ? {backgroundColor:value,border:'none',boxShadow:`0 0 0 2px #fff,0 0 0 3.5px ${value}`,transform:'scale(1.25)'} : {}}>
                {isPreset && <PlusIcon className='w-2.5 h-2.5 text-gray-400'/>}
            </button>
            <input ref={ref} type='color' value={value} onChange={e=>onChange(e.target.value)}
                className='absolute opacity-0 w-0 h-0 pointer-events-none'/>
        </div>
    );
}

// ── 미니 캘린더 ──────────────────────────────────────────────────
function MiniCalendar({ events, onNavigate }: { events: any[]; onNavigate:(d:Date)=>void }) {
    const now = new Date();
    const [yr, setYr] = React.useState(now.getFullYear());
    const [mo, setMo] = React.useState(now.getMonth());
    const prevMonth = () => { if (mo===0){setYr(y=>y-1);setMo(11);}else setMo(m=>m-1); };
    const nextMonth = () => { if (mo===11){setYr(y=>y+1);setMo(0);}else setMo(m=>m+1); };
    const firstDay    = new Date(yr, mo, 1).getDay();
    const daysInMonth = new Date(yr, mo+1, 0).getDate();
    const eventDays = new Set(
        events.map(e => new Date(e.start))
              .filter(d => d.getFullYear()===yr && d.getMonth()===mo)
              .map(d => d.getDate())
    );
    const cells: (number|null)[] = [...Array(firstDay).fill(null), ...Array.from({length:daysInMonth},(_,i)=>i+1)];
    while (cells.length % 7 !== 0) cells.push(null);
    return (
        <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-3'>
            <div className='flex items-center justify-between mb-2'>
                <button onClick={prevMonth} className='w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors'>
                    <ChevronLeftIcon className='h-3 w-3 text-gray-400'/>
                </button>
                <span className='text-xs font-semibold text-gray-600'>{yr}년 {mo+1}월</span>
                <button onClick={nextMonth} className='w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors'>
                    <ChevronRightIcon className='h-3 w-3 text-gray-400'/>
                </button>
            </div>
            <div className='grid grid-cols-7 mb-1'>
                {KO_DAYS.map((d,i) => (
                    <div key={d} className={`text-center text-[9px] font-bold pb-1 ${i===0?'text-red-300':i===6?'text-blue-300':'text-gray-300'}`}>{d}</div>
                ))}
            </div>
            <div className='grid grid-cols-7 gap-y-0.5'>
                {cells.map((day, idx) => {
                    if (!day) return <div key={`e${idx}`}/>;
                    const isToday = day===now.getDate() && mo===now.getMonth() && yr===now.getFullYear();
                    const hasEv = eventDays.has(day);
                    const col = idx % 7;
                    return (
                        <button key={day} onClick={() => onNavigate(new Date(yr, mo, day))}
                            className='flex flex-col items-center justify-center h-7 rounded-md transition-all hover:bg-gray-50 relative'
                            style={isToday ? {backgroundColor:'#6366f1'} : {}}>
                            <span className={`text-[11px] font-medium leading-none ${isToday?'text-white':col===0?'text-red-400':col===6?'text-blue-400':'text-gray-600'}`}>{day}</span>
                            {hasEv && !isToday && <span className='absolute bottom-0.5 w-1 h-1 rounded-full bg-indigo-400'/>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ── 이벤트 폼 타입 ───────────────────────────────────────────────
interface EventForm {
    title: string; color: string; fromDt: string; toDt: string;
    contents: string; allDay: boolean; category: CatId;
    priority: Priority; repeat: Repeat; url: string; done: boolean;
}
const DEFAULT_FORM: EventForm = {
    title:'', color:COLORS[0], fromDt:'', toDt:'', contents:'', allDay:false,
    category:'', priority:'', repeat:'none', url:'', done:false,
};

// ── 이벤트 모달 ──────────────────────────────────────────────────
function EventModal({ mode,form,setForm,onAdd,onModify,onDelete,onClose,saving=false }: {
    mode:'add'|'edit'; form:EventForm; setForm:(f:EventForm)=>void;
    onAdd:()=>void; onModify:()=>void; onDelete:()=>void; onClose:()=>void;
    saving?: boolean;
}) {
    const isEdit    = mode === 'edit';
    const canSubmit = form.title.trim().length > 0;
    const upd = (k: keyof EventForm) =>
        (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
            const val = e.target.value;
            if (k==='fromDt') { const next={...form,fromDt:val}; if(!form.toDt||val>form.toDt) next.toDt=val; setForm(next); }
            else setForm({...form,[k]:val});
        };
    const selectCat = (id: CatId) => {
        const cat = CATEGORIES.find(c=>c.id===id);
        const next: EventForm = {...form, category: id===form.category?'':id};
        if (cat && id!==form.category) next.color = cat.color;
        setForm(next);
    };
    const toggleAllDay = () => {
        const next=!form.allDay; let from=form.fromDt, to=form.toDt;
        if(next){from=from.split('T')[0]||from;to=to.split('T')[0]||to;}
        else{if(from&&!from.includes('T'))from+='T00:00';if(to&&!to.includes('T'))to+='T00:00';}
        setForm({...form,allDay:next,fromDt:from,toDt:to});
    };
    const ipt='w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/10';
    const spanDays = getSpanDays(form.fromDt, form.toDt);
    const isLongPreview = spanDays >= LONG_DAYS;

    return (
        <motion.div key='overlay'
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.16}}
            className='fixed inset-0 z-[200] flex items-end sm:items-center justify-center'
            style={{background:'rgba(15,15,25,.4)',backdropFilter:'blur(8px)'}}
            onClick={onClose}>
            <motion.div
                initial={{opacity:0,y:20,scale:.98}} animate={{opacity:1,y:0,scale:1}}
                exit={{opacity:0,y:12,scale:.98}} transition={{duration:.2,ease:[.16,1,.3,1]}}
                className='w-full sm:max-w-[460px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col'
                style={{maxHeight:'90dvh'}} onClick={e=>e.stopPropagation()}>

                <div className='h-[3px] shrink-0 transition-colors duration-300' style={{backgroundColor:form.color}}/>
                <div className='flex items-center justify-between px-5 pt-4 pb-3 shrink-0'>
                    <div className='flex items-center gap-2'>
                        <span className='w-2 h-2 rounded-full shrink-0 transition-colors duration-300' style={{backgroundColor:form.color}}/>
                        <span className='text-sm font-semibold text-gray-800'>{isEdit?'일정 수정':'새 일정'}</span>
                        {isLongPreview && (
                            <span className='px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-amber-50 text-amber-500 border border-amber-200'>
                                {spanDays}일 · 장기 일정
                            </span>
                        )}
                    </div>
                    <div className='flex items-center gap-1'>
                        {isEdit && (
                            <button onClick={()=>setForm({...form,done:!form.done})}
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${form.done?'bg-green-100 text-green-600':'hover:bg-gray-100 text-gray-400'}`}>
                                <CheckCircleIcon className='h-3.5 w-3.5'/>{form.done?'완료됨':'완료 처리'}
                            </button>
                        )}
                        <button onClick={onClose} className='w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 transition-colors'>
                            <XMarkIcon className='h-3.5 w-3.5'/>
                        </button>
                    </div>
                </div>
                <div className='h-px bg-gray-100 mx-5 shrink-0'/>

                <div className='overflow-y-auto flex-1 px-5 pt-4 pb-2 flex flex-col gap-3.5'>
                    {/* 카테고리 */}
                    <div>
                        <p className='text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-2'>카테고리</p>
                        <div className='flex flex-wrap gap-1.5'>
                            {CATEGORIES.map(cat=>(
                                <button key={cat.id} type='button' onClick={()=>selectCat(cat.id as CatId)}
                                    className='flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all active:scale-95'
                                    style={form.category===cat.id?{backgroundColor:cat.color,color:'#fff'}:{backgroundColor:cat.bg,color:cat.color}}>
                                    <span style={{fontSize:11}}>{cat.emoji}</span>{cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* 우선순위 */}
                    <div>
                        <p className='text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-2'>우선순위</p>
                        <div className='flex gap-1.5'>
                            {PRIORITIES.map(p=>(
                                <button key={p.id} type='button' onClick={()=>setForm({...form,priority:form.priority===p.id?'':p.id as Priority})}
                                    className='flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium transition-all active:scale-95'
                                    style={form.priority===p.id?{backgroundColor:p.color,color:'#fff'}:{backgroundColor:p.bg,color:p.color}}>
                                    {p.dot} {p.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* 제목 */}
                    <input placeholder='일정 제목' value={form.title} onChange={upd('title')} autoFocus className={`${ipt} font-medium text-[15px] py-2.5`}/>
                    {/* 하루 종일 */}
                    <div className='flex items-center justify-between'>
                        <span className='text-[10px] font-semibold text-gray-300 uppercase tracking-widest'>하루 종일</span>
                        <button type='button' onClick={toggleAllDay}
                            className={`w-10 h-[22px] rounded-full transition-colors relative shrink-0 ${form.allDay?'bg-indigo-500':'bg-gray-200'}`}>
                            <span className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${form.allDay?'left-[22px]':'left-[3px]'}`}/>
                        </button>
                    </div>
                    {/* 날짜 */}
                    <div className='grid grid-cols-2 gap-2.5'>
                        <div>
                            <label className='text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-1.5 block'>시작</label>
                            <input type={form.allDay?'date':'datetime-local'} value={form.fromDt} onChange={upd('fromDt')} className={ipt}/>
                        </div>
                        <div>
                            <label className='text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-1.5 block'>종료</label>
                            <input type={form.allDay?'date':'datetime-local'} value={form.toDt} min={form.fromDt||undefined} onChange={upd('toDt')} className={ipt}/>
                        </div>
                    </div>
                    {/* 장기 일정 안내 */}
                    {isLongPreview && (
                        <div className='flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg'>
                            <span className='text-sm shrink-0 mt-0.5'>🗓️</span>
                            <p className='text-[11px] text-amber-700 leading-relaxed'>
                                <span className='font-semibold'>{spanDays}일짜리 장기 일정</span>은 배경 색 밴드로 표시되어 다른 일정을 가리지 않습니다.
                            </p>
                        </div>
                    )}
                    {/* 반복 */}
                    <div>
                        <p className='text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-2 flex items-center gap-1.5'>
                            <ArrowPathIcon className='h-3 w-3'/>반복
                        </p>
                        <div className='flex flex-wrap gap-1.5'>
                            {REPEATS.map(r=>(
                                <button key={r.id} type='button' onClick={()=>setForm({...form,repeat:r.id as Repeat})}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${form.repeat===r.id?'bg-indigo-100 text-indigo-600 font-semibold':'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* 메모 */}
                    <textarea placeholder='메모 (선택)' value={form.contents} onChange={upd('contents')} rows={2} className={`${ipt} resize-none`}/>
                    {/* URL */}
                    <div className='relative'>
                        <LinkIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300 pointer-events-none'/>
                        <input placeholder='링크 URL (선택)' value={form.url} onChange={upd('url')} className={`${ipt} pl-8`}/>
                    </div>
                    {/* 색상 */}
                    <div className='flex items-center justify-between py-0.5'>
                        <span className='text-[10px] font-semibold text-gray-300 uppercase tracking-widest'>색상</span>
                        <ColorDot value={form.color} onChange={c=>setForm({...form,color:c})}/>
                    </div>
                </div>

                <div className='px-5 pt-3 pb-5 flex items-center gap-2 shrink-0 border-t border-gray-100 mt-1'>
                    <button onClick={onClose} className='px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all'>취소</button>
                    <div className='flex-1'/>
                    {isEdit && (
                        <button onClick={onDelete} className='px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 border border-red-100 transition-all active:scale-[.98]'>삭제</button>
                    )}
                    <button onClick={isEdit?onModify:onAdd} disabled={!canSubmit||saving}
                        className='px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[.98] disabled:opacity-40 disabled:cursor-not-allowed'
                        style={{backgroundColor:canSubmit?form.color:'#94a3b8'}}>
                        {saving ? '저장 중…' : isEdit ? '저장' : '추가'}
                    </button>
                </div>
                <div className='sm:hidden' style={{height:'env(safe-area-inset-bottom,0px)'}}/>
            </motion.div>
        </motion.div>
    );
}

// ── 사이드바 ────────────────────────────────────────────────────
function Sidebar({ events, filterCat, setFilterCat, filterPriority, setFilterPriority, hideDone, setHideDone, showHolidays, setShowHolidays, onNavigate, onEventEdit }: {
    events: any[]; filterCat: CatId; setFilterCat:(c:CatId)=>void;
    filterPriority: Priority; setFilterPriority:(p:Priority)=>void;
    hideDone: boolean; setHideDone:(v:boolean)=>void;
    showHolidays: boolean; setShowHolidays:(v:boolean)=>void;
    onNavigate:(d:Date)=>void;
    onEventEdit:(e:any)=>void;
}) {
    const now   = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = events.filter(e=>{const d=new Date(e.start);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();}).length;
    const thisWeek  = events.filter(e=>{const d=new Date(e.start);const w=new Date(today);w.setDate(today.getDate()+7);return d>=today&&d<w;}).length;
    const doneCount = events.filter(e=>e.extendedProps?.done).length;
    const longCount = events.filter(e=>e.extendedProps?.isLong).length;
    const [showAll, setShowAll] = React.useState(false);
    const upcomingAll = events.filter(e=>new Date(e.start)>=today)
        .sort((a,b)=>new Date(a.start).getTime()-new Date(b.start).getTime());
    const upcoming = showAll ? upcomingAll : upcomingAll.slice(0, 8);

    return (
        <div className='flex flex-col gap-3 overflow-y-auto' style={{maxHeight:'calc(100vh - 160px)'}}>
            <MiniCalendar events={events} onNavigate={onNavigate}/>

            {/* 오늘 + 통계 */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4'>
                <div className='flex items-center justify-between mb-3'>
                    <div>
                        <p className='text-[10px] font-semibold text-gray-300 uppercase tracking-widest'>오늘</p>
                        <p className='text-2xl font-bold text-gray-900 leading-none mt-0.5'>{now.getDate()}</p>
                        <p className='text-[11px] text-gray-400 mt-1'>{now.getFullYear()}.{now.getMonth()+1} {KO_DAYS[now.getDay()]}요일</p>
                    </div>
                    <div className='flex flex-col gap-2 text-right'>
                        <div><span className='text-[10px] text-gray-300 block'>이번 달</span><span className='text-sm font-bold text-gray-700'>{thisMonth}개</span></div>
                        <div><span className='text-[10px] text-gray-300 block'>이번 주</span><span className='text-sm font-bold text-gray-700'>{thisWeek}개</span></div>
                    </div>
                </div>
                {longCount > 0 && (
                    <div className='flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 rounded-lg mb-3 border border-amber-100'>
                        <span style={{fontSize:11}}>🗓️</span>
                        <span className='text-[11px] text-amber-600 font-medium'>장기 일정 {longCount}개</span>
                        <span className='text-[10px] text-amber-400 ml-auto'>배경 밴드</span>
                    </div>
                )}
                <div className='flex items-center justify-between pt-3 border-t border-gray-50'>
                    <span className='text-[11px] text-gray-400'>
                        완료된 일정 숨기기
                        {doneCount>0 && <span className='ml-1 text-green-500 font-semibold'>({doneCount})</span>}
                    </span>
                    <button onClick={()=>setHideDone(!hideDone)}
                        className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${hideDone?'bg-indigo-500':'bg-gray-200'}`}>
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${hideDone?'left-4':'left-0.5'}`}/>
                    </button>
                </div>
                <div className='flex items-center justify-between pt-2.5 border-t border-gray-50'>
                    <span className='text-[11px] text-gray-400 flex items-center gap-1.5'>
                        🇰🇷 공휴일 표시
                    </span>
                    <button onClick={()=>setShowHolidays(!showHolidays)}
                        className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${showHolidays?'bg-red-400':'bg-gray-200'}`}>
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${showHolidays?'left-4':'left-0.5'}`}/>
                    </button>
                </div>
            </div>

            {/* 카테고리 + 통계 바 */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4'>
                <p className='text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-3'>카테고리</p>
                <div className='flex flex-col gap-1.5'>
                    <button onClick={()=>setFilterCat('')}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${!filterCat?'bg-gray-100 text-gray-700 font-semibold':'text-gray-400 hover:bg-gray-50'}`}>
                        <span style={{fontSize:11}}>📋</span>전체
                        <span className='ml-auto text-[10px] opacity-50'>{events.length}</span>
                    </button>
                    {CATEGORIES.map(cat=>{
                        const cnt = events.filter(e=>e.extendedProps?.category===cat.id).length;
                        const active = filterCat===cat.id;
                        const pct = events.length ? Math.round(cnt/events.length*100) : 0;
                        return (
                            <div key={cat.id}>
                                <button onClick={()=>setFilterCat(active?'':cat.id as CatId)}
                                    className='w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all'
                                    style={active?{backgroundColor:cat.color+'15',color:cat.color,fontWeight:600}:{color:'#94a3b8'}}>
                                    <span style={{fontSize:11}}>{cat.emoji}</span>{cat.label}
                                    <span className='ml-auto text-[10px]' style={{color:active?cat.color:'#cbd5e1'}}>{cnt||''}</span>
                                </button>
                                {cnt>0 && (
                                    <div className='mx-2 mb-1 h-1 rounded-full bg-gray-100 overflow-hidden'>
                                        <div className='h-full rounded-full transition-all duration-500' style={{width:`${pct}%`,backgroundColor:cat.color+'88'}}/>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 우선순위 필터 */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4'>
                <p className='text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-3'>우선순위 필터</p>
                <div className='flex gap-1.5'>
                    {PRIORITIES.map(p=>{
                        const cnt = events.filter(e=>e.extendedProps?.priority===p.id).length;
                        const active = filterPriority===p.id;
                        return (
                            <button key={p.id} onClick={()=>setFilterPriority(active?'':p.id as Priority)}
                                className='flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-[10px] font-medium transition-all'
                                style={active?{backgroundColor:p.color,color:'#fff'}:{backgroundColor:p.bg,color:p.color}}>
                                <span style={{fontSize:13}}>{p.dot}</span>{p.label}
                                {cnt>0 && <span className='text-[9px] opacity-70'>{cnt}</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 다가오는 일정 */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4'>
                <div className='flex items-center justify-between mb-3'>
                    <p className='text-[10px] font-semibold text-gray-300 uppercase tracking-widest'>다가오는 일정</p>
                    {upcomingAll.length > 0 &&
                        <span className='text-[10px] text-gray-300'>{upcomingAll.length}개</span>}
                </div>
                {upcoming.length===0 ? (
                    <p className='text-xs text-gray-300 text-center py-3'>예정된 일정이 없습니다</p>
                ) : (
                    <div className='flex flex-col gap-0.5'>
                        {upcoming.map(e=>{
                            const cat  = CATEGORIES.find(c=>c.id===e.extendedProps?.category);
                            const pri  = PRIORITIES.find(p=>p.id===e.extendedProps?.priority);
                            const done = e.extendedProps?.done;
                            const isLong = e.extendedProps?.isLong;
                            return (
                                <button key={e.id} onClick={()=>onEventEdit(e)}
                                    className={`group flex items-start gap-2 w-full text-left px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors ${done?'opacity-50':''}`}>
                                    <div className='relative shrink-0 mt-1.5'>
                                        <div className='w-1.5 h-1.5 rounded-full' style={{backgroundColor:e.extendedProps?.color||e.backgroundColor}}/>
                                        {isLong && <span className='absolute -top-0.5 -right-0.5 w-1 h-1 rounded-full bg-amber-400'/>}
                                    </div>
                                    <div className='min-w-0 flex-1'>
                                        <div className='flex items-center gap-1'>
                                            {cat && <span style={{fontSize:9}}>{cat.emoji}</span>}
                                            {pri && <span style={{fontSize:8}}>{pri.dot}</span>}
                                            <span className={`text-xs font-medium text-gray-700 truncate ${done?'line-through':''}`}>{e.title}</span>
                                            {isLong && <span className='text-[9px] text-amber-500 shrink-0'>{e.extendedProps.spanDays}일</span>}
                                        </div>
                                        <span className='text-[10px] text-gray-400'>{fmtUpcoming(e.start, e.extendedProps?.isAllDay||e.allDay)}</span>
                                    </div>
                                    <PencilSquareIcon className='h-3 w-3 text-gray-200 group-hover:text-gray-400 shrink-0 mt-1 transition-colors'/>
                                </button>
                            );
                        })}
                        {upcomingAll.length > 8 && (
                            <button onClick={()=>setShowAll(v=>!v)}
                                className='text-[10px] text-indigo-400 hover:text-indigo-600 text-center mt-1 py-1 w-full transition-colors'>
                                {showAll ? '접기 ↑' : `+${upcomingAll.length-8}개 더보기`}
                            </button>
                        )}
                    </div>
                )}
                {/* 단축키 힌트 */}
                <div className='mt-3 pt-2.5 border-t border-gray-50 flex items-center gap-1.5 flex-wrap'>
                    {[['N','새 일정'],['T','오늘'],['M','월'],['W','주'],['?','단축키']].map(([k,d])=>(
                        <span key={k} className='flex items-center gap-1'>
                            <kbd className='inline-flex items-center justify-center w-4 h-4 bg-gray-100 rounded text-[9px] font-bold text-gray-500 border border-gray-200'>{k}</kbd>
                            <span className='text-[9px] text-gray-300'>{d}</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── 뷰 탭 / 단축키 ──────────────────────────────────────────────
const VIEWS = [
    {key:'dayGridMonth',label:'월'},{key:'timeGridWeek',label:'주'},
    {key:'timeGridDay',label:'일'},{key:'listWeek',label:'목록'},
] as const;
const SHORTCUTS = [
    {key:'N',desc:'새 일정'},{key:'T',desc:'오늘'},{key:'/',desc:'검색'},
    {key:'M',desc:'월간'},{key:'W',desc:'주간'},{key:'D',desc:'일간'},{key:'L',desc:'목록'},
];

// ── 메인 컴포넌트 ────────────────────────────────────────────────
export default function CalendarComponent() {
    const calRef = React.useRef<any>(null);

    /** rawEvents = 서버 원본 데이터 (1건 = 1이벤트) */
    const [rawEvents,      setRawEvents]      = React.useState<any[]>([]);
    const [schedIdx,       setSchedIdx]       = React.useState<number|null>(null);
    const [mode,           setMode]           = React.useState<'add'|'edit'>('add');
    const [showModal,      setShowModal]      = React.useState(false);
    const [form,           setForm]           = React.useState<EventForm>(DEFAULT_FORM);
    const [currentView,    setCurrentView]    = React.useState<ViewKey>('dayGridMonth');
    const [filterCat,      setFilterCat]      = React.useState<CatId>('');
    const [filterPriority, setFilterPriority] = React.useState<Priority>('');
    const [hideDone,       setHideDone]       = React.useState(false);
    const [search,         setSearch]         = React.useState('');
    const [searchOpen,     setSearchOpen]     = React.useState(false);
    const [showShortcuts,  setShowShortcuts]  = React.useState(false);
    const [showHolidays,   setShowHolidays]   = React.useState(true);
    const searchRef = React.useRef<HTMLInputElement>(null);

    // ── 데이터 로드 ─────────────────────────────────────────────
    const load = React.useCallback(async () => {
        try {
            const data = await calendarService.getSchedule();
            setRawEvents((data.list??[]).map((item:any) => {
                const spanDays = getSpanDays(item.fromDt, item.toDt || item.fromDt);
                const isLong   = spanDays >= LONG_DAYS;
                return {
                    id:              String(item.scheduleIdx),
                    title:           item.scheduleTitle,
                    start:           item.fromDt,
                    end:             item.toDt,
                    allDay:          item.allDay || false,
                    backgroundColor: item.color,
                    borderColor:     item.color,
                    textColor:       getContrastYIQ(item.color||'#6366f1'),
                    classNames:      item.done ? ['event-done'] : [],
                    extendedProps: {
                        contents: item.contents||'',
                        category: item.category||'',
                        priority: item.priority||'',
                        repeat:   item.repeat||'none',
                        url:      item.url||'',
                        done:     item.done||false,
                        spanDays,
                        isLong,
                        color:    item.color,        // 원본 색상 (bg 변환 전)
                        startDt:  item.fromDt,       // 원본 시작일
                        endDt:    item.toDt,         // 원본 종료일
                        isAllDay: item.allDay||false,
                    },
                };
            }));
        } catch {}
    }, []);

    React.useEffect(() => { load(); }, [load]);

    // ── displayEvents: 장기 일정을 bg + label 쌍으로 변환 ────────
    // 배경 밴드는 날짜별 최대 MAX_BG_BANDS 개까지만 표시 (겹침 방지)
    const MAX_BG_BANDS = 3;
    const displayEvents = React.useMemo(() => {
        const bgCountPerDay = new Map<string, number>();

        return rawEvents.flatMap(e => {
            if (!e.extendedProps?.isLong) return [e];

            const color   = e.extendedProps.color || e.backgroundColor;
            const startDt = (e.start||'').split('T')[0];
            const endDt   = e.extendedProps.endDt
                ? e.extendedProps.endDt.split('T')[0]
                : addDays(startDt, e.extendedProps.spanDays);

            // 이 이벤트 기간 중 한 날이라도 MAX_BG_BANDS 이상이면 배경 생략
            const startMs = new Date(startDt).getTime();
            const endMs   = new Date(endDt).getTime();
            let overLimit = false;
            for (let ms = startMs; ms < endMs; ms += 86400000) {
                const key = new Date(ms).toISOString().split('T')[0];
                if ((bgCountPerDay.get(key) ?? 0) >= MAX_BG_BANDS) { overLimit = true; break; }
            }
            if (!overLimit) {
                for (let ms = startMs; ms < endMs; ms += 86400000) {
                    const key = new Date(ms).toISOString().split('T')[0];
                    bgCountPerDay.set(key, (bgCountPerDay.get(key) ?? 0) + 1);
                }
            }

            // ① 배경 밴드 (겹침 한도 내에서만)
            const bgEvent = overLimit ? null : {
                ...e, id:`bg-${e.id}`, display:'background',
                allDay:true, start:startDt, end:endDt,
                backgroundColor: hexToRgba(color, 0.10),
                borderColor:'transparent', classNames:[],
            };

            // ② 라벨 칩 (시작일 하루, 항상 표시)
            const labelEvent = {
                ...e, id:`label-${e.id}`, allDay:true,
                start:startDt, end:addDays(startDt, 1),
                classNames:[...(e.classNames||[]), 'event-long-label', overLimit?'event-long-noband':''],
                editable:false,
            };

            return bgEvent ? [bgEvent, labelEvent] : [labelEvent];
        });
    }, [rawEvents]);

    // ── 공휴일 이벤트 (연도별 고정 + 가변) ─────────────────────────
    const holidayEvents = React.useMemo(() => {
        const YEARS = [2023, 2024, 2025, 2026, 2027];
        const fixed    = Object.entries(HOLIDAYS).filter(([k]) => k.length === 5);  // MM-DD
        const variable = Object.entries(HOLIDAYS).filter(([k]) => k.length === 10); // YYYY-MM-DD
        const result: any[] = [];
        YEARS.forEach(yr => {
            fixed.forEach(([mmdd, name]) => {
                const ds = `${yr}-${mmdd}`;
                result.push({ id:`h-${ds}`, title:name, start:ds, end:addDays(ds,1),
                    allDay:true, classNames:['holiday-event'],
                    extendedProps:{ isHoliday:true }, editable:false });
            });
        });
        variable.forEach(([ds, name]) => {
            result.push({ id:`h-${ds}`, title:name, start:ds, end:addDays(ds,1),
                allDay:true, classNames:['holiday-event'],
                extendedProps:{ isHoliday:true }, editable:false });
        });
        return result;
    }, []);

    // ── 필터링 (FullCalendar에 전달) ─────────────────────────────
    const filteredDisplayEvents = React.useMemo(() =>
        displayEvents.filter(e => {
            if (hideDone && e.extendedProps?.done) return false;
            if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
            if (filterCat && e.extendedProps?.category !== filterCat) return false;
            if (filterPriority && e.extendedProps?.priority !== filterPriority) return false;
            return true;
        }),
    [displayEvents, search, filterCat, filterPriority, hideDone]);

    /** 공휴일 포함 최종 이벤트 목록 */
    const allDisplayEvents = React.useMemo(() =>
        showHolidays ? [...filteredDisplayEvents, ...holidayEvents] : filteredDisplayEvents,
    [filteredDisplayEvents, showHolidays, holidayEvents]);

    // ── 모달 ───────────────────────────────────────────────────
    const openAdd = (info:any) => {
        setSchedIdx(null); setMode('add');
        const isAD = !info.startStr?.includes('T');
        setForm({...DEFAULT_FORM,
            fromDt: isAD ? (info.startStr?.split('T')[0]||'') : toLocal(info.startStr||''),
            toDt:   isAD ? (info.endStr?.split('T')[0]||'')   : toLocal(info.endStr||info.startStr||''),
            allDay: isAD,
        });
        setShowModal(true);
        info.view?.calendar?.unselect();
    };

    const openEdit = (info:any) => {
        const { event } = info;
        if (event.extendedProps?.isHoliday) return; // 공휴일 클릭 무시
        // bg-/label- prefix 제거 → 원본 scheduleIdx 복원
        const rawId = event.id.toString().replace(/^(bg-|label-)/, '');
        setSchedIdx(Number(rawId)); setMode('edit');
        // extendedProps의 원본 날짜를 사용 (label 이벤트의 잘린 end 날짜 무시)
        const ep = event.extendedProps ?? {};
        setForm({
            title:    event.title,
            color:    ep.color || event.backgroundColor || COLORS[0],
            fromDt:   ep.isAllDay ? (ep.startDt?.split('T')[0]||'') : toLocal(ep.startDt||''),
            toDt:     ep.isAllDay ? (ep.endDt?.split('T')[0]||'')   : toLocal(ep.endDt||ep.startDt||''),
            contents: ep.contents||'',
            allDay:   ep.isAllDay||false,
            category: ep.category||'',
            priority: ep.priority||'',
            repeat:   ep.repeat||'none',
            url:      ep.url||'',
            done:     ep.done||false,
        });
        setShowModal(true);
    };

    const close = () => setShowModal(false);
    const [saving, setSaving] = React.useState(false);

    const handleAdd = async () => {
        if (!form.title.trim() || saving) return;
        setSaving(true);
        try { await calendarService.addSchedule(form); await load(); close(); }
        catch (e) { console.error('일정 추가 실패', e); }
        finally { setSaving(false); }
    };
    const handleModify = async () => {
        if (schedIdx === null || saving) return;
        setSaving(true);
        try { await calendarService.modifySchedule(schedIdx, form); await load(); close(); }
        catch (e) { console.error('일정 수정 실패', e); }
        finally { setSaving(false); }
    };
    const handleDelete = async () => {
        if (schedIdx === null || saving) return;
        setSaving(true);
        try { await calendarService.deleteSchedule(schedIdx); await load(); close(); }
        catch (e) { console.error('일정 삭제 실패', e); }
        finally { setSaving(false); }
    };

    /** 사이드바에서 rawEvent 직접 클릭 → 수정 모달 열기 */
    const openEditFromRaw = (raw: any) => {
        if (!raw) return;
        const ep = raw.extendedProps ?? {};
        setSchedIdx(Number(raw.id));
        setMode('edit');
        setForm({
            title:    raw.title,
            color:    ep.color || raw.backgroundColor || COLORS[0],
            fromDt:   ep.isAllDay ? (ep.startDt?.split('T')[0]||'') : toLocal(ep.startDt||''),
            toDt:     ep.isAllDay ? (ep.endDt?.split('T')[0]||'')   : toLocal(ep.endDt||ep.startDt||''),
            contents: ep.contents||'',
            allDay:   ep.isAllDay||false,
            category: ep.category||'',
            priority: ep.priority||'',
            repeat:   ep.repeat||'none',
            url:      ep.url||'',
            done:     ep.done||false,
        });
        setShowModal(true);
    };

    // ── 드래그 & 리사이즈 (일반 이벤트만) ───────────────────────
    const buildDragForm = (event:any) => {
        const ep = event.extendedProps ?? {};
        return {
            title: event.title, color: ep.color||event.backgroundColor,
            fromDt: event.allDay?(event.startStr?.split('T')[0]||''):toLocal(event.startStr),
            toDt:   event.allDay?(event.endStr?.split('T')[0]||''):toLocal(event.endStr||event.startStr),
            contents: ep.contents||'', allDay: event.allDay||false,
            category: ep.category||'', priority: ep.priority||'',
            repeat: ep.repeat||'none', url: ep.url||'', done: ep.done||false,
        };
    };
    const handleEventDrop = async (info:any) => {
        if (info.event.id.startsWith('bg-')||info.event.id.startsWith('label-')){ info.revert(); return; }
        try{ await calendarService.modifySchedule(Number(info.event.id),buildDragForm(info.event)); }
        catch{ info.revert(); }
    };
    const handleEventResize = async (info:any) => {
        if (info.event.id.startsWith('bg-')||info.event.id.startsWith('label-')){ info.revert(); return; }
        try{ await calendarService.modifySchedule(Number(info.event.id),buildDragForm(info.event)); }
        catch{ info.revert(); }
    };

    // ── 뷰 전환 ─────────────────────────────────────────────────
    const switchView = (v:ViewKey) => { setCurrentView(v); calRef.current?.getApi().changeView(v); };
    const toggleSearch = () => {
        setSearchOpen(v => { if(v) setSearch(''); else setTimeout(()=>searchRef.current?.focus(),60); return !v; });
    };

    // ── 키보드 단축키 ────────────────────────────────────────────
    React.useEffect(() => {
        const handler = (e:KeyboardEvent) => {
            const tag = (document.activeElement as HTMLElement)?.tagName;
            if (tag==='INPUT'||tag==='TEXTAREA'||tag==='SELECT') return;
            if (showModal) return;
            switch(e.key.toUpperCase()){
                case 'N': setSchedIdx(null);setMode('add');setForm(DEFAULT_FORM);setShowModal(true); break;
                case 'T': calRef.current?.getApi().today(); break;
                case '/': e.preventDefault();setSearchOpen(true);setTimeout(()=>searchRef.current?.focus(),60); break;
                case 'M': switchView('dayGridMonth'); break;
                case 'W': switchView('timeGridWeek'); break;
                case 'D': switchView('timeGridDay'); break;
                case 'L': switchView('listWeek'); break;
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [showModal]);

    const handleMiniNavigate = (date:Date) => { calRef.current?.getApi().gotoDate(date); };

    // ── 이벤트 커스텀 렌더 ──────────────────────────────────────
    const renderEvent = (arg:any) => {
        // 공휴일 뱃지
        if (arg.event.extendedProps?.isHoliday) {
            return (
                <div style={{
                    display:'inline-flex', alignItems:'center', gap:2,
                    padding:'1px 4px', borderRadius:3,
                    background:'rgba(239,68,68,0.06)',
                    border:'1px solid rgba(239,68,68,0.2)',
                    maxWidth:'100%', overflow:'hidden',
                }}>
                    <span style={{fontSize:8,lineHeight:1,flexShrink:0}}>🇰🇷</span>
                    <span style={{
                        fontSize:9, color:'#ef4444', fontWeight:600,
                        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                        lineHeight:1.3,
                    }}>{arg.event.title}</span>
                </div>
            );
        }

        const isLongLabel = (arg.event.classNames||[]).includes('event-long-label');
        const cat   = CATEGORIES.find(c=>c.id===arg.event.extendedProps?.category);
        const pri   = PRIORITIES.find(p=>p.id===arg.event.extendedProps?.priority);
        const done  = arg.event.extendedProps?.done;
        const color = arg.event.extendedProps?.color || arg.event.backgroundColor || '#6366f1';
        const spanDays = arg.event.extendedProps?.spanDays || 1;

        // 장기 일정 라벨 칩
        if (isLongLabel) {
            return (
                <div style={{
                    display:'inline-flex', alignItems:'center', gap:3,
                    background: hexToRgba(color, 0.09),
                    border: `1px solid ${hexToRgba(color, 0.4)}`,
                    borderRadius:4, padding:'2px 6px 2px 4px',
                    maxWidth:'100%', overflow:'hidden', cursor:'pointer',
                }}>
                    {cat && <span style={{fontSize:9, lineHeight:1, flexShrink:0}}>{cat.emoji}</span>}
                    {pri && <span style={{fontSize:8, lineHeight:1, flexShrink:0}}>{pri.dot}</span>}
                    <span style={{
                        fontSize:9.5, fontWeight:700, color,
                        overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis',
                        lineHeight:1.3, textDecoration:done?'line-through':'none', opacity:done?0.6:1,
                    }}>{arg.event.title}</span>
                    <span style={{fontSize:8, color, opacity:0.5, flexShrink:0, lineHeight:1, marginLeft:1}}>
                        {spanDays}일↔
                    </span>
                </div>
            );
        }

        // 일반 이벤트
        return (
            <div className='flex items-center gap-0.5 w-full min-w-0 px-0.5'>
                {pri && <span className='shrink-0' style={{fontSize:7,lineHeight:1}}>{pri.dot}</span>}
                {cat && <span className='shrink-0 leading-none' style={{fontSize:9}}>{cat.emoji}</span>}
                <span className={`cal-evt-title truncate ${done?'line-through opacity-60':''}`}
                    style={{fontSize:11,fontWeight:500,lineHeight:'14px'}}>
                    {arg.event.title}
                </span>
            </div>
        );
    };

    return (
        <div className='flex flex-col gap-4'>
            <style>{FC_STYLES}</style>

            {/* ── 헤더 ── */}
            <div className='flex items-center justify-between gap-3 flex-wrap'>
                <div className='flex items-center gap-2.5'>
                    <span className='shrink-0 rounded-full inline-block'
                        style={{width:4,height:22,background:'linear-gradient(180deg,#6366f1,#3b82f6)'}}/>
                    <h2 className='font-bold text-gray-900 text-lg leading-tight'>캘린더</h2>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-1.5'>
                        <AnimatePresence>
                            {searchOpen && (
                                <motion.input ref={searchRef} key='si'
                                    initial={{width:0,opacity:0}} animate={{width:160,opacity:1}} exit={{width:0,opacity:0}}
                                    transition={{duration:.2}}
                                    value={search} onChange={e=>setSearch(e.target.value)}
                                    placeholder='일정 검색...'
                                    className='h-8 px-3 rounded-lg border border-gray-200 bg-white text-sm outline-none text-gray-700 placeholder-gray-400 focus:border-indigo-400 overflow-hidden'
                                />
                            )}
                        </AnimatePresence>
                        <button onClick={toggleSearch}
                            className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${searchOpen?'bg-indigo-50 border-indigo-200 text-indigo-600':'border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}>
                            <MagnifyingGlassIcon className='h-4 w-4'/>
                        </button>
                    </div>
                    <div className='flex items-center bg-gray-100 rounded-lg p-0.5'>
                        {VIEWS.map(v=>(
                            <button key={v.key} onClick={()=>switchView(v.key as ViewKey)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${currentView===v.key?'bg-white text-gray-800 shadow-sm':'text-gray-400 hover:text-gray-600'}`}>
                                {v.label}
                            </button>
                        ))}
                    </div>
                    <button onClick={()=>setShowShortcuts(v=>!v)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors text-xs font-bold ${showShortcuts?'bg-indigo-50 border-indigo-200 text-indigo-600':'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>?</button>
                    <button onClick={()=>{setSchedIdx(null);setMode('add');setForm(DEFAULT_FORM);setShowModal(true);}}
                        className='inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow-sm'
                        style={{background:'linear-gradient(135deg,#6366f1,#4f46e5)'}}>
                        <PlusIcon className='h-3.5 w-3.5'/>일정 추가
                    </button>
                </div>
            </div>

            {/* 단축키 패널 */}
            <AnimatePresence>
                {showShortcuts && (
                    <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.15}}
                        className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4'>
                        <div className='flex items-center justify-between mb-3'>
                            <span className='text-xs font-semibold text-gray-600'>키보드 단축키</span>
                            <button onClick={()=>setShowShortcuts(false)} className='text-gray-300 hover:text-gray-500'><XMarkIcon className='h-4 w-4'/></button>
                        </div>
                        <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
                            {SHORTCUTS.map(s=>(
                                <div key={s.key} className='flex items-center gap-2'>
                                    <kbd className='min-w-[24px] h-6 px-1.5 bg-gray-100 rounded-md text-[11px] font-bold text-gray-600 flex items-center justify-center border border-gray-200'>{s.key}</kbd>
                                    <span className='text-[11px] text-gray-500'>{s.desc}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── 본문 ── */}
            <div className='flex gap-4 items-start'>
                <div className='hidden lg:flex flex-col gap-3 w-56 shrink-0'>
                    <Sidebar
                        events={rawEvents}
                        filterCat={filterCat} setFilterCat={setFilterCat}
                        filterPriority={filterPriority} setFilterPriority={setFilterPriority}
                        hideDone={hideDone} setHideDone={setHideDone}
                        showHolidays={showHolidays} setShowHolidays={setShowHolidays}
                        onNavigate={handleMiniNavigate}
                        onEventEdit={openEditFromRaw}
                    />
                </div>

                <div className='cal-wrap flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                    {/* 모바일 카테고리 필터 */}
                    <div className='lg:hidden flex items-center gap-1.5 px-4 pt-3 flex-wrap'>
                        <button onClick={()=>setFilterCat('')}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${!filterCat?'bg-gray-200 text-gray-700':'bg-gray-100 text-gray-400'}`}>전체</button>
                        {CATEGORIES.map(cat=>(
                            <button key={cat.id} onClick={()=>setFilterCat(filterCat===cat.id?'':cat.id as CatId)}
                                className='flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all'
                                style={filterCat===cat.id?{backgroundColor:cat.color,color:'#fff'}:{backgroundColor:cat.bg,color:cat.color}}>
                                {cat.emoji}{cat.label}
                            </button>
                        ))}
                    </div>

                    <FullCalendar
                        ref={calRef}
                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                        initialView='dayGridMonth'
                        events={allDisplayEvents}
                        eventClick={openEdit}
                        dayCellClassNames={(arg:any) => {
                            const d = arg.date;
                            const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
                            return getHoliday(ds) ? ['is-holiday'] : [];
                        }}
                        selectable editable
                        select={openAdd}
                        eventDrop={handleEventDrop}
                        eventResize={handleEventResize}
                        locale='ko' height='auto'
                        headerToolbar={{left:'prev,next today',center:'title',right:''}}
                        buttonText={{today:'오늘'}}
                        eventTimeFormat={{hour:'2-digit',minute:'2-digit',hour12:false}}
                        slotLabelFormat={{hour:'2-digit',minute:'2-digit',hour12:false}}
                        nowIndicator
                        dayMaxEvents={4}
                        listDayFormat={{month:'long',day:'numeric',weekday:'short'}}
                        noEventsContent={search||filterCat||filterPriority?'검색 결과가 없습니다':'일정이 없습니다'}
                        eventContent={renderEvent}
                    />
                </div>
            </div>

            {createPortal(
                <AnimatePresence>
                    {showModal && (
                        <EventModal mode={mode} form={form} setForm={setForm}
                            onAdd={handleAdd} onModify={handleModify}
                            onDelete={handleDelete} onClose={close}
                            saving={saving}/>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
