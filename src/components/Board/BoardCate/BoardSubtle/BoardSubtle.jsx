import { IoIosHeartEmpty } from "react-icons/io"
import styles from "./BoardSubtle.module.scss"

const BoardSubtle = () => {
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
                <ul className={styles.board__header}>
                    <li className=""></li>
                </ul>

                <div className={styles.board__table}>
                    <ul className={styles.board__header}>
                        <li className={styles.no}>No</li>
                        <li className={styles.category}>
                            <span className={styles.category_select}>
                                <div className={styles.dropdown}>
                                    <a data-target="#" id="dLabel" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                                        카테고리
                                    </a>
                                    <ul className={styles.dropdown__menu}>
                                        <li className={styles.category_all}></li>
                                    </ul>
                                </div>
                            </span>
                        </li>
                        <li className={styles.tit}>제목</li>
                        <li className={styles.name}>글쓴이</li>
                        <li className={styles.date}>작성시간</li>
                        <li className={styles.read}>조회수</li>
                        <li className={styles.like}>좋아요</li>
                    </ul>

                    <ul className={styles.board__list}>
                        <li className={styles.no}>1</li>
                        <li className={styles.category}>카테고리1</li>
                        <li className={styles.tit}>안녕</li>
                        <li className={styles.name}>글쓰니</li>
                        <li className={styles.date}>2014.12.23</li>
                        <li className={styles.read}>3</li>
                        <li className={styles.like}>2</li>
                    </ul>
                </div>

            </div >
        </>
    )
}

export default BoardSubtle
