import { Link } from "react-router-dom";
import linksData from "../utils/config/links.json"

const Home = () => {

    return (
        <div className='list__wrap'>
            {linksData.map((link, i) => (
                <Link className='list' key={i} to={link.path}>
                    <span className='cate'>{link.title}</span>
                    <h3 className='title'>
                        {link.title}
                    </h3>
                    <p className='desc'>{link.title}</p>
                </Link>
            ))}
        </div>
    )
}

export default Home
