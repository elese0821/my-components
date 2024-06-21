import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../utils/config/system_config.json';
import { motion } from 'framer-motion';
import {
    Tabs,
    TabsHeader,
    Tab,
    TabPanel,
} from "@material-tailwind/react";

const variants = {
    open: { opacity: 1, display: 'flex' },
    closed: { opacity: 0, display: 'none' },
};

export default function Category() {
    const [showMenu, setShowMenu] = useState(null);
    const subMenu = config.menu.map((el) => el.submenu);
    // dsad
    const [activeTab, setActiveTab] = useState("html");
    const navigate = useNavigate();

    const handleTabClick = (path, i) => {
        navigate(path);
        setActiveTab(path);
        setShowMenu(showMenu === i ? null : i);
    }

    return (
        <>
            <Tabs value={activeTab} className="relative">
                <TabsHeader
                    className="rounded-none border-b border-blue-gray-50 pt-0 bg-rgba"
                    indicatorProps={{
                        className:
                            "bg-transparent border-t-4 border-purple shadow-none rounded-none",
                    }}
                >
                    {config.menu.map(({ title, path }, i) => (
                        <div key={`tab-${path}`} className='w-full' >
                            <Tab
                                value={path}
                                onClick={() => handleTabClick(path, i)}
                                className={`leading-9 ${activeTab === path && "text-purple"}`}
                            >
                                {title}
                            </Tab>
                            {/* 서브메뉴 */}
                            {subMenu[i] &&
                                <motion.ul
                                    initial="closed"
                                    animate={showMenu === i ? 'open' : 'closed'}
                                    variants={variants}
                                    transition={{ duration: 0.2 }}
                                    className='absolute left-0 w-full bg-gray-800 text-white flex gap-2 text-sm top-full justify-center'
                                    key={`submenu-${path}-${i}`}
                                >
                                    {subMenu[i].map((subEl, j) => (
                                        <li key={`subEl-${subEl.cateId}-${j}`} >
                                            {subEl.cateId &&
                                                <Link to={`${path}/${subEl.cateId}`} className='p-4 block cursor-pointer'>
                                                    {subEl.name}
                                                </Link>
                                            }
                                        </li>
                                    ))}
                                </motion.ul>
                            }
                        </div>
                    ))}
                </TabsHeader>
            </Tabs>
            {/* <ul className='w-full bg-gray-800 text-white p-8 flex gap-2 justify-evenly'>
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
            </ul> */}
        </>
    );
}