import axios from 'axios';
import { SERVER_API_BASE_URL } from './endpoint';

const instance = axios.create({
    baseURL: SERVER_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


export default instance;
