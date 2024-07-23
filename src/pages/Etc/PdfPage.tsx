import React from 'react'
import PDFViewer from '../../components/Pdf/PDFViewer';

export default function PdfPage() {
    const pdfUrl = '/skyand.pdf';

    return (
        <div className="App">
            <h1>PDF Viewer</h1>
            <PDFViewer pdfUrl={pdfUrl} />
        </div>
    );
}
