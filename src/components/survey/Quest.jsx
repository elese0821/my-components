import { useEffect, useState } from 'react';
import RadioGroups from '../common/forms/RadioGroups';
import Radio from '../common/forms/Radio';

export default function Quest({ questData, handleAnswer, finishSurvey }) {
    const [finishState, setFinishState] = useState(false);
    const did = questData.userAnswer;

    const handleAnswerChange = (e) => {
        // console.log(questData)
        // questData.answer(el.selIdx===questData.userAnswer)

        if (questData.questType === "S") {
            handleAnswer(
                questData.questIdx,
                questData.questType,
                e.target.value,
            )
        } else {
            handleAnswer(
                questData.questIdx,
                questData.questType,
                e.target.value,
            )
        }
    }

    useEffect(() => {
        if (finishSurvey === "Y") {
            setFinishState(true);
        }
    }, [finishSurvey]);

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
            <div className='bg-gray-300 p-2 rounded'>{questData.questDesc}</div>
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
                                        disabled={!finishState ? false : true}
                                        checked={!finishState ? questData.userAnswer === el.selIdx : el.selIdx === did}
                                        onChange={!finishState ? handleAnswerChange : undefined}
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
                        onChange={handleAnswerChange}
                        value={questData.userAnswer || ''}
                        disabled={!finishState ? false : true}
                    ></textarea>
                </form>
            )}
        </div >
    );
}
