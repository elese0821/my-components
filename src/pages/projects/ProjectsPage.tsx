import React from 'react';
import { motion } from 'framer-motion';
import { ArrowTopRightOnSquareIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

/**
 * Projects — 내가 개발한 프로젝트 쇼케이스
 *
 * ▶ 아래 PROJECTS 배열만 수정하면 카드가 자동 생성됩니다.
 *   - url:  배포된 사이트 주소 ('' 이면 "준비 중" 으로 비활성 표시)
 *   - tags: 기술 스택 태그
 *   - gradient: 카드 상단 배너 색상 (CSS gradient)
 */

interface Project {
    title:    string;
    subtitle: string;
    desc:     string;
    url:      string;
    tags:     string[];
    gradient: string;
    initial:  string;   // 배너에 표시할 이니셜/이모지
}

const PROJECTS: Project[] = [
    {
        title:    'WY Components',
        subtitle: 'React + Node.js 풀스택 프로젝트',
        desc:     '게시판 6종 · 캘린더 · 테이블 · 차트 · 지도 · 실시간 채팅 · 설문까지 웹 서비스 핵심 기능을 직접 구현. (지금 보고 있는 사이트)',
        url:      '',
        tags:     ['React 18', 'TypeScript', 'Vite', 'Node.js'],
        gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
        initial:  'WY',
    },
    {
        title:    'Admin Dashboard',
        subtitle: '관리자 대시보드',
        desc:     'KPI 카드 · 차트 · 사용자/주문 관리 테이블을 갖춘 관리자 백오피스. 인증과 권한 관리 포함.',
        url:      '',
        tags:     ['React', 'Chart', 'Express'],
        gradient: 'linear-gradient(135deg,#0ea5e9,#22d3ee)',
        initial:  'AD',
    },
    {
        title:    'Portfolio',
        subtitle: '개인 포트폴리오',
        desc:     '나를 소개하는 반응형 포트폴리오 사이트. 프로젝트·기술스택·연락처 섹션으로 구성.',
        url:      '',
        tags:     ['React', 'Framer Motion', 'Tailwind'],
        gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
        initial:  'PF',
    },
    {
        title:    'my-components (Next.js)',
        subtitle: 'Next.js 리빌드',
        desc:     'WY Components 를 Next.js(App Router) 기반으로 재구축한 SSR 버전.',
        url:      '',
        tags:     ['Next.js', 'TypeScript', 'SSR'],
        gradient: 'linear-gradient(135deg,#111827,#374151)',
        initial:  'NX',
    },
];

// ── 카드 ──────────────────────────────────────────────────────
function ProjectCard({ p, index }: { p: Project; index: number }) {
    const live = !!p.url;
    const Wrapper: any = live ? 'a' : 'div';
    const wrapperProps = live
        ? { href: p.url, target: '_blank', rel: 'noopener noreferrer' }
        : {};

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.06 }}
        >
            <Wrapper
                {...wrapperProps}
                className={`group block rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all duration-200 ${
                    live ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : 'opacity-90'
                }`}
            >
                {/* 배너 */}
                <div className='relative h-28 flex items-center justify-center' style={{ background: p.gradient }}>
                    <span className='text-3xl font-extrabold text-white/90 tracking-tight'>{p.initial}</span>
                    {live ? (
                        <span className='absolute top-3 right-3 flex items-center gap-1 text-[10px] font-semibold text-white/90 bg-white/20 backdrop-blur px-2 py-0.5 rounded-full'>
                            <span className='w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse' /> LIVE
                        </span>
                    ) : (
                        <span className='absolute top-3 right-3 text-[10px] font-semibold text-white/80 bg-black/20 px-2 py-0.5 rounded-full'>
                            준비 중
                        </span>
                    )}
                </div>

                {/* 본문 */}
                <div className='p-4 flex flex-col gap-2.5'>
                    <div>
                        <h3 className='text-sm font-bold text-gray-900 flex items-center gap-1.5'>
                            {p.title}
                            {live && (
                                <ArrowTopRightOnSquareIcon className='h-3.5 w-3.5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all' />
                            )}
                        </h3>
                        <p className='text-xs text-indigo-500 font-medium mt-0.5'>{p.subtitle}</p>
                    </div>

                    <p className='text-xs text-gray-500 leading-relaxed min-h-[48px]'>{p.desc}</p>

                    {/* 태그 */}
                    <div className='flex flex-wrap gap-1.5'>
                        {p.tags.map(t => (
                            <span key={t} className='text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600'>
                                {t}
                            </span>
                        ))}
                    </div>

                    {/* 하단 액션 */}
                    <div className='pt-1'>
                        {live ? (
                            <span className='inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:gap-2 transition-all'>
                                <GlobeAltIcon className='h-3.5 w-3.5' />
                                사이트 방문
                            </span>
                        ) : (
                            <span className='inline-flex items-center gap-1 text-xs text-gray-300'>
                                배포 예정
                            </span>
                        )}
                    </div>
                </div>
            </Wrapper>
        </motion.div>
    );
}

// ── 페이지 ────────────────────────────────────────────────────
export default function ProjectsPage() {
    return (
        <div className='section_wrap flex flex-col gap-7'>
            {/* 헤더 */}
            <div className='flex flex-col gap-2 pt-2'>
                <div className='flex items-center gap-2.5'>
                    <span className='shrink-0 rounded-full inline-block' style={{
                        width: 4, height: 24, background: 'linear-gradient(180deg,#6366f1,#8b5cf6)',
                    }} />
                    <h1 className='text-2xl font-bold text-gray-900 leading-tight'>Projects</h1>
                </div>
                <p className='text-sm text-gray-500 max-w-2xl leading-relaxed'>
                    제가 직접 기획하고 개발한 프로젝트들입니다. 카드를 클릭하면 배포된 사이트로 이동합니다.
                </p>
            </div>

            {/* 카드 그리드 */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                {PROJECTS.map((p, i) => (
                    <ProjectCard key={p.title} p={p} index={i} />
                ))}
            </div>

            {/* 안내 */}
            <p className='text-xs text-gray-400 text-center mt-2'>
                더 많은 프로젝트는 계속 업데이트됩니다.
            </p>
        </div>
    );
}
