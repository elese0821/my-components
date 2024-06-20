import React from 'react';

function Pagination({ totalPages, page, setPage }) {
    const handleFirstPage = () => setPage(1);
    const handlePreviousPage = () => setPage(prev => Math.max(prev - 1, 1));
    const handleNextPage = () => setPage(prev => Math.min(prev + 1, totalPages));
    const handleLastPage = () => setPage(totalPages);

    const getPageNumbers = () => {
        const pageNumbers = [];
        let startPage = Math.max(page - 5, 1);
        let endPage = Math.min(page + 4, totalPages);

        if (endPage - startPage < 9) {
            if (startPage === 1) {
                endPage = Math.min(startPage + 9, totalPages);
            } else if (endPage === totalPages) {
                startPage = Math.max(endPage - 9, 1);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <div className='flex gap-4 my-4 justify-center col-start-2'>
            <button
                onClick={handleFirstPage}
                disabled={page === 1}
                className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-300 text-gray-600' : 'bg-gray-200 text-black'}`}
            >
                {`<<`}
            </button>
            <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-300 text-gray-600' : 'bg-gray-200 text-black'}`}
            >
                {`<`}
            </button>
            {getPageNumbers().map((pageNumber) => (
                <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`px-3 py-1 rounded ${page === pageNumber ? 'bg-gray-500 text-white' : 'bg-gray-200 text-black'}`}
                >
                    {pageNumber}
                </button>
            ))}
            <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-300 text-gray-600' : 'bg-gray-200 text-black'}`}
            >
                {`>`}
            </button>
            <button
                onClick={handleLastPage}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-300 text-gray-600' : 'bg-gray-200 text-black'}`}
            >
                {`>>`}
            </button>
        </div>
    );
}

export default Pagination;
