import { Link } from "react-router-dom";
import linksData from "../utils/config/links.json"

const Home = () => {

    return (
        <>
            <div className='login__header'>
                <h3>Home</h3>
                <p>메인</p>
            </div>

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
            {/* <Avatar
                    size="30"
                    round={true}
                    src={post.author.photoURL}
                /> */}
        </>
        // <div>
        //     {linksData.map((link, index) => (
        //         < key={index} to={link.path}></>
        //     ))}
        // </div>
    )
}

export default Home
