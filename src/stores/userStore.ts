import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserStoreState {
    userId:       string | null;
    token:        string | null;
    usrIdx:       string | null;
    profileImage: string | null;   // 소셜 프로필 사진 URL
    nickname:     string | null;   // 소셜 닉네임
    provider:     string | null;   // 'GOOGLE' | 'NORMAL'
    setUser: (data: {
        userId:        any;
        token:         any;
        usrIdx:        any;
        profileImage?: string | null;
        nickname?:     string | null;
        provider?:     string | null;
    }) => void;
    setProfileImage: (url: string | null) => void;
    logout: () => void;
}

const useUserStore = create(
    persist<UserStoreState>((set) => ({
        userId:       null,
        token:        null,
        usrIdx:       null,
        profileImage: null,
        nickname:     null,
        provider:     null,

        setUser: (data) => set({
            userId:       data.userId,
            token:        data.token,
            usrIdx:       data.usrIdx,
            profileImage: data.profileImage ?? null,
            nickname:     data.nickname     ?? null,
            provider:     data.provider     ?? 'NORMAL',
        }),

        setProfileImage: (url) => set({ profileImage: url }),

        logout: () => set({
            userId: null, token: null, usrIdx: null,
            profileImage: null, nickname: null, provider: null,
        }),
    }), {
        name: 'userInfo',
        storage: createJSONStorage(() => localStorage),
    })
);

export default useUserStore;
