import axios from 'axios';
import { SERVER_API_BASE_URL } from './endpoint';
import useUserStore from '../stores/userStore.ts';
import useDialogStore from './../stores/dialogStore';
import useStatusStore from '../stores/statusStore';

const instance = axios.create({
    baseURL: SERVER_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// 요청 인터셉터 설정
instance.interceptors.request.use(
    (config) => {
        const { token } = useUserStore.getState();
        if (config.url !== '/login') {
            config.headers["X-SKYAND-AUTH-TOKEN"] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
``
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { token } = useUserStore.getState();
        const { logout } = useUserStore.getState();
        const { openDialog } = useDialogStore.getState();
        const { setStatus } = useStatusStore.getState();
        if (error.response && error.response.status === 401) {
            // 안쓸거같지만 만들어둠
            if (token) {
                logout();
                openDialog("세션이 만료되었습니다. 다시 로그인해주세요🥲");
                return
            }
            // ---
            openDialog("로그인해주세요🥲");
            setStatus(error.response.status, "/");
        }
        return Promise.reject(error);
    }
);

export default instance;
