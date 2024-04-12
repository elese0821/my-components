import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import BoardSelect from "./BoardCate/BoardSelect";
import BoardNormal from "./BoardCate/BoardNormal";
import BoardSubtle from "./BoardCate/BoardSubtle";
import BoardQnA from "./BoardCate/BoardQnA";
import BoardCate from "./BoardCate/BoardCate";
import BoardBlog from "./BoardCate/BoardBlog";
import BoardGallery from "./BoardCate/BoardGallery";
import BoardWrite from "./BoardPost/BoardWrite";
import { useEffect, useState } from "react";
import BoardCard from "./BoardCate/BoardCard";

const Board = () => {
    // 기본 게시판페이지와 글쓰기페이지시 isMatchAny false
    const location = useLocation();
    const paths = ['/board', '/board/write'];
    const isMatchAny = paths.some(path => location.pathname === path);

    // 서버요청데이터
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        console.log(isMatchAny)
    }, [location, isMatchAny])


    // fetch
    useEffect(() => {
        // fetch 함수를 사용하여 백엔드에 요청을 보냅니다.
        fetch('/api/greeting')
            .then(response => response.text())
            .then(text => setGreeting(text))
            .catch(err => console.error(err));
    }, []);

    return (
        <section id="board__page">
            <Routes>
                {/* 게시판 종류 */}
                <Route path='/' element={<BoardSelect />} />
                <Route path='/normal' element={<BoardNormal />} />
                <Route path='/subtle' element={<BoardSubtle />} />
                <Route path='/qna' element={<BoardQnA />} />
                <Route path='/cate' element={<BoardCate />} />
                <Route path='/blog' element={<BoardBlog />} />
                <Route path='/card' element={<BoardCard />} />
                <Route path='/gallery/*' element={<BoardGallery />} />

                {/* 글쓰기페이지 */}
                <Route path='/write' element={<BoardWrite />} />
            </Routes>

            <div className="flex justify-between mt-4">
                {/* 글쓰기 버튼 */}
                {!isMatchAny &&
                    <div className="write__btn">
                        <Link to="/board/write" className="btn black small rounded">글쓰기</Link >
                    </div >
                }
            </div>
        </section>
    )
}

export default Board
