import { create } from 'zustand'
import { persist } from 'zustand/middleware'
/* 
persist = Zustand 스토어를 지속성 있는 저장소에 연결해주는 middleware
Zustand 스토어를 생성, persist를 통해 이 스토어의 상태가 세션 스토리지에 저장되도록 설정
페이지를 새로 고침하거나 닫았다 다시 열어도 사용자의 로그인 상태나 토큰 정보를 유지할 수 있도록 함
  */
/*
`persist`의 주요 기능
자동 저장: 스토어의 상태가 변경될 때마다 자동으로 지정된 스토리지(로컬 스토리지나 세션 스토리지)에 저장합니다.
상태 복원: 브라우저를 새로고침하거나 재접속할 때 이전에 저장된 상태를 자동으로 불러와 Zustand 스토어에 복원합니다.
구성 가능: 저장할 스토리지 타입(localStorage, sessionStorage 등)을 선택하고, 저장될 때 사용할 키 이름을 지정할 수 있습니다.
*/

const useUserStore = create(persist((set) => ({
    userId: null,
    token: null,
    usrIdx: null,
    setUser: (data) => set({
        userId: data.userId,
        token: data.token,
        usrIdx: data.usrIdx
    }),
    // [TODO] 
    setToken: (data) => set({
        token: data.token,
    }),
    logout: () => set({
        userId: null,
        token: null,
        usrIdx: null
    }),
}), {
    name: 'userInfo', // 스토리지 저장될 때 사용될 키 이름
    getStorage: () => localStorage // 사용할 스토리지 지정
}));

export default useUserStore;
