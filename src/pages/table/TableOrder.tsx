import React, { useMemo, useState } from 'react';
import {
    MagnifyingGlassIcon, EyeIcon, TruckIcon, XCircleIcon,
    ArrowDownTrayIcon, CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Pagination from '../../components/common/pagination/Pagination';

type Status = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
    id: number; orderNo: string; customer: string; product: string;
    qty: number; amount: number; payMethod: string; orderDate: string; status: Status;
}

const STATUS_CFG: Record<Status, { label: string; bg: string; text: string; dot: string }> = {
    pending:    { label: '주문접수', bg: 'bg-sky-50',    text: 'text-sky-600',    dot: '#0ea5e9' },
    processing: { label: '처리중',   bg: 'bg-amber-50',  text: 'text-amber-600',  dot: '#f59e0b' },
    shipped:    { label: '배송중',   bg: 'bg-indigo-50', text: 'text-indigo-600', dot: '#6366f1' },
    delivered:  { label: '배송완료', bg: 'bg-green-50',  text: 'text-green-600',  dot: '#10b981' },
    cancelled:  { label: '취소됨',   bg: 'bg-red-50',    text: 'text-red-400',    dot: '#ef4444' },
};

const ORDERS: Order[] = [
    { id: 1,  orderNo: '#10023', customer: '이민준', product: 'MacBook Pro 14"',        qty: 1, amount: 3_200_000, payMethod: '신용카드',    orderDate: '2024-01-15', status: 'delivered'  },
    { id: 2,  orderNo: '#10024', customer: '박서연', product: 'LG UltraWide 34"',       qty: 2, amount: 1_680_000, payMethod: '계좌이체',    orderDate: '2024-01-16', status: 'shipped'    },
    { id: 3,  orderNo: '#10025', customer: '김하준', product: 'Sony WH-1000XM5',        qty: 1, amount: 420_000,  payMethod: '신용카드',    orderDate: '2024-01-17', status: 'processing' },
    { id: 4,  orderNo: '#10026', customer: '최유나', product: 'iPad Pro 12.9"',         qty: 1, amount: 1_590_000, payMethod: '카카오페이',  orderDate: '2024-01-17', status: 'pending'    },
    { id: 5,  orderNo: '#10027', customer: '정도현', product: 'Samsung T7 SSD 1TB',     qty: 3, amount: 360_000,  payMethod: '신용카드',    orderDate: '2024-01-18', status: 'delivered'  },
    { id: 6,  orderNo: '#10028', customer: '강지우', product: 'Logitech MX Keys',       qty: 1, amount: 149_000,  payMethod: '네이버페이',  orderDate: '2024-01-18', status: 'cancelled'  },
    { id: 7,  orderNo: '#10029', customer: '윤채원', product: 'AirPods Pro 2세대',      qty: 2, amount: 798_000,  payMethod: '신용카드',    orderDate: '2024-01-19', status: 'shipped'    },
    { id: 8,  orderNo: '#10030', customer: '임태양', product: 'Dell XPS 15',            qty: 1, amount: 2_890_000, payMethod: '계좌이체',   orderDate: '2024-01-19', status: 'processing' },
    { id: 9,  orderNo: '#10031', customer: '한소희', product: 'Razer DeathAdder V3',    qty: 1, amount: 89_000,   payMethod: '신용카드',    orderDate: '2024-01-20', status: 'delivered'  },
    { id: 10, orderNo: '#10032', customer: '오준서', product: 'Nintendo Switch OLED',   qty: 2, amount: 798_000,  payMethod: '카카오페이',  orderDate: '2024-01-20', status: 'pending'    },
    { id: 11, orderNo: '#10033', customer: '백수민', product: 'Apple Watch Ultra 2',    qty: 1, amount: 1_199_000, payMethod: '신용카드',   orderDate: '2024-01-21', status: 'shipped'    },
    { id: 12, orderNo: '#10034', customer: '신예진', product: 'Bose QC 45',             qty: 1, amount: 320_000,  payMethod: '네이버페이',  orderDate: '2024-01-21', status: 'delivered'  },
    { id: 13, orderNo: '#10035', customer: '류성훈', product: 'LG Gram 16 2024',        qty: 1, amount: 2_190_000, payMethod: '신용카드',   orderDate: '2024-01-22', status: 'processing' },
    { id: 14, orderNo: '#10036', customer: '나지현', product: 'Anker PowerBank 26800',  qty: 2, amount: 120_000,  payMethod: '계좌이체',    orderDate: '2024-01-22', status: 'cancelled'  },
    { id: 15, orderNo: '#10037', customer: '조민우', product: 'Samsung 65" QLED TV',    qty: 1, amount: 3_490_000, payMethod: '신용카드',   orderDate: '2024-01-23', status: 'pending'    },
    { id: 16, orderNo: '#10038', customer: '황지수', product: 'Canon EOS R6 Mark II',   qty: 1, amount: 3_990_000, payMethod: '계좌이체',   orderDate: '2024-01-23', status: 'processing' },
    { id: 17, orderNo: '#10039', customer: '손민재', product: 'Dyson V15 Detect',       qty: 1, amount: 1_090_000, payMethod: '카카오페이', orderDate: '2024-01-24', status: 'shipped'    },
    { id: 18, orderNo: '#10040', customer: '문채은', product: 'Kindle Paperwhite 2023', qty: 2, amount: 330_000,  payMethod: '네이버페이',  orderDate: '2024-01-24', status: 'delivered'  },
];

