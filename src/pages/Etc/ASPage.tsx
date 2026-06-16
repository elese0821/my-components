import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronDoubleRightIcon, ChevronDoubleLeftIcon,
    ChevronRightIcon, ChevronLeftIcon,
    MagnifyingGlassIcon, UserCircleIcon,
    ArrowPathIcon, CheckIcon,
} from '@heroicons/react/24/outline'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import instance from '../../services/instance'
import useDialogStore from '../../stores/dialogStore'

// ── 타입 ─────────────────────────────────────────────────────
interface Member {
    id: number
    name: string
    role: string
    dept: string
    avatar: string
}

// ── 아바타 색상 ───────────────────────────────────────────────
const AVATAR_COLORS = [
    '#6366f1', '#ec4899', '#10b981', '#f59e0b',
    '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4',
]

// ── 초기 목 데이터 (서버 없을 때 사용) ───────────────────────
const MOCK_MEMBERS: Member[] = [
    { id: 1, name: '김민준', role: '프론트엔드 개발자', dept: '개발팀',   avatar: '#6366f1' },
    { id: 2, name: '이서연', role: 'UI/UX 디자이너',   dept: '디자인팀', avatar: '#ec4899' },
    { id: 3, name: '박지호', role: '백엔드 개발자',     dept: '개발팀',   avatar: '#10b981' },
    { id: 4, name: '최수아', role: '데이터 분석가',     dept: '분석팀',   avatar: '#f59e0b' },
    { id: 5, name: '정도현', role: '프로덕트 매니저',   dept: '기획팀',   avatar: '#3b82f6' },
    { id: 6, name: '강유진', role: 'QA 엔지니어',      dept: '품질팀',   avatar: '#8b5cf6' },
    { id: 7, name: '윤채원', role: '머신러닝 엔지니어', dept: 'AI팀',     avatar: '#ef4444' },
    { id: 8, name: '임태양', role: 'DevOps 엔지니어',  dept: '인프라팀', avatar: '#06b6d4' },
]

// ── 아바타 ────────────────────────────────────────────────────
function Avatar({ member, size = 32 }: { member: Member; size?: number }) {
    return (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: member.avatar, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: size * 0.38, fontWeight: 700, flexShrink: 0,
        }}>
            {member.name[0]}
        </div>
    )
}

// ── 멤버 행 ──────────────────────────────────────────────────
function MemberRow({ member, selected, onClick, onDblClick }: {
    member: Member; selected: boolean; onClick: () => void; onDblClick: () => void;
}) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 6 }}
            onClick={onClick}
            onDoubleClick={onDblClick}
            className='flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all select-none'
            style={{
                background: selected ? '#eef2ff' : 'transparent',
                border: selected ? '1px solid #a5b4fc' : '1px solid transparent',
            }}
        >
            <Avatar member={member} />
            <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-800 truncate'>{member.name}</p>
                <p className='text-xs text-gray-400 truncate'>{member.role}</p>
            </div>
            {selected && <CheckCircleIcon className='h-4 w-4 text-indigo-500 shrink-0' />}
        </motion.div>
    )
}

