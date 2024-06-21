import React from 'react'
import H1 from '../../components/common/tag/H1'
import Comments from '../../components/common/comments/Comments';
import instance from '../../services/instance';

export default function BoardViewPage({ data }) {
    const { title, usrNm, views, contents, regDt, boardIdx, fileIdx } = data || null;

    // /file/download / { fileIdx }

    const getFile = async (fileIdx) => {
        const _res = await instance.get(`/file/download/${fileIdx}`);
        if (_res.status === 200) {
            return _res.data;
        } else {
            return null;
        }
    }

    return (
        <section>
            <H1 className="text-[20px] border-b border-gray4 p-1">글 상세보기</H1>
            <div className="p-4 bg-white border-b border-gray4">
                <table className=" min-w-full divide-y divide-gray-200 text-sm border">
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <th className="p-2 bg-gray4">제 목</th>
                            <td colSpan={3} className="p-2">{title}</td>
                        </tr>
                        <tr>
                            <th className="p-2 bg-gray4">작성자</th>
                            <td className="p-2 text-center">{usrNm}</td>
                            <th className="p-2 bg-gray4">조회수</th>
                            <td className="p-2 text-center">{views ? views : "안나와요"}</td>
                        </tr>
                        <tr>
                            <th className="p-2 bg-gray4">등록일</th>
                            <td colSpan={3} className="p-2">{regDt}</td>
                        </tr>
                        <tr>
                            <td colSpan={4} className="p-2">
                                <div
                                    className='min-h-40 break-all'
                                    dangerouslySetInnerHTML={{ __html: contents }} />
                            </td>
                        </tr>
                        <tr>
                            <th className="p-2 bg-gray4">첨부파일</th>
                            <td className="p-2">
                                {fileIdx && fileIdx.map((el, i) => (
                                    <div
                                        key={i}
                                        onClick={() => getFile(el)}
                                    >
                                        {el}
                                    </div>
                                ))}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <Comments boardIdx={boardIdx} className="p-4" />
        </section>
    )
}
