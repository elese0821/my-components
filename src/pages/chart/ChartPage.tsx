import React, { useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

// ── 데이터 ──────────────────────────────────────────────
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

const salesData    = [3200, 4100, 3800, 5200, 4700, 6100, 5800, 7200, 6500, 8100, 7400, 9200];
const visitorsData = [1200, 1800, 1500, 2200, 1900, 2800, 2600, 3100, 2900, 3500, 3200, 4100];
const returnsData  = [120,  180,  160,  210,  190,  250,  230,  280,  260,  310,  290,  340];

const weekData = {
    labels: ['월', '화', '수', '목', '금', '토', '일'],
    orders: [42, 58, 51, 67, 89, 112, 94],
    revenue: [520, 710, 630, 840, 1100, 1380, 1150],
};

const categoryPie = [
    { id: 0, value: 35, label: '전자제품', color: '#6366f1' },
    { id: 1, value: 25, label: '의류',     color: '#8b5cf6' },
    { id: 2, value: 20, label: '식품',     color: '#06b6d4' },
    { id: 3, value: 12, label: '도서',     color: '#10b981' },
    { id: 4, value: 8,  label: '기타',     color: '#f59e0b' },
];

const KPI_LIST = [
    { label: '총 매출',     value: '₩68,500만', change: '+12.4%', up: true,  sparkData: [32, 41, 38, 52, 47, 61, 58, 72, 65, 81, 74, 92] },
    { label: '총 주문',     value: '28,491건',   change: '+8.1%',  up: true,  sparkData: [12, 18, 15, 22, 19, 28, 26, 31, 29, 35, 32, 41] },
    { label: '신규 회원',   value: '4,218명',    change: '-2.3%',  up: false, sparkData: [45, 38, 42, 35, 40, 33, 38, 30, 36, 28, 34, 26] },
    { label: '전환율',      value: '3.84%',      change: '+0.6%p', up: true,  sparkData: [28, 31, 29, 35, 32, 38, 36, 41, 39, 44, 42, 48] },
];

// ── 컴포넌트 ──────────────────────────────────────────────
const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>{children}</div>
);

const CardHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div className='px-5 pt-5 pb-3'>
        <h3 className='text-sm font-semibold text-gray-800'>{title}</h3>
        {subtitle && <p className='text-xs text-gray-400 mt-0.5'>{subtitle}</p>}
    </div>
);

