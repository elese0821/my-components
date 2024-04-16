import { useEffect } from 'react';
import instance from '../../../services/instance';
import useUserStore from '../../../services/userService';

function BoardWrite() {
    const { user } = useUserStore();

    useEffect(() => {
        const getDate = async () => {
            try {
                const _res = await instance.post("/user/board/info", {
                    fileIdx: "dsadsa",
                    title: "dddd",
                    contents: "sdsd"
                });

                if (_res.data.result === "success") {
                    alert("success");
                } else {
                    alert("Failure");
                }
            } catch (error) {
                console.error('Error posting board info:', error);
                alert("Error occurred");
            }
        };

        getDate();
    }, []);

    console.log(user); // 로그인된 사용자 정보 로그 출력

    return (
        <div>
            write
        </div>
    );
}

export default BoardWrite;
