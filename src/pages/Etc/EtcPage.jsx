import React, { useState } from 'react'
import Form from './../../components/common/forms/Form';
import Radio from '../../components/common/forms/Radio';
import Button from './../../components/common/forms/Button';
import RadioGroups from '../../components/common/forms/RadioGroups';
import Input from './../../components/common/forms/Input';

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
                <Button className="bg-red-500" onClick={handleSubmit} >Submit</Button>
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
                <Button className="bg-red-500" onClick={handleSubmit} >Submit</Button>
            </Form>

            <Form>
                <Input type="email" placeholder="email" />
                <Input type="tel" placeholder="tel" />
                <Input type="url" placeholder="url" />
                <Input type="month" placeholder="month" />
                <Input type="week" placeholder="week" />
                <Input type="time" placeholder="time" />
                <Input type="color" placeholder="color" />
                <Input type="range" placeholder="range" />
                <Input type="search" placeholder="search" />
                <Input type="number" placeholder="number" />
                <Input type="date" placeholder="date" />
                <Input type="password" placeholder="password" />
                <Input type="image" placeholder="image" />
                <Input type="file" placeholder="image" />
                <Input type="reset" placeholder="reset" />
            </Form>
        </section>
    )
}
