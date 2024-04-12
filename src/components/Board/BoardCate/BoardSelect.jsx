import boardCate from "../../../utils/config/board.json";
import { Link } from 'react-router-dom';

const BoardSelect = () => {
    return (
        <div className='list__wrap'>
            {boardCate.map((cate, i) => (
                <Link className='list' to={cate.cateId} key={i}>
                    <span className='cate'>{cate.name}</span>
                    <h3 className='title'>
                        <div>{cate.name}</div>
                    </h3>
                    <p className='desc'>{cate.name}</p>
                </Link>
            ))}
        </div>
    )
}

export default BoardSelect
