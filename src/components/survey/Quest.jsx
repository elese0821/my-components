import React, { useEffect } from 'react';
import RadioGroups from '../common/forms/RadioGroups';
import Radio from './../common/forms/Radio';
import Button from '../common/forms/Button';

export default function Quest({ questData }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const handleRadioChange = (event) => {
        setSelectedAnswer(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(`${questData.questOrderNo} : ${selectedAnswer}`);
    };

    useEffect(() => {
        console.log(questData)
    }, [questData])
    return (
        <div className='border p-4 my-6 rounded-xl border-slate-700 flex flex-col'>
            <div className='flex justify-between'>
                <h3 className='text-xl'><span className='px-1'>{questData.questOrderNo}.</span>{questData.questTitle}</h3>
                {questData.questType === "S" ? (
                    <div className='bg-blue-400 rounded p-2'>
                        객관식
                    </div>
                ) : (
                    <div className='bg-red-400'>
                        주관식
                    </div>
                )
                }
            </div>
            <div className='bg-gray-300 p-2 rounded'>{questData.questDesc}</div>

            <form>
                {/* selIdx: {answer.selIdx}, answerTitle: {answer.answerTitle}, answerWeight: {answer.answerWeight}, answerOrderNo: {answer.answerOrderNo} */}
                <RadioGroups>
                    {questData.answers.map((el) => (
                        <div key={el.selIdx} className='flex gap-2'>
                            <span className='w-2 block'>{el.answerOrderNo}.
                            </span>
                            <Radio
                                name={`question-${questData.questOrderNo}`}
                                value={el.selIdx}
                                checked={selectedAnswer === String(el.selIdx)}
                                onChange={handleRadioChange}
                            >
                                {el.answerTitle}
                            </Radio>
                        </div>
                    ))
                    }
                </RadioGroups>
                <Button onClick={handleSubmit}>Submit</Button>
            </form>
        </div >
    );
}
