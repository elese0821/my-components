import * as React from 'react';
import calendarService from '../../services/calendar/calendarService';
import { useMutation, useQuery } from '@tanstack/react-query';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import { listType } from './@types/listType';
import instance from '../../services/instance';
import Modal from './../modal/Modal';
import useModalStore from '../../stores/modalStore';
import InputText from './../common/forms/InputText';
import { Button } from '@material-tailwind/react';

export default function CalendarComponent() {
    const { openModal, isOpen } = useModalStore();
    const [subjectIdx, setSubjectIdx] = React.useState();
    const [selectedInfo, setSelectedInfo] = React.useState();
    const [formData, setFormData] = React.useState({
        title: '',
        color: '#337ab7',
        start: '',
        end: '',
        contents: '',
    });

    function getContrastYIQ(hexcolor) {
        // 16진수 색상 코드를 RGB 값으로 변환
        const r = parseInt(hexcolor.substr(1, 2), 16);
        const g = parseInt(hexcolor.substr(3, 2), 16);
        const b = parseInt(hexcolor.substr(5, 2), 16);

        // YIQ 값 계산
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;

        // YIQ 값이 128보다 크면 검은색 텍스트가, 작으면 하얀색 텍스트가 잘 보임
        return yiq >= 128 ? 'black' : 'white';
    }

    // events
    const fetchEvents = (info, successCallback, failureCallback) => {
        const startStr = info.startStr;
        const endStr = info.endStr;
        let retArr = [];
        let dataRes = calendarService.getSchedule({ startStr, endStr })
            .then(function (data) {
                for (let i = 0; i < data.list.length; i++) {
                    let color = data.list[i].color;
                    let row = {
                        id: data.list[i].scheduleIdx
                        , title: data.list[i].scheduleTitle
                        , start: data.list[i].fromDt
                        , end: data.list[i].toDt
                        , backgroundColor: color
                        , borderColor: color
                        , textColor: getContrastYIQ(color || "#3788d8")
                    }
                    retArr.push(row);
                }
                successCallback(retArr);
            })
            .catch(function (error) {
                failureCallback(error);
            });
    }

    const showEventDetail = (info) => {
        const { event } = info;
        setSubjectIdx(event.id);

        openModal();
    }

    const deleteSchedule = () => {
        console.log(subjectIdx);
        // 삭제 비동기 Request
    }

    const addSchedule = () => {
        calendarService.addSchedule(formData);
    }

    const handleDateSelect = (selectInfo) => {
        console.log(selectInfo)
        let calendarApi = selectInfo.view.calendar;
        setSelectedInfo(selectInfo);
        setFormData({
            title: selectInfo.title,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            contents: selectInfo.contents,
            color: selectInfo.color,
        })
        openModal();
        calendarApi.unselect(); // clear date selection
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        console.log(formData)
    };

    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                eventAdd={function () {
                    // Add your own code here...
                    // successCallback({ id: 'newEvent' });
                    // failureCallback({ message: 'Failed to add event' });
                }}
                eventClick={showEventDetail}
                events={fetchEvents}
                selectable={true}
                select={handleDateSelect}
            />
            {isOpen &&
                <Modal>
                    <div className='flex flex-col p-5'>
                        {/* Add your own modal content here */}
                        <InputText label='title' name='title' onChange={handleChange} value={formData.title} />
                        <textarea placeholder='contents' />
                        <InputText placeholder='start' name='start' onChange={handleChange} value={formData.start} />
                        <InputText placeholder='end' name='end' onChange={handleChange} value={formData.end} />
                        <InputText placeholder='color' name='color' onChange={handleChange} value={formData.color} />

                        <div className='flex justify- '>
                            <Button onClick={addSchedule}>추가</Button>
                            <Button onClick={deleteSchedule}>삭제</Button>
                        </div>
                    </div>
                </Modal >
            }
        </div >
    );
}
