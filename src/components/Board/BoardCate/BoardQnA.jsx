import React from 'react'
import { IoIosHeartEmpty } from 'react-icons/io'

const BoardQnA = () => {
    return (
        <div className="board">
            {/* <!-- 게시판 항목 --> */}
            <article className="board__head">
                <div className="board__item-header">
                    <h2 className="board__item-title">일반게시판<span>2</span></h2>
                </div>
            </article>

            {/* <!-- 일반 게시판 항목 --> */}
            <div className="board__section">
                <ul className="board__list">
                    <li className="board__list-item">
                        <article className="board__article">
                            <header className="board__article-header">
                                <h2 className="board__article-title">게시글 제목</h2>
                                <div className="board__article-meta">
                                    <span className="board__article-author">작성자: 관리자</span>
                                    <time className="board__article-date" dateTime="2014-04-03">2014년 4월 3일</time>
                                </div>
                            </header>
                            <p className="board__article-content">이곳은 게시글의 간략한 설명이 들어갑니다. 사용자의 관심을 끌 수 있는 내용을 간단히 소개하세요.</p>
                            <footer className="board__article-footer">
                                <span className="board__article-views">조회수: 1453</span>
                                <span className="board__article-likes"><IoIosHeartEmpty /> 1</span>
                            </footer>
                        </article>
                    </li>
                </ul>

                <ul className="board__list">
                    <li className="board__list-item">
                        <article className="board__article">
                            <header className="board__article-header">
                                <h2 className="board__article-title">게시글 제목</h2>
                                <div className="board__article-meta">
                                    <span className="board__article-author">작성자: 관리자</span>
                                    <time className="board__article-date" dateTime="2014-04-03">2014년 4월 3일</time>
                                </div>
                            </header>
                            <p className="board__article-content">이곳은 게시글의 간략한 설명이 들어갑니다. 사용자의 관심을 끌 수 있는 내용을 간단히 소개하세요.</p>
                            <footer className="board__article-footer">
                                <span className="board__article-views">조회수: 1453</span>
                                <span className="board__article-likes"><IoIosHeartEmpty /> 1</span>
                            </footer>
                        </article>
                    </li>
                </ul>

                <ul className="board__list">
                    <li className="board__list-item">
                        <article className="board__article">
                            <header className="board__article-header">
                                <h2 className="board__article-title">게시글 제목</h2>
                                <div className="board__article-meta">
                                    <span className="board__article-author">작성자: 관리자</span>
                                    <time className="board__article-date" dateTime="2014-04-03">2014년 4월 3일</time>
                                </div>
                            </header>
                            <p className="board__article-content">이곳은 게시글의 간략한 설명이 들어갑니다. 사용자의 관심을 끌 수 있는 내용을 간단히 소개하세요.</p>
                            <footer className="board__article-footer">
                                <span className="board__article-views">조회수: 1453</span>
                                <span className="board__article-likes"><IoIosHeartEmpty /> 1</span>
                            </footer>
                        </article>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default BoardQnA
