import { Route, Routes, useLocation, useNavigate } from "react-router-dom"


// components import 
import Footer from "./components/Common/Footer"
import Header from "./components/Common/Header"
import Home from "./pages/Home"
import Main from "./components/Common/Main"
import Login from "./components/Auth/Login"
import Register from "./components/Auth/Register"
import Board from "./components/Board/Board"
import Calendar from "./components/Calendar/Calendar"
import Table from "./components/Table/Table"
import Etc from "./components/etc/Etc"
import Chart from "./components/Chart/Chart"
import { useEffect } from "react"


import styles from "./App.module.scss";
import BoardNormal from "./components/Board/BoardCate/BoardNormal/BoardNormal"
import BoardSubtle from "./components/Board/BoardCate/BoardSubtle/BoardSubtle"
import BoardQnA from "./components/Board/BoardCate/BoardQnA/BoardQnA"
import BoardBlog from "./components/Board/BoardCate/BoardBlog/BoardBlog"
import BoardCard from "./components/Board/BoardCate/BoardCard/BoardCard"
import BoardGallery from "./components/Board/BoardCate/Gallery/BoardGallery"
import BoardWrite from "./components/Board/BoardPost/BoardWrite"
import GalleryGrid from "./components/Board/BoardCate/Gallery/GalleryCate/GalleryGrid"
import GalleryGrid2 from "./components/Board/BoardCate/Gallery/GalleryCate/GalleryGrid2"
import GallerySlide from "./components/Board/BoardCate/Gallery/GalleryCate/GallerySlide"
import GallerySlide2 from "./components/Board/BoardCate/Gallery/GalleryCate/GallerySlide2"

function App() {
    // 뒤로가기 버튼
    const location = useLocation();
    const paths = ['/'];
    const isMatchAny = paths.some(path => location.pathname === path);
    const navigate = useNavigate()

    useEffect(() => {
    }, [location, isMatchAny])

    return (
        <>
            <Header />
            <Main>
                {/* 뒤로가기 버튼 */}
                {!isMatchAny &&
                    <div className={styles.btn_wrap}>
                        <div className="btn black small rounded mb-6" onClick={() => navigate(-1)}>뒤로가기</div>
                        <div className="btn black small rounded mb-6" onClick={() => navigate('/')}>Home</div>
                    </div>
                }
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* Auth */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/board/*" element={<Board />}>
                        {/* 게시판 종류 */}
                        <Route path='normal' element={<BoardNormal />} />
                        <Route path='subtle' element={<BoardSubtle />} />
                        <Route path='qna' element={<BoardQnA />} />
                        <Route path='blog' element={<BoardBlog />} />
                        <Route path='card' element={<BoardCard />} />
                        <Route path='gallery/*' element={<BoardGallery />}>
                            <Route path="grid" element={<GalleryGrid />} />
                            <Route path="grid2" element={<GalleryGrid2 />} />
                            <Route path="slide" element={<GallerySlide />} />
                            <Route path="slide2" element={<GallerySlide2 />} />
                        </Route>

                        {/* 글쓰기페이지 */}
                        <Route path='write' element={<BoardWrite />} />
                    </Route>
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/table/*" element={<Table />} />
                    <Route path="/chart" element={<Chart />} />

                    <Route path="/etc/*" element={<Etc />} />
                </Routes>


            </Main>
            <Footer />
        </>
    )
}

export default App
