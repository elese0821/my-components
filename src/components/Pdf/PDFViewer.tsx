import { Viewer, Worker } from '@react-pdf-viewer/core'
import React from 'react'

export default function PDFViewer({ pdfUrl }) {
    return (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            <div>
                <Viewer fileUrl={pdfUrl} />
            </div>
        </Worker>
    )
}
