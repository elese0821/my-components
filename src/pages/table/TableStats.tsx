import React, { useMemo, useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, UsersIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface Employee {
    id: number; name: string; dept: string; role: string;
    joinDate: string; status: 'active' | 'leave' | 'retired'; salary: number;
}

const DATA: Employee[] = [
    { id: 1,  name: '김민준', dept: '개발팀',   role: '시니어 개발자',   joinDate: '2019-03-15', status: 'active',  salary: 6800 },
    { id: 2,  name: '이서연', dept: '디자인팀', role: 'UI/UX 디자이너',  joinDate: '2020-07-01', status: 'active',  salary: 5200 },
    { id: 3,  name: '박지훈', dept: '기획팀',   role: 'PM',             joinDate: '2018-11-20', status: 'active',  salary: 5900 },
    { id: 4,  name: '최수아', dept: '개발팀',   role: '주니어 개발자',   joinDate: '2022-02-14', status: 'active',  salary: 3800 },
    { id: 5,  name: '정도윤', dept: 'QA팀',     role: 'QA 엔지니어',    joinDate: '2021-05-10', status: 'leave',   salary: 4400 },
    { id: 6,  name: '강하은', dept: '개발팀',   role: '프론트엔드',      joinDate: '2020-09-01', status: 'active',  salary: 5100 },
    { id: 7,  name: '윤서준', dept: '기획팀',   role: '서비스 기획',     joinDate: '2019-12-03', status: 'active',  salary: 4700 },
    { id: 8,  name: '임지아', dept: '디자인팀', role: '그래픽 디자이너', joinDate: '2023-01-16', status: 'active',  salary: 3600 },
    { id: 9,  name: '오현우', dept: 'QA팀',     role: '테스트 리드',     joinDate: '2017-08-22', status: 'retired', salary: 5500 },
    { id: 10, name: '한채원', dept: '개발팀',   role: '백엔드 개발자',   joinDate: '2021-03-08', status: 'active',  salary: 5600 },
    { id: 11, name: '신유진', dept: '기획팀',   role: 'UX 리서처',      joinDate: '2022-06-27', status: 'active',  salary: 4300 },
    { id: 12, name: '배준혁', dept: '개발팀',   role: 'DevOps',         joinDate: '2020-11-30', status: 'leave',   salary: 6200 },
    { id: 13, name: '조민서', dept: '디자인팀', role: '모션 디자이너',   joinDate: '2023-04-03', status: 'active',  salary: 3900 },
    { id: 14, name: '황성호', dept: '개발팀',   role: 'iOS 개발자',     joinDate: '2019-06-17', status: 'active',  salary: 6100 },
    { id: 15, name: '문지은', dept: 'QA팀',     role: 'QA 엔지니어',    joinDate: '2021-09-14', status: 'active',  salary: 4100 },
];

const DEPT_STYLE: Record<string, { bg: string; text: string; ring: string; avatarBg: string }> = {
    '개발팀':   { bg: 'bg-blue-50',   text: 'text-blue-700',   ring: 'ring-blue-200',   avatarBg: '#3b82f6' },
    '디자인팀': { bg: 'bg-purple-50', text: 'text-purple-700', ring: 'ring-purple-200', avatarBg: '#8b5cf6' },
    '기획팀':   { bg: 'bg-orange-50', text: 'text-orange-700', ring: 'ring-orange-200', avatarBg: '#f97316' },
    'QA팀':     { bg: 'bg-rose-50',   text: 'text-rose-700',   ring: 'ring-rose-200',   avatarBg: '#f43f5e' },
};

const STATUS_LABEL: Record<string, string> = { active: '재직', leave: '휴직', retired: '퇴직' };

function Bar({ pct, color }: { pct: number; color: string }) {
    return (
        <div className='relative h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden'>
            <div className='absolute inset-y-0 left-0 rounded-full transition-all duration-500' style={{ width: `${pct}%`, background: color }} />
        </div>
    );
}

export default function TableStats() {
    const [expanded, setExpanded] = useState<string[]>([]);
    const toggle = (dept: string) =>
        setExpanded(p => p.includes(dept) ? p.filter(d => d !== dept) : [...p, dept]);

    const grouped = useMemo(() => {
        const depts = [...new Set(DATA.map(d => d.dept))];
        return depts.map(dept => {
            const members = DATA.filter(d => d.dept === dept);
            const salaries = members.map(m => m.salary);
            const activeCount = members.filter(m => m.status === 'active').length;
            return {
                dept,
                count:   members.length,
                avg:     Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length),
                max:     Math.max(...salaries),
                min:     Math.min(...salaries),
                total:   salaries.reduce((a, b) => a + b, 0),
                activeCount,
                activePct: Math.round((activeCount / members.length) * 100),
                members,
            };
        });
    }, []);

    const totals = useMemo(() => ({
        count:   DATA.length,
        avg:     Math.round(DATA.reduce((s, d) => s + d.salary, 0) / DATA.length),
        max:     Math.max(...DATA.map(d => d.salary)),
        min:     Math.min(...DATA.map(d => d.salary)),
        total:   DATA.reduce((s, d) => s + d.salary, 0),
        activePct: Math.round((DATA.filter(d => d.status === 'active').length / DATA.length) * 100),
    }), []);

    const COLS = ['부서', '인원', '평균 연봉', '최고 연봉', '최저 연봉', '재직 비율', '연봉 총액'];

    return (
        <div className='flex flex-col gap-4'>
            {/* 헤더 */}
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
                <div>
                    <h1 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                        <UsersIcon className='h-5 w-5 text-indigo-500' />
                        부서별 통계 집계
                    </h1>
                    <p className='text-sm text-gray-400 mt-0.5'>전체 {DATA.length}명 · 평균 연봉 {totals.avg.toLocaleString()}만원</p>
                </div>
                <button
                    onClick={() => setExpanded(p => p.length === grouped.length ? [] : grouped.map(g => g.dept))}
                    className='text-sm text-indigo-500 hover:text-indigo-700 font-medium transition-colors'>
                    {expanded.length === grouped.length ? '전체 접기 ↑' : '전체 펼치기 ↓'}
                </button>
            </div>

            {/* KPI 카드 */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {[
                    { label: '전체 인원',   value: `${totals.count}명`,              sub: `${grouped.length}개 부서` },
                    { label: '평균 연봉',   value: `${totals.avg.toLocaleString()}만`, sub: `max ${totals.max.toLocaleString()}만` },
                    { label: '재직 비율',   value: `${totals.activePct}%`,            sub: `${DATA.filter(d => d.status === 'active').length}명 재직 중` },
                    { label: '총 인건비',   value: `${(totals.total / 100).toFixed(0)}억원`, sub: `연 기준` },
                ].map(k => (
                    <div key={k.label} className='bg-white rounded-2xl border border-gray-100 shadow-sm p-4'>
                        <p className='text-xs text-gray-400'>{k.label}</p>
                        <p className='text-2xl font-bold text-gray-800 mt-1'>{k.value}</p>
                        <p className='text-xs text-gray-400 mt-0.5'>{k.sub}</p>
                    </div>
                ))}
            </div>

            {/* 집계 테이블 */}
            <div className='bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden'>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50 border-b border-gray-200'>
                            <tr>
                                {COLS.map((c, i) => (
                                    <th key={i} className={`px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap ${i > 0 ? 'text-right' : 'text-left'}`}>{c}</th>
                                ))}
                                <th className='px-4 py-3 w-10' />
                            </tr>
                        </thead>
                        <tbody>
                            {grouped.map(g => {
                                const st = DEPT_STYLE[g.dept] ?? DEPT_STYLE['개발팀'];
                                const isOpen = expanded.includes(g.dept);
                                return (
                                    <React.Fragment key={g.dept}>
                                        {/* 부서 집계 행 */}
                                        <tr
                                            className='border-b border-gray-100 cursor-pointer hover:bg-gray-50/60 transition-colors'
                                            onClick={() => toggle(g.dept)}
                                        >
                                            <td className='px-4 py-3.5'>
                                                <div className='flex items-center gap-2.5'>
                                                    <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.18 }}>
                                                        <ChevronRightIcon className='h-4 w-4 text-gray-400' />
                                                    </motion.div>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${st.bg} ${st.text}`}>{g.dept}</span>
                                                </div>
                                            </td>
                                            <td className='px-4 py-3.5 text-right'>
                                                <span className='text-sm font-semibold text-gray-800'>{g.count}명</span>
                                            </td>
                                            <td className='px-4 py-3.5 text-right text-sm font-medium text-gray-800'>{g.avg.toLocaleString()}만원</td>
                                            <td className='px-4 py-3.5 text-right text-sm text-green-600 font-medium'>{g.max.toLocaleString()}만원</td>
                                            <td className='px-4 py-3.5 text-right text-sm text-gray-500'>{g.min.toLocaleString()}만원</td>
                                            <td className='px-4 py-3.5 text-right'>
                                                <div className='flex items-center justify-end gap-2'>
                                                    <Bar pct={g.activePct} color={st.avatarBg} />
                                                    <span className='text-sm font-medium text-gray-700 w-10 text-right'>{g.activePct}%</span>
                                                </div>
                                            </td>
                                            <td className='px-4 py-3.5 text-right text-sm font-semibold text-gray-800'>{g.total.toLocaleString()}만원</td>
                                            <td className='px-2 py-3.5' />
                                        </tr>

                                        {/* 멤버 상세 (펼침) */}
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.tr
                                                    key={`detail-${g.dept}`}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.15 }}
                                                >
                                                    <td colSpan={8} className='p-0'>
                                                        <motion.div
                                                            initial={{ height: 0 }}
                                                            animate={{ height: 'auto' }}
                                                            exit={{ height: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className='overflow-hidden'
                                                        >
                                                            <div className={`${st.bg}/50 border-b border-gray-100`}>
                                                                <table className='w-full'>
                                                                    <thead>
                                                                        <tr className='text-xs text-gray-400'>
                                                                            <th className='pl-12 py-2 text-left font-medium'>이름</th>
                                                                            <th className='px-4 py-2 text-left font-medium'>직무</th>
                                                                            <th className='px-4 py-2 text-left font-medium'>입사일</th>
                                                                            <th className='px-4 py-2 text-right font-medium'>상태</th>
                                                                            <th className='px-4 py-2 text-right font-medium'>연봉</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {g.members.map(m => (
                                                                            <tr key={m.id} className='border-t border-gray-100/50'>
                                                                                <td className='pl-12 py-2.5'>
                                                                                    <div className='flex items-center gap-2'>
                                                                                        <div className='w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold'
                                                                                            style={{ background: st.avatarBg }}>
                                                                                            {m.name[0]}
                                                                                        </div>
                                                                                        <span className='text-sm text-gray-700'>{m.name}</span>
                                                                                    </div>
                                                                                </td>
                                                                                <td className='px-4 py-2.5 text-xs text-gray-500'>{m.role}</td>
                                                                                <td className='px-4 py-2.5 text-xs text-gray-400'>{m.joinDate}</td>
                                                                                <td className='px-4 py-2.5 text-right'>
                                                                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                                                                        m.status === 'active'  ? 'bg-green-100 text-green-600' :
                                                                                        m.status === 'leave'   ? 'bg-yellow-100 text-yellow-600' :
                                                                                        'bg-gray-100 text-gray-400'
                                                                                    }`}>{STATUS_LABEL[m.status]}</span>
                                                                                </td>
                                                                                <td className='px-4 py-2.5 text-right text-sm font-medium text-gray-700'>{m.salary.toLocaleString()}만원</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </motion.div>
                                                    </td>
                                                </motion.tr>
                                            )}
                                        </AnimatePresence>
                                    </React.Fragment>
                                );
                            })}

                            {/* 합계 행 */}
                            <tr className='bg-gray-50 border-t-2 border-gray-200 font-semibold'>
                                <td className='px-4 py-3.5 text-sm text-gray-700 font-bold'>합계 / 평균</td>
                                <td className='px-4 py-3.5 text-right text-sm text-gray-800'>{totals.count}명</td>
                                <td className='px-4 py-3.5 text-right text-sm text-gray-800'>{totals.avg.toLocaleString()}만원</td>
                                <td className='px-4 py-3.5 text-right text-sm text-green-600'>{totals.max.toLocaleString()}만원</td>
                                <td className='px-4 py-3.5 text-right text-sm text-gray-500'>{totals.min.toLocaleString()}만원</td>
                                <td className='px-4 py-3.5 text-right'>
                                    <div className='flex items-center justify-end gap-2'>
                                        <Bar pct={totals.activePct} color='#6366f1' />
                                        <span className='text-sm font-semibold text-indigo-600 w-10 text-right'>{totals.activePct}%</span>
                                    </div>
                                </td>
                                <td className='px-4 py-3.5 text-right text-sm text-indigo-700 font-bold'>{totals.total.toLocaleString()}만원</td>
                                <td className='px-2 py-3.5' />
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
