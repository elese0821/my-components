import { IoIosHeartEmpty } from "react-icons/io"

import styles from "./BoardNormal.module.scss";

const BoardNormal = () => {
    return (
        <>
            {/* <!-- 게시판 항목 --> */}
            <article className={styles.board__head}>
                <h2 className={styles.section__tit}>일반게시판
                    <em>2</em>
                </h2>
            </article>

            {/* <!-- 일반 게시판 항목 --> */}
            <div className={styles.board__section}>
                <ul className={styles.board__list}>
                    <li className={styles.list__top}>
                        <h2 className={styles.title}>게시글 제목1</h2>
                        {/* 댓글 컴포넌트 */}
                    </li>

                    <ul className={styles.list__bottom}>
                        <li className="author">관리자</li>
                        <li><time className="date" dateTime="2014-04-03">2014-04-03</time></li>
                        <li className="views">조회수<span className="pl-0.5">1453</span></li>
                        <li className="likes"><IoIosHeartEmpty /><span className="inline-block pl-px">1</span></li>
                    </ul>
                </ul>

                <ul className={styles.board__list}>
                    <li className={styles.list__top}>
                        <h2 className={styles.title}>게시글 제목1</h2>
                        {/* 댓글 컴포넌트 */}
                    </li>

                    <ul className={styles.list__bottom}>
                        <li className="author">관리자</li>
                        <li><time className="date" dateTime="2014-04-03">2014-04-03</time></li>
                        <li className="views">조회수<span className="pl-0.5">1453</span></li>
                        <li className="likes"><IoIosHeartEmpty /><span className="inline-block pl-px">1</span></li>
                    </ul>
                </ul>

            </div >
        </>
    )
}

export default BoardNormal
