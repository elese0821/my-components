import React from 'react'
import instance from '../../services/instance'

export default function WritePage() {
    const addBoard = async () => {
        try {
            const _res = await instance.post('/user/board/info', {
                fileIdx: "",
                title: "",
                contents: ""
            });
            if (_res.status === 200) {
                console.log("글쓰기성공")
            } else {
                console.log("글쓰기실패")
            }
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <section className='section_wrap'>
            <div onClick={addBoard}>dds</div>
        </section>
    )
}