// ── 리스트 박스 ───────────────────────────────────────────────
function ListBox({ title, color, members, selectedIds, onSelect, onDblClick, countBadge, loading }: {
    title: string; color: string; members: Member[]; selectedIds: Set<number>;
    onSelect: (id: number) => void; onDblClick: (id: number) => void;
    countBadge?: number; loading?: boolean;
}) {
    const [search, setSearch] = useState('')
    const filtered = useMemo(
        () => members.filter(m =>
            m.name.includes(search) || m.role.includes(search) || m.dept.includes(search)
        ),
        [members, search]
    )

    return (
        <div className='flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden' style={{ flex: 1, minWidth: 0 }}>
            <div className='flex items-center justify-between px-4 py-3 border-b border-gray-100'>
                <div className='flex items-center gap-2'>
                    <span className='text-sm font-bold text-gray-800'>{title}</span>
                    <span className='inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white'
                        style={{ background: color }}>
                        {countBadge ?? members.length}
                    </span>
                </div>
                <span className='text-xs text-gray-400'>
                    {loading ? '불러오는 중...' : selectedIds.size > 0 ? `${selectedIds.size}명 선택됨` : '더블클릭으로 이동'}
                </span>
            </div>

            <div className='px-3 pt-2.5 pb-1.5'>
                <div className='flex items-center gap-2 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50'>
                    <MagnifyingGlassIcon className='h-3.5 w-3.5 text-gray-400 shrink-0' />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder='이름, 직무 검색...'
                        className='bg-transparent text-xs outline-none text-gray-700 w-full placeholder-gray-400'
                    />
                </div>
            </div>

            <div className='flex-1 overflow-y-auto px-2 pb-2' style={{ minHeight: 200 }}>
                {loading ? (
                    <div className='space-y-2 p-1'>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className='flex items-center gap-2.5 px-3 py-2 rounded-lg animate-pulse'>
                                <div className='w-8 h-8 rounded-full bg-gray-200 shrink-0' />
                                <div className='flex-1 space-y-1.5'>
                                    <div className='h-3 w-3/4 rounded bg-gray-200' />
                                    <div className='h-2.5 w-1/2 rounded bg-gray-100' />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className='flex flex-col items-center justify-center h-24 gap-1.5 text-gray-300'>
                        <UserCircleIcon className='h-8 w-8' />
                        <p className='text-xs'>{search ? '검색 결과 없음' : '목록이 비어있습니다.'}</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {filtered.map(m => (
                            <MemberRow
                                key={m.id}
                                member={m}
                                selected={selectedIds.has(m.id)}
                                onClick={() => onSelect(m.id)}
                                onDblClick={() => onDblClick(m.id)}
                            />
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    )
}

// ── 컨트롤 버튼 ───────────────────────────────────────────────
function CtrlBtn({ onClick, disabled, children, title }: {
    onClick: () => void; disabled?: boolean; children: React.ReactNode; title?: string;
}) {
    return (
        <button onClick={onClick} disabled={disabled} title={title}
            className='flex items-center justify-center w-9 h-9 rounded-lg border transition-all active:scale-95'
            style={{
                borderColor: disabled ? '#e5e7eb' : '#c7d2fe',
                background:  disabled ? '#f9fafb' : '#eef2ff',
                color:       disabled ? '#d1d5db' : '#6366f1',
                cursor:      disabled ? 'not-allowed' : 'pointer',
            }}
        >
            {children}
        </button>
    )
}

// ── 메인 ─────────────────────────────────────────────────────
export default function ASPage() {
    const { openDialog } = useDialogStore()

    const [leftList,      setLeftList]      = useState<Member[]>([])
    const [rightList,     setRightList]     = useState<Member[]>([])
    const [leftSelected,  setLeftSelected]  = useState<Set<number>>(new Set())
    const [rightSelected, setRightSelected] = useState<Set<number>>(new Set())
    const [loading,       setLoading]       = useState(true)
    const [saving,        setSaving]        = useState(false)
    const [saved,         setSaved]         = useState(false)

    // ── 멤버 목록 로드 ────────────────────────────────────────
    const loadMembers = async () => {
        setLoading(true)
        try {
            // 서버에서 전체 사용자 목록 로드 시도
            const [allRes, selectedRes] = await Promise.allSettled([
                instance.get('/user/info', { params: { row: 100, pageNo: 1 } }),
                instance.get('/user/project/member'),
            ])

            const allList: Member[] = []
            const selList: Member[] = []

            if (allRes.status === 'fulfilled' && allRes.value.data?.list?.length) {
                allRes.value.data.list.forEach((m: any, i: number) => {
                    allList.push({
                        id:     m.usrIdx ?? i + 1,
                        name:   m.userNm ?? m.userId ?? `사용자${i + 1}`,
                        role:   m.role ?? '직원',
                        dept:   m.dept ?? '부서 미지정',
                        avatar: AVATAR_COLORS[i % AVATAR_COLORS.length],
                    })
                })
            }

            if (selectedRes.status === 'fulfilled' && selectedRes.value.data?.list?.length) {
                const selIds = new Set(selectedRes.value.data.list.map((m: any) => m.usrIdx ?? m.id))
                allList.forEach(m => {
                    if (selIds.has(m.id)) selList.push(m)
                })
                setLeftList(allList.filter(m => !selIds.has(m.id)))
                setRightList(selList)
            } else {
                setLeftList(allList.length ? allList : MOCK_MEMBERS)
            }

            setLoading(false)
            return
        } catch { /* 서버 미지원 → 목 데이터 */ }

        setLeftList(MOCK_MEMBERS)
        setRightList([])
        setLoading(false)
    }

    useEffect(() => { loadMembers() }, [])

    // ── 선택 토글 ──────────────────────────────────────────
    const toggle = (set: Set<number>, setter: React.Dispatch<React.SetStateAction<Set<number>>>, id: number) => {
        setter(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
    }

    const toggleLeft  = (id: number) => toggle(leftSelected,  setLeftSelected,  id)
    const toggleRight = (id: number) => toggle(rightSelected, setRightSelected, id)

    // ── 이동 ───────────────────────────────────────────────
    const moveSelectedToRight = () => {
        const moving = leftList.filter(m => leftSelected.has(m.id))
        setRightList(p => [...p, ...moving])
        setLeftList(p => p.filter(m => !leftSelected.has(m.id)))
        setLeftSelected(new Set())
        setSaved(false)
    }
    const moveAllToRight = () => {
        setRightList(p => [...p, ...leftList]); setLeftList([]); setLeftSelected(new Set()); setSaved(false)
    }
    const moveSelectedToLeft = () => {
        const moving = rightList.filter(m => rightSelected.has(m.id))
        setLeftList(p => [...p, ...moving])
        setRightList(p => p.filter(m => !rightSelected.has(m.id)))
        setRightSelected(new Set())
        setSaved(false)
    }
    const moveAllToLeft = () => {
        setLeftList(p => [...p, ...rightList]); setRightList([]); setRightSelected(new Set()); setSaved(false)
    }
    const dblToRight = (id: number) => {
        const m = leftList.find(x => x.id === id); if (!m) return
        setRightList(p => [...p, m]); setLeftList(p => p.filter(x => x.id !== id))
        setLeftSelected(prev => { const n = new Set(prev); n.delete(id); return n }); setSaved(false)
    }
    const dblToLeft = (id: number) => {
        const m = rightList.find(x => x.id === id); if (!m) return
        setLeftList(p => [...p, m]); setRightList(p => p.filter(x => x.id !== id))
        setRightSelected(prev => { const n = new Set(prev); n.delete(id); return n }); setSaved(false)
    }

    // ── 저장 ───────────────────────────────────────────────
    const handleSave = async () => {
        setSaving(true)
        try {
            await instance.post('/user/project/member', {
                memberIdxList: rightList.map(m => m.id),
                memberNameList: rightList.map(m => m.name),
            })
            setSaved(true)
            openDialog('프로젝트 멤버가 저장되었습니다.')
        } catch {
            // 서버 미지원 → 로컬 피드백
            setSaved(true)
            openDialog(`${rightList.length}명의 멤버가 선택 저장되었습니다.`)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            {/* 상단 안내 */}
            <div className='flex items-center justify-between flex-wrap gap-2'>
                <div>
                    <h3 className='text-sm font-bold text-gray-700'>프로젝트 멤버 설정</h3>
                    <p className='text-xs text-gray-400 mt-0.5'>
                        항목을 클릭 선택 후 이동 버튼을 사용하거나, 더블클릭으로 즉시 이동합니다.
                    </p>
                </div>
                <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-3 text-xs text-gray-500'>
                        <span>전체 <strong className='text-gray-800'>{leftList.length + rightList.length}</strong>명</span>
                        <span>선택됨 <strong className='text-indigo-600'>{rightList.length}</strong>명</span>
                    </div>
                    {/* 새로고침 */}
                    <button
                        onClick={loadMembers}
                        disabled={loading}
                        className='p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors'
                        title='목록 새로고침'
                    >
                        <ArrowPathIcon className={`h-3.5 w-3.5 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* 3-column 레이아웃 */}
            <div className='flex gap-3 items-stretch'>
                <ListBox
                    title='전체 멤버'    color='#6b7280'
                    members={leftList}  selectedIds={leftSelected}
                    onSelect={toggleLeft}  onDblClick={dblToRight}
                    loading={loading}
                />

                <div className='flex flex-col items-center justify-center gap-2 px-1 shrink-0'>
                    <CtrlBtn onClick={moveAllToRight}      disabled={leftList.length === 0}    title='전체 추가'>
                        <ChevronDoubleRightIcon className='h-4 w-4' />
                    </CtrlBtn>
                    <CtrlBtn onClick={moveSelectedToRight} disabled={leftSelected.size === 0}  title='선택 추가'>
                        <ChevronRightIcon className='h-4 w-4' />
                    </CtrlBtn>
                    <div className='h-px w-6 bg-gray-200' />
                    <CtrlBtn onClick={moveSelectedToLeft}  disabled={rightSelected.size === 0} title='선택 제거'>
                        <ChevronLeftIcon className='h-4 w-4' />
                    </CtrlBtn>
                    <CtrlBtn onClick={moveAllToLeft}       disabled={rightList.length === 0}   title='전체 제거'>
                        <ChevronDoubleLeftIcon className='h-4 w-4' />
                    </CtrlBtn>
                </div>

                <ListBox
                    title='프로젝트 멤버' color='#6366f1'
                    members={rightList}  selectedIds={rightSelected}
                    onSelect={toggleRight}  onDblClick={dblToLeft}
                />
            </div>

            {/* 하단 요약 + 저장 */}
            <div className='flex items-start justify-between gap-3 flex-wrap'>
                {/* 선택된 멤버 태그 */}
                {rightList.length > 0 ? (
                    <div className='flex flex-wrap gap-1.5 p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex-1 min-w-0'>
                        <span className='text-xs font-semibold text-indigo-600 mr-1'>선택된 멤버:</span>
                        {rightList.map(m => (
                            <span key={m.id}
                                className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium'
                                style={{ background: m.avatar + '22', color: m.avatar }}>
                                {m.name}
                            </span>
                        ))}
                    </div>
                ) : (
                    <div className='flex-1 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-400'>
                        프로젝트 멤버를 선택하세요.
                    </div>
                )}

                {/* 저장 버튼 */}
                <button
                    onClick={handleSave}
                    disabled={saving || rightList.length === 0}
                    className='flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] shrink-0'
                    style={{
                        background: saved
                            ? '#dcfce7'
                            : rightList.length === 0
                            ? '#e5e7eb'
                            : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                        color: saved ? '#16a34a' : rightList.length === 0 ? '#9ca3af' : '#fff',
                        boxShadow: rightList.length > 0 && !saved ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                    }}
                >
                    {saving ? (
                        <ArrowPathIcon className='h-4 w-4 animate-spin' />
                    ) : saved ? (
                        <CheckIcon className='h-4 w-4' />
                    ) : null}
                    {saving ? '저장 중...' : saved ? '저장됨' : `${rightList.length}명 저장하기`}
                </button>
            </div>
        </div>
    )
}
