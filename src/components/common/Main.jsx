import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ── 타이핑 문구 ────────────────────────────────────────────
const PHRASES = [
    '풀스택 개발 포트폴리오',
    '실시간 채팅 · 지도 · 파일 업로드',
    '8가지 게시판 레이아웃',
    'JWT 인증 · Socket.IO · REST API',
];

// ── 타이핑 컴포넌트 ────────────────────────────────────────
function Typewriter() {
    const [idx, setIdx]             = useState(0);
    const [displayed, setDisplayed] = useState('');
    const [deleting, setDeleting]   = useState(false);

    useEffect(() => {
        const phrase = PHRASES[idx];
        if (!deleting && displayed.length < phrase.length) {
            const t = setTimeout(() => setDisplayed(phrase.slice(0, displayed.length + 1)), 60);
            return () => clearTimeout(t);
        }
        if (!deleting && displayed.length === phrase.length) {
            const t = setTimeout(() => setDeleting(true), 2000);
            return () => clearTimeout(t);
        }
        if (deleting && displayed.length > 0) {
            const t = setTimeout(() => setDisplayed(prev => prev.slice(0, -1)), 28);
            return () => clearTimeout(t);
        }
        if (deleting && displayed.length === 0) {
            setDeleting(false);
            setIdx(prev => (prev + 1) % PHRASES.length);
        }
    }, [displayed, deleting, idx]);

    return (
        <span className='hero-typewriter'>
            {displayed}
            <span className='hero-cursor'>|</span>
        </span>
    );
}

// ── 파티클 ──────────────────────────────────────────────────
const PARTICLES = [
    { id: 0, x: '8%',  y: '20%', size: 3, dur: 6,   del: 0   },
    { id: 1, x: '18%', y: '60%', size: 2, dur: 8,   del: 1.2 },
    { id: 2, x: '30%', y: '35%', size: 4, dur: 7,   del: 0.5 },
    { id: 3, x: '45%', y: '75%', size: 2, dur: 9,   del: 2   },
    { id: 4, x: '58%', y: '25%', size: 3, dur: 6.5, del: 0.8 },
    { id: 5, x: '70%', y: '55%', size: 2, dur: 8,   del: 1.5 },
    { id: 6, x: '80%', y: '40%', size: 4, dur: 7,   del: 0.3 },
    { id: 7, x: '90%', y: '70%', size: 2, dur: 9,   del: 2.5 },
    { id: 8, x: '25%', y: '80%', size: 3, dur: 7,   del: 1   },
    { id: 9, x: '65%', y: '15%', size: 2, dur: 8.5, del: 1.8 },
];

// ── 메인 컴포넌트 ──────────────────────────────────────────
const Main = ({ children }) => {
    const sectionRef = useRef(null);
    const { scrollY } = useScroll();

    // 타이틀: 스크롤하면 빠르게 위로 빠져나감
    const contentY       = useTransform(scrollY, [0, 200], [0, -70]);
    const contentOpacity = useTransform(scrollY, [0, 160], [1, 0]);
    const contentScale   = useTransform(scrollY, [0, 200], [1, 0.88]);

    // 딤 오버레이 (blur 없음)
    const dimOpacity = useTransform(scrollY, [0, 200], [0, 0.45]);

    // 패럴랙스: background-position Y 를 rAF 단위로 직접 조작
    // → div 크기 변화 없음 → cover 기준 불변 → 이미지 비율·크기 완벽 유지
    // → background-attachment:fixed 와 달리 RAF 단위 paint → 렉 없음
    useEffect(() => {
        const unsub = scrollY.on('change', v => {
            if (!sectionRef.current) return;
            // 배경이 콘텐츠보다 40% 느리게 이동 (0.6× 속도)
            const offset = v * 0.4;
            sectionRef.current.style.backgroundPositionY = `calc(50% + ${offset}px)`;
        });
        return unsub;
    }, [scrollY]);

    return (
        <main id='main' role='main'>
            <section ref={sectionRef} className='section__header'>

                {/* ── 그라디언트 오버레이 ── */}
                <div className='hero-overlay' aria-hidden='true' />

                {/* ── 스크롤 딤 오버레이 (blur 제거) ── */}
                <motion.div
                    className='hero-overlay--dim'
                    style={{ opacity: dimOpacity }}
                    aria-hidden='true'
                />

                {/* ── 파티클 ── */}
                <div className='hero-particles' aria-hidden='true'>
                    {PARTICLES.map(p => (
                        <span
                            key={p.id}
                            className='hero-particle'
                            style={{
                                left: p.x, top: p.y,
                                width: p.size, height: p.size,
                                animationDuration: `${p.dur}s`,
                                animationDelay: `${p.del}s`,
                            }}
                        />
                    ))}
                </div>

                {/* ── 타이틀 + 서브타이틀: 스크롤 시 위로 빠짐 ── */}
                <motion.div
                    style={{
                        y: contentY,
                        opacity: contentOpacity,
                        scale: contentScale,
                        position: 'relative',
                        zIndex: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1.4rem',
                    }}
                >
                    {/* WY COMPONENTS */}
                    <div className='title'>
                        <motion.h3
                            initial={{ opacity: 0, y: 30, letterSpacing: '0.35em' }}
                            animate={{ opacity: 1, y: 0,  letterSpacing: '0.05em' }}
                            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                        >
                            WY
                        </motion.h3>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0  }}
                            transition={{ duration: 1.0, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        >
                            COMPONENTS
                        </motion.p>
                    </div>

                    {/* 타이핑 서브타이틀 */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        <Typewriter />
                    </motion.div>
                </motion.div>

                {/* ── 스크롤 인디케이터 ── */}
                <motion.div
                    className='hero-scroll'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    aria-hidden='true'
                >
                    <span className='hero-scroll__line' />
                    <span className='hero-scroll__chevrons'>
                        <svg className='hero-scroll__chev hero-scroll__chev--1' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                            <polyline points='6 9 12 15 18 9' />
                        </svg>
                        <svg className='hero-scroll__chev hero-scroll__chev--2' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                            <polyline points='6 9 12 15 18 9' />
                        </svg>
                    </span>
                </motion.div>

            </section>

            {/* ── 콘텐츠 카드: 둥근 상단 모서리로 hero 위를 덮으며 올라옴 ── */}
            <div
                className='relative z-10'
                style={{
                    background: '#ffffff',
                    borderRadius: '28px 28px 0 0',
                    marginTop: '-28px',
                    boxShadow: '0 -6px 48px rgba(0,0,0,0.13)',
                    minHeight: '60vh',
                }}
            >
                {children}
            </div>
        </main>
    );
};

export default Main;
