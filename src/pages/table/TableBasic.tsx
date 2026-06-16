import React, { useEffect, useMemo, useState } from 'react';
import {
    MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon,
    ArrowsUpDownIcon, FunnelIcon, ArrowDownTrayIcon,
    TrashIcon, PencilIcon, Bars3Icon, CheckIcon,
} from '@heroicons/react/24/outline';
import Pagination from '../../components/common/pagination/Pagination';
import instance from '../../services/instance';

type SortDir = 'asc' | 'desc' | null;

interface Employee {
    id: number; name: string; dept: string; role: string;
    email: string; joinDate: string;
    status: 'active' | 'leave' | 'retired'; salary: number;
}

const BASE_DATA: Employee[] = [
    { id: 1,  name: '김민준', dept: '개발팀',   role: '시니어 개발자',   email: 'minjun.kim@company.com',   joinDate: '2019-03-15', status: 'active',  salary: 6800 },
    { id: 2,  name: '이서연', dept: '디자인팀', role: 'UI/UX 디자이너',  email: 'seoyeon.lee@company.com',  joinDate: '2020-07-01', status: 'active',  salary: 5200 },
    { id: 3,  name: '박지훈', dept: '기획팀',   role: 'PM',             email: 'jihun.park@company.com',   joinDate: '2018-11-20', status: 'active',  salary: 5900 },
    { id: 4,  name: '최수아', dept: '개발팀',   role: '주니어 개발자',   email: 'sua.choi@company.com',     joinDate: '2022-02-14', status: 'active',  salary: 3800 },
    { id: 5,  name: '정도윤', dept: 'QA팀',     role: 'QA 엔지니어',    email: 'doyun.jung@company.com',   joinDate: '2021-05-10', status: 'leave',   salary: 4400 },
    { id: 6,  name: '강하은', dept: '개발팀',   role: '프론트엔드',      email: 'haeun.kang@company.com',   joinDate: '2020-09-01', status: 'active',  salary: 5100 },
    { id: 7,  name: '윤서준', dept: '기획팀',   role: '서비스 기획',     email: 'seojun.yoon@company.com',  joinDate: '2019-12-03', status: 'active',  salary: 4700 },
    { id: 8,  name: '임지아', dept: '디자인팀', role: '그래픽 디자이너', email: 'jia.lim@company.com',      joinDate: '2023-01-16', status: 'active',  salary: 3600 },
    { id: 9,  name: '오현우', dept: 'QA팀',     role: '테스트 리드',     email: 'hyunwoo.oh@company.com',   joinDate: '2017-08-22', status: 'retired', salary: 5500 },
    { id: 10, name: '한채원', dept: '개발팀',   role: '백엔드 개발자',   email: 'chaewon.han@company.com',  joinDate: '2021-03-08', status: 'active',  salary: 5600 },
    { id: 11, name: '신유진', dept: '기획팀',   role: 'UX 리서처',      email: 'yujin.shin@company.com',   joinDate: '2022-06-27', status: 'active',  salary: 4300 },
    { id: 12, name: '배준혁', dept: '개발팀',   role: 'DevOps',         email: 'junhyuk.bae@company.com',  joinDate: '2020-11-30', status: 'leave',   salary: 6200 },
    { id: 13, name: '조민서', dept: '디자인팀', role: '모션 디자이너',   email: 'minseo.jo@company.com',    joinDate: '2023-04-03', status: 'active',  salary: 3900 },
    { id: 14, name: '황성호', dept: '개발팀',   role: 'iOS 개발자',     email: 'sungho.hwang@company.com', joinDate: '2019-06-17', status: 'active',  salary: 6100 },
    { id: 15, name: '문지은', dept: 'QA팀',     role: 'QA 엔지니어',    email: 'jieun.moon@company.com',   joinDate: '2021-09-14', status: 'active',  salary: 4100 },
];

const STATUS_MAP = {
    active:  { label: '재직중', cls: 'bg-green-100 text-green-700' },
    leave:   { label: '휴직중', cls: 'bg-yellow-100 text-yellow-700' },
    retired: { label: '퇴직',   cls: 'bg-gray-100 text-gray-500' },
};
const DEPT_COLORS: Record<string, string> = {
    '개발팀':   'bg-blue-50 text-blue-700',
    '디자인팀': 'bg-purple-50 text-purple-700',
    '기획팀':   'bg-orange-50 text-orange-700',
    'QA팀':     'bg-red-50 text-red-700',
};

