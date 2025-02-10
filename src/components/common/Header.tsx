import React, { SetStateAction, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useDialogStore from '../../stores/dialogStore';
import useUserStore from '../../stores/userStore.ts';
import useModalStore from '../../stores/modalStore.ts';
import Modal from '../modal/Modal.tsx';
import styles from './Header.module.scss';
import Join from '../Auth/Join.tsx';
import Login from '../Auth/Login.tsx';

const Header = () => {
    const { userId, logout } = useUserStore();
    const openDialog = useDialogStore(state => state.openDialog);
    const navigate = useNavigate()
    const openModal = useModalStore(state => state.openModal);
    const [loginState, setLoginState] = useState('');

    const handleLogout = () => {
        logout();
        navigate("/");
        setLoginState('')
        openDialog("로그아웃🥲");
    }

    const handleHeader = (state: SetStateAction<string>) => {
        setLoginState(state);
        openModal();
    }

    return (
        <>
            <header id={styles.header} role='banner'>
                <div className={styles.left}>
                    <h1 className={styles.logo}>
                        <Link to="/">
                            <span>
                                WY
                            </span>

                            <span className={styles.lime}>
                                components
                            </span>
                        </Link>
                    </h1>
                </div>
                <div className={styles.right}>
                    {userId ? (
                        <ul>
                            <li>
                                <span className='cursor-pointer'>
                                    <Link to="/user-info">
                                        <span className='underline underline-offset-2 text-yellow-200'>{userId}</span>님 환영합니다
                                    </Link>
                                </span>
                            </li>
                            <li>
                                <span className='cursor-pointer' onClick={handleLogout}>
                                    로그아웃
                                </span>
                            </li>
                        </ul>
                    ) : (
                        <ul>
                            <li className='cursor-pointer' onClick={() => handleHeader("login")}>
                                로그인
                            </li>
                            <li className='cursor-pointer' onClick={() => handleHeader("join")}>
                                회원가입
                            </li>
                        </ul>
                    )}
                </div>
            </header >
            {!userId &&
                <Modal>
                    {loginState === "login" ?
                        (
                            <Login handleHeader={handleHeader} />
                        ) : (
                            <Join handleHeader={handleHeader} />
                        )
                    }
                </Modal>
            }
        </>
    )
}

export default Header