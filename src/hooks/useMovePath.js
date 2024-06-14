import { useNavigate } from 'react-router-dom';

const useMovePath = (code, path) => {
    const navigate = useNavigate();

    const handleMovePath = () => {
        navigate(path);
    }
    return handleMovePath;
}


export default useMovePath;