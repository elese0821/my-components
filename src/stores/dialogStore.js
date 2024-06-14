import { create } from 'zustand';

const useDialogStore = create((set) => ({
    isOpen: false,
    message: '',
    openDialog: (message) => set({ isOpen: true, message: message }),
    closeDialog: () => set({ isOpen: false, message: '' })
}));

export default useDialogStore;
