import { motion } from 'framer-motion';
import useModalStore from '../../stores/modalStore';
import { XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

const Modal = ({ children }) => {
    const { isOpen, closeModal } = useModalStore();

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-20"
        >
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full relative">
                <button className="absolute top-2.5 right-2.5 text-gray-600 hover:text-gray-800" onClick={closeModal}>
                    <XCircleIcon className='text-lg h-6' />
                </button>
                {children}
            </div>
        </motion.div>
    );
};

export default Modal;
