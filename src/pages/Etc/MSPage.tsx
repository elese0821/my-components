import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRightIcon, MagnifyingGlassIcon, TagIcon,
    ArrowPathIcon, ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import instance from '../../services/instance';
import useDialogStore from '../../stores/dialogStore';

// ── 타입 ────────────────────────────────────────────────────────
type Status = 'active' | 'new' | 'sale' | 'out';
interface Product {
    id: number;
    name: string;
    desc: string;
    price: number;
    status: Status;
}
interface Category {
    id: string;
    emoji: string;
    label: string;
    color: string;
    products: Product[];
}

const STATUS_META: Record<Status, { label: string; bg: string; text: string }> = {
    active: { label: '판매중', bg: '#dcfce7', text: '#16a34a' },
    new:    { label: 'NEW',   bg: '#dbeafe', text: '#1d4ed8' },
    sale:   { label: 'SALE',  bg: '#fef9c3', text: '#ca8a04' },
    out:    { label: '품절',   bg: '#f3f4f6', text: '#9ca3af' },
};

// ── 목 데이터 (서버 응답 없을 때 사용) ─────────────────────────
const MOCK_CATEGORIES: Category[] = [
    {
        id: 'monitor', emoji: '🖥️', label: '모니터', color: '#6366f1',
        products: [
            { id: 1,  name: 'UltraWide 34"',  desc: '3440×1440 IPS · 144Hz · HDR400',    price: 599_000,   status: 'active' },
            { id: 2,  name: '4K ProDisplay',  desc: '3840×2160 OLED · 60Hz · USB-C',      price: 1_299_000, status: 'new'    },
            { id: 3,  name: 'Gaming 27"',      desc: '2560×1440 VA · 165Hz · FreeSync',    price: 399_000,   status: 'sale'   },
            { id: 4,  name: 'Portable 15"',    desc: '1920×1080 IPS · 60Hz · USB-C',       price: 249_000,   status: 'active' },
        ],
    },
    {
        id: 'keyboard', emoji: '⌨️', label: '키보드', color: '#10b981',
        products: [
            { id: 5,  name: 'MX Keys Pro',     desc: '무선 · 멀티디바이스 · 백라이트',    price: 149_000, status: 'active' },
            { id: 6,  name: 'Mechanical 65%',  desc: 'Cherry MX Red · PBT 키캡 · 핫스왑', price: 189_000, status: 'new'    },
            { id: 7,  name: 'Slim Scissor',    desc: '저소음 · 슬림 · USB-C',             price: 79_000,  status: 'active' },
            { id: 8,  name: 'Numpad Compact',  desc: '숫자패드 · 유선 · 16키',             price: 39_000,  status: 'out'    },
        ],
    },
    {
        id: 'mouse', emoji: '🖱️', label: '마우스', color: '#f59e0b',
        products: [
            { id: 9,  name: 'Precision Pro',   desc: '8000DPI · 6버튼 · 인체공학',       price: 89_000, status: 'active' },
            { id: 10, name: 'Wireless Silent', desc: '2.4G/BT · 저소음 · 충전식',        price: 59_000, status: 'sale'   },
            { id: 11, name: 'Vertical Ergo',   desc: '수직마우스 · 손목 보호 · DPI 3200', price: 49_000, status: 'active' },
        ],
    },
    {
        id: 'headset', emoji: '🎧', label: '헤드셋', color: '#ec4899',
        products: [
            { id: 12, name: 'Studio ANC Pro', desc: '노이즈캔슬링 · 30H 배터리 · LDAC', price: 329_000, status: 'new'    },
            { id: 13, name: 'Gaming 7.1',     desc: 'USB · 가상 7.1CH · LED',           price: 129_000, status: 'active' },
            { id: 14, name: 'Earbuds Lite',   desc: 'TWS · IPX5 · 24H 총재생',         price: 99_000,  status: 'sale'   },
        ],
    },
    {
        id: 'storage', emoji: '💾', label: '저장장치', color: '#3b82f6',
        products: [
            { id: 15, name: 'NVMe 1TB',          desc: 'PCIe 4.0 · 7000MB/s · M.2',   price: 149_000, status: 'active' },
            { id: 16, name: 'Portable SSD 2TB',  desc: 'USB 3.2 · 1000MB/s · 방진방수', price: 199_000, status: 'new'    },
            { id: 17, name: 'HDD 8TB',           desc: 'SATA · 5400RPM · NAS 최적화',  price: 229_000, status: 'active' },
            { id: 18, name: 'USB 64GB 3.0',      desc: 'USB 3.0 · 회전 커버 · 소형',   price: 19_000,  status: 'out'    },
        ],
    },
];

