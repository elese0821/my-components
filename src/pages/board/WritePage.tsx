import { useEffect, useState } from 'react';
import instance from '../../services/instance';
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
import useDialogStore from '../../stores/dialogStore';

function uploadAdapter(loader: FileLoader): UploadAdapter {
    return {
        upload: () => {
            return new Promise(async (resolve, reject) => {
                try {
                    const file = await loader.file;
                    console.log(file);
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
        title: '',
        contents: '',
        files: ''
    });

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            setFormData({
                title: data.title,
                contents: data.contents,
                files: data.files
            });
            setEditor(data.contents);
        }
    }, [data]);

    // FIXME: 수정
    const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        const { name, value, files } = e.target as HTMLInputElement;
        if (files) {
            setFileList(files);
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // FIXME: 수정
    const handleFileUpload = async (fileList: Array<string>): Promise<number | null> => {
        const fileData = new FormData();
        for (let i = 0; i < fileList.length; i++) {
            fileData.append('file[]', fileList[i]);
        }
        try {
            const response = await instance.post("/file/upload", fileData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data) {
                console.log("파일 업로드 성공🌟");
                return response.data.fileIdxList[0]; // 파일 인덱스를 반환
            } else {
                console.log("파일 업로드 실패😂");
                return null;
            }
        } catch (error) {
            console.error('Error posting board info:', error);
            return null;
        }
    };

    const boardSubmit = async (fileIdx: string): Promise<void> => {
        const sendContents = editor; // CKEditor 에디터의 내용을 가져옵니다.
        const { title } = formData;
        try {
            const _res = await instance.post("/user/board/info", {
                title: title,
                contents: sendContents,
                fileIdx: fileIdx
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
    }

    // 게시물 작성
    const handleSubmit = async (e: React.FormEvent<HTMLInputElement>): Promise<void> => {
        e.preventDefault();
        let fileIdx = formData.files;
        if (fileList.length > 0) {
            fileIdx = await handleFileUpload(fileList); // 업로드 결과를 기다림
        }
        if (fileIdx) {
            boardSubmit(fileIdx);
        } else {
            openDialog("파일 업로드 실패로 인해 게시물 작성 중단");
            return;
        }
    };

    // 게시물 수정
    const handlePatch = (boardIdx: number) => async (e: React.FormEvent<HTMLInputElement>): Promise<void> => {
        e.preventDefault();
        if (fileList.length > 0) {
            await handleFileUpload(fileList);
        }
        const sendContents = editor; // CKEditor 에디터의 내용을 가져옵니다.
        const { title, files } = formData;

        try {
            const _res = await instance.patch("/user/board/info", {
                boardIdx: boardIdx,
                title: title,
                contents: sendContents,
                fileIdx: files
            });
            if (_res.status === 200) {
                openDialog("수정성공😆");
                getBoardList(); // 수정 후 목록 갱신
            } else {
                openDialog("수정실패😂");
            }
        } catch (error) {
            openDialog("수정실패😂");
            console.log(error);
        }
    }

    return (
        <section>
            <H1 className="text-[20px] border-b border-gray4 p-1">글쓰기 / 수정</H1>
            <div className='p-4 px-8'>
                <InputText
                    label='Title'
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
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
                            className="h-full bg-gray1 text-white text-sm items-center transition px-4 flex rounded-md shadow-sm cursor-pointer hover:bg-gray2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                        <Buttons type="button" className="text-sm rounded" onClick={handleSubmit}>
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
