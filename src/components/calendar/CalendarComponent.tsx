import * as React from 'react'
import Calendar from 'react-calendar';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

import 'react-calendar/dist/Calendar.css';
import calendarService from '../../services/calendar/calendarService';
import { useQuery } from '@tanstack/react-query';
export default function CalendarComponent() {
    const [value, onChange] = React.useState<Value>(new Date());
    const [getResult, setGetResult] = React.useState<string | null>(null);

    React.useEffect(() => {
        console.log(value)
    }, [value])

    // const { isLoading, refetch } = useQuery(
    //     "query-tutorials",
    //     async () => {
    //         return await calendarService.getSchedule();
    //     },
    //     {
    //         enabled: false,
    //         onSuccess: (res) => {
    //             setGetResult(res);
    //         },
    //         onError: (err: any) => {
    //             setGetResult(err.response?.data || err);
    //         },
    //     }
    // );

    return (
        <div>
            <Calendar onChange={onChange} value={value} />
        </div>
    )
}
