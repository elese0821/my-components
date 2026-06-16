import { useEffect, useRef, useState } from 'react';
import instance from '../../services/instance';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { Editor } from "@ckeditor/ckeditor5-core";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { SERVER_API_BASE_URL } from '../../services/endpoint';
import { UploadAdapter, FileLoader } from "@ckeditor/ckeditor5-upload/src/filerepository";
import React from 'react';
import useDialogStore from '../../stores/dialogStore';
import {
    PhotoIcon, PaperClipIcon, TrashIcon,
    CheckIcon, PencilSquareIcon, XMarkIcon,
    ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';

// ── CKEditor 이미지 업로드 어댑터 ────────────────────────────────
function uploadAdapter(loader: FileLoader): UploadAdapter {
    return {
        upload: () => new Promise(async (resolve, reject) => {
            try {
                const file = await loader.file;
                const fd = new FormData();
                fd.append('file[]', file);
                const res = await instance.post('/file/upload/editor', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                resolve({ default: `${SERVER_API_BASE_URL}/${res.data.url}` });
            } catch (e) { reject(`이미지 업로드 실패: ${e}`); }
        }),
        abort: () => {},
    };
}
function uploadPlugin(editor: Editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => uploadAdapter(loader);
}

// ── 파일 이름에서 확장자로 이미지 판별 ─────────────────────────
const isImageExt = (name?: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name ?? '');

// ── Props ────────────────────────────────────────────────────────
interface WritePageProps {
    data: any;
    handleBoardData: (action: string, boardIdx: string) => void;
    getBoardList: () => void;
    closeModal: () => void;
}

export default function WritePage({ data, handleBoardData, getBoardList, closeModal }: WritePageProps) {
    const openDialog = useDialogStore(state => state.openDialog);
    const isEdit = data && Object.keys(data).length > 0;

    // ── 폼 state ─────────────────────────────────────────────────
    const [title,    setTitle]    = useState('');
    const [editorHtml, setEditorHtml] = useState('<p></p>');
    const [loading,  setLoading]  = useState(false);

    // ── 파일 state ───────────────────────────────────────────────
    // 신규 선택 파일
    const [newFile,   setNewFile]   = useState<File | null>(null);
    const [newPreview, setNewPreview] = useState<string>('');

    // 기존 첨부파일 (수정 시)
    // null = 유지, '' = 삭제(명시적)
    const [existingFileIdx, setExistingFileIdx] = useState<string | null>(null);
    const [existingFileName, setExistingFileName] = useState<string>('');
    const [existingRemoved, setExistingRemoved] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── data 로드 ─────────────────────────────────────────────────
    useEffect(() => {
        if (!isEdit) return;
        setTitle(data.title ?? '');
        setEditorHtml(data.contents ?? '<p></p>');
        setExistingFileIdx(data.fileIdx ?? null);
        setExistingFileName(data.fileOrgNm ?? '');
        setExistingRemoved(false);
        setNewFile(null);
        setNewPreview('');
    }, [data]);

    // ── 신규 파일 선택 ─────────────────────────────────────────
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 20 * 1024 * 1024) {
            openDialog('파일 크기는 20MB 이하만 가능합니다.');
            return;
        }
        setNewFile(file);
        setExistingRemoved(true); // 새 파일 선택 시 기존 파일 대체
        if (isImageExt(file.name)) {
            setNewPreview(URL.createObjectURL(file));
        } else {
            setNewPreview('');
        }
        e.target.value = '';
    };

    // 기존 파일 삭제 표시
    const handleRemoveExisting = () => {
        setExistingRemoved(true);
        setExistingFileIdx(null);
    };

    // 새로 선택한 파일 취소
    const handleCancelNew = () => {
        setNewFile(null);
        setNewPreview('');
        // 기존 파일이 있었다면 복구
        if (data?.fileIdx) {
            setExistingRemoved(false);
            setExistingFileIdx(data.fileIdx);
        }
    };

    // ── 파일 업로드 → fileIdx ──────────────────────────────────
    const uploadFile = async (file: File): Promise<string | null> => {
        const fd = new FormData();
        fd.append('file[]', file);
        try {
            const res = await instance.post('/file/upload', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data.fileIdxList?.[0] ?? null;
        } catch { return null; }
    };

    // ── 등록 ─────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!title.trim()) { openDialog('제목을 입력해주세요.'); return; }
        setLoading(true);
        try {
            let fileIdx: string | null = null;
            if (newFile) fileIdx = await uploadFile(newFile);

            const res = await instance.post('/user/board/info', {
                title,
                contents: editorHtml,
                fileIdx,
            });
            if (res.status === 200) {
                openDialog('등록되었습니다.');
                closeModal();
                getBoardList();
            } else {
                openDialog('등록에 실패했습니다.');
            }
        } catch { openDialog('오류가 발생했습니다.'); }
        finally { setLoading(false); }
    };

    // ── 수정 ─────────────────────────────────────────────────────
    const handlePatch = async () => {
        if (!title.trim()) { openDialog('제목을 입력해주세요.'); return; }
        setLoading(true);
        try {
            let fileIdx: string | null | undefined;

            if (newFile) {
                // 새 파일 업로드
                fileIdx = await uploadFile(newFile);
            } else if (existingRemoved) {
                // 기존 파일 삭제 의사 표시 → null 전송
                fileIdx = null;
            } else {
                // 기존 파일 유지 → 원본 fileIdx 그대로
                fileIdx = existingFileIdx;
            }

            const res = await instance.patch('/user/board/info', {
                boardIdx: data.boardIdx,
                title,
                contents: editorHtml,
                fileIdx,
            });
            if (res.status === 200) {
                openDialog('수정되었습니다.');
                getBoardList();
                closeModal();
            } else {
                openDialog('수정에 실패했습니다.');
            }
        } catch { openDialog('오류가 발생했습니다.'); }
        finally { setLoading(false); }
    };

    // ── 렌더 ─────────────────────────────────────────────────────
    const hasExistingFile = isEdit && existingFileIdx && !existingRemoved;
    const isExistingImage = hasExistingFile && isImageExt(existingFileName);

    return (
        <div className='flex flex-col h-full'>
            {/* ── 헤더 ── */}
            <div className='flex items-center justify-between px-5 py-3.5 border-b border-gray-100'>
                <div className='flex items-center gap-2'>
                    <PencilSquareIcon className='h-4.5 w-4.5 text-gray-400' style={{ height: 18, width: 18 }} />
                    <h2 className='text-sm font-bold text-gray-800'>
                        {isEdit ? '게시글 수정' : '새 게시글 작성'}
                    </h2>
                </div>
            </div>

            {/* ── 본문 스크롤 영역 ── */}
            <div className='flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4'>

                {/* 제목 입력 */}
                <div className='flex flex-col gap-1.5'>
                    <label className='text-xs font-semibold text-gray-500'>제목 <span className='text-red-400'>*</span></label>
                    <input
                        type='text'
                        placeholder='제목을 입력하세요'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className='w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-400 transition-all bg-white'
                    />
                </div>

                {/* CKEditor */}
                <div className='flex flex-col gap-1.5'>
                    <label className='text-xs font-semibold text-gray-500'>내용</label>
                    <div className='border border-gray-200 rounded-xl overflow-hidden'>
                        <CKEditor
                            config={{ extraPlugins: [uploadPlugin] }}
                            editor={ClassicEditor}
                            data={editorHtml}
                            onReady={(ed) => setEditorHtml(ed.getData())}
                            onChange={(_, ed) => setEditorHtml(ed.getData())}
                        />
                    </div>
                </div>

                {/* ── 파일 첨부 섹션 ── */}
                <div className='flex flex-col gap-2'>
                    <label className='text-xs font-semibold text-gray-500'>파일 첨부</label>

                    {/* 기존 첨부파일 (수정 시, 삭제 안 된 경우) */}
                    {hasExistingFile && (
                        <div className='flex flex-col gap-2'>
                            <div className='text-xs text-gray-400 font-medium'>현재 첨부파일</div>
                            {isExistingImage ? (
                                /* 이미지 미리보기 */
                                <div className='relative inline-block'>
                                    <img
                                        src={`${SERVER_API_BASE_URL}/file/download/${existingFileIdx}`}
                                        alt={existingFileName}
                                        className='h-28 w-auto rounded-lg border border-gray-200 object-cover'
                                    />
                                    <button
                                        onClick={handleRemoveExisting}
                                        className='absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shadow-sm'
                                        title='이미지 삭제'
                                    >
                                        <XMarkIcon style={{ width: 11, height: 11, color: '#fff' }} />
                                    </button>
                                    <p className='text-xs text-gray-400 mt-1 truncate max-w-[200px]'>{existingFileName}</p>
                                </div>
                            ) : (
                                /* 일반 파일 */
                                <div className='flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 w-fit'>
                                    <PaperClipIcon className='h-4 w-4 text-gray-400 shrink-0' />
                                    <span className='text-xs text-gray-600 truncate max-w-[200px]'>{existingFileName || `파일 #${existingFileIdx}`}</span>
                                    <button
                                        onClick={handleRemoveExisting}
                                        className='ml-1 p-0.5 hover:text-red-500 text-gray-400 transition-colors'
                                        title='파일 삭제'
                                    >
                                        <TrashIcon className='h-3.5 w-3.5' />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 삭제 표시 시 안내 */}
                    {isEdit && existingRemoved && !newFile && data?.fileIdx && (
                        <div className='flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-xs text-red-500 w-fit'>
                            <TrashIcon className='h-3.5 w-3.5 shrink-0' />
                            기존 파일이 제거됩니다.
                        </div>
                    )}

                    {/* 새 파일 미리보기 */}
                    {newFile && (
                        <div className='flex flex-col gap-1'>
                            <div className='text-xs text-gray-400 font-medium'>새로 선택한 파일</div>
                            <div className='flex items-center gap-2 px-3 py-2 border border-blue-200 rounded-lg bg-blue-50 w-fit'>
                                {newPreview ? (
                                    <img src={newPreview} alt='preview' className='h-10 w-10 object-cover rounded-md border border-blue-200' />
                                ) : (
                                    <PaperClipIcon className='h-4 w-4 text-blue-400 shrink-0' />
                                )}
                                <span className='text-xs text-blue-700 truncate max-w-[200px]'>{newFile.name}</span>
                                <button
                                    onClick={handleCancelNew}
                                    className='ml-1 p-0.5 hover:text-red-500 text-blue-400 transition-colors'
                                    title='선택 취소'
                                >
                                    <XMarkIcon className='h-3.5 w-3.5' />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 파일 선택 버튼 */}
                    <button
                        type='button'
                        onClick={() => fileInputRef.current?.click()}
                        className='inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all w-fit'
                    >
                        <ArrowUpTrayIcon className='h-4 w-4' />
                        {newFile ? '다른 파일 선택' : (hasExistingFile ? '파일 교체' : '파일 선택')}
                    </button>
                    <input
                        ref={fileInputRef}
                        type='file'
                        className='hidden'
                        onChange={handleFileSelect}
                    />
                    <p className='text-[10px] text-gray-300'>이미지(jpg·png·gif·webp) 및 일반 파일 · 최대 20MB</p>
                </div>
            </div>

            {/* ── 하단 버튼 영역 ── */}
            <div className='px-5 py-3.5 border-t border-gray-100 bg-white flex items-center justify-between gap-2'>
                <button
                    type='button'
                    onClick={closeModal}
                    className='px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors'
                >
                    취소
                </button>

                <div className='flex gap-2'>
                    {isEdit && (
                        <button
                            type='button'
                            onClick={() => handleBoardData('delete', data.boardIdx)}
                            className='inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors'
                        >
                            <TrashIcon className='h-3.5 w-3.5' />
                            삭제
                        </button>
                    )}

                    <button
                        type='button'
                        onClick={isEdit ? handlePatch : handleSubmit}
                        disabled={loading || !title.trim()}
                        className='inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-lg transition-all'
                        style={{
                            background: !loading && title.trim() ? 'linear-gradient(135deg,#3b82f6,#6366f1)' : '#e5e7eb',
                            color: !loading && title.trim() ? '#fff' : '#9ca3af',
                        }}
                    >
                        <CheckIcon className='h-3.5 w-3.5' />
                        {loading ? '처리 중…' : (isEdit ? '수정 완료' : '게시하기')}
                    </button>
                </div>
            </div>
        </div>
    );
}