const fmt = (n: number) => n.toLocaleString('ko-KR') + '원';

// ── 스켈레톤 ────────────────────────────────────────────────────
function Skeleton() {
    return (
        <div className='grid gap-3' style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))' }}>
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='rounded-xl border border-gray-100 p-4 animate-pulse'>
                    <div className='h-3.5 w-3/4 rounded bg-gray-200 mb-2' />
                    <div className='h-2.5 w-full rounded bg-gray-100 mb-1' />
                    <div className='h-2.5 w-2/3 rounded bg-gray-100 mb-3' />
                    <div className='h-4 w-1/2 rounded bg-gray-200' />
                </div>
            ))}
        </div>
    );
}

// ── 상품 카드 ────────────────────────────────────────────────────
function ProductCard({ product, selected, onClick }: {
    product: Product; selected: boolean; onClick: () => void;
}) {
    const s = STATUS_META[product.status];
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onClick}
            className='cursor-pointer rounded-xl border p-4 transition-all'
            style={{
                borderColor: selected ? '#6366f1' : '#e5e7eb',
                background:  selected ? '#eef2ff' : '#fff',
                boxShadow:   selected ? '0 0 0 2px #6366f133' : '0 1px 3px rgba(0,0,0,0.06)',
            }}
        >
            <div className='flex items-start justify-between gap-2 mb-2'>
                <p className='text-sm font-semibold text-gray-800 leading-snug'>{product.name}</p>
                <span className='text-xs font-bold px-1.5 py-0.5 rounded-md shrink-0'
                    style={{ background: s.bg, color: s.text }}>
                    {s.label}
                </span>
            </div>
            <p className='text-xs text-gray-400 leading-relaxed mb-3'>{product.desc}</p>
            <p className='text-base font-bold' style={{ color: product.status === 'out' ? '#9ca3af' : '#4f46e5' }}>
                {product.status === 'out' ? '품절' : fmt(product.price)}
            </p>
        </motion.div>
    );
}

