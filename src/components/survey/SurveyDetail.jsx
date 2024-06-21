import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import instance from '../../services/instance';
import Quest from './Quest';
import Buttons from '../common/forms/Buttons';

export default function SurveyDetail() {
    const id = useLocation();
    const params = id.pathname.split('/').slice(-1)[0] // parma 가져옴
    const { contents, title, finishSurvey } = id.state // state 가져옴
    const [surveyData, setSurveyData] = useState([]);
    const [answer, setAnswer] = useState([]);

    const handleAnswer = (questIdx, questType, questAnswer) => {
        setAnswer((prev) => {
            const newAnswers = [...prev];
            const index = newAnswers.findIndex((item) => item.questIdx === questIdx);

            if (index !== -1) {
                // 이미 존재하는 경우 업데이트
                newAnswers[index] = { questIdx, questType, answers: questAnswer };
            } else {
                // 존재하지 않는 경우 추가
                newAnswers.push({ questIdx, questType, answers: questAnswer });
            }

            return newAnswers;
        });
    }

    const getSurveyDetail = async () => {
        if (finishSurvey === "Y") {
            try {
                const _res = await instance.get("/user/survey/info/result", {
                    params: {
                        surveyIdx: params
                    }
                });
                // console.log(_res)
                if (_res.status === 200) {
                    const _data = await _res.data;
                    setSurveyData(_data.one);
                } else {
                    console.log("못불러옴")
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            try {
                const _res = await instance.get("/user/survey/info", {
                    params: {
                        surveyIdx: params
                    }
                });
                // console.log(_res)
                if (_res.status === 200) {
                    const _data = await _res.data;
                    setSurveyData(_data.one);
                } else {
                    console.log("못불러옴")
                }
            } catch (e) {
                console.log(e);
            }
        }

    }

    const handelSubmit = async () => {
        // 설문 수 비교
        const submit = answer.map(item => item.questIdx);
        const submit2 = Object.keys(groupedData);
        console.log(answer, groupedData);

        const missing = submit2.filter(key => !submit.includes(key));

        if (submit.length === submit2.length) {
            console.log("제출가능");
            console.log(answer);
            try {
                const _res = await instance.post("/user/survey/info", {
                    surveyIdx: params,
                    contents: answer
                });
                if (_res.status === 200) {
                    alert("성공");
                } else {
                    alert("실패");
                }
            } catch (e) {
                console.log(e);
            }
        } else {
            console.log("제출불가. 다음 질문들이 누락되었습니다: ", missing);
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
        <div className=''>
            <h1 className='text-3xl py-2 border-b border-slate-700'>{title}</h1>
            <div className='bg-gray-200 rounded-lg p-4 min-h-24  my-6'>{contents}</div>
            <div className='p-2 grid grid-cols-1 gap-6'>
                {Object.keys(groupedData).map((questIdx) => {
                    const data = groupedData[questIdx]
                    return (
                        <Quest key={questIdx} questData={data} handleAnswer={handleAnswer} />
                    )
                }
                )}
            </div>
            <Buttons onClick={handelSubmit}>제출하기</Buttons>
        </div>
    )
}

