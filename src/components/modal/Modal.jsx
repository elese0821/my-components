import { motion } from 'framer-motion';
import useModalStore from '../../stores/modalStore';
import { useParams, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

const Modal = ({ children }) => {
    const { isOpen, closeModal } = useModalStore();

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center"
        >
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full pt-10  relative">
                <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={closeModal}>
                    &times;
                </button>
                {children}
            </div>
        </motion.div>
    );
};

export default Modal;
