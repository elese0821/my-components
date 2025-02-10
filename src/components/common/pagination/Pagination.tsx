import { Button } from '@material-tailwind/react';
import React from 'react';
import Buttons from '../forms/Buttons';
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

function Pagination({ totalPages, page, setPage }) {
    const handleFirstPage = () => setPage(1); // 1페이지
    const handlePreviousPage = () => setPage(prev => Math.max(prev - 1, 1)); // 이전페이지
    const handleNextPage = () => setPage(prev => Math.min(prev + 1, totalPages)); // 다음페이지 
    const handleLastPage = () => setPage(totalPages); // 마지막페이지 

    const getPageNumbers = () => {
        const pageNumbers = [];
        let startPage = Math.max(page - 2, 1);
        let endPage = Math.min(page + 2, totalPages);

        if (endPage - startPage < 5) {
            if (startPage === 1) {
                endPage = Math.min(startPage + 4, totalPages);
            } else if (endPage === totalPages) {
                startPage = Math.max(endPage - 4, 1);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    if (totalPages < 1) {
        return
    }

    return (
        <div className='flex gap-2 lg:gap-4 my-4 justify-center h-6'>
            <Buttons
                onClick={handleFirstPage}
                disabled={page === 1}
                className={`px-1 rounded w-5 flex`}
            >
                <ChevronDoubleLeftIcon />
            </Buttons>
            <Buttons
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`px-1 rounded w-5 flex`}
            >
                <ChevronLeftIcon />
            </Buttons>
            {getPageNumbers().map((pageNumber) => (
                <Buttons
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`text-center rounded w-5 ${page === pageNumber ? 'bg-gray2' : 'bg-gray1 text-white'}`}
                >
                    {pageNumber}
                </Buttons>
            ))}
            <Buttons
                onClick={handleNextPage}
                disabled={page === totalPages}
                className={`px-1 rounded w-5 flex`}
            >
                <ChevronRightIcon />
            </Buttons>
            <Buttons
                onClick={handleLastPage}
                disabled={page === totalPages}
                className={`px-1 rounded w-5 flex`}
            >
                <ChevronDoubleRightIcon />
            </Buttons>
        </div>
    );
}

export default Pagination;
