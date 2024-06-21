import { Link, useNavigate } from 'react-router-dom'
import styles from './Header.module.scss';
import useDialogStore from '../../stores/dialogStore';
import useUserStore from '../../stores/userStore';

const Header = () => {
    const { userId, logout } = useUserStore();
    const openDialog = useDialogStore(state => state.openDialog);
    const navigate = useNavigate()

    const handleLogout = () => {
        logout();
        navigate("/");
        openDialog("로그아웃🥲");
    }

    return (
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
                                <font className='underline underline-offset-2 text-yellow-200'>{userId}</font>님 환영합니다
                            </span>
                        </li>
                        <li>
                            <span className='cursor-pointer' onClick={handleLogout}>
                                로그아웃
                            </span>
                        </li>
                    </ul>
                ) : (<ul>
                    <li>
                        <Link to="/login">로그인</Link>
                    </li>
                    <li>
                        <Link to="/register">회원가입</Link>
                    </li>
                </ul>
                )}
            </div>
        </header >
    )
}

export default Header