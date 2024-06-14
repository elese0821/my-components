import React, { useEffect, useState } from 'react'
import instance from './../../services/instance';
import { Outlet } from 'react-router-dom';

export default function SurveyPage() {
    const [surveyList, setSurveyList] = useState([]);

    const getSurveyList = async () => {
        try {
            const _res = await instance.get('/user/survey/info');
            const _data = await _res.data;

            if (_data.result === "success") {
                setSurveyList(_data.list);
            } else {
                console.log("오류발생🤣");
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getSurveyList();
    }, [])

    return (
        <div className='section_wrap'>
            <Outlet
                context={{
                    surveyList
                }}
            />
        </div>
    )
}
