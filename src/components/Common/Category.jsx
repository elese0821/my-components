import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import config from '../../utils/config/system_config.json';
import { motion } from 'framer-motion';

const variants = {
    open: { opacity: 1, display: 'flex' },
    closed: { opacity: 0, display: 'none' },
};

export default function Category() {
    const [showMenu, setShowMenu] = useState(null);
    const subMenu = config.menu.map((el) => el.submenu);

    return (
        <ul className='w-full bg-gray-800 text-white p-8 flex gap-2 justify-evenly'>
            {config.menu.map((el, i) => (
                <li key={el.title}>
                    <Link
                        to={el.path}
                        className={showMenu === i ? 'text-gray-400' : ''}
                        onClick={() => setShowMenu(showMenu === i ? null : i)}
                    >
                        {el.title}
                    </Link>
                    {subMenu[i] &&
                        <motion.ul
                            initial="closed"
                            animate={showMenu === i ? 'open' : 'closed'}
                            variants={variants}
                            transition={{ duration: 0.2 }}
                            className='absolute left-0 w-full bg-gray-400 text-white flex gap-2 text-sm top-full justify-center'
                            key={el.title}
                        >
                            {subMenu[i].map((subEl, j) => (
                                <li key={`${subEl.cateId}-${j}`} className='p-4'>
                                    {subEl.cateId &&
                                        <Link to={`${el.path}/${subEl.cateId}`}>
                                            {subEl.name}
                                        </Link>
                                    }
                                </li>
                            ))}
                        </motion.ul>
                    }
                </li>
            ))}
        </ul>
    );
}
