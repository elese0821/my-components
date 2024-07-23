import React, { useEffect, useRef } from 'react';
import useModalStore from '../../stores/modalStore';
import { XCircleIcon } from '@heroicons/react/24/solid';
import useDialogStore from '../../stores/dialogStore';
import { motion } from 'framer-motion';

const Modal = ({ children }) => {
    const { isOpen: isModalOpen, closeModal } = useModalStore();
    const isDialogOpen = useDialogStore(state => state.isOpen);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!isDialogOpen && modalRef.current && !modalRef.current.contains(event.target)) {
                closeModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen, closeModal, isDialogOpen]);

    if (!isModalOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-20"
        >
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full relative"
                ref={modalRef}>
                <button className="absolute top-2.5 right-2.5 text-gray-600 hover:text-gray-800" onClick={closeModal}>
                    <XCircleIcon className='text-lg h-6' />
                </button>
                {children}
            </div>
        </motion.div>
    );
};

export default Modal;
