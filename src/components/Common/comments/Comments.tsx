import React from 'react'
import H1 from '../tag/H1'

export default function Comments({ className }) {
    return (
        <div className={`${className}`}>
            <H1 className="text-[1.2rem]">글 댓글</H1>
            <table className="table-auto w-full text-center  text-sm">
                <thead className='bg-gray2 text-white'>
                    <tr>
                        <th className='border border-black p-0.5 pt-1'>작성자</th>
                        <th className='border border-black p-0.5 pt-1'>제목</th>
                        <th className='border border-black p-0.5 pt-1'>등록일</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className='border border-black p-0.5 pt-1'>The Sliding </td>
                        <td className='border border-black p-0.5 pt-1'>Malcolm Lockyer</td>
                        <td className='border border-black p-0.5 pt-1'>1961</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