export default function ChartPage() {
    const [lineRange, setLineRange] = useState<'6m' | '12m'>('12m');
    const [barMode, setBarMode] = useState<'orders' | 'revenue'>('orders');

    const lineMonths = lineRange === '6m' ? MONTHS.slice(6) : MONTHS;
    const lineSales   = lineRange === '6m' ? salesData.slice(6)    : salesData;
    const lineVisitors = lineRange === '6m' ? visitorsData.slice(6) : visitorsData;

    return (
        <section className='section_wrap flex flex-col gap-5'>
            <div>
                <h1 className='text-xl font-bold text-gray-800'>통계 대시보드</h1>
                <p className='text-sm text-gray-400 mt-0.5'>2024년 연간 데이터 기준</p>
            </div>

            {/* KPI 카드 */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                {KPI_LIST.map(kpi => (
                    <Card key={kpi.label} className='p-4'>
                        <p className='text-xs text-gray-500 mb-1'>{kpi.label}</p>
                        <p className='text-xl font-bold text-gray-800 leading-tight'>{kpi.value}</p>
                        <div className='flex items-end justify-between mt-2 gap-2'>
                            <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${kpi.up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                {kpi.change}
                            </span>
                            <div className='flex-1 h-8'>
                                <SparkLineChart
                                    data={kpi.sparkData}
                                    height={32}
                                    curve='natural'
                                    color={kpi.up ? '#10b981' : '#ef4444'}
                                    plotType='line'
                                />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* 라인 차트 (매출 + 방문자) */}
            <Card>
                <div className='px-5 pt-5 pb-2 flex items-center justify-between'>
                    <div>
                        <h3 className='text-sm font-semibold text-gray-800'>월별 매출 & 방문자 추이</h3>
                        <p className='text-xs text-gray-400 mt-0.5'>단위: 매출(만원), 방문자(명)</p>
                    </div>
                    <div className='flex gap-1'>
                        {(['6m', '12m'] as const).map(r => (
                            <button
                                key={r}
                                onClick={() => setLineRange(r)}
                                className={`px-3 py-1 text-xs rounded-full transition-colors ${lineRange === r ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                            >
                                {r === '6m' ? '최근 6개월' : '전체 12개월'}
                            </button>
                        ))}
                    </div>
                </div>
                <LineChart
                    xAxis={[{ scaleType: 'point', data: lineMonths }]}
                    series={[
                        { data: lineSales,    label: '매출(만원)', color: '#6366f1', curve: 'natural', showMark: false },
                        { data: lineVisitors, label: '방문자',    color: '#06b6d4', curve: 'natural', showMark: false },
                    ]}
                    height={280}
                    margin={{ left: 60, right: 20, top: 20, bottom: 40 }}
                    slotProps={{ legend: { hidden: false } }}
                />
            </Card>

            {/* 바 차트 + 파이 차트 */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                {/* 바 차트 */}
                <Card className='lg:col-span-2'>
                    <div className='px-5 pt-5 pb-2 flex items-center justify-between'>
                        <div>
                            <h3 className='text-sm font-semibold text-gray-800'>요일별 현황</h3>
                            <p className='text-xs text-gray-400 mt-0.5'>이번 주 기준</p>
                        </div>
                        <div className='flex gap-1'>
                            {([
                                { key: 'orders',  label: '주문수' },
                                { key: 'revenue', label: '매출액' },
                            ] as const).map(opt => (
                                <button
                                    key={opt.key}
                                    onClick={() => setBarMode(opt.key)}
                                    className={`px-3 py-1 text-xs rounded-full transition-colors ${barMode === opt.key ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: weekData.labels }]}
                        series={[{
                            data: barMode === 'orders' ? weekData.orders : weekData.revenue,
                            label: barMode === 'orders' ? '주문수(건)' : '매출(만원)',
                            color: barMode === 'orders' ? '#8b5cf6' : '#f59e0b',
                        }]}
                        height={270}
                        margin={{ left: 55, right: 20, top: 20, bottom: 35 }}
                        borderRadius={6}
                        slotProps={{ legend: { hidden: true } }}
                    />
                </Card>

                {/* 파이 차트 */}
                <Card>
                    <CardHeader title='카테고리별 매출 비율' subtitle='2024년 누적 기준' />
                    <div className='flex flex-col items-center pb-4'>
                        <PieChart
                            series={[{
                                data: categoryPie,
                                innerRadius: 52,
                                outerRadius: 88,
                                paddingAngle: 3,
                                cornerRadius: 4,
                                highlightScope: { faded: 'global', highlighted: 'item' },
                            }]}
                            height={200}
                            margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
                            slotProps={{ legend: { hidden: true } }}
                        />
                        {/* 커스텀 범례 */}
                        <div className='grid grid-cols-1 gap-1.5 w-full px-5 mt-1'>
                            {categoryPie.map(item => (
                                <div key={item.id} className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2'>
                                        <span className='w-2.5 h-2.5 rounded-full flex-shrink-0' style={{ backgroundColor: item.color }} />
                                        <span className='text-xs text-gray-600'>{item.label}</span>
                                    </div>
                                    <span className='text-xs font-semibold text-gray-800'>{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* 복합 차트 (바 + 라인) */}
            <Card>
                <CardHeader title='월별 주문수 & 반품률' subtitle='막대: 주문수(건) · 선: 반품(건)' />
                <BarChart
                    xAxis={[{ scaleType: 'band', data: MONTHS }]}
                    series={[
                        { type: 'bar',  data: [420, 580, 510, 670, 590, 780, 710, 890, 830, 960, 910, 1080], label: '주문수', color: '#6366f1' },
                        { type: 'line', data: returnsData, label: '반품', color: '#ef4444', curve: 'natural' },
                    ]}
                    height={260}
                    margin={{ left: 55, right: 20, top: 20, bottom: 35 }}
                    borderRadius={4}
                    slotProps={{ legend: { hidden: false } }}
                />
            </Card>
        </section>
    );
}
