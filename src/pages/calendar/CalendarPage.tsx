import React, { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import instance from '../../services/instance';
import Days from '../../components/calendar/Days';
import CalendarComponent from '../../components/calendar/CalendarComponent';

export default function CalendarPage() {
    const [list, setList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs()); // 선택한 날짜 상태
    const [selectedSchedule, setSelectedSchedule] = useState([]); // 선택한 날짜의 일정 상태
    const [highlightedDays, setHighlightedDays] = useState([]); // 일정이 있는 날들을 저장

    // 일정 리스트 조회
    const getSchedule = async () => {
        try {
            const _res = await instance.get('user/schedule/info');
            if (_res.status === 200) {
                setList(_res.data.list);
                const days = _res.data.list.map(schedule => dayjs(schedule.fromDt).date());
                setHighlightedDays(days);
            } else {
                console.log("에러");
            }
        } catch (e) {
            console.log(e);
        }
    };

    // 특정 날짜의 일정 조회
    const getScheduleByDate = (date) => {
        const selectedSchedules = list.filter(schedule => dayjs(schedule.fromDt).isSame(date, 'day'));
        setSelectedSchedule(selectedSchedules);
    };

    // 일정 추가
    const addSchedule = async () => {
        try {
            const fromDt = selectedDate.format('YYYY.MM.DD');
            const toDt = selectedDate.add(1, 'day').format('YYYY.MM.DD'); // 종료일자를 시작일자 다음 날로 설정
            const _res = await instance.post('user/schedule/info', {
                fromDt: fromDt,
                toDt: toDt,
                color: "#ff0000", // 예시 색상
                title: "일정 제목",
                contents: "일정 내용",
            });
            if (_res.status === 200) {
                getSchedule();
            } else {
                console.log("에러");
            }
        } catch (e) {
            console.log(e);
        }
    };

    // 일정 수정
    const modifySchedule = async (scheduleIdx) => {
        try {
            const fromDt = selectedDate.format('YYYY.MM.DD');
            const toDt = selectedDate.add(1, 'day').format('YYYY.MM.DD'); // 종료일자를 시작일자 다음 날로 설정
            const _res = await instance.patch('user/schedule/info', {
                scheduleIdx: scheduleIdx,
                fromDt: fromDt,
                toDt: toDt,
                color: "#ff0000",
                title: "일정 수정",
                contents: "일정 수정 내용",
            });
            if (_res.status === 200) {
                getSchedule();
            } else {
                console.log("에러");
            }
        } catch (e) {
            console.log(e);
        }
    };

    // 일정 삭제
    const deleteSchedule = async (scheduleIdx) => {
        try {
            const _res = await instance.delete('user/schedule/info', {
                data: {
                    scheduleIdx: scheduleIdx
                },
            });
            if (_res.status === 200) {
                getSchedule();
                setSelectedSchedule([]); // 삭제 후 선택된 일정 초기화
            } else {
                console.log("에러");
            }
        } catch (e) { console.log(e) }
    };

    useEffect(() => {
        getSchedule();
    }, []);

    return (
        <section className='section_wrap'>
            <CalendarComponent />

            <div className=' grid grid-cols-2'>
                <div className='flex flex-col'>
                    {/* 캘린더 */}
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                    >
                        <DateCalendar
                            value={selectedDate}
                            onChange={(newValue) => {
                                setSelectedDate(newValue);
                                getScheduleByDate(newValue);
                            }}
                            slots={{
                                day: (props) => <Days {...props} highlightedDays={highlightedDays} />
                            }}
                        />
                    </LocalizationProvider>
                    <button onClick={addSchedule}>일정 추가</button>
                </div>

                {/* 일정 */}
                <div
                    className='w-1/2'
                >
                    <h2>선택한 날짜의 일정</h2>
                    <ul className='grid gap-4 lg:grid-cols-1'>
                        {selectedSchedule.length > 0 && selectedSchedule.map(({ scheduleContents, scheduleTitle, fromDt, toDt, scheduleIdx }, i) => (
                            <li key={i} className='bg-gray4 flex p-2'>
                                <div>
                                    {scheduleContents}
                                </div>
                                <strong>{scheduleTitle}</strong>
                                : {fromDt} - {toDt}
                                <button onClick={() => deleteSchedule(scheduleIdx)}>일정 삭제</button>
                                <button onClick={() => modifySchedule(scheduleIdx)}>일정 수정</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>


        </section>
    );
}
