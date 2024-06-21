import React, { useState } from 'react'
import Form from './../../components/common/forms/Form';
import Radio from '../../components/common/forms/Radio';
import RadioGroups from '../../components/common/forms/RadioGroups';
import InputText from '../../components/common/forms/InputText';
import Buttons from '../../components/common/forms/Buttons';

export default function EtcPage() {
    const [answers, setAnswers] = useState({});

    const questions = [
        { id: 1, text: "Question 1" },
        { id: 2, text: "Question 2" },
        { id: 3, text: "Question 3" },
    ];

    const question2 = [
        { id: 1, text: "Question 1" }
    ];

    // const handleRadioChange = (questionId, value) => {
    //     setAnswers((prevAnswers) => ({
    //         ...prevAnswers,
    //         [questionId]: value,
    //     }));
    // };

    const handleRadioChange = (el, value) => {
        setAnswers(prev => ({
            ...prev,
            [el]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(answers);
    };

    return (
        <section className='section_wrap'>
            <Form className="mb-6">
                {questions.map((question, i) => (
                    <div key={question.id}>
                        <p className='text-lg'>{question.text}</p>
                        <RadioGroups label="question">
                            <Radio
                                value="1"
                                name={`${question}${i}`}
                                checked={answers[question.id] === "1"}
                                onChange={() => handleRadioChange(question.text, `${question.id} ${i}`)}
                            >
                                1
                            </Radio>
                            <Radio
                                value="2"
                                name={`${question}${i}`}
                                checked={answers[question.id] === "2"}
                                onChange={() => handleRadioChange(question.text, `${question.id} ${i}`)}
                            >
                                2
                            </Radio>
                            <Radio
                                value="3"
                                name={`${question}${i}`}
                                checked={answers[question.id] === "3"}
                                onChange={() => handleRadioChange(question.text, `${question.id} ${i}`)}
                            >
                                3
                            </Radio>
                        </RadioGroups>
                    </div>
                ))}
                <Buttons className="bg-red-500" onClick={handleSubmit} >Submit</Buttons>
            </Form>

            <Form className="mb-6">
                <h2>설문제목</h2>
                <p>설문 내용입니다.</p>
                {question2.map((question, i) => (
                    <div key={question.id}>
                        <p className='text-lg'>{question.text}</p>
                        <RadioGroups label="question">
                            <Radio
                                value="1"
                                name={`${question}${i}`}
                                checked={answers[question.id] === "1"}
                                onChange={() => handleRadioChange(question.text, `${question.id} ${i}`)}
                            >
                                1
                            </Radio>
                            <Radio
                                value="2"
                                name={`${question}${i}`}
                                checked={answers[question.id] === "2"}
                                onChange={() => handleRadioChange(question.text, `${question.id} ${i}`)}
                            >
                                2
                            </Radio>
                            <Radio
                                value="3"
                                name={`${question}${i}`}
                                checked={answers[question.id] === "3"}
                                onChange={() => handleRadioChange(question.text, `${question.id} ${i}`)}
                            >
                                3
                            </Radio>
                        </RadioGroups>
                    </div>
                ))}
                <Buttons className="bg-red-500" onClick={handleSubmit} >Submit</Buttons>
            </Form>

            <Form>
                <InputText type="email" placeholder="email" />
                <InputText type="tel" placeholder="tel" />
                <InputText type="url" placeholder="url" />
                <InputText type="month" placeholder="month" />
                <InputText type="week" placeholder="week" />
                <InputText type="time" placeholder="time" />
                <InputText type="color" placeholder="color" />
                <InputText type="range" placeholder="range" />
                <InputText type="search" placeholder="search" />
                <InputText type="number" placeholder="number" />
                <InputText type="date" placeholder="date" />
                <InputText type="password" placeholder="password" />
                <InputText type="image" placeholder="image" />
                <InputText type="file" placeholder="image" />
                <InputText type="reset" placeholder="reset" />
            </Form>
        </section>
    )
}
