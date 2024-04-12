import dayjs from "dayjs"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!

const Calendar = () => {
    /*   const now = dayjs();
      now.format();
  
      const date = dayjs("2021-10-10");
      date.format(); // 2021-10-09 T00:00:00+09:00
  
      const date2 = dayjs("2021.10.10", "YYYY.MM.DD");
      date2.format(); // 2021-10-09 T00:00:00+09:00
  
      const date3 = dayjs("10/10/21", "MM/DD/YY");
      date3.format(); // 2021-10-09 T00:00:00+09:00
  
      const date4 = dayjs("2021-10-10 10:30:25", "YYYY-MM-DD HH:mm:ss");
      date4.format(); // 2021-10-09 T10:30:25+09:00 */


    return (
        < >
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
            />

            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                weekends={false}
                events={[
                    { title: 'event 1', date: '2024-04-01' },
                    { title: 'event 2', date: '2019-04-02' }
                ]}
            />
        </ >
    )
}

export default Calendar