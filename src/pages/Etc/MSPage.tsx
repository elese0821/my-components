import React from 'react'
import { motion } from 'framer-motion';

const menu = {
    "컴퓨터": ["책상", "볼펜", "커피"],
    "컴퓨터2": ["책상", "볼펜", "커피"],
    "컴퓨터3": ["책상", "볼펜", "커피"],
    "컴퓨터4": ["책상", "볼펜", "커피"]
}

export default function MSPage() {
    const [isOpen, setIsOpen] = React.useState<null | number>(null);
    return (
        <div className='grid grid-cols-4'>
            <ul className=''>
                {Object.keys(menu).map((key: string, index: number) => (
                    <li key={index} className='my-4'>
                        <h2
                            onClick={() => setIsOpen(index)}
                            className='p-2'
                        >{key}</h2>
                        <motion.ul
                            initial={{ height: "0" }}
                            animate={isOpen === index ? "open" : "closed"}
                            transition={{ duration: 0.2 }}
                            variants={{
                                open: { height: "auto" },
                                closed: { height: "0" }
                            }}
                            className="bg-gray4 overflow-hidden"
                        >
                            {menu[key].map((item: string, i: number) => (
                                <li
                                    key={i}
                                    className='p-2'
                                >{item}</li>
                            ))}
                        </motion.ul>
                    </li>
                ))}
            </ul>

            <div className='col-span-3'>dsadsadddddddddddddddddddddddddddddddddddddddddddddddddddd</div>
        </div>
    )
}
