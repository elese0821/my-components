import { useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import List from "./List"

export default function SurveyList() {
    const { surveyList } = useOutletContext()

    useEffect(() => {
    }, [surveyList])

    return (
        <div className="shadow-md rounded-md">
            {surveyList.map((el) => {
                const { contents, title, surveyIdx, finishSurvey } = el;

                const data = {
                    contents: contents,
                    title: title,
                    surveyIdx: surveyIdx,
                    finishSurvey: finishSurvey
                }

                if (data.finishSurvey === "Y") {
                    return (
                        <List key={data.surveyIdx} surveyList={data} finishSurvey="Y" className="" />
                    )
                } else {
                    return (
                        <List key={data.surveyIdx} surveyList={data} finishSurvey="N" className="" />
                    )
                }
            })
            }
        </div>
    )
}
