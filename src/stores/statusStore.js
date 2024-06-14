import { create } from 'zustand';

const useStatusStore = create((set) => ({
    path: null,
    code: null,
    setStatus: (code, path) => set({ path: path, code: code }), //오류상태에따라 dialog띄움 첫번쨰인자는 에러코드값, 두번쨰는 이동할 path
    // 로딩상태관리
    loading: false,
    setLoading: (boolean) => set({ loading: boolean }),
}));

export default useStatusStore;
