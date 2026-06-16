import instance from "../instance";

export interface ScheduleForm {
    title:    string;
    color:    string;
    fromDt:   string;
    toDt:     string;
    contents: string;
    allDay:   boolean;
    category: string;
    priority: string;
    repeat:   string;
    url:      string;
    done:     boolean;
}

const getSchedule = async () => {
    const response = await instance.get('/user/schedule/info');
    return response.data;
};

const addSchedule = async (formData: Partial<ScheduleForm> & Pick<ScheduleForm, 'title'>) => {
    const response = await instance.post('/user/schedule/info', {
        title:    formData.title,
        color:    formData.color    ?? '#6366f1',
        fromDt:   formData.fromDt   ?? '',
        toDt:     formData.toDt     ?? '',
        contents: formData.contents ?? '',
        allDay:   formData.allDay   ?? false,
        category: formData.category ?? '',
        priority: formData.priority ?? '',
        repeat:   formData.repeat   ?? 'none',
        url:      formData.url      ?? '',
        done:     formData.done     ?? false,
    });
    return response.data;
};

const modifySchedule = async (scheduleIdx: number, formData: Partial<ScheduleForm>) => {
    const response = await instance.patch('/user/schedule/info', {
        scheduleIdx,
        title:    formData.title,
        color:    formData.color,
        fromDt:   formData.fromDt,
        toDt:     formData.toDt,
        contents: formData.contents ?? '',
        allDay:   formData.allDay   ?? false,
        category: formData.category ?? '',
        priority: formData.priority ?? '',
        repeat:   formData.repeat   ?? 'none',
        url:      formData.url      ?? '',
        done:     formData.done     ?? false,
    });
    return response.data;
};

const deleteSchedule = async (scheduleIdx: number) => {
    const response = await instance.delete('/user/schedule/info', {
        data: { scheduleIdx },
    });
    return response.data;
};

const calendarService = {
    getSchedule,
    addSchedule,
    modifySchedule,
    deleteSchedule,
};

export default calendarService;
