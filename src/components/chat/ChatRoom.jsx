import { useEffect, useRef, useState } from "react"
import instance from "../../services/instance"
import { useLocation, useNavigate } from "react-router-dom"
import useUserStore from './../../stores/userStore';
import { SERVER_API_BASE_URL, WEB_SOCKET_API_BASE_URL } from "../../services/endpoint";
import { Stomp } from "@stomp/stompjs";
import styles from "./ChatRoom.module.scss";
import useDialogStore from "../../stores/dialogStore";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Button from "../common/forms/Button";

export default function ChatRoom() {
    const location = useLocation();
    const { channelId, chatName } = location.state || null;
    const [messages, setMessages] = useState([]); // 채팅 메세지 기록
    const { usrIdx, userId, token } = useUserStore(state => state);
    const navigate = useNavigate();
    const openDialog = useDialogStore(state => state.openDialog);

    // 스톰프
    const [message, setMessage] = useState(""); // 메시지 입력상태
    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);

    // 파일                                          
    const [sendFileType, setSendFileType] = useState(false)
    const [fileIdx, setFileIdx] = useState(null);
    const fileInputRef = useRef(null); // 전송후 input 초기화

    // 메시지 목록이 업데이트될 때마다 스크롤을 최하단으로 이동시키는 함수
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView(0);
    };

    // 룸 진입시 채팅기록 불러오는 함수
    const getChatRecord = async () => {
        try {
            const _res = await instance.get(`/user/chat/${channelId}`)
            if (_res.data.result == "success") {
                const _data = _res.data;
                setMessages(_data.list);
                if (channelId) {
                    connect();
                }
            } else {
                console.log("오류발생🤣");
            }
        } catch (e) {
            console.log("error", e)
        }
    }

    // 웹소켓 연결 설정
    const connect = () => {
        // 1. WebSocket 인스턴스를 생성합니다.
        const socket = new WebSocket(`${WEB_SOCKET_API_BASE_URL}/ws`);

        // 2. WebSocket을 STOMP 프로토콜로 래핑하여 STOMP 클라이언트를 생성합니다.
        stompClient.current = Stomp.over(socket);

        // 3. STOMP 클라이언트와 서버 간의 연결을 설정합니다.
        stompClient.current.connect({}, () => {

            // 4. 특정 주제(/sub/chatroom/${roomId})에 대한 구독을 설정합니다.
            stompClient.current.subscribe(`/sub/chatroom/${channelId}`, (message) => {

                // 5. 수신한 메시지의 본문을 JSON 형식으로 파싱합니다.
                const newMessage = JSON.parse(message.body);

                // 6. 기존 메시지 배열에 새 메시지를 추가하여 상태를 업데이트합니다.
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        }, (error) => {
            console.log("STOMP 연결 실패", error);
        });
    };

    // 웹소켓 연결 해제
    const disconnect = () => {
        if (stompClient.current) {
            stompClient.current.disconnect();
        }
    };

    // 새 메시지를 보내는 함수
    const sendMessage = (sendType) => {
        if (sendType === "C" && message === "") {
            openDialog("메세지를 입력하세요..🥲");
            return;
        }
        if (stompClient.current) {
            const messageObj = {
                channelId: channelId,
                token: token,
                usrIdx: usrIdx,
                contents: !sendFileType ? message : fileIdx,
                chatType: sendType
            };
            stompClient.current.send(`/pub/message`, {}, JSON.stringify(messageObj));
            if (sendType === "C") {
                setMessage("");
            }
            if (sendType === "F") {
                handleFileReset()
            }
        }
    };

    const handleFileReset = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            setFileIdx(null);
            setSendFileType(false);
        }
    }

    const activeEnter = (e) => {
        if (e.key === "Enter") {
            sendMessage("C");
        }
    }

    // 파일선택시
    const handleFileChange = async (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFileUpload(files);
        }
    }

    // 파일업로드
    const handleFileUpload = async (files) => {
        const fileData = new FormData();
        for (let i = 0; i < files.length; i++) {
            fileData.append('file[]', files[i]);
        }
        try {
            const response = await instance.post("/file/upload", fileData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const file = await response.data.fileIdxList;
            setSendFileType(true);
            setFileIdx(file[0]);
        } catch (error) {
            console.error('Error posting board info:', error);
            alert("서버 오류가 발생했습니다.");
        }
    }

    const handleLocation = () => {
        navigate("/chat");
    }

    useEffect(() => {
        if (sendFileType && fileIdx) {
            sendMessage("F");
        }
    }, [sendFileType, fileIdx]);

    useEffect(() => {
        getChatRecord();

        return () => disconnect();
    }, [channelId])

    return (
        <div className={styles.chat__room}>
            <div className="flex flex-col bg-gray-600 rounded">
                <div className="flex w-full bg-blue-500 justify-between items-center p-0.5 rounded-t">
                    <h2 className="text-white p-1.5 bold text-lg">{chatName}</h2>
                    <XMarkIcon className="h-8 w-8 cursor-pointer text-white p-1.5 hover:text-gray-300 transition" onClick={handleLocation} />
                </div>
                <div className={`p-4 overflow-y-auto scrollbar-thin ${styles.chatMsg}`} >
                    {/* 메시지가 표시 */}
                    <div className="flex flex-col space-y-4" >
                        {
                            messages.length > 0 ? (
                                messages.map((el, i) => {
                                    // const isCurrentUsr = el.isMine === "Y";
                                    const isCurrentUsr = usrIdx === el.usrIdx;
                                    const chatFileType = el.chatType === "F";

                                    return (
                                        <div
                                            key={i}
                                            className={`${isCurrentUsr ? 'self-end' : 'self-start'
                                                }`}
                                            ref={messagesEndRef}>
                                            <p className={`rounded-lg text-sm text-white mb-1 ${isCurrentUsr ? 'text-right' : 'text-left'}`}>{el.usrNm}</p>

                                            {!chatFileType ?
                                                <p className={`rounded-lg p-3 text-md text-white ${isCurrentUsr ? 'bg-gray-700' : 'bg-gray-800'
                                                    }`}>{el.contents}</p>
                                                :
                                                <p className={`rounded-lg p-3 text-md text-white ${isCurrentUsr ? 'bg-gray-700' : 'bg-gray-800'}`}>파일 다운로드 : <a href={`${SERVER_API_BASE_URL}/file/download/${el.contents}`} className="text-blue-500 underline">{el.fileName}</a>
                                                </p>
                                            }
                                            <p className={`rounded-lg text-sm text-white mt-1 ${isCurrentUsr ? 'text-right' : 'text-left'}`}>{el.regDt}</p>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="rounded-lg p-3 text-white self-center">
                                    <p className="text-md">메세지가 없습니다.</p>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="p-4">
                    {/* 입력 필드와 전송 버튼 */}
                    <div className="flex">
                        <label htmlFor="file" className="text-sm font-medium text-gray-700 flex items-center bg-blue-500 p-2 hover:bg-blue-700 transition cursor-pointer">
                            <PlusIcon className="h-6 w-6 text-white" />
                        </label>
                        <input
                            type="file"
                            name="file"
                            id="file"
                            className="blind"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        // multiple
                        />
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 py-2 px-4 bg-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyUp={(e) => activeEnter(e)}
                        />
                        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 transition" onClick={() => sendMessage(sendFileType ? "F" : "C")}>
                            전송
                        </Button>
                    </div>
                </div>
            </div >
        </div >
    )
}
