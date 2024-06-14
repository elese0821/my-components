import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function List({ surveyList }) {
    const { surveyIdx, title, contents } = surveyList;
    useEffect(() => {
    }, [surveyList])
    return (
        <Link to={surveyIdx} state={{ contents: contents, title: title }}>
            {title}
        </Link >
    )
}
