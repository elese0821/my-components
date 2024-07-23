import React, { useState } from 'react'
import RadioGroups from '../../components/common/forms/RadioGroups';
import InputText from '../../components/common/forms/InputText';
import Buttons from '../../components/common/forms/Buttons';
import { Button, Input, Menu, MenuItem, Slider, Typography } from '@material-tailwind/react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { Link } from 'react-router-dom';
import Form from './../../components/common/forms/Form';
import Radio from '../../components/common/forms/Radio';

function LightBulbIcon(props: SvgIconProps) {
    return (
        <SvgIcon {...props}>
            <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z" />
        </SvgIcon>
    );
}

export default function FormsPage() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
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
        <>
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
            {/* <Input
                autoFocus={false}
            /> */}
            {/* <Slider
                className="my-4"
                defaultValue={30}
                classes={{ active: 'shadow-none' }}
                slotProps={{ thumb: { className: 'hover:shadow-none' } }}
            />
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                Popover Menu
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleClose} className="py-2">
                    Small Item
                </MenuItem>
                <MenuItem onClick={handleClose} className="py-8">
                    Large Item
                </MenuItem>
            </Menu>
            <Typography sx={{ mt: 6, mb: 3, color: 'text.secondary' }}>
                <LightBulbIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                {'Pro tip: See more '}
                <Link href="https://mui.com/material-ui/getting-started/templates/">templates</Link>
                {' in the Material UI documentation.'}
            </Typography> */}
        </>
    )
}
