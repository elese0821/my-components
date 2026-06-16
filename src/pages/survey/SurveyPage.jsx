import React, { useCallback, useEffect, useState } from 'react';
import instance from './../../services/instance';
import { Outlet } from 'react-router-dom';

export default function SurveyPage() {
    const [surveyList, setSurveyList] = useState([]);
    const [loading, setLoading] = useState(true);

    const getSurveyList = useCallback(async () => {
        setLoading(true);
        try {
            const _res = await instance.get('/user/survey/info');
            if (_res.data.result === 'success') {
                setSurveyList(_res.data.list);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getSurveyList();
    }, [getSurveyList]);

    return (
        <div className='section_wrap'>
            <Outlet context={{ surveyList, loading, reload: getSurveyList }} />
        </div>
    );
}
