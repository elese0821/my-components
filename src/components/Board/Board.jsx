import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";


import styles from "./Board.module.scss";
import BoardSelect from "./Common/BoardSelect";

const Board = () => {
    // 기본 게시판페이지와 글쓰기페이지시 isMatchAny false
    const location = useLocation();
    const paths = ['/board', '/board/write'];
    const isMatchAny = paths.some(path => location.pathname === path);

    useEffect(() => {
    }, [location, isMatchAny])

    return (
        <>
            <BoardSelect />

            <section id={styles.board__page}>
                <Outlet />

                <div className="flex justify-between mt-4">
                    {/* 글쓰기 버튼 */}
                    {!isMatchAny &&
                        <div className="write__btn">
                            <Link to="/board/write" className="btn black small rounded">글쓰기</Link >
                        </div >
                    }
                </div>

            </section>
        </>
    )
}

export default Board