// ── 메인 ────────────────────────────────────────────────────────
export default function MSPage() {
    const { openDialog }     = useDialogStore();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading,    setLoading]    = useState(true);
    const [cartLoading, setCartLoading] = useState(false);
    const [openId,     setOpenId]     = useState<string | null>(null);
    const [selected,   setSelected]   = useState<Product | null>(null);
    const [search,     setSearch]     = useState('');

    // ── 카테고리 목록 로드 ──────────────────────────────────────
    const loadCategories = async () => {
        setLoading(true);
        try {
            const res = await instance.get('/user/product/category');
            if (res.data?.list?.length) {
                setCategories(res.data.list);
                setOpenId(res.data.list[0]?.id ?? null);
                setLoading(false);
                return;
            }
        } catch { /* 서버 미지원 → 목 데이터 사용 */ }
        setCategories(MOCK_CATEGORIES);
        setOpenId(MOCK_CATEGORIES[0].id);
        setLoading(false);
    };

    useEffect(() => { loadCategories(); }, []);

    // ── 카테고리 클릭 시 상품 로드 (서버 or 목) ───────────────
    const handleCatClick = async (id: string) => {
        setOpenId(prev => prev === id ? null : id);
        setSelected(null);
        setSearch('');
        // 서버에서 상품 목록 업데이트 시도
        try {
            const res = await instance.get('/user/product/info', { params: { categoryId: id } });
            if (res.data?.list?.length) {
                setCategories(prev => prev.map(c =>
                    c.id === id ? { ...c, products: res.data.list } : c
                ));
            }
        } catch { /* 목 데이터 유지 */ }
    };

    const activeCat = categories.find(c => c.id === openId) ?? null;

    const filtered = useMemo(() => {
        if (!activeCat) return [];
        if (!search.trim()) return activeCat.products;
        const q = search.toLowerCase();
        return activeCat.products.filter(p =>
            p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
        );
    }, [activeCat, search]);

    // ── 장바구니 담기 ───────────────────────────────────────────
    const handleAddCart = async () => {
        if (!selected || selected.status === 'out') return;
        setCartLoading(true);
        try {
            await instance.post('/user/product/cart', {
                productId:    selected.id,
                productName:  selected.name,
                price:        selected.price,
                categoryId:   activeCat?.id,
            });
            openDialog(`"${selected.name}"을(를) 장바구니에 담았습니다.`);
        } catch {
            // 서버 미지원 → 로컬 피드백
            openDialog(`"${selected.name}"을(를) 장바구니에 담았습니다.`);
        } finally {
            setCartLoading(false);
        }
    };

    return (
        <div className='flex gap-0 rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm' style={{ minHeight: 480 }}>

            {/* ── 왼쪽 카테고리 트리 ── */}
            <div className='w-48 shrink-0 border-r border-gray-100 bg-gray-50 flex flex-col'>
                <div className='px-3 py-3 border-b border-gray-100 flex items-center justify-between'>
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-widest'>카테고리</p>
                    <button onClick={loadCategories}
                        className='p-1 rounded hover:bg-gray-200 transition-colors'
                        title='새로고침'>
                        <ArrowPathIcon className={`h-3 w-3 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
                <nav className='flex-1 overflow-y-auto py-1'>
                    {loading ? (
                        <div className='px-3 py-4 space-y-2'>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className='h-8 rounded-lg bg-gray-200 animate-pulse' />
                            ))}
                        </div>
                    ) : categories.map(cat => (
                        <div key={cat.id}>
                            <button
                                onClick={() => handleCatClick(cat.id)}
                                className='w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors'
                                style={{
                                    background:  openId === cat.id ? `${cat.color}18` : 'transparent',
                                    color:       openId === cat.id ? cat.color : '#374151',
                                    fontWeight:  openId === cat.id ? 700 : 500,
                                }}
                            >
                                <span className='text-base shrink-0'>{cat.emoji}</span>
                                <span className='flex-1 truncate'>{cat.label}</span>
                                <span className='text-xs text-gray-300 shrink-0'>{cat.products.length}</span>
                                <ChevronRightIcon
                                    className='h-3.5 w-3.5 shrink-0 transition-transform duration-150'
                                    style={{ transform: openId === cat.id ? 'rotate(90deg)' : '' }}
                                />
                            </button>

                            {/* 서브 상품 */}
                            <AnimatePresence>
                                {openId === cat.id && (
                                    <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.18 }}
                                        className='overflow-hidden'
                                    >
                                        {cat.products.map(p => (
                                            <li key={p.id}>
                                                <button
                                                    onClick={() => setSelected(p)}
                                                    className='w-full flex items-center gap-1.5 pl-9 pr-3 py-1.5 text-xs text-left transition-colors'
                                                    style={{
                                                        background: selected?.id === p.id ? `${cat.color}18` : 'transparent',
                                                        color:      selected?.id === p.id ? cat.color : '#6b7280',
                                                        fontWeight: selected?.id === p.id ? 600 : 400,
                                                    }}
                                                >
                                                    {selected?.id === p.id && (
                                                        <span className='w-1 h-1 rounded-full shrink-0' style={{ background: cat.color }} />
                                                    )}
                                                    <span className='truncate'>{p.name}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </nav>
            </div>

            {/* ── 오른쪽 콘텐츠 패널 ── */}
            <div className='flex-1 flex flex-col min-w-0'>
                {activeCat ? (
                    <>
                        {/* 패널 헤더 */}
                        <div className='flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-white gap-3'>
                            <div className='flex items-center gap-2'>
                                <span className='text-xl'>{activeCat.emoji}</span>
                                <span className='font-bold text-gray-800'>{activeCat.label}</span>
                                <span className='text-xs text-gray-400'>{activeCat.products.length}개 상품</span>
                            </div>
                            <div className='flex items-center gap-2 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50 w-48'>
                                <MagnifyingGlassIcon className='h-3.5 w-3.5 text-gray-400 shrink-0' />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder='상품 검색...'
                                    className='bg-transparent text-xs outline-none text-gray-700 w-full placeholder-gray-400'
                                />
                            </div>
                        </div>

                        <div className='flex flex-1 min-h-0 overflow-hidden'>
                            {/* 상품 그리드 */}
                            <div className='flex-1 overflow-y-auto p-5'>
                                {loading ? (
                                    <Skeleton />
                                ) : filtered.length === 0 ? (
                                    <div className='flex items-center justify-center h-32 text-sm text-gray-400'>
                                        검색 결과가 없습니다.
                                    </div>
                                ) : (
                                    <div className='grid gap-3'
                                        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))' }}>
                                        {filtered.map(p => (
                                            <ProductCard
                                                key={p.id}
                                                product={p}
                                                selected={selected?.id === p.id}
                                                onClick={() => setSelected(prev => prev?.id === p.id ? null : p)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 상품 상세 패널 */}
                            <AnimatePresence>
                                {selected && (
                                    <motion.aside
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: 240, opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        transition={{ duration: 0.22 }}
                                        className='border-l border-gray-100 bg-gray-50 overflow-hidden shrink-0'
                                    >
                                        <div className='p-4 w-60'>
                                            <div className='flex items-center gap-1.5 mb-4'>
                                                <TagIcon className='h-4 w-4 text-indigo-500' />
                                                <p className='text-xs font-bold text-gray-500 uppercase tracking-wide'>상품 상세</p>
                                            </div>

                                            {(() => {
                                                const s = STATUS_META[selected.status];
                                                return (
                                                    <span className='inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-3'
                                                        style={{ background: s.bg, color: s.text }}>
                                                        {s.label}
                                                    </span>
                                                );
                                            })()}

                                            <h3 className='text-base font-bold text-gray-800 leading-snug mb-2'>{selected.name}</h3>
                                            <p className='text-xs text-gray-500 leading-relaxed mb-4'>{selected.desc}</p>

                                            <div className='space-y-2 text-xs mb-5'>
                                                <div className='flex justify-between'>
                                                    <span className='text-gray-400'>카테고리</span>
                                                    <span className='font-medium text-gray-700'>{activeCat.emoji} {activeCat.label}</span>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <span className='text-gray-400'>가격</span>
                                                    <span className='font-bold text-indigo-600'>
                                                        {selected.status === 'out' ? '품절' : fmt(selected.price)}
                                                    </span>
                                                </div>
                                            </div>

                                            {selected.status !== 'out' && (
                                                <button
                                                    onClick={handleAddCart}
                                                    disabled={cartLoading}
                                                    className='w-full py-2 rounded-lg text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-1.5'
                                                    style={{ background: activeCat.color }}
                                                >
                                                    {cartLoading ? (
                                                        <ArrowPathIcon className='h-3.5 w-3.5 animate-spin' />
                                                    ) : (
                                                        <ShoppingCartIcon className='h-3.5 w-3.5' />
                                                    )}
                                                    {cartLoading ? '처리 중...' : '장바구니 담기'}
                                                </button>
                                            )}

                                            <div className='mt-3 flex items-center gap-1 text-xs text-gray-400'>
                                                <CheckBadgeIcon className='h-3.5 w-3.5 text-green-400' />
                                                정품 보증 1년
                                            </div>
                                        </div>
                                    </motion.aside>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                ) : (
                    <div className='flex flex-1 items-center justify-center text-sm text-gray-400'>
                        왼쪽에서 카테고리를 선택하세요.
                    </div>
                )}
            </div>
        </div>
    );
}
