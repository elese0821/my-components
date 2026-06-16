import React, { useState, useRef, useCallback } from 'react';
import {
    CheckIcon, XMarkIcon, PencilSquareIcon,
    ArrowPathIcon, ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

type StockStatus = 'active' | 'soldout' | 'hidden';

interface Product {
    id: number;
    name: string;
    category: string;
    stock: number;
    price: number;
    discount: number;   // %
    status: StockStatus;
}

const STATUS_CFG: Record<StockStatus, { label: string; bg: string; text: string }> = {
    active:  { label: '판매중', bg: 'bg-green-50',  text: 'text-green-600'  },
    soldout: { label: '품절',   bg: 'bg-red-50',    text: 'text-red-500'    },
    hidden:  { label: '숨김',   bg: 'bg-gray-100',  text: 'text-gray-400'   },
};
const STATUS_CYCLE: StockStatus[] = ['active', 'soldout', 'hidden'];

const CATEGORIES = ['가전/디지털', '패션/의류', '식품/음료', '뷰티/헬스', '스포츠', '가구/인테리어'];

const INITIAL: Product[] = [
    { id: 1,  name: 'MacBook Pro 14" M3',      category: '가전/디지털',   stock: 12,  price: 3_200_000, discount: 0,  status: 'active'  },
    { id: 2,  name: 'Nike Air Max 270',         category: '패션/의류',     stock: 45,  price: 149_000,  discount: 10, status: 'active'  },
    { id: 3,  name: '비비고 왕교자 1.2kg',       category: '식품/음료',     stock: 200, price: 12_900,   discount: 5,  status: 'active'  },
    { id: 4,  name: 'LANEIGE 수분 크림 50ml',   category: '뷰티/헬스',     stock: 0,   price: 35_000,   discount: 0,  status: 'soldout' },
    { id: 5,  name: 'Garmin Forerunner 265',    category: '스포츠',        stock: 8,   price: 590_000,  discount: 15, status: 'active'  },
    { id: 6,  name: 'Herman Miller Aeron',      category: '가구/인테리어', stock: 3,   price: 2_100_000, discount: 0, status: 'active'  },
    { id: 7,  name: 'Sony WH-1000XM5',          category: '가전/디지털',   stock: 22,  price: 420_000,  discount: 8,  status: 'active'  },
    { id: 8,  name: 'Dyson Airwrap Complete',   category: '뷰티/헬스',     stock: 0,   price: 790_000,  discount: 0,  status: 'soldout' },
    { id: 9,  name: 'Patagonia Nano Puff',      category: '패션/의류',     stock: 17,  price: 320_000,  discount: 20, status: 'active'  },
    { id: 10, name: '테팔 에어프라이어 4.2L',    category: '가전/디지털',   stock: 0,   price: 89_000,   discount: 0,  status: 'hidden'  },
    { id: 11, name: 'iPad Pro 12.9" M4',        category: '가전/디지털',   stock: 5,   price: 1_590_000, discount: 0, status: 'active'  },
    { id: 12, name: '스탠리 퀜처 40oz',          category: '스포츠',        stock: 88,  price: 59_000,   discount: 0,  status: 'active'  },
];

type EditMap   = Partial<Record<number, Partial<Product>>>;
type FocusCell = { id: number; field: keyof Product } | null;

export default function TableEdit() {
    const [rows,      setRows]      = useState<Product[]>(INITIAL);
    const [edits,     setEdits]     = useState<EditMap>({});
    const [focus,     setFocus]     = useState<FocusCell>(null);
    const [saved,     setSaved]     = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const dirtyIds  = Object.keys(edits).map(Number).filter(id => Object.keys(edits[id] ?? {}).length > 0);
    const dirtyCount = dirtyIds.length;

    // 셀 값 가져오기 (편집 중이면 편집값 우선)
    const getVal = (row: Product, field: keyof Product) =>
        (edits[row.id]?.[field] as any) ?? row[field];

    // 셀 편집
    const setCellVal = (id: number, field: keyof Product, value: any) => {
        setEdits(prev => ({
            ...prev,
            [id]: { ...(prev[id] ?? {}), [field]: value },
        }));
    };

    // 저장
    const commitAll = () => {
        setRows(prev => prev.map(r => {
            const patch = edits[r.id];
            return patch ? { ...r, ...patch } : r;
        }));
        setEdits({});
        setFocus(null);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    // 되돌리기
    const discardAll = () => { setEdits({}); setFocus(null); };

    // 단일 행 되돌리기
    const discardRow = (id: number) => {
        setEdits(prev => { const next = { ...prev }; delete next[id]; return next; });
        if (focus?.id === id) setFocus(null);
    };

    // 상태 순환
    const cycleStatus = (id: number, current: StockStatus) => {
        const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length];
        setCellVal(id, 'status', next);
    };

    const isDirty = (id: number) => !!edits[id] && Object.keys(edits[id]!).length > 0;

    // 편집 가능 셀 렌더러
    const EditableCell = useCallback(({
        row, field, type = 'text', suffix = '', prefix = '',
    }: { row: Product; field: keyof Product; type?: string; suffix?: string; prefix?: string }) => {
        const isFocused = focus?.id === row.id && focus?.field === field;
        const val = getVal(row, field);
        const changed = edits[row.id]?.[field] !== undefined && edits[row.id]![field] !== row[field];

        if (isFocused) {
            return (
                <div className='flex items-center gap-1'>
                    {prefix && <span className='text-xs text-gray-400'>{prefix}</span>}
                    <input
                        ref={inputRef}
                        autoFocus
                        type={type}
                        defaultValue={val as any}
                        onChange={e => setCellVal(row.id, field, type === 'number' ? Number(e.target.value) : e.target.value)}
                        onBlur={() => setFocus(null)}
                        onKeyDown={e => { if (e.key === 'Enter') { (e.target as HTMLInputElement).blur(); } if (e.key === 'Escape') { discardRow(row.id); setFocus(null); } }}
                        className='w-full px-2 py-1 text-sm border border-indigo-400 rounded-lg outline-none ring-2 ring-indigo-500/20 bg-white min-w-0'
                        style={{ minWidth: 60 }}
                    />
                    {suffix && <span className='text-xs text-gray-400 shrink-0'>{suffix}</span>}
                </div>
            );
        }

        return (
            <div
                className={`flex items-center gap-1 px-2 py-1 rounded-lg cursor-text hover:bg-indigo-50 hover:ring-1 hover:ring-indigo-200 transition-all group/cell ${changed ? 'bg-amber-50 ring-1 ring-amber-200' : ''}`}
                onClick={() => setFocus({ id: row.id, field })}
                title='클릭하여 편집'
            >
                {prefix && <span className='text-xs text-gray-400'>{prefix}</span>}
                <span className={`text-sm ${changed ? 'text-amber-700 font-medium' : 'text-gray-700'}`}>
                    {type === 'number' ? Number(val).toLocaleString() : String(val)}
                </span>
                {suffix && <span className='text-xs text-gray-400'>{suffix}</span>}
                {changed && <span className='w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0' />}
            </div>
        );
    }, [focus, edits]);

    return (
        <div className='flex flex-col gap-4'>
            {/* 헤더 */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
                <div>
                    <h1 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                        <PencilSquareIcon className='h-5 w-5 text-indigo-500' />
                        인라인 편집
                    </h1>
                    <p className='text-sm text-gray-400 mt-0.5'>셀을 클릭해 바로 편집하세요. Enter 저장 · Esc 취소</p>
                </div>
                <div className='flex items-center gap-2'>
                    {saved && (
                        <span className='flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2.5 py-1.5 rounded-lg'>
                            <CheckCircleIcon className='h-3.5 w-3.5' />저장 완료
                        </span>
                    )}
                    {dirtyCount > 0 && (
                        <>
                            <span className='text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg font-medium'>
                                <ExclamationCircleIcon className='h-3.5 w-3.5 inline mr-1' />
                                {dirtyCount}개 행 변경됨
                            </span>
                            <button onClick={discardAll}
                                className='inline-flex items-center gap-1 px-3 py-2 text-sm rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors'>
                                <ArrowPathIcon className='h-4 w-4' />되돌리기
                            </button>
                            <button onClick={commitAll}
                                className='inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl font-semibold text-white transition-all'
                                style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', boxShadow: '0 3px 10px rgba(99,102,241,0.3)' }}>
                                <CheckIcon className='h-4 w-4' />저장하기
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* 안내 배너 */}
            <div className='flex items-center gap-2 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl px-3.5 py-2.5'>
                <PencilSquareIcon className='h-4 w-4 shrink-0' />
                <span>각 셀을 클릭하면 직접 편집할 수 있습니다. 변경된 셀은 <span className='font-semibold text-amber-600'>노란색</span>으로 표시됩니다. 상태 뱃지를 클릭하면 값이 순환됩니다.</span>
            </div>

            {/* 테이블 */}
            <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50 border-b border-gray-200'>
                            <tr>
                                {['', '상품명', '카테고리', '재고', '판매가', '할인율', '상태', ''].map((h, i) => (
                                    <th key={i} className={`px-3 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap ${i >= 3 ? 'text-right' : 'text-left'}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {rows.map(row => {
                                const dirty  = isDirty(row.id);
                                const status = (getVal(row, 'status') as StockStatus);
                                const s      = STATUS_CFG[status];

                                return (
                                    <tr key={row.id}
                                        className={`transition-colors ${dirty ? 'bg-amber-50/30' : 'hover:bg-gray-50/50'}`}>
                                        {/* 변경 인디케이터 */}
                                        <td className='w-1.5 py-2 pl-2'>
                                            {dirty && <div className='w-1 h-8 rounded-full bg-amber-400' />}
                                        </td>

                                        {/* 상품명 */}
                                        <td className='px-2 py-2 min-w-[180px]'>
                                            <EditableCell row={row} field='name' />
                                        </td>

                                        {/* 카테고리 — select */}
                                        <td className='px-2 py-2 min-w-[130px]'>
                                            {focus?.id === row.id && focus?.field === 'category' ? (
                                                <select
                                                    autoFocus
                                                    value={getVal(row, 'category') as string}
                                                    onChange={e => setCellVal(row.id, 'category', e.target.value)}
                                                    onBlur={() => setFocus(null)}
                                                    className='w-full px-2 py-1 text-sm border border-indigo-400 rounded-lg outline-none ring-2 ring-indigo-500/20 bg-white'
                                                >
                                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                                </select>
                                            ) : (
                                                <div
                                                    className={`px-2 py-1 rounded-lg cursor-pointer hover:bg-indigo-50 hover:ring-1 hover:ring-indigo-200 transition-all text-sm ${
                                                        edits[row.id]?.category !== undefined && edits[row.id]!.category !== row.category ? 'bg-amber-50 ring-1 ring-amber-200 text-amber-700 font-medium' : 'text-gray-600'
                                                    }`}
                                                    onClick={() => setFocus({ id: row.id, field: 'category' })}
                                                >
                                                    {getVal(row, 'category') as string}
                                                </div>
                                            )}
                                        </td>

                                        {/* 재고 */}
                                        <td className='px-2 py-2 text-right min-w-[80px]'>
                                            <EditableCell row={row} field='stock' type='number' suffix='개' />
                                        </td>

                                        {/* 판매가 */}
                                        <td className='px-2 py-2 text-right min-w-[110px]'>
                                            <EditableCell row={row} field='price' type='number' prefix='₩' />
                                        </td>

                                        {/* 할인율 */}
                                        <td className='px-2 py-2 text-right min-w-[80px]'>
                                            <EditableCell row={row} field='discount' type='number' suffix='%' />
                                        </td>

                                        {/* 상태 — 클릭 순환 */}
                                        <td className='px-3 py-2 text-right'>
                                            <button
                                                onClick={() => cycleStatus(row.id, status)}
                                                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all hover:ring-2 hover:ring-current/30 ${s.bg} ${s.text}`}
                                                title='클릭하여 상태 변경'
                                            >
                                                {s.label}
                                            </button>
                                        </td>

                                        {/* 행 되돌리기 */}
                                        <td className='px-3 py-2 text-right w-10'>
                                            {dirty && (
                                                <button onClick={() => discardRow(row.id)}
                                                    className='p-1 rounded-lg text-gray-300 hover:text-amber-500 hover:bg-amber-50 transition-colors'
                                                    title='이 행 되돌리기'>
                                                    <XMarkIcon className='h-4 w-4' />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className='px-4 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-400'>
                    <span>총 {rows.length}개 상품</span>
                    {dirtyCount > 0
                        ? <span className='text-amber-600 font-medium'>{dirtyCount}개 행에 미저장 변경사항이 있습니다.</span>
                        : <span className='text-green-500'>모든 변경사항이 저장되었습니다.</span>}
                </div>
            </div>
        </div>
    );
}
