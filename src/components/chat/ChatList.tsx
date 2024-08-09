import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom'
import instance from '../../services/instance';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import Modal from '../modal/Modal';
import Buttons from '../common/forms/Buttons';
import { Input } from '@material-tailwind/react';
import InputText from '../common/forms/InputText';
import useUserStore from '../../stores/userStore';
import useModalStore from '../../stores/modalStore';
import { listType } from './@types/listType';
import useDialogStore from '../../stores/dialogStore';

export default function ChatList() {
    const { userId, token } = useUserStore();
    const [chatList, setChatList] = useState<listType[]>([]);
    const { openModal, closeModal } = useModalStore(state => state);
    const [add, setAdd] = useState(false);
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        chatName: '',
        password: '',
        channelId: '',
    });
    const initialFormData = {
        chatName: '',
        password: '',
        channelId: ''
    };
    const { openDialog } = useDialogStore();

    // 함수정의
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 폼 초기화
    const resetFormData = () => {
        setFormData(initialFormData);
    };

    // 채팅방 리스트 get
    const getChatList = async () => {
        try {
            const _res = await instance.get("/user/chat", {
                params: {
                    row: 10,
                    pageNo: 1
                }
            });

            if (_res.data.result == "success") {
                setChatList(_res.data.list);
                resetFormData();
            } else {
                console.log("오류발생🤣");
            }

        } catch (e) {
            console.log('error', e)
        }
    }

    // 채팅룸 추가 클릭시
    const handleAddClick = () => {
        // 모달 추가
        setAdd(true);
        openModal();
    };

    // 채팅룸 입장
    const handleEnterChat = (chatNm, channelId) => {
        setFormData({ ...formData, chatName: chatNm, channelId: channelId });
        setAdd(false);
        openModal();
    }

    // 채팅룸 추가 요청
    const handleAddChatRoom = async () => {
        // 임시
        if (!formData.chatName) {
            openDialog("채팅방이름을 입력해주세여");
            return;
        }
        try {
            const _res = await instance.post("/user/chat", {
                chatNm: formData.chatName,
                pw: formData.password
            });

            if (_res.data.result == "success") {
                getChatList();
                resetFormData();
                closeModal();
                openDialog("채팅방이 생성되었습니다.");
            } else {
                console.log("오류발생🥲");
            }
        } catch (e) {
            console.log('error', e);
        }
    };

    // 채팅룸 입장 요청
    const handleEnterChatRoom = async () => {
        try {
            const _res = await instance.get(`/user/chat/${formData.channelId}`, {
                params: {
                    chatNm: formData.chatName,
                    pw: formData.password
                }
            });

            if (_res.data.result == "success") {
                navigate(`chatRoom/${formData.channelId}`, { state: { ...formData } });
                closeModal();
                resetFormData();
            } else {
                console.log("오류발생🥲");
            }

        } catch (e) {
            console.log('error', e);
        }
    }

    // useEffect
    useEffect(() => {
        getChatList();
    }, [])

    return (
        <>
            <div className="flex flex-col justify-center gap-4">
                {chatList &&
                    chatList.map((list, idx) => {
                        let lastRegDt = list?.regDt;
                        let regDt = lastRegDt.split(" ");
                        return (
                            <div
                                key={idx}
                                className="bg-white shadow-sm cursor-default rounded-lg p-6 flex justify-between items-center"
                            >
                                <div>
                                    <div className="text-sm font-bold text-gray-500 ">
                                        {list.chatNm}
                                    </div>
                                    {/* <div>채팅방 만든 사람이름 {list.usrNm}</div> */}
                                    {/* 채팅기록 존재 X */}
                                    {list.lastChat &&
                                        <p className='text-blue-500 text-xl pt-2'>{list.lastChat}</p>
                                    }
                                </div>
                                <div className='flex gap-2 text-gray-400 text-sm'>
                                    <div className='text-right flex-col flex justify-center font-light'>
                                        {regDt.map((r, i) =>
                                            <div key={i}>
                                                {r}
                                            </div>
                                        )}
                                    </div>
                                    <Buttons
                                        className='cursor-pointer bg-gray-500 rounded-2xl hover:bg-gray-400 transition text-white h-12 w-16'
                                        onClick={() => handleEnterChat(list.chatNm, list.channelId)}
                                    >입장</Buttons>
                                </div>
                            </div>
                        )
                    })
                }
                <Buttons
                    onClick={handleAddClick}
                    className="flex items-center justify-center bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out">
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    채팅룸 추가
                </Buttons>

                {/* 채팅방 */}
                <Outlet />
            </div >

            {/* 채팅입장, 채팅추가 모달 */}
            {userId &&
                <Modal>
                    <div>
                        {add ? (
                            <div className='p-10 pb-10 flex-col justify-center flex gap-5'>
                                <form className="flex flex-col rounded-lg gap-3">
                                    <InputText
                                        type="text"
                                        id="chatName"
                                        name="chatName"
                                        onChange={handleChange}
                                        required
                                        autoComplete='off'
                                        label='채팅방 이름'
                                        placeholder='채팅방 이름'
                                    />

                                    <InputText
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        autoComplete='off'
                                        label='입장 비밀번호'
                                        placeholder='입장 비밀번호'
                                    />
                                </form>
                                <Buttons onClick={handleAddChatRoom}>
                                    채팅방 생성
                                </Buttons>
                            </ div>
                        ) : (
                            <div className='p-10 pb-10 flex-col justify-center flex gap-5'>
                                <form className="flex flex-col bg-white rounded-lg gap-5">
                                    <InputText
                                        label={formData.chatName}
                                        type="text"
                                        id="chatName"
                                        name="chatName"
                                        value={formData.chatName}
                                        onChange={handleChange}
                                        autoComplete='off'
                                        disabled
                                    />
                                    <InputText
                                        label="비밀번호"
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete='off'
                                    />
                                </form>
                                <Buttons
                                    onClick={handleEnterChatRoom}
                                >
                                    채팅방 입장
                                </Buttons>
                            </div>
                        )}
                    </div>
                </Modal >
            }
        </>
    )
}
