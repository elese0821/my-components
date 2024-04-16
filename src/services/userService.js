import create from 'zustand'
import { persist } from 'zustand/middleware' // 상태를 지속적으로 유지하기 위해 zustand에 포함된 미들웨어입니다. 이 미들웨어는 상태를 로컬 저장소에 저장하여 페이지 새로고침 후에도 상태를 유지할 수 있게 해줍니다.

const useUserStore = create(persist((set, get) => ({
    user: null,
    setUser: (user) => set(user),
    logout: () => set({ user: null })
}), {
    name: 'user-storage',
    getStorage: () => sessionStorage
}));

export default useUserStore;
