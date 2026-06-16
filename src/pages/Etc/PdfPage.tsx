import React, { useCallback, useRef, useState } from 'react';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import {
    DocumentArrowUpIcon,
    DocumentTextIcon,
    XMarkIcon,
    ArrowDownTrayIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/outline';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const WORKER_URL = 'https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js';
const MAX_MB = 30;

// ── 파일 크기 포맷 ─────────────────────────────────────
function fmtSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// ── 드롭존 ─────────────────────────────────────────────
function DropZone({ onFile }: { onFile: (f: File) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [drag, setDrag] = useState(false);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDrag(false);
        const file = e.dataTransfer.files[0];
        if (file?.type === 'application/pdf') onFile(file);
    }, [onFile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFile(file);
        e.target.value = '';
    };

    return (
        <div className='flex flex-col items-center justify-center h-full min-h-[60vh]'>
            <div
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`w-full max-w-md border-2 border-dashed rounded-2xl p-12 flex flex-col items-center gap-4 cursor-pointer transition-all duration-200 select-none ${
                    drag
                        ? 'border-indigo-400 bg-indigo-50 scale-[1.02]'
                        : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50/40'
                }`}
            >
                <div className='w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center'>
                    <DocumentArrowUpIcon className='h-8 w-8 text-indigo-500' />
                </div>
                <div className='text-center'>
                    <p className='text-base font-semibold text-gray-700'>
                        PDF 파일을 드래그하거나
                    </p>
                    <p className='text-base font-semibold text-indigo-600'>
                        클릭해서 선택하세요
                    </p>
                    <p className='text-xs text-gray-400 mt-2'>
                        PDF 형식만 지원 · 최대 {MAX_MB}MB
                    </p>
                </div>
                <input
                    ref={inputRef}
                    type='file'
                    accept='application/pdf'
                    className='hidden'
                    onChange={handleChange}
                />
            </div>

            {/* 안내 카드 */}
            <div className='mt-8 w-full max-w-md bg-blue-50 rounded-xl p-4 flex gap-3'>
                <InformationCircleIcon className='h-5 w-5 text-blue-400 shrink-0 mt-0.5' />
                <div className='text-xs text-blue-600 leading-relaxed'>
                    <p className='font-semibold mb-1'>PDF 뷰어 기능 안내</p>
                    <ul className='space-y-0.5 text-blue-500'>
                        <li>• 페이지 이동 / 썸네일 사이드바</li>
                        <li>• 확대/축소 · 전체화면 · 페이지 회전</li>
                        <li>• 텍스트 검색 · 인쇄 · 다운로드</li>
                        <li>• 파일은 브라우저에서만 처리 (서버 전송 없음)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

// ── 파일 정보 바 ────────────────────────────────────────
function FileBar({ file, totalPages, onClose }: { file: File; totalPages: number; onClose: () => void }) {
    const url = URL.createObjectURL(file);

    return (
        <div className='flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-200 gap-3 flex-shrink-0'>
            <div className='flex items-center gap-2.5 min-w-0'>
                <div className='w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0'>
                    <DocumentTextIcon className='h-4 w-4 text-red-500' />
                </div>
                <div className='min-w-0'>
                    <p className='text-sm font-medium text-gray-800 truncate'>{file.name}</p>
                    <p className='text-xs text-gray-400'>
                        {fmtSize(file.size)} · {totalPages > 0 ? `${totalPages}페이지` : '로딩 중…'}
                    </p>
                </div>
            </div>

            <div className='flex items-center gap-2 shrink-0'>
                <a
                    href={url}
                    download={file.name}
                    className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors'
                >
                    <ArrowDownTrayIcon className='h-3.5 w-3.5' />
                    다운로드
                </a>
                <button
                    onClick={onClose}
                    className='p-1.5 rounded-lg hover:bg-gray-100 transition-colors'
                    title='파일 닫기'
                >
                    <XMarkIcon className='h-4 w-4 text-gray-400' />
                </button>
            </div>
        </div>
    );
}

// ── 메인 컴포넌트 ───────────────────────────────────────
export default function PdfPage() {
    const [file, setFile]           = useState<File | null>(null);
    const [fileUrl, setFileUrl]     = useState<string>('');
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError]         = useState('');

    const layoutPlugin = defaultLayoutPlugin({
        sidebarTabs: defaultTabs => defaultTabs,
        toolbarPlugin: {
            fullScreenPlugin: { onEnterFullScreen: () => {}, onExitFullScreen: () => {} },
        },
    });

    const handleFile = (f: File) => {
        if (f.size > MAX_MB * 1024 * 1024) {
            setError(`파일 크기가 ${MAX_MB}MB를 초과합니다. (현재: ${fmtSize(f.size)})`);
            return;
        }
        setError('');
        setTotalPages(0);
        if (fileUrl) URL.revokeObjectURL(fileUrl);
        const url = URL.createObjectURL(f);
        setFile(f);
        setFileUrl(url);
    };

    const handleClose = () => {
        if (fileUrl) URL.revokeObjectURL(fileUrl);
        setFile(null);
        setFileUrl('');
        setTotalPages(0);
    };

    return (
        <div className='section_wrap p-0 overflow-hidden flex flex-col' style={{ minHeight: 'calc(100vh - 100px)' }}>
            {/* 헤더 타이틀 */}
            <div className='flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 bg-white'>
                <span className='shrink-0 rounded-full inline-block' style={{
                    width: 4, height: 22,
                    background: 'linear-gradient(180deg, #6366f1 0%, #3b82f6 100%)',
                }} />
                <h2 className='font-bold text-gray-900 text-lg leading-tight'>PDF 뷰어</h2>
                <span className='ml-auto text-xs text-gray-400'>로컬 파일 · 서버 미전송</span>
            </div>

            {/* 에러 */}
            {error && (
                <div className='mx-6 mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600'>
                    <XMarkIcon className='h-4 w-4 shrink-0' />
                    {error}
                    <button onClick={() => setError('')} className='ml-auto text-red-400 hover:text-red-600'>
                        <XMarkIcon className='h-3.5 w-3.5' />
                    </button>
                </div>
            )}

            {/* 파일 없을 때 */}
            {!file && (
                <div className='px-6 py-4 flex-1'>
                    <DropZone onFile={handleFile} />
                </div>
            )}

            {/* 파일 있을 때 */}
            {file && fileUrl && (
                <div className='flex flex-col flex-1 overflow-hidden'>
                    <FileBar file={file} totalPages={totalPages} onClose={handleClose} />

                    <div className='flex-1 overflow-hidden' style={{ height: 'calc(100vh - 230px)' }}>
                        <Worker workerUrl={WORKER_URL}>
                            <Viewer
                                fileUrl={fileUrl}
                                plugins={[layoutPlugin]}
                                defaultScale={SpecialZoomLevel.PageWidth}
                                onDocumentLoad={e => setTotalPages(e.doc.numPages)}
                            />
                        </Worker>
                    </div>
                </div>
            )}
        </div>
    );
}
