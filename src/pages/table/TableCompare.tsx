import React, { useState } from 'react';
import { CheckIcon, XMarkIcon, MinusIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/solid';

type PlanKey = 'free' | 'basic' | 'pro' | 'enterprise';
type CellVal = boolean | string | null;

interface FeatureRow {
    label: string;
    tooltip?: string;
    free: CellVal;
    basic: CellVal;
    pro: CellVal;
    enterprise: CellVal;
}

interface FeatureGroup {
    group: string;
    rows: FeatureRow[];
}

const PLANS: { key: PlanKey; name: string; price: string; sub: string; highlight?: boolean; color: string }[] = [
    { key: 'free',       name: 'Free',       price: '무료',         sub: '개인 사용자',     color: '#64748b' },
    { key: 'basic',      name: 'Basic',      price: '₩9,900/월',   sub: '소규모 팀',       color: '#3b82f6' },
    { key: 'pro',        name: 'Pro',        price: '₩29,900/월',  sub: '성장하는 팀',     highlight: true, color: '#6366f1' },
    { key: 'enterprise', name: 'Enterprise', price: '문의',         sub: '대기업 / 맞춤형', color: '#0f172a' },
];

const FEATURES: FeatureGroup[] = [
    {
        group: '저장공간 & 데이터',
        rows: [
            { label: '스토리지',        free: '5GB',       basic: '50GB',     pro: '500GB',    enterprise: '무제한' },
            { label: '파일 업로드',     free: '최대 10MB', basic: '최대 100MB', pro: '최대 5GB', enterprise: '무제한' },
            { label: '데이터 백업',     free: false,       basic: '주 1회',   pro: '매일',     enterprise: '실시간' },
            { label: 'API 호출량',      free: '1,000/일',  basic: '10,000/일', pro: '100,000/일', enterprise: '무제한' },
        ],
    },
    {
        group: '팀 & 협업',
        rows: [
            { label: '멤버 수',         free: '1명',       basic: '최대 5명',  pro: '최대 30명', enterprise: '무제한' },
            { label: '워크스페이스',    free: '1개',       basic: '3개',       pro: '무제한',    enterprise: '무제한' },
            { label: '권한 관리',       free: false,       basic: '기본',      pro: '상세',      enterprise: '완전 커스텀' },
            { label: '게스트 초대',     free: false,       basic: true,        pro: true,        enterprise: true },
            { label: 'SSO / SAML',      free: false,       basic: false,       pro: true,        enterprise: true },
        ],
    },
    {
        group: '보안 & 준수',
        rows: [
            { label: '2단계 인증 (2FA)', free: true,       basic: true,        pro: true,        enterprise: true },
            { label: '감사 로그',        free: false,      basic: '30일',      pro: '1년',       enterprise: '무제한' },
            { label: 'IP 화이트리스트', free: false,       basic: false,       pro: true,        enterprise: true },
            { label: 'SOC 2 Type II',   free: false,       basic: false,       pro: true,        enterprise: true },
            { label: 'GDPR 준수',       free: true,        basic: true,        pro: true,        enterprise: true },
            { label: '온프레미스 배포', free: false,       basic: false,       pro: false,       enterprise: true },
        ],
    },
    {
        group: '지원 & SLA',
        rows: [
            { label: '기술 지원',       free: '커뮤니티',  basic: '이메일',    pro: '우선 이메일', enterprise: '전담 CSM' },
            { label: '응답 시간',       free: null,        basic: '24시간',    pro: '4시간',     enterprise: '1시간' },
            { label: 'SLA 보장',        free: false,       basic: false,       pro: '99.9%',     enterprise: '99.99%' },
            { label: '온보딩 지원',     free: false,       basic: false,       pro: true,        enterprise: '전담 트레이닝' },
        ],
    },
];

function Cell({ val, highlight }: { val: CellVal; highlight?: boolean }) {
    if (val === null)  return <span className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100'><MinusIcon className='h-3 w-3 text-gray-300' /></span>;
    if (val === true)  return <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${highlight ? 'bg-indigo-100' : 'bg-green-50'}`}><CheckIcon className={`h-3.5 w-3.5 ${highlight ? 'text-indigo-600' : 'text-green-500'} stroke-2`} /></span>;
    if (val === false) return <span className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-50'><XMarkIcon className='h-3.5 w-3.5 text-red-300 stroke-2' /></span>;
    return <span className={`text-xs font-medium whitespace-nowrap ${highlight ? 'text-indigo-700' : 'text-gray-600'}`}>{val}</span>;
}

export default function TableCompare() {
    const [currentPlan, setCurrentPlan] = useState<PlanKey>('basic');

    return (
        <div className='flex flex-col gap-4'>
            {/* 헤더 */}
            <div>
                <h1 className='text-xl font-bold text-gray-800'>요금제 비교표</h1>
                <p className='text-sm text-gray-400 mt-0.5'>서비스 플랜별 기능을 비교해보세요. 현재 플랜을 선택하면 강조 표시됩니다.</p>
            </div>

            {/* 플랜 선택 칩 (현재 플랜 시뮬레이터) */}
            <div className='flex flex-wrap gap-2 items-center'>
                <span className='text-xs text-gray-400 mr-1'>내 플랜:</span>
                {PLANS.map(p => (
                    <button
                        key={p.key}
                        onClick={() => setCurrentPlan(p.key)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            currentPlan === p.key
                                ? 'text-white shadow-sm'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        style={currentPlan === p.key ? { background: p.color } : {}}
                    >
                        {p.name}
                    </button>
                ))}
            </div>

            {/* 비교 테이블 */}
            <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full' style={{ minWidth: 640 }}>
                        <thead>
                            <tr>
                                {/* 기능 헤더 */}
                                <th className='sticky left-0 z-10 bg-white px-5 py-4 text-left w-48'>
                                    <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>기능</span>
                                </th>

                                {/* 플랜 헤더 */}
                                {PLANS.map(p => {
                                    const isCurrent = p.key === currentPlan;
                                    return (
                                        <th key={p.key} className='px-4 py-4 text-center align-top'>
                                            <div className={`relative inline-flex flex-col items-center gap-1 px-4 py-3 rounded-2xl w-full transition-all ${
                                                p.highlight ? 'ring-2 ring-indigo-300' : ''
                                            }`}
                                            style={p.highlight ? { background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)' } : {}}>
                                                {p.highlight && (
                                                    <span className='absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap'>
                                                        <SparklesIcon className='h-2.5 w-2.5' />추천
                                                    </span>
                                                )}
                                                {isCurrent && (
                                                    <span className='absolute -top-2.5 right-1 text-[10px] font-bold px-2 py-0.5 rounded-full text-white'
                                                        style={{ background: p.color }}>현재</span>
                                                )}
                                                <span className='text-sm font-bold text-gray-800'>{p.name}</span>
                                                <span className='text-sm font-semibold' style={{ color: p.color }}>{p.price}</span>
                                                <span className='text-xs text-gray-400'>{p.sub}</span>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        <tbody>
                            {FEATURES.map(group => (
                                <React.Fragment key={group.group}>
                                    {/* 그룹 헤더 */}
                                    <tr>
                                        <td colSpan={5} className='px-5 pt-5 pb-1.5'>
                                            <span className='text-xs font-bold text-gray-400 uppercase tracking-widest'>{group.group}</span>
                                        </td>
                                    </tr>

                                    {/* 기능 행 */}
                                    {group.rows.map((row, ri) => (
                                        <tr key={ri} className='border-t border-gray-50 hover:bg-gray-50/50 transition-colors'>
                                            <td className='sticky left-0 z-10 bg-white px-5 py-3'>
                                                <span className='text-sm text-gray-700'>{row.label}</span>
                                            </td>
                                            {PLANS.map(p => {
                                                const isHighlight = p.highlight;
                                                const isCurrent   = p.key === currentPlan;
                                                return (
                                                    <td key={p.key}
                                                        className={`px-4 py-3 text-center transition-colors ${
                                                            isHighlight ? 'bg-indigo-50/30' : ''
                                                        } ${isCurrent ? 'ring-x ring-inset' : ''}`}
                                                    >
                                                        <div className='flex items-center justify-center'>
                                                            <Cell val={row[p.key]} highlight={isHighlight} />
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}

                            {/* CTA 행 */}
                            <tr className='border-t-2 border-gray-200'>
                                <td className='px-5 py-5 text-xs text-gray-400'>업그레이드 시 즉시 적용</td>
                                {PLANS.map(p => (
                                    <td key={p.key} className={`px-4 py-5 text-center ${p.highlight ? 'bg-indigo-50/30' : ''}`}>
                                        <button
                                            className='w-full py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95'
                                            style={
                                                p.key === currentPlan
                                                    ? { background: '#f3f4f6', color: '#9ca3af' }
                                                    : p.highlight
                                                    ? { background: `linear-gradient(135deg,#6366f1,#8b5cf6)`, color: '#fff', boxShadow: '0 3px 12px rgba(99,102,241,0.3)' }
                                                    : { background: p.color, color: '#fff' }
                                            }
                                        >
                                            {p.key === currentPlan ? '현재 플랜' : p.key === 'enterprise' ? '문의하기' : '업그레이드'}
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
