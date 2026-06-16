import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardDocumentCheckIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function List({ surveyList }) {
    const { surveyIdx, title, contents, finishSurvey } = surveyList;
    const done = finishSurvey === 'Y';

    return (
        <Link
            to={String(surveyIdx)}
            state={{ contents, title, finishSurvey }}
        >
            <div className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group
                ${done
                    ? 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    : 'border-blue-100 bg-white hover:bg-blue-50 hover:border-blue-300 hover:shadow-sm'
                }`}
            >
                <div className='flex items-center gap-3'>
                    {done
                        ? <ClipboardDocumentCheckIcon className='h-5 w-5 text-gray-400 flex-shrink-0' />
                        : <ClipboardDocumentListIcon className='h-5 w-5 text-blue-500 flex-shrink-0' />
                    }
                    <div>
                        <p className={`text-sm font-medium ${done ? 'text-gray-400 line-through' : 'text-gray-800 group-hover:text-blue-700'}`}>
                            {title}
                        </p>
                        {contents && (
                            <p className='text-xs text-gray-400 mt-0.5 line-clamp-1'>{contents}</p>
                        )}
                    </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
                    done ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700'
                }`}>
                    {done ? '응시완료' : '응시가능'}
                </span>
            </div>
        </Link>
    );
}
