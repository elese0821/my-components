import { create } from 'zustand';

interface DialogState {
    isOpen: boolean;
    message: string;
    openDialog: (message: string) => void;
    closeDialog: () => void;
}

const useDialogStore = create<DialogState>((set) => ({
    isOpen: false,
    message: '',
    openDialog: (message) => set({ isOpen: true, message: message }),
    closeDialog: () => set({ isOpen: false, message: '' })
}));

export default useDialogStore;
