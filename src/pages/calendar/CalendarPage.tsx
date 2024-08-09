import React, { useEffect, useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import instance from '../../services/instance';
import Days from '../../components/calendar/Days';
import CalendarComponent from '../../components/calendar/CalendarComponent';

export default function CalendarPage() {
    return (
        <section className='section_wrap'>
            <CalendarComponent />
        </section>
    );
}
