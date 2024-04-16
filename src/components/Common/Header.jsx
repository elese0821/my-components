import { Link } from 'react-router-dom'
import styles from './Header.module.scss';


const Header = () => {
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
                {/* <nav className={styles.nav}>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/board">Board</Link>
                        </li>
                        <li>
                            <Link to="/calendar">Calendar</Link>
                        </li>
                        <li>
                            <Link to="/table">Table</Link>
                        </li>
                        <li>
                            <Link to="/chart">Chart</Link>
                        </li>
                        <li>
                            <Link to="/icon">Icon</Link>
                        </li>
                        <li>
                            <Link to="/alert">Alert</Link>
                        </li>
                    </ul>
                </nav> */}
            </div>
            <div className={styles.right}>
                <ul>
                    <li>
                        <Link to="/login">로그인</Link>
                    </li>
                    <li>
                        <Link to="/register">회원가입</Link>
                    </li>
                </ul>
            </div>
        </header >
    )
}

export default Header