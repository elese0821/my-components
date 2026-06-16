import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useDialogStore from '../../stores/dialogStore'
import useUserStore from '../../stores/userStore'
import useModalStore from '../../stores/modalStore'
import Modal from '../modal/Modal'
import Join from '../auth/Join'
import Login from '../auth/Login'
import config from '../../utils/config/system_config.json'
import { hiResAvatar } from '../../utils/avatar'

// ─────────────────────────────────────────────
// config.menu 타입 확장 (submenu 포함)
// ─────────────────────────────────────────────
type MenuItem = {
    title: string
    path: string
    submenu?: { cateId: string; name: string }[]
}
const menu = config.menu as MenuItem[]

const Header = () => {
    const { userId, logout, profileImage, nickname } = useUserStore()
    const openDialog = useDialogStore(state => state.openDialog)
    const navigate = useNavigate()
    const location = useLocation()
    const { isOpen: isModalOpen, openModal } = useModalStore()
    const [loginState, setLoginState] = useState('')
    const [scrolled, setScrolled] = useState(false)
    const [clickedIdx, setClickedIdx] = useState<number | null>(null)

    useEffect(() => { if (!isModalOpen) setLoginState('') }, [isModalOpen])

    // html{overflow-y:auto} 덕분에 window.scrollY 정상 동작
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // 라우트 변경 시 클릭 수동 submenu 초기화
    useEffect(() => { setClickedIdx(null) }, [location.pathname])

    // URL 기반 활성 메뉴 인덱스
    const activeIdx = useMemo(() =>
        menu.findIndex(item => item.path !== '/' && location.pathname.startsWith(item.path))
    , [location.pathname])

    // 보여줄 submenu: URL 우선, 그 다음 클릭한 것
    const submenuIdx = useMemo(() => {
        if (activeIdx >= 0 && menu[activeIdx].submenu) return activeIdx
        if (clickedIdx !== null && menu[clickedIdx]?.submenu) return clickedIdx
        return null
    }, [activeIdx, clickedIdx])

    const handleLogout = () => {
        logout()
        navigate('/')
        setLoginState('')
        openDialog('로그아웃 되었습니다.')
    }

    const handleAuthClick = (state: string) => {
        setLoginState(state)
        openModal()
    }

    const handleMenuClick = (path: string, i: number, hasSubmenu: boolean) => {
        navigate(path)
        // submenu 없는 메뉴 클릭 시 clickedIdx 반드시 초기화
        // → 이전에 ETC 서브메뉴가 열려 있어도 사라짐
        setClickedIdx(hasSubmenu ? (prev => prev === i ? null : i) : null)
    }

    return (
        <>
            <header
                className='fixed top-0 left-0 w-full z-50'
                style={scrolled
                    ? { background: 'rgba(30,41,59,0.92)', boxShadow: '0 2px 16px rgba(0,0,0,0.3)' }
                    : { background: 'rgba(30,41,59,0.45)' }
                }
            >
                {/* ── Row 1 : 로고 + 유저 ── */}
                <div className='flex items-center justify-between px-3 sm:px-6 h-12 sm:h-14'>
                    {/* 로고 */}
                    <Link to='/' className='flex items-end gap-1 group select-none shrink-0'>
                        <span className='font-bold text-white text-xl sm:text-[1.55rem] leading-none tracking-tight'>
                            WY
                        </span>
                        <span className='text-purple-300 text-[0.7rem] sm:text-[0.78rem] leading-none mb-[3px] group-hover:text-purple-200 transition-colors'>
                            components
                        </span>
                    </Link>

                    {/* 유저 영역 */}
                    <div className='flex items-center gap-2 sm:gap-3 text-sm shrink-0'>
                        {userId ? (
                            <>
                                <Link
                                    to='/user-info'
                                    className='flex items-center gap-1.5 hover:opacity-90 transition-opacity'
                                >
                                    {profileImage ? (
                                        <img src={hiResAvatar(profileImage, 96) ?? undefined} alt={nickname || userId}
                                            className='w-6 h-6 rounded-full object-cover border border-white/20 shrink-0'/>
                                    ) : (
                                        <div className='w-6 h-6 rounded-full bg-purple-500/70 flex items-center justify-center text-[10px] font-bold text-white shrink-0'>
                                            {(nickname || userId || '?').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className='text-yellow-300 font-medium text-xs hidden sm:inline'>
                                        {nickname || userId}
                                    </span>
                                </Link>
                                <div className='w-px h-3 bg-white/20' />
                                <button
                                    onClick={handleLogout}
                                    className='text-white/60 text-xs hover:text-white transition-colors'
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleAuthClick('login')}
                                    className='text-white/70 text-xs hover:text-white transition-colors'
                                >
                                    로그인
                                </button>
                                <div className='w-px h-3 bg-white/20' />
                                <button
                                    onClick={() => handleAuthClick('join')}
                                    className='text-white/70 text-xs hover:text-white transition-colors'
                                >
                                    회원가입
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* ── Row 2 : 메인 내비게이션 ── */}
                {/* 스크롤 래퍼: overflow-x-auto 는 여기, justify-center 는 안쪽 nav 에 */}
                <div
                    className='border-t border-white/10 overflow-x-auto'
                    style={{ scrollbarWidth: 'none' }}
                >
                    {/* w-max mx-auto: 컨텐츠가 화면보다 좁으면 가운데 정렬,
                        넘치면 mx-auto 가 0 으로 수축 → 왼쪽부터 시작 → 오른쪽 스크롤 가능 */}
                    <nav className='flex w-max mx-auto'>
                        {menu.map(({ title, path, submenu }, i) => {
                            const isActive = path !== '/' && location.pathname.startsWith(path)
                            return (
                                <button
                                    key={path}
                                    onClick={() => handleMenuClick(path, i, !!submenu)}
                                    className={`relative shrink-0 px-2.5 sm:px-4 md:px-5 py-[9px] text-[0.72rem] sm:text-sm leading-none font-[Quicksand] font-medium transition-colors duration-200 whitespace-nowrap ${
                                        isActive ? 'text-white' : 'text-white/55 hover:text-white/90'
                                    }`}
                                >
                                    {title}
                                    {isActive && (
                                        <motion.span
                                            layoutId='header-active-bar'
                                            className='absolute bottom-0 inset-x-1 sm:inset-x-2 h-[2px] rounded-t-full bg-purple-400'
                                        />
                                    )}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                {/* ── Row 3 : 서브메뉴 (조건부) ── */}
                <AnimatePresence>
                    {submenuIdx !== null && (
                        <motion.div
                            key={`sub-${submenuIdx}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className='overflow-hidden border-t border-white/10'
                        >
                            <div
                                className='overflow-x-auto py-1.5'
                                style={{ scrollbarWidth: 'none' }}
                            >
                            <div className='flex w-max mx-auto gap-1 px-2'>
                                {menu[submenuIdx].submenu!.map(({ cateId, name }) => {
                                    const full = `${menu[submenuIdx].path}/${cateId}`
                                    const isSubActive = location.pathname.startsWith(full)
                                    return (
                                        <button
                                            key={cateId}
                                            onClick={() => navigate(full)}
                                            className={`shrink-0 px-2 sm:px-3 py-[5px] text-xs rounded-full transition-all duration-150 whitespace-nowrap ${
                                                isSubActive
                                                    ? 'bg-purple-500/40 text-white font-semibold'
                                                    : 'text-white/45 hover:text-white/90 hover:bg-white/10'
                                            }`}
                                        >
                                            {name}
                                        </button>
                                    )
                                })}
                            </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* 로그인/회원가입 모달 */}
            {!userId && loginState && (
                <Modal>
                    {loginState === 'login'
                        ? <Login handleHeader={handleAuthClick} />
                        : <Join handleHeader={handleAuthClick} />
                    }
                </Modal>
            )}
        </>
    )
}

export default Header
