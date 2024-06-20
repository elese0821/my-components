import React from 'react'
import H1 from '../../components/common/tag/H1'

export default function BoardViewPage({ data }) {
    const { title, usrNm, views, contents, regDt } = data || null;
    return (
        <section>
            <H1 className="text-[20px] border-b border-gray4 p-1">글 상세보기</H1>
            <div className="p-4 bg-white rounded-md shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="p-2 font-semibold">제 목</td>
                            <td className="p-2">{title}</td>
                        </tr>
                        <tr>
                            <td className="p-2 font-semibold">작성자</td>
                            <td className="p-2">{usrNm}</td>
                            <td className="p-2 font-semibold">조회수</td>
                            <td className="p-2">{views}</td>
                        </tr>
                        <tr>
                            <td className="p-2 font-semibold">등록일</td>
                            <td className="p-2" colSpan="3">{regDt}</td>
                        </tr>
                        <tr>
                            <td className="p-2 font-semibold" colSpan="4">
                                <div dangerouslySetInnerHTML={{ __html: contents }}></div>
                            </td>
                        </tr>
                        <tr>
                            <td className="p-2 font-semibold">첨부파일</td>
                            <td className="p-2" colSpan="3">
                                sds
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    )
}
