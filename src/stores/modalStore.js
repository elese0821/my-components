import { create } from 'zustand';

const useModalStore = create((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false })
}));

export default useModalStore;
