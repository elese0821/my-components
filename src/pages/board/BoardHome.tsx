import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    QueueListIcon,
    Squares2X2Icon,
    ChatBubbleBottomCenterTextIcon,
    NewspaperIcon,
    PhotoIcon,
    ViewColumnsIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/outline';

// ── 게시판 카테고리 정의 ─────────────────────────────────────
interface BoardCategory {
    cateId: string;
    name: string;
    desc: string;
    color: string;
    lightBg: string;
    Icon: React.ElementType;
    badge?: string;
}

const CATEGORIES: BoardCategory[] = [
    {
        cateId:  'basic',
        name:    '게시판',
        desc:    '제목·내용·작성자 중심의 기본 리스트 게시판. 페이지네이션과 검색, 상세 보기 / 수정 / 삭제를 지원합니다.',
        color:   '#6366f1',
        lightBg: '#eef2ff',
        Icon:    QueueListIcon,
        badge:   '기본',
    },
    {
        cateId:  'card',
        name:    '카드형',
        desc:    '콘텐츠를 카드 레이아웃으로 표현합니다. 썸네일·요약문이 있는 게시물을 시각적으로 보여주기에 적합합니다.',
        color:   '#3b82f6',
        lightBg: '#eff6ff',
        Icon:    Squares2X2Icon,
    },
    {
        cateId:  'faq',
        name:    'FAQ',
        desc:    '자주 묻는 질문 형식의 아코디언 게시판. 질문 클릭 시 답변이 펼쳐지며 카테고리별 그룹핑을 지원합니다.',
        color:   '#10b981',
        lightBg: '#ecfdf5',
        Icon:    ChatBubbleBottomCenterTextIcon,
    },
    {
        cateId:  'blog',
        name:    '블로그',
        desc:    '본문 미리보기와 태그, 커버 이미지가 있는 블로그 스타일 게시판. 에디터로 작성한 긴 글을 담기에 좋습니다.',
        color:   '#f59e0b',
        lightBg: '#fffbeb',
        Icon:    NewspaperIcon,
    },
    {
        cateId:  'gallery',
        name:    '갤러리',
        desc:    '이미지 중심의 포토 갤러리 게시판. 그리드 뷰로 사진을 탐색하고 확대 보기를 지원합니다.',
        color:   '#ec4899',
        lightBg: '#fdf2f8',
        Icon:    PhotoIcon,
    },
    {
        cateId:  'grid',
        name:    '그리드',
        desc:    '넓은 그리드 레이아웃으로 많은 게시물을 한 화면에 표시합니다. 간결한 데이터 탐색에 최적화되어 있습니다.',
        color:   '#8b5cf6',
        lightBg: '#f5f3ff',
        Icon:    ViewColumnsIcon,
    },
];

// ── 카드 컴포넌트 ────────────────────────────────────────────
function CategoryCard({ cat, index }: { cat: BoardCategory; index: number }) {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.3, ease: 'easeOut' }}
            onClick={() => navigate(`/board/${cat.cateId}`)}
            className='group relative flex flex-col p-6 bg-white rounded-2xl border border-gray-100 shadow-sm
                       cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-xl overflow-hidden'
            style={{
                ['--hover-border' as string]: cat.color + '44',
            }}
        >
            {/* hover 테두리 오버레이 */}
            <div
                className='absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'
                style={{ border: `2px solid ${cat.color}33` }}
            />

            {/* 좌상단 컬러 악센트 */}
            <div
                className='absolute top-0 left-0 w-1 h-12 rounded-bl-none rounded-br-none rounded-tl-2xl rounded-tr-none'
                style={{ background: cat.color }}
            />

            {/* 아이콘 */}
            <div
                className='w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shrink-0 transition-transform duration-200 group-hover:scale-110'
                style={{ background: cat.lightBg }}
            >
                <cat.Icon className='h-6 w-6' style={{ color: cat.color }} />
            </div>

            {/* 뱃지 */}
            {cat.badge && (
                <span
                    className='absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full'
                    style={{ background: cat.lightBg, color: cat.color }}
                >
                    {cat.badge}
                </span>
            )}

            {/* 이름 */}
            <h3 className='text-base font-bold text-gray-800 mb-1.5 leading-tight'>
                {cat.name}
            </h3>

            {/* 설명 */}
            <p className='text-sm text-gray-400 leading-relaxed flex-1'>
                {cat.desc}
            </p>

            {/* 바로가기 */}
            <div
                className='flex items-center gap-1 mt-4 text-sm font-semibold transition-all duration-200 group-hover:gap-2'
                style={{ color: cat.color }}
            >
                바로가기
                <ArrowRightIcon className='h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            </div>
        </motion.div>
    );
}

// ── 메인 ────────────────────────────────────────────────────
export default function BoardHome() {
    return (
        <section className='section_wrap'>
            <div className='flex flex-col gap-8'>

                {/* 헤더 */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className='flex items-center gap-2.5 mb-2'>
                        <span
                            className='inline-block rounded-full shrink-0'
                            style={{ width: 4, height: 24, background: 'linear-gradient(180deg,#6366f1,#3b82f6)' }}
                        />
                        <h1 className='text-2xl font-bold text-gray-900'>게시판</h1>
                    </div>
                    <p className='text-sm text-gray-400 ml-[18px]'>
                        아래 게시판 유형 중 하나를 선택하세요. 각 유형은 다른 레이아웃과 기능을 제공합니다.
                    </p>
                </motion.div>

                {/* 카테고리 그리드 */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {CATEGORIES.map((cat, i) => (
                        <CategoryCard key={cat.cateId} cat={cat} index={i} />
                    ))}
                </div>

                {/* 하단 안내 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className='flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-400'
                >
                    <span className='w-1 h-1 rounded-full bg-gray-300 shrink-0' />
                    게시판을 클릭하면 해당 유형의 게시판으로 이동합니다. 글쓰기 및 수정은 로그인 후 이용할 수 있습니다.
                </motion.div>
            </div>
        </section>
    );
}
