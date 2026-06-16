import React from 'react';
import Comments from '../../components/common/comments/Comments';
import instance from '../../services/instance';
import useDialogStore from '../../stores/dialogStore';
import { SERVER_API_BASE_URL } from '../../services/endpoint';
import { EyeIcon, CalendarIcon, UserIcon, PaperClipIcon, ArrowDownTrayIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const isImageFile = (name?: string) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name ?? '');

export default function BoardViewPage({ data, handleBoardData, currentUsrIdx }: {
    data: any;
    handleBoardData?: (action: string, boardIdx: string) => void;
    currentUsrIdx?: string | null;
}) {
    const { title, usrNm, views, contents, regDt, boardIdx, fileIdx, fileOrgNm, usrIdx } = data || {};
    const isOwner = currentUsrIdx && usrIdx && String(currentUsrIdx) === String(usrIdx);
    const { openDialog } = useDialogStore();

    const getFile = async (fileIdx) => {
        openDialog("파일 다운로드 중입니다.");
        try {
            const _res = await instance.get(`/file/download/${fileIdx}`, { responseType: 'blob' });
            if (_res.status === 200) {
                const url = window.URL.createObjectURL(new Blob([_res.data], { type: _res.headers['content-type'] }));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileOrgNm || 'downloaded_file');
                document.body.appendChild(link);
                link.click();
                link.remove();
                openDialog("다운로드 완료");
            }
        } catch (e) {
            openDialog("다운로드 실패");
        }
    };

    return (
        <article className='flex flex-col'>
            {/* 이미지 첨부 시 상단 히어로 이미지 */}
            {fileIdx && isImageFile(fileOrgNm) && (
                <div className='w-full bg-gray-900 flex items-center justify-center overflow-hidden' style={{ maxHeight: '360px' }}>
                    <img
                        src={`${SERVER_API_BASE_URL}/file/download/${fileIdx}`}
                        alt={fileOrgNm}
                        className='w-full h-auto object-contain'
                        style={{ maxHeight: '360px' }}
                    />
                </div>
            )}

            <div className='p-6'>
                {/* 제목 */}
                <h1 className='text-xl font-bold text-gray-900 leading-snug mb-4'>{title}</h1>

                {/* 메타 정보 + 작성자 전용 수정/삭제 버튼 */}
                <div className='flex flex-wrap items-center gap-4 pb-4 border-b border-gray-100 text-sm text-gray-400'>
                    <span className='flex items-center gap-1.5'>
                        <UserIcon className='h-4 w-4' />
                        {usrNm}
                    </span>
                    <span className='flex items-center gap-1.5'>
                        <CalendarIcon className='h-4 w-4' />
                        {regDt}
                    </span>
                    <span className='flex items-center gap-1.5'>
                        <EyeIcon className='h-4 w-4' />
                        조회 {views ?? 0}
                    </span>

                    {/* 글쓴이 전용 수정·삭제 */}
                    {isOwner && handleBoardData && (
                        <div className='ml-auto flex gap-1.5'>
                            <button
                                onClick={() => handleBoardData('modify', boardIdx)}
                                className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 hover:border-blue-300 hover:text-blue-600 transition-colors'
                            >
                                <PencilSquareIcon className='h-3.5 w-3.5' />수정
                            </button>
                            <button
                                onClick={() => handleBoardData('delete', boardIdx)}
                                className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-colors'
                            >
                                <TrashIcon className='h-3.5 w-3.5' />삭제
                            </button>
                        </div>
                    )}
                </div>

                {/* 본문 */}
                <div
                    className='py-5 text-sm text-gray-700 leading-7 min-h-[120px] border-b border-gray-100'
                    dangerouslySetInnerHTML={{ __html: contents || '<p class="text-gray-400">내용이 없습니다.</p>' }}
                />

                {/* 첨부파일 (이미지 외) */}
                {fileIdx && !isImageFile(fileOrgNm) && (
                    <div className='mt-4 pt-4 border-t border-gray-100'>
                        <p className='text-xs font-medium text-gray-500 mb-2'>첨부파일</p>
                        <button
                            onClick={() => getFile(fileIdx)}
                            className='inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors'
                        >
                            <PaperClipIcon className='h-4 w-4 text-gray-400' />
                            <span className='truncate max-w-[240px]'>{fileOrgNm}</span>
                            <ArrowDownTrayIcon className='h-4 w-4 text-gray-400 flex-shrink-0' />
                        </button>
                    </div>
                )}
            </div>

            {/* 댓글 */}
            <Comments boardIdx={boardIdx} className='px-6 pb-6' />
        </article>
    );
}