const SortIcon = ({ field, sortField, sortDir }: { field: string; sortField: string | null; sortDir: SortDir }) => {
    if (sortField !== field) return <ArrowsUpDownIcon className='h-3.5 w-3.5 text-gray-300' />;
    return sortDir === 'asc'
        ? <ArrowUpIcon className='h-3.5 w-3.5 text-indigo-500' />
        : <ArrowDownIcon className='h-3.5 w-3.5 text-indigo-500' />;
};

export default function TableBasic() {
    const [rows, setRows]                 = useState<Employee[]>(BASE_DATA);
    const [search, setSearch]             = useState('');
    const [deptFilter, setDeptFilter]     = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortField, setSortField]       = useState<keyof Employee | null>(null);
    const [sortDir, setSortDir]           = useState<SortDir>(null);
    const [selected, setSelected]         = useState<number[]>([]);
    const [page, setPage]                 = useState(1);
    const [dragSrcId, setDragSrcId]       = useState<number | null>(null);
    const [dragOverId, setDragOverId]     = useState<number | null>(null);
    const [saveState, setSaveState]       = useState<'idle' | 'saving' | 'done'>('idle');
    const ROW = 5;

    const canDrag = !sortField && !search && !deptFilter && !statusFilter;

    useEffect(() => {
        instance.get('/table/order').then(res => {
            const order: number[] = res.data?.order;
            if (Array.isArray(order) && order.length > 0) {
                setRows(prev => [...prev].sort((a, b) => {
                    const ai = order.indexOf(a.id), bi = order.indexOf(b.id);
                    return (ai === -1 ? 9999 : ai) - (bi === -1 ? 9999 : bi);
                }));
            }
        }).catch(() => {});
    }, []);

    const handleSort = (field: keyof Employee) => {
        if (sortField === field) {
            if (sortDir === 'desc') { setSortField(null); setSortDir(null); }
            else setSortDir(p => p === 'asc' ? 'desc' : 'asc');
        } else { setSortField(field); setSortDir('asc'); }
        setPage(1);
    };

    const filtered = useMemo(() => {
        let data = [...rows];
        if (search)       data = data.filter(r => [r.name, r.role, r.email, r.dept].some(v => v.toLowerCase().includes(search.toLowerCase())));
        if (deptFilter)   data = data.filter(r => r.dept === deptFilter);
        if (statusFilter) data = data.filter(r => r.status === statusFilter);
        if (sortField && sortDir) {
            data.sort((a, b) => {
                const cmp = String(a[sortField]).localeCompare(String(b[sortField]), 'ko', { numeric: true });
                return sortDir === 'asc' ? cmp : -cmp;
            });
        }
        return data;
    }, [rows, search, deptFilter, statusFilter, sortField, sortDir]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ROW));
    const paged      = filtered.slice((page - 1) * ROW, page * ROW);
    const allSelected = paged.length > 0 && paged.every(r => selected.includes(r.id));
    const toggleAll   = () => setSelected(allSelected ? selected.filter(id => !paged.find(r => r.id === id)) : [...new Set([...selected, ...paged.map(r => r.id)])]);
    const toggleRow   = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const exportCSV = () => {
        const headers = ['No','이름','부서','직무','이메일','입사일','상태','연봉(만원)'];
        const csvRows = [headers, ...filtered.map(r => [r.id, r.name, r.dept, r.role, r.email, r.joinDate, STATUS_MAP[r.status].label, r.salary])];
        const blob = new Blob(['﻿' + csvRows.map(r => r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
        const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'employees.csv' });
        a.click(); URL.revokeObjectURL(a.href);
    };

    const handleDragStart = (e: React.DragEvent, id: number) => {
        setDragSrcId(id);
        e.dataTransfer.effectAllowed = 'move';
        const ghost = (e.currentTarget as HTMLElement).cloneNode(true) as HTMLElement;
        ghost.style.opacity = '0.01'; ghost.style.position = 'fixed'; ghost.style.top = '-9999px';
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 0, 0);
        setTimeout(() => document.body.removeChild(ghost), 0);
    };
    const handleDragEnter = (id: number) => setDragOverId(id);
    const handleDragEnd   = () => { setDragSrcId(null); setDragOverId(null); };
    const handleDrop = (e: React.DragEvent, dropId: number) => {
        e.preventDefault();
        if (dragSrcId === null || dragSrcId === dropId) return handleDragEnd();
        setRows(prev => {
            const next = [...prev];
            const from = next.findIndex(r => r.id === dragSrcId);
            const to   = next.findIndex(r => r.id === dropId);
            const [item] = next.splice(from, 1);
            next.splice(to, 0, item);
            saveOrder(next.map(r => r.id));
            return next;
        });
        handleDragEnd();
    };
    const saveOrder = async (order: number[]) => {
        setSaveState('saving');
        try { await instance.post('/table/order', { order }); setSaveState('done'); setTimeout(() => setSaveState('idle'), 1800); }
        catch { setSaveState('idle'); }
    };

    const thCls     = 'px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap select-none';
    const thSortCls = `${thCls} cursor-pointer hover:bg-gray-100 transition-colors`;

    return (
        <div className='flex flex-col gap-4'>
            {/* 헤더 */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
                <div>
                    <h1 className='text-xl font-bold text-gray-800'>직원 관리</h1>
                    <p className='text-sm text-gray-400 mt-0.5'>전체 {BASE_DATA.length}명 · 검색 결과 {filtered.length}명</p>
                </div>
                <div className='flex items-center gap-2'>
                    {saveState !== 'idle' && (
                        <span className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg ${saveState === 'done' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-500'}`}>
                            {saveState === 'done'
                                ? <><CheckIcon className='h-3.5 w-3.5' />순서 저장됨</>
                                : <><span className='animate-spin w-3 h-3 border border-blue-400 border-t-transparent rounded-full inline-block' />저장 중...</>}
                        </span>
                    )}
                    {selected.length > 0 && (
                        <button className='inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors'>
                            <TrashIcon className='h-4 w-4' />선택 삭제 ({selected.length})
                        </button>
                    )}
                    <button onClick={exportCSV} className='inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors'>
                        <ArrowDownTrayIcon className='h-4 w-4' />CSV
                    </button>
                </div>
            </div>

            {/* 필터 바 */}
            <div className='flex flex-col sm:flex-row gap-2'>
                <div className='relative flex-1'>
                    <MagnifyingGlassIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                    <input
                        type='text' placeholder='이름, 직무, 이메일 검색...'
                        value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className='w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all'
                    />
                </div>
                <select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setPage(1); }}
                    className='px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all'>
                    <option value=''>전체 부서</option>
                    {['개발팀','디자인팀','기획팀','QA팀'].map(d => <option key={d}>{d}</option>)}
                </select>
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                    className='px-3 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all'>
                    <option value=''>전체 상태</option>
                    <option value='active'>재직중</option>
                    <option value='leave'>휴직중</option>
                    <option value='retired'>퇴직</option>
                </select>
                {(search || deptFilter || statusFilter) && (
                    <button onClick={() => { setSearch(''); setDeptFilter(''); setStatusFilter(''); setPage(1); }}
                        className='px-3 py-2 text-sm rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors whitespace-nowrap'>
                        <FunnelIcon className='h-4 w-4 inline mr-1' />초기화
                    </button>
                )}
            </div>

            {canDrag
                ? <p className='text-xs text-indigo-500 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2'><Bars3Icon className='h-3.5 w-3.5 inline mr-1' />핸들을 드래그해 순서를 변경할 수 있습니다.</p>
                : <p className='text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2'>정렬·필터 적용 중에는 드래그 순서 변경이 비활성화됩니다.</p>
            }

            {/* 테이블 */}
            <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50 border-b border-gray-200'>
                            <tr>
                                <th className='pl-3 py-3 w-8' />
                                <th className='pl-2 py-3 w-10'>
                                    <input type='checkbox' checked={allSelected} onChange={toggleAll} className='w-4 h-4 rounded accent-indigo-600' />
                                </th>
                                {([
                                    { key: 'id',       label: 'No'     },
                                    { key: 'name',     label: '이름'   },
                                    { key: 'dept',     label: '부서'   },
                                    { key: 'role',     label: '직무'   },
                                    { key: 'email',    label: '이메일' },
                                    { key: 'joinDate', label: '입사일' },
                                    { key: 'salary',   label: '연봉'   },
                                    { key: 'status',   label: '상태'   },
                                ] as const).map(col => (
                                    <th key={col.key} className={thSortCls} onClick={() => handleSort(col.key as keyof Employee)}>
                                        <span className='inline-flex items-center gap-1'>{col.label}<SortIcon field={col.key} sortField={sortField} sortDir={sortDir} /></span>
                                    </th>
                                ))}
                                <th className='px-4 py-3 text-xs font-semibold text-gray-500 uppercase text-right'>액션</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {paged.length === 0
                                ? <tr><td colSpan={11} className='py-16 text-center text-sm text-gray-400'>검색 결과가 없습니다.</td></tr>
                                : paged.map(row => {
                                    const isDragging = dragSrcId === row.id;
                                    const isDragOver = dragOverId === row.id && dragSrcId !== row.id;
                                    return (
                                        <tr key={row.id} draggable={canDrag}
                                            onDragStart={canDrag ? e => handleDragStart(e, row.id) : undefined}
                                            onDragEnter={canDrag ? () => handleDragEnter(row.id) : undefined}
                                            onDragOver={canDrag ? e => e.preventDefault() : undefined}
                                            onDrop={canDrag ? e => handleDrop(e, row.id) : undefined}
                                            onDragEnd={canDrag ? handleDragEnd : undefined}
                                            className={`transition-all duration-150 ${isDragging ? 'opacity-30 bg-indigo-50' : isDragOver ? 'border-t-2 border-indigo-400 bg-indigo-50/40' : selected.includes(row.id) ? 'bg-indigo-50/30' : 'hover:bg-gray-50/60'}`}>
                                            <td className='pl-3 py-3 w-8'>
                                                {canDrag && <Bars3Icon className='h-4 w-4 text-gray-300 hover:text-gray-500 transition-colors cursor-grab' />}
                                            </td>
                                            <td className='pl-2 py-3 w-10'>
                                                <input type='checkbox' checked={selected.includes(row.id)} onChange={() => toggleRow(row.id)} className='w-4 h-4 rounded accent-indigo-600' />
                                            </td>
                                            <td className='px-4 py-3 text-xs text-gray-400'>{row.id}</td>
                                            <td className='px-4 py-3'>
                                                <div className='flex items-center gap-2'>
                                                    <div className='w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0' style={{ background: `linear-gradient(135deg,#6366f1,#8b5cf6)` }}>{row.name[0]}</div>
                                                    <span className='text-sm font-medium text-gray-800 whitespace-nowrap'>{row.name}</span>
                                                </div>
                                            </td>
                                            <td className='px-4 py-3'><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DEPT_COLORS[row.dept] ?? ''}`}>{row.dept}</span></td>
                                            <td className='px-4 py-3 text-sm text-gray-600 whitespace-nowrap'>{row.role}</td>
                                            <td className='px-4 py-3 text-sm text-gray-400'>{row.email}</td>
                                            <td className='px-4 py-3 text-sm text-gray-500 whitespace-nowrap'>{row.joinDate}</td>
                                            <td className='px-4 py-3 text-sm font-medium text-gray-700 whitespace-nowrap text-right'>{row.salary.toLocaleString()}만원</td>
                                            <td className='px-4 py-3'><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_MAP[row.status].cls}`}>{STATUS_MAP[row.status].label}</span></td>
                                            <td className='px-4 py-3 text-right'>
                                                <div className='flex items-center justify-end gap-1'>
                                                    <button className='p-1.5 rounded-lg text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors'><PencilIcon className='h-4 w-4' /></button>
                                                    <button className='p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors'><TrashIcon className='h-4 w-4' /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
                <div className='px-4 py-2.5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-2'>
                    <p className='text-xs text-gray-400'>{selected.length > 0 ? `${selected.length}개 선택됨 · ` : ''}{filtered.length}개 중 {Math.min((page-1)*ROW+1, filtered.length)}–{Math.min(page*ROW, filtered.length)} 표시</p>
                    <Pagination totalPages={totalPages} page={page} setPage={setPage} />
                </div>
            </div>
        </div>
    );
}
