import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function List({ surveyList, className, finishSurvey }) {
    const { surveyIdx, title, contents } = surveyList;
    useEffect(() => {
    }, [surveyList])

    if (finishSurvey === "Y") {
        return (
            <Link to={surveyIdx} state={{ contents: contents, title: title, finishSurvey: finishSurvey }}>
                <div className={`${className} flex justify-between p-4`}>
                    <div>{title}</div>
                    <div className='bg-gray-400 text-white rounded px-3 py-1'>응시완료</div>
                </div>
            </Link >
        )
    }
    else {
        return (
            <Link to={surveyIdx} state={{ contents: contents, title: title }}>
                <div className={`${className} flex justify-between p-2`}>
                    <div>{title}</div>
                    <div className='bg-gray-700 text-white rounded'>응시가능</div>
                </div>
            </Link >
        )
    }
}
