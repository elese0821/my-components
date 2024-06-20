import { motion } from 'framer-motion';
import { XCircleIcon } from '@heroicons/react/24/solid';
import useDialogStore from './../../stores/dialogStore';

const Dialog = () => {
    const { isOpen, message, closeDialog } = useDialogStore();

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-20"
        >
            <div className="modal-content bg-white rounded-lg shadow p-6 m-4 max-w-sm w-full flex flex-col justify-center relative">
                <div className="bg-gray-800 ">
                    <button
                        className="absolute top-3 right-3"
                        onClick={closeDialog}
                    >
                        <XCircleIcon className="h-6 w-6 text-gray-500 hover:text-gray-800" />
                    </button>
                </div >
                <p className="text-lg text-gray-800 text-center">{message}</p>
            </div >
        </motion.div>
    );
}

export default Dialog;
