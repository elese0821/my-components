import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import instance from '../../services/instance';
import Quest from './Quest';

export default function SurveyDetail() {
    const id = useLocation();
    const params = id.pathname.split('/').slice(-1)[0] // parma 가져옴
    const { contents, title } = id.state // state 가져옴
    const [surveyData, setServeyData] = useState([]);

    const getSurveyDetail = async () => {
        try {
            const _res = await instance.get("/user/survey/info", {
                params: {
                    surveyIdx: params
                }
            });
            // console.log(_res)
            if (_res.status === 200) {
                const _data = await _res.data;
                setServeyData(_data.one);
            } else {
                console.log("못불러옴")
            }
        } catch (e) {
            console.log(e);
        }
    }

    /* // questIdx를 기준으로 데이터 그룹화
    const groupedData = surveyData.reduce((acc, cur) => {
        const { questIdx } = cur;
        if (!acc[questIdx]) {
            acc[questIdx] = []; // 배열 초기화 해당 questIdx 키가 존재하는 경우에는 기존 배열을 사용
        }
        acc[questIdx].push(cur); // cur 요소를 questIdx 키에 해당하는 배열에 추가
        return acc; // 누적값   다음 순회에서 다시 사용
    }, {} // acc의 초기값 빈 객체
    ); // 최종적으로 acc 객체를 반환
    // questIdx 값을 키로 하고, 각 키에 해당하는 값은 동일한 questIdx 값을 가진 요소들의 배열
 */
    useEffect(() => {
        getSurveyDetail();
    }, [params]);

    // 데이터 그룹화 및 변환
    const groupedData = surveyData.reduce((acc, cur) => {
        const { questIdx, questOrderNo, questTitle, questDesc, questType, selIdx, answerTitle, answerWeight, answerOrderNo } = cur;
        if (!acc[questIdx]) {
            acc[questIdx] = {
                questTitle: questTitle,
                questDesc: questDesc,
                questIdx: questIdx,
                questType: questType,
                questOrderNo: questOrderNo,
                answers: []
            };
        }
        acc[questIdx].answers.push({
            selIdx: selIdx,
            answerTitle: answerTitle,
            answerWeight: answerWeight,
            answerOrderNo: answerOrderNo
        });
        return acc;

    }, {});


    return (
        <div>
            <h1 className='text-3xl py-2 border-b border-slate-700 mb-4'>{title}</h1>
            <div className='p-2'>
                <div className='bg-gray-200 rounded-lg p-4 min-h-52'>{contents}</div>
                {Object.keys(groupedData).map((questIdx) => (
                    <Quest key={questIdx} questData={groupedData[questIdx]} />
                ))}
            </div>
        </div>
    )
}

