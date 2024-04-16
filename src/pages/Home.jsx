import { Link } from "react-router-dom";
import linksData from "../utils/config/links.json"

import styles from "./Home.module.scss";

const Home = () => {

    return (
        <div className={styles.home_wrap}>
            {linksData.map((link, i) => (
                <Link className={styles.category} key={i} to={link.path}>
                    {link.title}
                </Link>
            ))}
        </div>
    )
}

export default Home
