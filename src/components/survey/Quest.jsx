import { useState } from 'react';
import RadioGroups from '../common/forms/RadioGroups';
import Radio from '../common/forms/Radio';

export default function Quest({ questData, handleAnswer, finishSurvey }) {
    const isFinished = finishSurvey === "Y";

    // 로컬 state 로 선택값 관리
    // → questData.userAnswer 는 서버 초기값(완료된 설문용), 신규 응답은 여기서 추적
    const [selectedValue, setSelectedValue] = useState(
        questData.questType === "S"
            // 객관식: 서버가 string 으로 줄 수도 있으니 Number 로 통일 (null 은 null 유지)
            ? (questData.userAnswer != null ? Number(questData.userAnswer) : null)
            : (questData.userAnswer ?? '')        // 주관식: 문자열 또는 빈 문자열
    );

    const handleAnswerChange = (e) => {
        const val = questData.questType === "S"
            ? Number(e.target.value)   // selIdx 는 숫자
            : e.target.value;
        setSelectedValue(val);
        handleAnswer(questData.questIdx, questData.questType, val);
    };

    return (
        <div className='p-4 rounded-xl flex flex-col gap-2 shadow-md'>
            <div className='flex justify-between'>
                <h3 className='text-xl'><span className='px-1'>{questData.questOrderNo}.</span>{questData.questTitle}</h3>
                {questData.questType === "S" ? (
                    <div className='bg-blue-400 rounded p-2'>
                        객관식
                    </div>
                ) : (
                    <div className='bg-red-400 rounded p-2'>
                        주관식
                    </div>
                )
                }
            </div>
            {questData.questDesc && (
                <div className='bg-gray-300 p-2 rounded'>{questData.questDesc}</div>
            )}
            {questData.questType === "S" ? (
                <form>
                    {/* selIdx: {answer.selIdx}, answerTitle: {answer.answerTitle}, answerWeight: {answer.answerWeight}, answerOrderNo: {answer.answerOrderNo} */}
                    <RadioGroups>
                        {questData.answers.map((el) => {
                            return (
                                <div key={el.selIdx} className='flex gap-2 w-full'>
                                    <Radio
                                        name={`question-${questData.questOrderNo}`}
                                        value={el.selIdx}
                                        disabled={isFinished}
                                        checked={selectedValue === el.selIdx}
                                        onChange={!isFinished ? handleAnswerChange : undefined}
                                    >
                                        <span className='w-2 block flex items-center mr-1'>
                                            {el.answerOrderNo}.
                                        </span>
                                        {el.answerTitle}
                                    </Radio>
                                </div>
                            )
                        }
                        )}
                    </RadioGroups>
                </form>
            ) : (
                <form>
                    <textarea
                        className='border w-full p-2 border-gray-400 rounded resize-none'
                        placeholder='답변을 입력해주세요.'
                        onChange={!isFinished ? handleAnswerChange : undefined}
                        value={selectedValue}
                        disabled={isFinished}
                    ></textarea>
                </form>
            )}
        </div >
    );
}
