import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <header id='header' role='banner'>
            <div className='left'>
                <h1 className='logo'>
                    <Link to="/">
                        <span>
                            WY
                        </span>
                        <span className='lime'>
                            components
                        </span>
                    </Link>
                </h1>
                {/* <nav className='nav'>
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
            <div className='right'>
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