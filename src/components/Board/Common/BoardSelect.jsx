import boardCate from "../../../utils/config/board.json";
import { Link } from 'react-router-dom';

import styles from "./BoardSelect.module.scss";

const BoardSelect = () => {
    return (
        <div className={styles.select__wrap}>
            {boardCate.map((cate, i) => (
                <Link className={styles.category} to={cate.cateId} key={i}>
                    {cate.name}
                </Link>
            ))}
        </div>
    )
}

export default BoardSelect
