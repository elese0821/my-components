import { Link } from "react-router-dom";
import boardCate from "../../utils/config/board.json"

const Board = () => {
    return (
        <>
            <div className='login__header'>
                <h3>Board</h3>
                <p>게시판</p>
            </div>

            <div className='list__wrap'>
                {boardCate.map((cate, i) => (
                    <Link className='list' key={i}>
                        <span className='cate'>{cate.name}</span>
                        <h3 className='title'>
                            <Link to={cate.cateId}>{cate.name}</Link>
                        </h3>
                        <p className='desc'>{cate.name}</p>
                        <div className='auth'>
                            ddd
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
}

export default Board
