import { create } from 'zustand';

interface StatusState {
    path: any;
    code: string | null;
    loading: boolean;
    setStatus: (code: string | null, path: string | null) => void;
    setLoading: (boolean: boolean) => void;
}

const useStatusStore = create<StatusState>((set) => ({
    path: null,
    code: null,
    setStatus: (code, path) => set({ path: path, code: code }), //오류상태에따라 dialog띄움 (에러코드값, 이동할 path)
    // 로딩상태관리
    loading: false,
    setLoading: (boolean) => set({ loading: boolean }),
}));

export default useStatusStore;
