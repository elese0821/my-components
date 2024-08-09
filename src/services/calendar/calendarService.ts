import instance from "../instance";
import Calendar from "./types/Calendar";

// 스케쥴(일정) 리스트
const getSchedule = async () => {
    const response = await instance.get('user/schedule/info');
    return response.data;
}

// 스케쥴(일정) 추가
const addSchedule = async (formData) => {
    const response = await instance.post('user/schedule/info', {
        title: formData.title,
        color: formData.color,
        fromDt: formData.start,
        toDt: formData.end,
        contents: formData.contents,
    });
    return response.data;
}

//스케쥴(일정) 수정
const modifySchedule = async (selectedDate, scheduleIdx: number) => {
    const fromDt = selectedDate.format('YYYY.MM.DD');
    const toDt = selectedDate.add(1, 'day').format('YYYY.MM.DD'); // 종료일자를 시작일자 다음 날로 설정
    const response = await instance.patch('user/schedule/info', {
        scheduleIdx: scheduleIdx,
        fromDt: fromDt,
        toDt: toDt,
        color: "#ff0000",
        title: "일정 수정",
        contents: "일정 수정 내용",
    });
    return response.data;
}

//스케쥴(일정) 삭제
const deleteSchedule = async (scheduleIdx: number) => {
    const response = await instance.delete('user/schedule/info', {
        data: {
            scheduleIdx: scheduleIdx
        },
    });
    return response.data;
}

const calendarService = {
    getSchedule,
    addSchedule,
    modifySchedule,
    deleteSchedule
}

export default calendarService;