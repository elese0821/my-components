// src/stores/useUserStore.js
import create from 'zustand'
import { persist } from 'zustand/middleware'

const useUserStore = create(persist((set, get) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null })
}), {
    name: 'user', // 세션 스토리지에 저장될 때 사용될 키 이름
    getStorage: () => sessionStorage // 세션 스토리지를 사용
}));

export default useUserStore;