export default function TableOrder() {
    const [search,       setSearch]       = useState('');
    const [statusFilter, setStatusFilter] = useState<Status | ''>('');
    const [page,         setPage]         = useState(1);
    const ROW = 8;

    const filtered = useMemo(() => {
        let d = [...ORDERS];
        if (search)       d = d.filter(r => [r.orderNo, r.customer, r.product].some(v => v.toLowerCase().includes(search.toLowerCase())));
        if (statusFilter) d = d.filter(r => r.status === statusFilter);
        return d;
    }, [search, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ROW));
    const paged      = filtered.slice((page - 1) * ROW, page * ROW);

    const totalRevenue   = ORDERS.filter(r => r.status !== 'cancelled').reduce((s, r) => s + r.amount, 0);
    const filteredRevenue = filtered.filter(r => r.status !== 'cancelled').reduce((s, r) => s + r.amount, 0);

    // 상태별 집계
    const counts = Object.fromEntries(
        (Object.keys(STATUS_CFG) as Status[]).map(k => [k, ORDERS.filter(o => o.status === k).length])
    ) as Record<Status, number>;

    return (
        <div className='flex flex-col gap-4'>
            {/* 헤더 */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
                <div>
                    <h1 className='text-xl font-bold text-gray-800'>주문 관리</h1>
                    <p className='text-sm text-gray-400 mt-0.5'>총 {ORDERS.length}건 · 누적 매출 ₩{totalRevenue.toLocaleString()}</p>
                </div>
                <button className='inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors'>
                    <ArrowDownTrayIcon className='h-4 w-4' />내보내기
                </button>
            </div>

            {/* 상태 요약 카드 */}
            <div className='grid grid-cols-2 sm:grid-cols-5 gap-2'>
                {(Object.entries(STATUS_CFG) as [Status, typeof STATUS_CFG[Status]][]).map(([k, v]) => (
                    <button
                        key={k}
                        onClick={() => { setStatusFilter(p => p === k ? '' : k); setPage(1); }}
                        className={`flex flex-col gap-1 p-3 rounded-xl border transition-all text-left ${
                            statusFilter === k
                                ? `${v.bg} border-current ${v.text} ring-1 ring-current`
                                : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                        }`}
                    >
                        <div className='flex items-center gap-1.5'>
                            <span className='w-2 h-2 rounded-full' style={{ background: v.dot }} />
                            <span className={`text-xs font-medium ${statusFilter === k ? v.text : 'text-gray-500'}`}>{v.label}</span>
                        </div>
                        <span className={`text-2xl font-bold ${statusFilter === k ? v.text : 'text-gray-800'}`}>{counts[k]}</span>
                    </button>
                ))}
            </div>

            {/* 필터 */}
            <div className='flex gap-2'>
                <div className='relative flex-1'>
                    <MagnifyingGlassIcon className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
                    <input
                        type='text' placeholder='주문번호, 고객명, 상품 검색...'
                        value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className='w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-400 transition-all'
                    />
                </div>
                {(search || statusFilter) && (
                    <button onClick={() => { setSearch(''); setStatusFilter(''); setPage(1); }}
                        className='px-3 py-2 text-sm rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors whitespace-nowrap'>
                        초기화
                    </button>
                )}
            </div>

            {/* 테이블 */}
            <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50 border-b border-gray-200'>
                            <tr>
                                {['주문번호', '고객', '상품', '수량', '결제금액', '결제수단', '주문일', '상태', ''].map((h, i) => (
                                    <th key={i} className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap ${i >= 3 ? 'text-right' : 'text-left'}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {paged.length === 0
                                ? <tr><td colSpan={9} className='py-14 text-center text-sm text-gray-400'>검색 결과가 없습니다.</td></tr>
                                : paged.map(row => {
                                    const s = STATUS_CFG[row.status];
                                    return (
                                        <tr key={row.id} className='hover:bg-gray-50/60 transition-colors group'>
                                            <td className='px-4 py-3'>
                                                <span className='text-sm font-mono font-semibold text-indigo-600'>{row.orderNo}</span>
                                            </td>
                                            <td className='px-4 py-3'>
                                                <div className='flex items-center gap-2'>
                                                    <div className='w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0'
                                                        style={{ background: `hsl(${(row.customer.charCodeAt(0) * 37) % 360}, 60%, 55%)` }}>
                                                        {row.customer[0]}
                                                    </div>
                                                    <span className='text-sm text-gray-800 whitespace-nowrap'>{row.customer}</span>
                                                </div>
                                            </td>
                                            <td className='px-4 py-3 text-sm text-gray-700 whitespace-nowrap max-w-[180px] truncate'>{row.product}</td>
                                            <td className='px-4 py-3 text-sm text-gray-500 text-right'>{row.qty}</td>
                                            <td className='px-4 py-3 text-sm font-semibold text-gray-800 text-right whitespace-nowrap'>
                                                ₩{row.amount.toLocaleString()}
                                            </td>
                                            <td className='px-4 py-3 text-xs text-gray-400 text-right whitespace-nowrap'>{row.payMethod}</td>
                                            <td className='px-4 py-3 text-xs text-gray-400 text-right whitespace-nowrap'>{row.orderDate}</td>
                                            <td className='px-4 py-3 text-right'>
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                                                    <span className='w-1.5 h-1.5 rounded-full' style={{ background: s.dot }} />
                                                    {s.label}
                                                </span>
                                            </td>
                                            <td className='px-4 py-3'>
                                                <div className='flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                                                    <button className='p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors' title='상세보기'>
                                                        <EyeIcon className='h-4 w-4' />
                                                    </button>
                                                    {!['delivered','cancelled'].includes(row.status) && (
                                                        <button className='p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors' title='배송 처리'>
                                                            <TruckIcon className='h-4 w-4' />
                                                        </button>
                                                    )}
                                                    {row.status === 'delivered' && (
                                                        <CheckCircleIcon className='h-4 w-4 text-green-400' />
                                                    )}
                                                    {!['delivered','cancelled'].includes(row.status) && (
                                                        <button className='p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors' title='주문 취소'>
                                                            <XCircleIcon className='h-4 w-4' />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
                <div className='px-4 py-2.5 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-2'>
                    <div className='flex items-center gap-4 text-xs text-gray-400'>
                        <span>{filtered.length}건 표시</span>
                        <span className='font-semibold text-indigo-600'>취소 제외 매출: ₩{filteredRevenue.toLocaleString()}</span>
                    </div>
                    <Pagination totalPages={totalPages} page={page} setPage={setPage} />
                </div>
            </div>
        </div>
    );
}
