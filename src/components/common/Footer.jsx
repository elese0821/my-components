import React from 'react'
import { Link } from 'react-router-dom'

const LINKS = [
    { label: 'Board',    path: '/board/basic' },
    { label: 'Calendar', path: '/calendar'    },
    { label: 'Table',    path: '/table'       },
    { label: 'Chart',    path: '/chart'       },
    { label: 'Etc',      path: '/etc/forms'   },
    { label: 'Chat',     path: '/chat'        },
    { label: 'Map',      path: '/map'         },
    { label: 'Survey',   path: '/survey'      },
]

const Footer = () => (
    /* z-20: Main 의 흰 카드(z-10)가 위를 덮는 것을 방지 */
    <footer
        role='contentinfo'
        style={{ background: '#1e293b', position: 'relative', zIndex: 20 }}
    >
        <div className='max-w-6xl mx-auto px-6 py-8 flex flex-col gap-6'>

            {/* 상단 — 로고 + 링크 */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                {/* 로고 */}
                <Link to='/' className='flex items-end gap-1 select-none group'>
                    <span className='font-bold text-white text-xl leading-none tracking-tight'>WY</span>
                    <span className='text-purple-400 text-xs leading-none mb-0.5 group-hover:text-purple-300 transition-colors'>
                        components
                    </span>
                </Link>

                {/* 내비 링크 */}
                <nav className='flex flex-wrap gap-x-5 gap-y-1.5'>
                    {LINKS.map(({ label, path }) => (
                        <Link
                            key={path}
                            to={path}
                            style={{ color: '#94a3b8' }}
                            className='text-xs hover:text-white transition-colors'
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* 구분선 */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />

            {/* 하단 — 스택 + 카피라이트 */}
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                <div className='flex flex-wrap gap-1.5'>
                    {['React 18', 'TypeScript', 'Node.js', 'Socket.IO', 'TiDB'].map(t => (
                        <span
                            key={t}
                            className='text-[10px] px-2 py-0.5 rounded'
                            style={{ background: 'rgba(255,255,255,0.06)', color: '#64748b' }}
                        >
                            {t}
                        </span>
                    ))}
                </div>
                <p className='text-[11px]' style={{ color: '#475569' }}>
                    © {new Date().getFullYear()} WY Components
                </p>
            </div>
        </div>
    </footer>
)

export default Footer
