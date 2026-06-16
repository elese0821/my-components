import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import todoService from '../../services/todo/todoService';
import {
    PlusIcon, XMarkIcon, TrashIcon, PencilSquareIcon,
    ChevronDownIcon, CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

// ── 상수 ────────────────────────────────────────────────────────
const CATEGORIES = [
    { id: 'work',     label: '업무', color: '#6366f1', emoji: '💼' },
    { id: 'personal', label: '개인', color: '#10b981', emoji: '🏠' },
    { id: 'health',   label: '건강', color: '#ef4444', emoji: '❤️' },
    { id: 'meet',     label: '약속', color: '#f59e0b', emoji: '👥' },
    { id: 'memo',     label: '메모', color: '#8b5cf6', emoji: '📝' },
] as const;
const PRIORITIES = [
    { id: 'high',   label: '높음', color: '#ef4444', dot: '🔴' },
    { id: 'medium', label: '보통', color: '#f59e0b', dot: '🟡' },
    { id: 'low',    label: '낮음', color: '#10b981', dot: '🔵' },
] as const;

type CatId    = typeof CATEGORIES[number]['id'] | '';
type Priority = typeof PRIORITIES[number]['id'] | '';
type TodoType = 'goal' | 'todo';

// ── 타입 ────────────────────────────────────────────────────────
interface TodoItem {
    todoIdx:  number;
    title:    string;
    type:     TodoType;
    category: CatId;
    priority: Priority;
    dueDate:  string;
    memo:     string;
    done:     boolean;
    doneAt:   string;
    regDt:    string;
}
interface TodoForm {
    title: string; type: TodoType; category: CatId;
    priority: Priority; dueDate: string; memo: string;
}
const DEFAULT_FORM: TodoForm = { title:'', type:'todo', category:'', priority:'', dueDate:'', memo:'' };

// ── 헬퍼 ────────────────────────────────────────────────────────
function getCat(id: string) { return CATEGORIES.find(c => c.id === id); }
function getPri(id: string) { return PRIORITIES.find(p => p.id === id); }
function rgba(hex: string, a: number) {
    if (!hex || hex.length < 7) return `rgba(99,102,241,${a})`;
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
}

function fmtDue(dueDate: string): { text: string; color: string } | null {
    if (!dueDate) return null;
    const today = new Date(); today.setHours(0,0,0,0);
    const due   = new Date(dueDate); due.setHours(0,0,0,0);
    const diff  = Math.round((due.getTime() - today.getTime()) / 86400000);
    if (diff < 0)  return { text: `D+${Math.abs(diff)}`, color: '#ef4444' };
    if (diff === 0) return { text: '오늘',     color: '#f59e0b' };
    if (diff === 1) return { text: '내일',     color: '#f59e0b' };
    if (diff <= 7)  return { text: `D-${diff}`, color: '#6366f1' };
    return { text: due.toLocaleDateString('ko-KR',{month:'short',day:'numeric'}), color: '#94a3b8' };
}
function fmtAgo(dt: string): string {
    if (!dt) return '';
    const diff = Math.floor((Date.now() - new Date(dt).getTime()) / 86400000);
    if (diff === 0) return '오늘'; if (diff === 1) return '어제'; return `${diff}일 전`;
}

// ── 투명 칩 스타일 헬퍼 ─────────────────────────────────────────
const chipStyle = (color: string, active: boolean, base = false) => active
    ? { backgroundColor: rgba(color, 0.09), border: `1px solid ${rgba(color, 0.32)}`, color }
    : base
        ? { backgroundColor: rgba(color, 0.05), border: `1px solid ${rgba(color, 0.15)}`, color }
        : { backgroundColor: rgba(color, 0.06), border: '1px solid transparent', color };

// ── 추가/수정 모달 ────────────────────────────────────────────────
function TodoFormModal({ mode, form, setForm, onSubmit, onDelete, onClose }: {
    mode: 'add'|'edit'; form: TodoForm; setForm:(f:TodoForm)=>void;
    onSubmit:()=>void; onDelete:()=>void; onClose:()=>void;
}) {
    const isEdit    = mode === 'edit';
    const canSubmit = form.title.trim().length > 0;
    const ipt = 'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/10';

    return (
        <motion.div key='overlay'
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.15}}
            className='fixed inset-0 z-[200] flex items-end sm:items-center justify-center'
            style={{background:'rgba(15,15,25,.38)',backdropFilter:'blur(8px)'}}
            onClick={onClose}>
            <motion.div
                initial={{opacity:0,y:18,scale:.98}} animate={{opacity:1,y:0,scale:1}}
                exit={{opacity:0,y:12,scale:.98}} transition={{duration:.2,ease:[.16,1,.3,1]}}
                className='w-full sm:max-w-[440px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col'
                style={{maxHeight:'90dvh'}} onClick={e=>e.stopPropagation()}>

                {/* 타입 탭 */}
                <div className='flex items-center p-3 gap-2 bg-gray-50 border-b border-gray-100 shrink-0'>
                    {(['todo','goal'] as TodoType[]).map(t => (
                        <button key={t} onClick={()=>setForm({...form,type:t})}
                            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${form.type===t?'bg-white shadow-sm text-gray-700':'text-gray-400 hover:text-gray-500'}`}>
                            {t==='todo' ? '✅ 할 일' : '🎯 목표'}
                        </button>
                    ))}
                    <button onClick={onClose}
                        className='w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 transition-colors ml-1'>
                        <XMarkIcon className='h-4 w-4'/>
                    </button>
                </div>

                <div className='overflow-y-auto flex-1 px-5 pt-4 pb-2 flex flex-col gap-3.5'>
                    {/* 제목 */}
                    <input placeholder={form.type==='goal'?'목표 이름...':'할 일 이름...'} value={form.title}
                        onChange={e=>setForm({...form,title:e.target.value})} autoFocus
                        className={`${ipt} font-medium text-[15px] py-2.5`}
                        onKeyDown={e=>e.key==='Enter'&&canSubmit&&onSubmit()}/>

                    {/* 카테고리 */}
                    <div>
                        <p className='text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-2'>카테고리</p>
                        <div className='flex flex-wrap gap-1.5'>
                            {CATEGORIES.map(cat=>{
                                const active = form.category === cat.id;
                                return (
                                    <button key={cat.id} type='button'
                                        onClick={()=>setForm({...form,category:active?'':cat.id as CatId})}
                                        className='flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all active:scale-95'
                                        style={chipStyle(cat.color, active, !active)}>
                                        <span style={{fontSize:11}}>{cat.emoji}</span>{cat.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 우선순위 */}
                    <div>
                        <p className='text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-2'>우선순위</p>
                        <div className='flex gap-1.5'>
                            {PRIORITIES.map(p=>{
                                const active = form.priority === p.id;
                                return (
                                    <button key={p.id} type='button'
                                        onClick={()=>setForm({...form,priority:active?'':p.id as Priority})}
                                        className='flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium transition-all active:scale-95'
                                        style={chipStyle(p.color, active, !active)}>
                                        {p.dot} {p.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 마감일 */}
                    <div>
                        <label className='text-[10px] font-semibold text-gray-300 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 block'>
                            <CalendarDaysIcon className='h-3 w-3'/>마감일 (선택)
                        </label>
                        <input type='date' value={form.dueDate}
                            onChange={e=>setForm({...form,dueDate:e.target.value})} className={ipt}/>
                    </div>

                    {/* 메모 */}
                    <textarea placeholder='메모 (선택)' value={form.memo}
                        onChange={e=>setForm({...form,memo:e.target.value})}
                        rows={form.type==='goal'?3:2}
                        className={`${ipt} resize-none`}/>
                </div>

                {/* 하단 버튼 */}
                <div className='px-5 pt-3 pb-5 flex items-center gap-2 shrink-0 border-t border-gray-100 mt-1'>
                    <button onClick={onClose}
                        className='px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all'>취소</button>
                    <div className='flex-1'/>
                    {isEdit && (
                        <button onClick={onDelete}
                            className='px-4 py-2.5 rounded-xl text-sm font-medium transition-all'
                            style={{color:'#ef4444', border:'1px solid rgba(239,68,68,0.25)', backgroundColor:'rgba(239,68,68,0.04)'}}>
                            삭제
                        </button>
                    )}
                    <button onClick={onSubmit} disabled={!canSubmit}
                        className='px-5 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[.98] disabled:opacity-40 disabled:cursor-not-allowed'
                        style={canSubmit
                            ? {color:'#6366f1', border:'1.5px solid rgba(99,102,241,0.35)', backgroundColor:'rgba(99,102,241,0.07)'}
                            : {color:'#94a3b8', border:'1.5px solid #e2e8f0', backgroundColor:'transparent'}
                        }>
                        {isEdit ? '저장' : (form.type==='goal' ? '목표 추가' : '할 일 추가')}
                    </button>
                </div>
                <div className='sm:hidden' style={{height:'env(safe-area-inset-bottom,0px)'}}/>
            </motion.div>
        </motion.div>
    );
}

// ── 목표 카드 ────────────────────────────────────────────────────
function GoalCard({ item, onComplete, onEdit }: {
    item: TodoItem; onComplete:(id:number)=>void; onEdit:(item:TodoItem)=>void;
}) {
    const cat = getCat(item.category);
    const pri = getPri(item.priority);
    const due = fmtDue(item.dueDate);
    const [hovered, setHovered] = React.useState(false);
    const accentColor = cat?.color || '#6366f1';

    return (
        <motion.div layout
            initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.94,transition:{duration:.2}}}
            className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative'
            style={{borderLeft:`3px solid ${rgba(accentColor, 0.45)}`}}
            onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>

            {/* 호버: 수정 버튼 */}
            <AnimatePresence>
                {hovered && (
                    <motion.button initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.12}}
                        onClick={()=>onEdit(item)}
                        className='absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-400 hover:text-gray-600 shadow-sm transition-colors z-10'>
                        <PencilSquareIcon className='h-3.5 w-3.5'/>
                    </motion.button>
                )}
            </AnimatePresence>

            <div className='p-4 flex-1'>
                {/* 카테고리 + 우선순위 */}
                <div className='flex items-center justify-between mb-2.5'>
                    {cat ? (
                        <span className='flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium'
                            style={{backgroundColor:rgba(cat.color,0.08), border:`1px solid ${rgba(cat.color,0.2)}`, color:cat.color}}>
                            {cat.emoji} {cat.label}
                        </span>
                    ) : <div/>}
                    {pri && <span style={{fontSize:14}}>{pri.dot}</span>}
                </div>

                {/* 제목 */}
                <h3 className='font-semibold text-gray-800 text-sm leading-snug mb-3 line-clamp-2'>{item.title}</h3>

                {/* 마감일 */}
                {due && (
                    <div className='flex items-center gap-1 mb-2'>
                        <CalendarDaysIcon className='h-3 w-3' style={{color:due.color}}/>
                        <span className='text-[11px] font-semibold' style={{color:due.color}}>{due.text}</span>
                    </div>
                )}

                {/* 메모 */}
                {item.memo && (
                    <p className='text-[11px] text-gray-400 leading-relaxed line-clamp-2'>{item.memo}</p>
                )}
            </div>

            {/* 완료 버튼 */}
            <div className='px-4 pb-3.5 pt-2 border-t border-gray-50'>
                <button onClick={()=>onComplete(item.todoIdx)}
                    className='w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-[.98]'
                    style={{color:accentColor, border:`1px solid ${rgba(accentColor,0.28)}`, backgroundColor:rgba(accentColor,0.05)}}>
                    ✓ 완료 처리
                </button>
            </div>
        </motion.div>
    );
}

// ── 할 일 행 ─────────────────────────────────────────────────────
function TodoRow({ item, onComplete, onEdit }: {
    item: TodoItem; onComplete:(id:number)=>void; onEdit:(item:TodoItem)=>void;
}) {
    const cat = getCat(item.category);
    const pri = getPri(item.priority);
    const due = fmtDue(item.dueDate);
    const [hovered, setHovered] = React.useState(false);
    const checkColor = cat?.color || '#6366f1';

    return (
        <motion.div layout
            initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} exit={{opacity:0,x:16,transition:{duration:.18}}}
            className='flex items-center gap-3 px-4 py-3 hover:bg-gray-50/70 rounded-xl transition-colors'
            onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>

            {/* 체크박스 */}
            <button onClick={()=>onComplete(item.todoIdx)}
                className='w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90'
                style={{border:`2px solid ${rgba(checkColor, hovered ? 0.7 : 0.3)}`, backgroundColor: hovered ? rgba(checkColor,0.07) : 'transparent'}}>
                <AnimatePresence>
                    {hovered && (
                        <motion.span initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0,opacity:0}}
                            transition={{duration:.12}} className='text-[8px] font-bold' style={{color:checkColor}}>✓</motion.span>
                    )}
                </AnimatePresence>
            </button>

            {/* 제목 */}
            <span className='flex-1 text-sm text-gray-700 font-medium min-w-0 truncate'>{item.title}</span>

            {/* 메타 */}
            <div className='flex items-center gap-1.5 shrink-0'>
                {cat && (
                    <span className='text-[10px] font-medium px-1.5 py-0.5 rounded-full'
                        style={{backgroundColor:rgba(cat.color,0.08), border:`1px solid ${rgba(cat.color,0.18)}`, color:cat.color}}>
                        {cat.emoji}
                    </span>
                )}
                {pri && <span style={{fontSize:11}}>{pri.dot}</span>}
                {due && (
                    <span className='text-[10px] font-semibold px-1.5 py-0.5 rounded-md'
                        style={{color:due.color, backgroundColor:rgba(due.color,0.08), border:`1px solid ${rgba(due.color,0.2)}`}}>
                        {due.text}
                    </span>
                )}
            </div>

            {/* 수정 */}
            <AnimatePresence>
                {hovered && (
                    <motion.button initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:.8}}
                        transition={{duration:.1}} onClick={()=>onEdit(item)}
                        className='w-6 h-6 flex items-center justify-center rounded-md text-gray-300 hover:text-gray-500 hover:bg-gray-100 shrink-0 transition-colors'>
                        <PencilSquareIcon className='h-3.5 w-3.5'/>
                    </motion.button>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ── 완료 항목 행 ─────────────────────────────────────────────────
function CompletedRow({ item, onUndo, onDelete }: {
    item: TodoItem; onUndo:(id:number)=>void; onDelete:(id:number)=>void;
}) {
    const cat = getCat(item.category);
    const circleColor = cat?.color || '#10b981';

    return (
        <motion.div layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className='flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/60 rounded-xl transition-colors group'>

            {/* 완료 원 (클릭 = 되돌리기) */}
            <button onClick={()=>onUndo(item.todoIdx)} title='완료 취소'
                className='w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all hover:scale-110'
                style={{border:`2px solid ${rgba(circleColor,0.35)}`, backgroundColor:rgba(circleColor,0.08)}}>
                <span className='text-[8px] font-bold' style={{color:circleColor}}>✓</span>
            </button>

            <span className='flex-1 text-sm text-gray-400 line-through truncate'>{item.title}</span>

            <div className='flex items-center gap-1.5 shrink-0'>
                {cat && (
                    <span className='text-[10px] font-medium px-1.5 py-0.5 rounded-full'
                        style={{backgroundColor:rgba(cat.color,0.07), border:`1px solid ${rgba(cat.color,0.15)}`, color:cat.color}}>
                        {cat.emoji}
                    </span>
                )}
                <span className='text-[10px] text-gray-300'>{fmtAgo(item.doneAt)}</span>
            </div>

            <button onClick={()=>onDelete(item.todoIdx)}
                className='w-6 h-6 flex items-center justify-center rounded-md text-gray-200 hover:text-red-400 hover:bg-red-50 shrink-0 opacity-0 group-hover:opacity-100 transition-all'>
                <TrashIcon className='h-3.5 w-3.5'/>
            </button>
        </motion.div>
    );
}

// ── 스켈레톤 ─────────────────────────────────────────────────────
const SkeletonGoal = () => (
    <div className='bg-white rounded-2xl border border-gray-100 p-4 animate-pulse' style={{borderLeft:'3px solid #f1f5f9'}}>
        <div className='flex justify-between mb-3'>
            <div className='h-5 bg-gray-100 rounded-full w-16'/>
            <div className='h-4 w-4 bg-gray-100 rounded-full'/>
        </div>
        <div className='h-4 bg-gray-100 rounded w-3/4 mb-1.5'/>
        <div className='h-3 bg-gray-100 rounded w-1/2 mb-4'/>
        <div className='h-8 bg-gray-100 rounded-xl'/>
    </div>
);
const SkeletonTodo = () => (
    <div className='flex items-center gap-3 px-4 py-3 animate-pulse'>
        <div className='w-5 h-5 rounded-full bg-gray-100 shrink-0'/>
        <div className='flex-1 h-3 bg-gray-100 rounded'/>
        <div className='h-4 bg-gray-100 rounded-full w-12'/>
    </div>
);

// ── 메인 컴포넌트 ────────────────────────────────────────────────
export default function TodoComponent() {
    const [todos,         setTodos]         = React.useState<TodoItem[]>([]);
    const [loading,       setLoading]       = React.useState(true);
    const [showForm,      setShowForm]      = React.useState(false);
    const [formMode,      setFormMode]      = React.useState<'add'|'edit'>('add');
    const [form,          setForm]          = React.useState<TodoForm>(DEFAULT_FORM);
    const [editingIdx,    setEditingIdx]    = React.useState<number|null>(null);
    const [filterCat,     setFilterCat]     = React.useState<CatId>('');
    const [completedOpen, setCompletedOpen] = React.useState(false);
    const [quickVal,      setQuickVal]      = React.useState('');
    const [showQuick,     setShowQuick]     = React.useState(false);
    const [confirmClear,  setConfirmClear]  = React.useState(false);
    const quickRef = React.useRef<HTMLInputElement>(null);

    // ── 데이터 ─────────────────────────────────────────────────
    const load = React.useCallback(async () => {
        setLoading(true);
        try { const d = await todoService.getList(); setTodos(d.list ?? []); }
        catch { setTodos([]); }
        finally { setLoading(false); }
    }, []);
    React.useEffect(() => { load(); }, [load]);

    // ── 필터 ───────────────────────────────────────────────────
    const match      = (t: TodoItem) => !filterCat || t.category === filterCat;
    const activeGoals = todos.filter(t => !t.done && t.type === 'goal' && match(t));
    const activeTodos = todos.filter(t => !t.done && t.type === 'todo' && match(t));
    const completed   = todos.filter(t => t.done && match(t))
        .sort((a,b) => new Date(b.doneAt||0).getTime() - new Date(a.doneAt||0).getTime());

    // ── CRUD ───────────────────────────────────────────────────
    const openAdd = (type: TodoType = 'todo') => {
        setFormMode('add'); setEditingIdx(null); setForm({...DEFAULT_FORM,type}); setShowForm(true);
    };
    const openEdit = (item: TodoItem) => {
        setFormMode('edit'); setEditingIdx(item.todoIdx);
        setForm({title:item.title,type:item.type,category:item.category,priority:item.priority,dueDate:item.dueDate,memo:item.memo});
        setShowForm(true);
    };
    const closeForm = () => setShowForm(false);

    const handleSubmit = async () => {
        if (!form.title.trim()) return;
        closeForm();
        if (formMode === 'add') {
            const tmpId = -Date.now();
            setTodos(p => [...p, {todoIdx:tmpId,...form,done:false,doneAt:'',regDt:new Date().toISOString()}]);
            try { await todoService.add(form); await load(); }
            catch { setTodos(p => p.filter(t => t.todoIdx !== tmpId)); }
        } else if (editingIdx !== null) {
            setTodos(p => p.map(t => t.todoIdx === editingIdx ? {...t,...form} : t));
            try { await todoService.update(editingIdx, form); } catch { load(); }
        }
    };
    const handleDelete = async () => {
        if (editingIdx === null) return;
        closeForm();
        setTodos(p => p.filter(t => t.todoIdx !== editingIdx));
        try { await todoService.remove(editingIdx); } catch { load(); }
    };
    const handleComplete = async (id: number) => {
        setTodos(p => p.map(t => t.todoIdx===id ? {...t,done:true,doneAt:new Date().toISOString()} : t));
        setCompletedOpen(true);
        try { await todoService.toggleDone(id,true); } catch { load(); }
    };
    const handleUndo = async (id: number) => {
        setTodos(p => p.map(t => t.todoIdx===id ? {...t,done:false,doneAt:''} : t));
        try { await todoService.toggleDone(id,false); } catch { load(); }
    };
    const handleDeleteOne = async (id: number) => {
        setTodos(p => p.filter(t => t.todoIdx !== id));
        try { await todoService.remove(id); } catch { load(); }
    };
    const handleClearCompleted = async () => {
        if (!confirmClear) { setConfirmClear(true); return; }
        setConfirmClear(false);
        const ids = todos.filter(t=>t.done).map(t=>t.todoIdx);
        setTodos(p => p.filter(t => !t.done));
        try { await todoService.removeCompleted(); }
        catch { ids.forEach(id => setTodos(p => p.map(t => t.todoIdx===id?{...t,done:false,doneAt:''}:t))); }
    };

    const handleQuickAdd = async () => {
        const title = quickVal.trim();
        if (!title) return;
        setQuickVal(''); setShowQuick(false);
        const tmpId = -Date.now();
        setTodos(p => [...p, {todoIdx:tmpId,title,type:'todo',category:''as CatId,priority:''as Priority,dueDate:'',memo:'',done:false,doneAt:'',regDt:new Date().toISOString()}]);
        try { await todoService.add({title,type:'todo',category:'',priority:'',dueDate:'',memo:''}); await load(); }
        catch { setTodos(p => p.filter(t => t.todoIdx !== tmpId)); }
    };
    React.useEffect(() => { if (showQuick) setTimeout(()=>quickRef.current?.focus(),60); }, [showQuick]);

    const totalActive = activeGoals.length + activeTodos.length;
    const totalDone   = todos.filter(t=>t.done).length;

    return (
        <div className='flex flex-col gap-5'>

            {/* ── 헤더 ── */}
            <div className='flex items-center justify-between gap-3 flex-wrap'>
                <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-2.5'>
                        <span className='shrink-0 rounded-full inline-block'
                            style={{width:4,height:22,background:'linear-gradient(180deg,#6366f1,#10b981)'}}/>
                        <h2 className='font-bold text-gray-900 text-lg'>할 일 &amp; 목표</h2>
                    </div>
                    {!loading && (
                        <div className='flex items-center gap-2'>
                            {totalActive > 0 && (
                                <span className='px-2.5 py-1 rounded-full text-xs font-semibold'
                                    style={{color:'#6366f1', backgroundColor:'rgba(99,102,241,0.07)', border:'1px solid rgba(99,102,241,0.2)'}}>
                                    진행중 {totalActive}
                                </span>
                            )}
                            {totalDone > 0 && (
                                <span className='px-2.5 py-1 rounded-full text-xs font-semibold'
                                    style={{color:'#10b981', backgroundColor:'rgba(16,185,129,0.07)', border:'1px solid rgba(16,185,129,0.2)'}}>
                                    완료 {totalDone}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* 추가 버튼들 */}
                <div className='flex items-center gap-2'>
                    <button onClick={()=>openAdd('goal')}
                        className='flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all active:scale-95'
                        style={{color:'#10b981', border:'1.5px solid rgba(16,185,129,0.3)', backgroundColor:'rgba(16,185,129,0.06)'}}>
                        <PlusIcon className='h-3.5 w-3.5'/>목표
                    </button>
                    <button onClick={()=>openAdd('todo')}
                        className='flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all active:scale-95'
                        style={{color:'#6366f1', border:'1.5px solid rgba(99,102,241,0.3)', backgroundColor:'rgba(99,102,241,0.06)'}}>
                        <PlusIcon className='h-3.5 w-3.5'/>할 일
                    </button>
                </div>
            </div>

            {/* ── 카테고리 필터 ── */}
            <div className='flex items-center gap-1.5 flex-wrap'>
                <button onClick={()=>setFilterCat('')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!filterCat?'bg-gray-100 text-gray-600 border border-gray-200':'text-gray-400 border border-transparent hover:border-gray-200 hover:bg-gray-50'}`}>
                    전체
                </button>
                {CATEGORIES.map(cat => {
                    const active = filterCat === cat.id;
                    return (
                        <button key={cat.id}
                            onClick={()=>setFilterCat(active?'':cat.id as CatId)}
                            className='flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all'
                            style={active
                                ? {backgroundColor:rgba(cat.color,0.1), border:`1.5px solid ${rgba(cat.color,0.35)}`, color:cat.color}
                                : {backgroundColor:rgba(cat.color,0.05), border:`1px solid ${rgba(cat.color,0.12)}`, color:cat.color}
                            }>
                            {cat.emoji} {cat.label}
                        </button>
                    );
                })}
            </div>

            {/* ── 목표 섹션 ── */}
            {(loading || activeGoals.length > 0) && (
                <div>
                    <div className='flex items-center gap-2 mb-3'>
                        <span className='text-base'>🎯</span>
                        <h3 className='text-sm font-bold text-gray-700'>목표</h3>
                        {!loading && <span className='text-xs text-gray-400'>{activeGoals.length}개</span>}
                    </div>
                    {loading ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                            {[1,2,3].map(i=><SkeletonGoal key={i}/>)}
                        </div>
                    ) : (
                        <motion.div layout className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
                            <AnimatePresence>
                                {activeGoals.map(item=>(
                                    <GoalCard key={item.todoIdx} item={item}
                                        onComplete={handleComplete} onEdit={openEdit}/>
                                ))}
                            </AnimatePresence>
                            <button onClick={()=>openAdd('goal')}
                                className='border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 py-8 text-gray-300 hover:border-gray-300 hover:text-gray-400 hover:bg-gray-50/50 transition-all min-h-[110px]'>
                                <PlusIcon className='h-4 w-4'/>
                                <span className='text-[11px] font-medium'>목표 추가</span>
                            </button>
                        </motion.div>
                    )}
                </div>
            )}

            {/* ── 할 일 섹션 ── */}
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                <div className='flex items-center gap-2 px-4 py-3 border-b border-gray-50'>
                    <span className='text-base'>✅</span>
                    <h3 className='text-sm font-bold text-gray-700'>할 일</h3>
                    {!loading && <span className='text-xs text-gray-400'>{activeTodos.length}개</span>}
                </div>

                {loading ? (
                    <div className='py-1'>{[1,2,3,4].map(i=><SkeletonTodo key={i}/>)}</div>
                ) : activeTodos.length === 0 && !showQuick ? (
                    <div className='flex flex-col items-center py-10 text-center'>
                        <span className='text-3xl mb-2'>📋</span>
                        <p className='text-sm text-gray-400 mb-4'>할 일이 없습니다</p>
                        <button onClick={()=>setShowQuick(true)}
                            className='flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all'
                            style={{color:'#6366f1', border:'1px solid rgba(99,102,241,0.25)', backgroundColor:'rgba(99,102,241,0.05)'}}>
                            <PlusIcon className='h-4 w-4'/>할 일 추가
                        </button>
                    </div>
                ) : (
                    <div className='py-1'>
                        <AnimatePresence>
                            {activeTodos.map(item=>(
                                <TodoRow key={item.todoIdx} item={item}
                                    onComplete={handleComplete} onEdit={openEdit}/>
                            ))}
                        </AnimatePresence>

                        {/* 빠른 추가 */}
                        <AnimatePresence>
                            {showQuick ? (
                                <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
                                    className='border-t border-gray-50 overflow-hidden'>
                                    <div className='flex items-center gap-2 px-4 py-2.5'>
                                        <div className='w-5 h-5 rounded-full border-2 shrink-0'
                                            style={{borderColor:'rgba(99,102,241,0.35)'}}/>
                                        <input ref={quickRef} value={quickVal}
                                            onChange={e=>setQuickVal(e.target.value)}
                                            onKeyDown={e=>{if(e.key==='Enter')handleQuickAdd();if(e.key==='Escape'){setShowQuick(false);setQuickVal('');}}}
                                            placeholder='할 일 이름 입력 후 Enter...'
                                            className='flex-1 text-sm outline-none text-gray-700 placeholder-gray-300 py-1'/>
                                        <button onClick={handleQuickAdd} disabled={!quickVal.trim()}
                                            className='text-xs font-semibold disabled:opacity-40 shrink-0 transition-colors'
                                            style={{color:'#6366f1'}}>추가</button>
                                        <button onClick={()=>{setShowQuick(false);setQuickVal('');}}
                                            className='text-xs text-gray-300 hover:text-gray-500 shrink-0'>취소</button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.button initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                                    onClick={()=>setShowQuick(true)}
                                    className='flex items-center gap-2 px-4 py-3 text-gray-300 hover:text-gray-500 w-full hover:bg-gray-50/60 transition-all text-sm border-t border-gray-50'>
                                    <PlusIcon className='h-4 w-4'/> 할 일 추가...
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* ── 완료됨 섹션 ── */}
            {completed.length > 0 && (
                <div className='bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden'>
                    <button onClick={()=>setCompletedOpen(v=>!v)}
                        className='w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50/60 transition-colors'>
                        <div className='flex items-center gap-2'>
                            <CheckCircleIcon className='h-4 w-4' style={{color:'rgba(16,185,129,0.6)'}}/>
                            <span className='text-sm font-bold text-gray-600'>완료됨</span>
                            <span className='px-2 py-0.5 rounded-full text-[11px] font-semibold'
                                style={{color:'#10b981', backgroundColor:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)'}}>
                                {completed.length}
                            </span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <button onClick={e=>{e.stopPropagation();handleClearCompleted();}}
                                className='text-[11px] font-semibold transition-all px-2.5 py-1 rounded-lg'
                                style={confirmClear
                                    ? {color:'#ef4444', backgroundColor:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.25)'}
                                    : {color:'#cbd5e1', border:'1px solid transparent'}
                                }>
                                {confirmClear ? '한 번 더 클릭' : '모두 삭제'}
                            </button>
                            {confirmClear && (
                                <button onClick={e=>{e.stopPropagation();setConfirmClear(false);}}
                                    className='text-[11px] text-gray-300 hover:text-gray-500'>취소</button>
                            )}
                            <motion.div animate={{rotate:completedOpen?180:0}} transition={{duration:.2}}>
                                <ChevronDownIcon className='h-4 w-4 text-gray-300'/>
                            </motion.div>
                        </div>
                    </button>

                    <AnimatePresence>
                        {completedOpen && (
                            <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}}
                                className='overflow-hidden border-t border-gray-50'>
                                <div className='py-1'>
                                    <AnimatePresence>
                                        {completed.map(item=>(
                                            <CompletedRow key={item.todoIdx} item={item}
                                                onUndo={handleUndo} onDelete={handleDeleteOne}/>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            {/* ── 빈 상태 ── */}
            {!loading && todos.length === 0 && (
                <div className='flex flex-col items-center py-16 text-center'>
                    <span className='text-5xl mb-4'>🌱</span>
                    <h3 className='text-base font-bold text-gray-700 mb-1'>아직 할 일이 없습니다</h3>
                    <p className='text-sm text-gray-400 mb-6'>목표를 세우고 할 일을 추가해 보세요</p>
                    <div className='flex items-center gap-3'>
                        <button onClick={()=>openAdd('goal')}
                            className='flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all'
                            style={{color:'#10b981', border:'1.5px solid rgba(16,185,129,0.3)', backgroundColor:'rgba(16,185,129,0.06)'}}>
                            <PlusIcon className='h-4 w-4'/>목표 추가
                        </button>
                        <button onClick={()=>openAdd('todo')}
                            className='flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all'
                            style={{color:'#6366f1', border:'1.5px solid rgba(99,102,241,0.3)', backgroundColor:'rgba(99,102,241,0.06)'}}>
                            <PlusIcon className='h-4 w-4'/>할 일 추가
                        </button>
                    </div>
                </div>
            )}

            {/* ── 폼 모달 ── */}
            {createPortal(
                <AnimatePresence>
                    {showForm && (
                        <TodoFormModal mode={formMode} form={form} setForm={setForm}
                            onSubmit={handleSubmit} onDelete={handleDelete} onClose={closeForm}/>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
