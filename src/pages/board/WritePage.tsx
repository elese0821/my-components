import { useEffect, useState } from 'react';
import instance from '../../services/instance';
import useDialogStore from '../../stores/dialogStore';
import { useNavigate, useOutletContext } from 'react-router-dom';
import H1 from '../../components/common/tag/H1';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Editor } from "@ckeditor/ckeditor5-core";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SERVER_API_BASE_URL } from '../../services/endpoint';
import { UploadAdapter, FileLoader } from "@ckeditor/ckeditor5-upload/src/filerepository";
import React from 'react';
import useModalStore from '../../stores/modalStore';
import InputText from '../../components/common/forms/InputText';
import Buttons from '../../components/common/forms/Buttons';
function uploadAdapter(loader: FileLoader): UploadAdapter {
    return {
        upload: () => {
            return new Promise(async (resolve, reject) => {
                try {
                    const file = await loader.file;
                    console.log(file)
                    const fileData = new FormData();
                    fileData.append('file[]', file);

                    const response = await instance.post("/file/upload/editor", fileData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    resolve({
                        // response.data.url
                        default: `${SERVER_API_BASE_URL}/${response.data.url}`
                    });
                } catch (error) {
                    reject(`🥲🥲🥲🥲🥲🥲 ${error} `);
                }
            });
        },
        abort: () => { }
    };
}

function uploadPlugin(editor: Editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return uploadAdapter(loader);
    };
}
export default function WritePage({ data, handleBoardData, getBoardList }) {
    const openDialog = useDialogStore(state => state.openDialog);
    const [fileList, setFileList] = useState([]);
    const [editor, setEditor] = useState("<p></p>");
    const { closeModal } = useModalStore();

    const [formData, setFormData] = useState({
        file: null,
        title: '',
        contents: ''
    });

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            setFormData({
                title: data.title,
                contents: data.contents,
                file: null
            });
            setEditor(data.contents);
        }
    }, [data])

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFileList(files);
            handleFileUpload(files);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // [TODO] 수정
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
            if (response.data) {
                const fileIdxList = response.data.fileIdxList;
                setFormData(prev => ({
                    ...prev,
                    file: fileIdxList
                }));
                openDialog("파일 업로드 성공🌟");
            } else {
                openDialog("파일 업로드 실패😂");
            }
        } catch (error) {
            console.error('Error posting board info:', error);
            alert("서버 오류가 발생했습니다.");
        }
    };

    // 게시물 작성
    const handleSubmit = async (e) => {
        e.preventDefault();
        const sendContents = editor; // TipTap 에디터의 내용을 가져옵니다.
        const { title, file } = formData;

        try {
            const _res = await instance.post("/user/board/info", {
                title: title,
                contents: sendContents,
                file: file
            });
            if (_res.status === 200) {
                openDialog("작성성공😆");
                closeModal();
                getBoardList(); // 작성 후 목록 갱신
            } else {
                openDialog("작성실패😂");
            }
        } catch (error) {
            openDialog("작성실패😂");
            console.log(error);
        }
    };

    // 게시물 수정
    const handlePatch = (boardIdx) => async (e) => {
        e.preventDefault();
        const sendContents = editor; // TipTap 에디터의 내용을 가져옵니다.
        const { title, file } = formData;
        try {
            const _res = await instance.patch("/user/board/info", {
                boardIdx: boardIdx,
                title: title,
                contents: sendContents,
                file: file
            });
            if (_res.status === 200) {
                openDialog("작성성공😆");
                getBoardList(); // 작성 후 목록 갱신
            } else {
                openDialog("작성실패😂");
            }
        } catch (error) {
            openDialog("작성실패😂");
            console.log(error);
        }
    }

    return (
        <section>
            <H1 className="text-[20px] border-b border-gray4 p-1">글쓰기 / 수정</H1>
            <div className='p-4 px-8'>
                <InputText
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="글 제목"
                />
                <div id="editor" className='my-2'></div>
                <CKEditor
                    config={{
                        extraPlugins: [uploadPlugin]
                    }}
                    editor={ClassicEditor}
                    data={editor}
                    onReady={(editor) => {
                        setEditor(editor.getData());
                    }}
                    onChange={(event, editor) => {
                        setEditor(editor.getData());
                    }}
                />
                <div className='flex justify-between mt-2'>
                    <div className="flex items-center">
                        <label
                            htmlFor="file"
                            className="bg-gray1 text-white text-sm px-4 py-2 rounded-md shadow-sm cursor-pointer hover:bg-gray2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            파일 선택
                        </label>
                        <input
                            type="file"
                            name="file"
                            id="file"
                            className="sr-only"
                            onChange={handleChange}
                            multiple
                        />
                        {fileList && (
                            <p className="ml-4 text-gray-700">
                                {Array.from(fileList).map((file, index) => (
                                    <span key={index} className="block">
                                        {file.name}
                                    </span>
                                ))}
                            </p>
                        )}
                    </div>
                    {Object.keys(data).length <= 0 ?
                        <Buttons type="button" className="text-sm roundedauto" onClick={handleSubmit}>
                            작성하기
                        </Buttons> :
                        <div className='flex justify-between gap-2'>
                            <Buttons type="button" className="text-sm rounded" onClick={handlePatch(data.boardIdx)}>
                                수정하기
                            </Buttons>
                            <Buttons type="button" className="text-sm rounded" onClick={() => handleBoardData("delete", data.boardIdx)}>
                                삭제하기
                            </Buttons>
                        </div>
                    }
                </div>
            </div>
        </section>
    );
}