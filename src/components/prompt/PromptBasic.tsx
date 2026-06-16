import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Buttons from './../common/forms/Buttons';
export default function PromptBasic() {
    const [prompt, setPrompt] = React.useState('');

    const handlePromptChange = (e) => {
        setPrompt(e.target.value)
    }

    const handleSubmit = () => {
        console.log(prompt)
    }

    return (
        <form
            className='relative'
        >
            sdsa
        </form>
    )
}
